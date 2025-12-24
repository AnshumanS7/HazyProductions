import { Navbar } from "@/components/layout/Navbar";
import { ProductCard } from "@/components/ui/ProductCard";
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
      {/* Auth Provider wrapper should be in layout or a separate provider component, 
          but for simplicity assuming RootLayout wraps children or we wrap Navbar usage? 
          Wait, Navbar uses useSession, so it must be inside SessionProvider. 
          I need to create a Providers component. */}
      {/* For now, assuming Providers are added to Layout. I will touch Layout next. */}

      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-black to-black z-0" />

        <div className="z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter">
            <span className="bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
              DIGITAL ASSETS
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
              FOR CREATORS
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/60 mb-8 max-w-2xl mx-auto">
            High-quality SFX, Ebooks, and Templates for your next masterpiece.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/shop" className="px-8 py-4 bg-white text-black font-bold rounded hover:bg-cyan-400 transition-colors text-lg">
              BROWSE CATALOG
            </Link>
            <Link href="/about" className="px-8 py-4 bg-transparent border border-white/20 hover:border-white/60 rounded transition-colors text-lg">
              LEARN MORE
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-24 px-4 bg-black/50">
        <div className="container mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Drops</h2>
              <p className="text-white/40">Curated specifically for you</p>
            </div>
            <Link href="/shop" className="text-cyan-400 hover:text-cyan-300">View All &rarr;</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product: any) => (
                <ProductCard
                  key={product._id}
                  id={product._id}
                  title={product.title}
                  price={product.price}
                  image={product.images?.[0] || ""}
                  category={product.category}
                  mediaType={product.mediaType}
                />
              ))
            ) : (
              // Empty State
              <div className="col-span-3 text-center py-20 border border-dashed border-white/10 rounded-xl">
                <p className="text-white/40">No featured products yet. Check back soon.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
