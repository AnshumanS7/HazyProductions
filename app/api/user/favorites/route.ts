import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Product from "@/models/Product"; // Ensure Product model is registered

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { productId } = await req.json();
        if (!productId) {
            return NextResponse.json({ error: "Product ID required" }, { status: 400 });
        }

        await dbConnect();

        const user = await User.findById(session.user.id);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Initialize favorites if undefined (for old users)
        if (!user.favorites) user.favorites = [];

        const isFavorite = user.favorites.includes(productId);

        if (isFavorite) {
            // Remove
            user.favorites = user.favorites.filter((id) => id.toString() !== productId);
        } else {
            // Add
            user.favorites.push(productId);
        }

        await user.save();

        return NextResponse.json({
            isFavorite: !isFavorite,
            favorites: user.favorites
        });

    } catch (error) {
        console.error("Favorites Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ favorites: [] });
        }

        await dbConnect();
        const user = await User.findById(session.user.id).select('favorites');

        return NextResponse.json({ favorites: user?.favorites || [] });

    } catch (error) {
        console.error("Favorites Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
