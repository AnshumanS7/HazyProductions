import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import WebhookLog from "@/models/WebhookLog";

export async function GET() {
    await dbConnect();
    const logs = await WebhookLog.find().sort({ createdAt: -1 }).limit(5);
    return NextResponse.json(logs);
}
