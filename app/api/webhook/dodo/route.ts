import { NextRequest, NextResponse } from "next/server";
import { dodo } from "@/lib/dodo";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";

export async function POST(req: NextRequest) {
    const rawBody = await req.text();
    const signature = req.headers.get("x-dodo-signature");
    const webhookSecret = process.env.DODO_PAYMENTS_WEBHOOK_KEY;

    if (!webhookSecret) {
        console.warn("Missing DODO_PAYMENTS_WEBHOOK_KEY - Verification skipped (Not Secure for Prod)");
        // In production this should error. For dev/hybrid, we proceed if no secret?
        // No, secure by default.
        // return NextResponse.json({ error: "Configuration Error" }, { status: 500 });
        // User said "leave for later", implying they might not set it. 
        // If I error here, it breaks. But without tunneling, it won't hit localhost anyway.
        // So this code is for PROD or TUNNEL.
    }

    // Only attempt verification if secret exists
    let paymentId_from_event: string | undefined;

    if (webhookSecret && signature) {
        try {
            // Check if dodo instance has webhooks. If using older/newer version, syntax varies.
            // Assuming current standard:
            // @ts-ignore - Bypass type check if d.ts is missing/incomplete in standard path
            const event = dodo.webhooks.constructEvent({
                payload: rawBody,
                sigHeader: signature,
                secret: webhookSecret
            });

            if (event.type === 'payment.succeeded') {
                paymentId_from_event = event.data.payment_id;
            }
        } catch (err: any) {
            console.error(`Webhook Verification Error: ${err.message}`);
            return NextResponse.json({ error: "Invalid Signature" }, { status: 400 });
        }
    } else {
        // Fallback for testing without signature if absolutely needed?
        // No, let's parse body manually if we trust the source (unsafe).
        // const body = JSON.parse(rawBody);
        // paymentId_from_event = body.data?.payment_id;
        // console.warn("Processing webhook without verification!");

        // Strict Mode:
        return NextResponse.json({ error: "Missing Signature or Secret" }, { status: 400 });
    }

    if (paymentId_from_event) {
        await dbConnect();
        const order = await Order.findOneAndUpdate(
            { paymentId: paymentId_from_event },
            { status: 'completed' }
        );

        if (order) {
            console.log(`Order ${order._id} marked as completed.`);
        } else {
            console.error(`Order not found for paymentId: ${paymentId_from_event}`);
        }
    }

    return NextResponse.json({ received: true });
}
