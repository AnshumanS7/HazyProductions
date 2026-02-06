import { NextRequest, NextResponse } from "next/server";
import { dodo } from "@/lib/dodo";
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

    const totalAmount = products.reduce((acc, p) => acc + p.price, 0);

    // Dodo Payments requires existing product IDs in their system.
    // We check if our DB product has a dodoProductId; if not, we create it and save it.
    const cartItems = [];

    for (const p of products) {
        let dodoId = p.dodoProductId;

        if (!dodoId) {
            try {
                // Ensure price is at least 1 cent and integer
                const amountInCents = Math.max(1, Math.round(p.price * 100));

                // Create product in Dodo
                // Note: Dodo SDK types might vary, ensuring minimal required fields
                const dodoProduct = await dodo.products.create({
                    name: p.title,
                    description: (p.description || "Digital Product").substring(0, 100),
                    price: {
                        type: 'one_time_price',
                        price: amountInCents,
                        currency: 'USD',
                        discount: 0,
                        purchasing_power_parity: false
                    },
                    tax_category: 'digital_products'
                });

                dodoId = dodoProduct.product_id;

                // Save generic ID back to DB
                p.dodoProductId = dodoId;
                await p.save();
            } catch (err: any) {
                console.error(`Failed to create Dodo product for ${p.title}:`, err);
                // Return 500 so client knows it failed
                return NextResponse.json({ error: `Product sync failed: ${err.message}` }, { status: 500 });
            }
        }

        cartItems.push({
            product_id: dodoId,
            quantity: 1
        });
    }

    try {
        console.log("Creating Dodo Checkout Session...");
        // Dodo Payments Checkout Creation (Using checkoutSessions resource for Hosted Page)
        const sessionResponse: any = await dodo.checkoutSessions.create({
            billing_address: {
                city: "New York",
                country: "US",
                state: "NY",
                street: "123 Street",
                zipcode: "10001"
            },
            customer: {
                email: session.user.email || "guest@example.com",
                name: session.user.name || "Guest"
            },
            product_cart: cartItems,
            return_url: `${process.env.NEXTAUTH_URL || req.headers.get('origin')}/dashboard?success=true`
        });

        console.log("Dodo Session Created:", sessionResponse);

        // Create pending order
        // Dodo returns 'session_id' in some versions, 'id' in others.
        const dodoPaymentId = sessionResponse.session_id || sessionResponse.payment_id || sessionResponse.checkout_session_id || sessionResponse.id;

        console.log("Creating Pending Order with ID:", dodoPaymentId);

        const newOrder = await Order.create({
            userId: session.user.id,
            paymentId: dodoPaymentId,
            stripeSessionId: dodoPaymentId || `dodo_legacy_${Date.now()}_${Math.random()}`, // Fail-safe for unique index
            provider: 'dodo',
            amount: totalAmount,
            items: products.map(p => p._id),
            customerEmail: session.user.email || 'guest@example.com',
            status: 'pending',
        } as any);

        console.log("Order Created Successfully:", newOrder._id);

        return NextResponse.json({
            url: sessionResponse.payment_link || sessionResponse.checkout_url || sessionResponse.url
        });
    } catch (error: any) {
        console.error("Dodo Create Error:", error);
        return NextResponse.json({ error: `Payment creation failed: ${error.message}` }, { status: 500 });
    }
}
