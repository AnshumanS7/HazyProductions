import { Navbar } from "@/components/layout/Navbar";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import { notFound } from "next/navigation";
import { Play, FileText, Download, ShieldCheck } from "lucide-react";
import { AddToCartButton } from "@/components/shop/AddToCartButton";

export const dynamic = 'force-dynamic';

export default async function ProductPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    await dbConnect();

    let product;
    try {
        product = await Product.findById(params.id).lean();
    } catch (e) {
        return notFound();
    }

    if (!product) return notFound();

    const serializedProduct = {
        ...product,
        _id: product._id.toString(),
        createdAt: product.createdAt?.toISOString(),
        updatedAt: product.updatedAt?.toISOString()
    };

    return (
        <main className="min-h-screen bg-black text-white">
            <Navbar />

            <div className="container mx-auto px-4 py-32">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Visuals */}
                    <div className="bg-white/5 rounded-2xl overflow-hidden border border-white/10 aspect-video flex items-center justify-center relative">
                        {serializedProduct.images?.[0] ? (
                            <img src={serializedProduct.images[0]} alt={serializedProduct.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-white/20">
                                <FileText className="w-24 h-24" />
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <span className="px-3 py-1 bg-cyan-400/20 text-cyan-400 rounded-full text-xs font-bold uppercase tracking-wider">
                                {serializedProduct.category}
                            </span>
                            {serializedProduct.isFeatured && (
                                <span className="px-3 py-1 bg-fuchsia-500/20 text-fuchsia-400 rounded-full text-xs font-bold uppercase">
                                    Featured
                                </span>
                            )}
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold mb-4">{serializedProduct.title}</h1>
                        <p className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent mb-6">
                            ${serializedProduct.price}
                        </p>

                        <div className="prose prose-invert mb-8 text-white/70">
                            <p>{serializedProduct.description}</p>
                        </div>

                        <div className="flex gap-4 mb-8">
                            <AddToCartButton
                                product={{
                                    id: serializedProduct._id,
                                    title: serializedProduct.title,
                                    price: serializedProduct.price,
                                    image: serializedProduct.images[0] || "",
                                    fileKey: serializedProduct.fileKey
                                }}
                            />
                            {/* Preview Button if applicable */}
                            {serializedProduct.previewUrl && (
                                <a href={serializedProduct.previewUrl} target="_blank" className="flex items-center justify-center gap-2 px-6 py-4 bg-transparent border border-white/20 rounded-lg hover:bg-white/10 transition-colors">
                                    <Play className="w-5 h-5" /> Preview
                                </a>
                            )}
                        </div>

                        <div className="border-t border-white/10 pt-6 space-y-4">
                            <div className="flex items-center gap-3 text-white/50 text-sm">
                                <ShieldCheck className="w-5 h-5 text-green-500" />
                                <span>Secure Payment via Dodo Payments</span>
                            </div>
                            <div className="flex items-center gap-3 text-white/50 text-sm">
                                <Download className="w-5 h-5 text-cyan-400" />
                                <span>Instant Digital Download</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
