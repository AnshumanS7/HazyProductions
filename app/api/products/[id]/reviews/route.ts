import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Review from "@/models/Review";
import Order from "@/models/Order";
import mongoose from "mongoose";

// GET reviews for a product
export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        const { id } = await params;

        const reviews = await Review.find({ product: id })
            .populate('user', 'name image')
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json(reviews);
    } catch (error) {
        console.error("Fetch Reviews Error:", error);
        return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
    }
}

// POST a new review
export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const { id: productId } = await params;
        const { rating, comment } = await req.json();

        if (!rating || rating < 1 || rating > 5) {
            return NextResponse.json({ error: "Invalid rating (1-5)" }, { status: 400 });
        }

        const userId = session.user.id;

        // 1. Verify Verification: User MUST have purchased the product
        const hasPurchased = await Order.findOne({
            userId: userId,
            "items.productId": productId,
            status: "completed" // Assuming 'completed' is the success status
        });

        if (!hasPurchased) {
            return NextResponse.json({
                error: "Verified Purchase Only. You must buy this product to review it."
            }, { status: 403 });
        }

        // 2. Prevent Duplicates
        const existingReview = await Review.findOne({ product: productId, user: userId });
        if (existingReview) {
            return NextResponse.json({ error: "You have already reviewed this product." }, { status: 409 });
        }

        // 3. Create Review
        const newReview = await Review.create({
            user: userId,
            product: productId,
            rating,
            comment
        });

        // Populate user details for immediate UI update
        await newReview.populate('user', 'name image');

        return NextResponse.json(newReview, { status: 201 });

    } catch (error) {
        console.error("Submit Review Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
