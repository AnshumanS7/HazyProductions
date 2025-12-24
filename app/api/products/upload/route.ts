import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUploadUrl } from "@/lib/s3";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { filename, contentType } = await req.json();

        if (!filename || !contentType) {
            return NextResponse.json({ error: "Missing filename or contentType" }, { status: 400 });
        }

        const fileKey = `products/${Date.now()}-${filename.replace(/\s+/g, '-')}`;
        const url = await getUploadUrl(fileKey, contentType);

        return NextResponse.json({ url, fileKey });
    } catch (error) {
        console.error("Upload URL error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
