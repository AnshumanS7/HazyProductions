import { NextRequest, NextResponse } from "next/server";
import { dodo } from "@/lib/dodo";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import WebhookLog from "@/models/WebhookLog";

export async function POST(req: NextRequest) {
    const rawBody = await req.text();
    const signature = req.headers.get("x-dodo-signature");
    const webhookSecret = process.env.DODO_PAYMENTS_WEBHOOK_KEY;

    await dbConnect();

    // Log raw webhook
    try {
        await WebhookLog.create({
            provider: 'dodo',
            payload: JSON.parse(rawBody),
            headers: { signature },
        });
    } catch (e) {
        console.error("Failed to log webhook", e);
    }

    if (!webhookSecret) {
        console.warn("Missing DODO_PAYMENTS_WEBHOOK_KEY - Verification Skipped");
    }

    let paymentId_from_event: string | undefined;
    let checkoutSessionId_from_event: string | undefined;

    if (webhookSecret && signature) {
        try {
            // @ts-ignore
            const event = dodo.webhooks.constructEvent({
                payload: rawBody,
                sigHeader: signature,
                secret: webhookSecret
            });

            if (event.type === 'payment.succeeded') {
                paymentId_from_event = event.data.payment_id;
                // Try to grab session ID if available in metadata or root
                // Note: Dodo structure varies, checking common paths
                checkoutSessionId_from_event = event.data.checkout_session_id || event.data.metadata?.checkout_session_id;
            }
        } catch (err: any) {
            console.error(`Webhook Verification Error: ${err.message}`);
            return NextResponse.json({ error: "Invalid Signature" }, { status: 400 });
        }
    } else {
        // Fallback or Strict Mode
        return NextResponse.json({ error: "Missing Signature or Secret" }, { status: 400 });
    }

    if (paymentId_from_event) {
        await dbConnect();

        // Strategy:
        // 1. Try finding by explicit paymentId (if we already had it)
        // 2. Try finding by stripeSessionId using the checkout_session_id from event
        // 3. Try finding by paymentId using checkout_session_id (if we stored session ID in paymentId field)

        let query: any = { paymentId: paymentId_from_event };

        if (checkoutSessionId_from_event) {
            query = {
                $or: [
                    { paymentId: paymentId_from_event },
                    { stripeSessionId: checkoutSessionId_from_event },
                    { paymentId: checkoutSessionId_from_event } // In case we stored session ID here
                ]
            };
        }

        const order = await Order.findOneAndUpdate(
            query,
            {
                status: 'completed',
                paymentId: paymentId_from_event // Update to the real payment ID for future
            },
            { new: true }
        );

        if (order) {
            console.log(`Order ${order._id} marked as completed.`);
        } else {
            console.error(`Order not found for paymentId: ${paymentId_from_event} or session: ${checkoutSessionId_from_event}`);
        }
    }

    return NextResponse.json({ received: true });
}
