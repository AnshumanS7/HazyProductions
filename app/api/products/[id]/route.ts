import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    await dbConnect();

    const session = await getServerSession(authOptions);
    let query = Product.findById(params.id) as any;

    if (session?.user?.role === 'admin') {
        query = query.select('+fileKey');
    }

    const product = await query;
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(product);
}

export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params; // Await params here
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const data = await req.json();

    // Prevent overwriting fileKey with empty string if not provided
    if (data.fileKey === "") {
        delete data.fileKey;
    }

    const product = await Product.findByIdAndUpdate(params.id, data, { new: true });
    return NextResponse.json(product);
}

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params; // Await params here
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    await Product.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
}
