import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { getDownloadUrl } from "@/lib/s3";

export async function POST(req: NextRequest, props: { params: Promise<{ productId: string }> }) {
    const params = await props.params;
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await dbConnect();

        // 1. Verify the user actually BOUGHT this product
        const hasPurchased = await Order.findOne({
            userId: session.user.id,
            status: 'completed',
            items: params.productId
        });

        // Also allow admins to download anything for testing
        const isAdmin = session.user.role === 'admin';

        if (!hasPurchased && !isAdmin) {
            return NextResponse.json({ error: "Purchase required" }, { status: 403 });
        }

        // 2. Get the product to find the file key
        const product = await Product.findById(params.productId).select('+fileKey');

        if (!product || !product.fileKey) {
            return NextResponse.json({ error: "File not found" }, { status: 404 });
        }

        // 3. Generate Presigned URL
        const url = await getDownloadUrl(product.fileKey);

        return NextResponse.json({ url });

    } catch (error) {
        console.error("Download error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
