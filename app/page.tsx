import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/home/Hero";
import { FeaturedGrid } from "@/components/home/FeaturedGrid";
import { SmokeBackground } from "@/components/ui/SmokeBackground";
import { HeartbeatVisualizer } from "@/components/home/HeartbeatVisualizer";
import Link from "next/link";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";

// Force dynamic because we fetch products directly
export const dynamic = 'force-dynamic';

async function getFeaturedProducts() {
  try {
    await dbConnect();
    // Return plain objects to avoid serialization issues
    const products = await Product.find({ isFeatured: true }).limit(3).lean();
    return products.map(p => ({
      ...p,
      _id: p._id.toString(),
      createdAt: p.createdAt?.toISOString(),
      updatedAt: p.updatedAt?.toISOString()
    }));
  } catch (error) {
    console.error("Failed to fetch products", error);
    return [];
  }
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <main className="min-h-screen bg-black text-white selection:bg-cyan-500/30">
      <SmokeBackground>
        <Navbar />

        <Hero />

        {/* Heartbeat Visualization */}
        <HeartbeatVisualizer />

        {/* Featured Section */}
        <section className="py-24 px-4 bg-black/50 relative z-10">
          <div className="container mx-auto">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl font-bold mb-2">Featured Drops</h2>
                <p className="text-white/40">Curated specifically for you</p>
              </div>
              <Link href="/shop" className="text-cyan-400 hover:text-cyan-300">View All &rarr;</Link>
            </div>

            <FeaturedGrid products={featuredProducts} />
          </div>
        </section>
      </SmokeBackground>
    </main>
  );
}
