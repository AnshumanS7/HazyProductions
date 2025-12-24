import { NextRequest, NextResponse } from "next/server";
import stripe from "@/lib/stripe";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";

// Force Node.js runtime for webhook handling if needed, but Edge usually fine if Stripe lib supports it.
// Default Node for Mongoose.

export async function POST(req: NextRequest) {
    const body = await req.text();
    const sig = req.headers.get("stripe-signature");

    if (!sig) {
        return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    let event;

    try {
        event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err: any) {
        console.error(`Webhook Error: ${err.message}`);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as any;

        await dbConnect();

        // Update order status
        await Order.findOneAndUpdate(
            { stripeSessionId: session.id },
            { status: "completed" }
        );

        // Logic to send email capable here
    }

    return NextResponse.json({ received: true });
}
