import { Navbar } from "@/components/layout/Navbar";
import { ProductCard } from "@/components/ui/ProductCard";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import { Search } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function ShopPage(props: {
    searchParams: Promise<{ search?: string; category?: string }>;
}) {
    const searchParams = await props.searchParams;
    await dbConnect();

    const query: any = {};
    if (searchParams.category) {
        query.category = { $regex: new RegExp(`^${searchParams.category}$`, 'i') };
    }
    if (searchParams.search) {
        query.$or = [
            { title: { $regex: searchParams.search, $options: "i" } },
            { tags: { $in: [new RegExp(searchParams.search, "i")] } },
        ];
    }

    const products = await Product.find(query).sort({ createdAt: -1 }).lean();
    const serializedProducts = products.map(p => ({
        ...p,
        _id: p._id.toString(),
        createdAt: p.createdAt?.toISOString(),
        updatedAt: p.updatedAt?.toISOString()
    }));

    return (
        <main className="min-h-screen bg-black text-white">
            <Navbar />

            <div className="container mx-auto px-4 py-24">
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">
                        CATALOG
                    </h1>

                    <form className="relative w-full md:w-96">
                        <input
                            name="search"
                            placeholder="Search assets..."
                            defaultValue={searchParams.search}
                            className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-3 pl-12 focus:outline-none focus:border-cyan-400 transition-colors"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
                    </form>
                </div>

                <div className="flex gap-4 mb-8 overflow-x-auto pb-4">
                    {['All', 'Ebooks', 'SFX', 'Templates'].map(cat => (
                        <a
                            key={cat}
                            href={cat === 'All' ? '/shop' : `/shop?category=${cat.toLowerCase()}`}
                            className={`px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${(searchParams.category === cat.toLowerCase() || (cat === 'All' && !searchParams.category))
                                ? 'bg-cyan-400 text-black'
                                : 'bg-white/5 hover:bg-white/10'
                                }`}
                        >
                            {cat}
                        </a>
                    ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {serializedProducts.length > 0 ? (
                        serializedProducts.map((product: any) => (
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
                        <div className="col-span-full py-20 text-center">
                            <p className="text-white/40 text-lg">No products found matching your criteria.</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
