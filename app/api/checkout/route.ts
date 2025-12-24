import { NextRequest, NextResponse } from "next/server";
import stripe from "@/lib/stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import Order from "@/models/Order";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { productIds } = await req.json();
    if (!productIds || !Array.isArray(productIds)) {
        return NextResponse.json({ error: "Invalid products" }, { status: 400 });
    }

    await dbConnect();
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length === 0) return NextResponse.json({ error: "No products found" }, { status: 400 });

    const line_items = products.map((p) => ({
        price_data: {
            currency: "usd",
            product_data: {
                name: p.title,
                images: p.images,
                description: p.description.substring(0, 100),
            },
            unit_amount: Math.round(p.price * 100), // Stripe expects cents
        },
        quantity: 1,
    }));

    const stripeSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items,
        mode: "payment",
        success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=true`,
        cancel_url: `${process.env.NEXTAUTH_URL}/cart?canceled=true`,
        customer_email: session.user.email || undefined,
        metadata: {
            userId: session.user.id,
            productIds: JSON.stringify(productIds),
        },
    });

    // Create pending order
    await Order.create({
        userId: session.user.id,
        stripeSessionId: stripeSession.id,
        amount: products.reduce((acc, p) => acc + p.price, 0),
        items: products.map(p => p._id),
        customerEmail: session.user.email || 'guest@example.com',
        status: 'pending',
    } as any);

    return NextResponse.json({ url: stripeSession.url });
}
