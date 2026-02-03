import { Navbar } from "@/components/layout/Navbar";
import { SmokeBackground } from "@/components/ui/SmokeBackground";
import { FeaturedGrid } from "@/components/home/FeaturedGrid";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Product from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

async function getFavorites() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return null;

    try {
        await dbConnect();
        // Populate specific fields from Product model
        const user = await User.findById(session.user.id).populate({
            path: 'favorites',
            model: Product,
            strictPopulate: false
        }).lean();

        if (!user || !user.favorites) return [];

        // Serialize
        return JSON.parse(JSON.stringify(user.favorites));
    } catch (error) {
        console.error("Failed to fetch favorites", error);
        return [];
    }
}

export default async function FavoritesPage() {
    const favorites = await getFavorites();

    if (favorites === null) {
        redirect("/auth/signin");
    }

    return (
        <main className="min-h-screen bg-black text-white selection:bg-cyan-500/30">
            <SmokeBackground>
                <Navbar />

                <div className="container mx-auto px-4 py-32 relative z-10">
                    <div className="mb-12">
                        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-400 to-fuchsia-500 bg-clip-text text-transparent">
                            Your Wishlist
                        </h1>
                        <p className="text-white/40">
                            Create your ultimate collection.
                        </p>
                    </div>

                    {favorites.length > 0 ? (
                        <FeaturedGrid products={favorites} forceFavorite={true} />
                    ) : (
                        <div className="text-center py-20 border border-white/10 rounded-2xl bg-black/40 backdrop-blur-sm">
                            <h3 className="text-2xl font-bold text-white/50 mb-4">It's empty here.</h3>
                            <p className="text-white/30 mb-8">Go find something inspiring.</p>
                            <Link
                                href="/shop"
                                className="px-8 py-3 bg-cyan-500 text-black font-bold rounded-full hover:bg-cyan-400 transition-colors"
                            >
                                Browse Shop
                            </Link>
                        </div>
                    )}
                </div>
            </SmokeBackground>
        </main>
    );
}
