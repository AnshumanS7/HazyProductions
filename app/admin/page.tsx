import { Navbar } from "@/components/layout/Navbar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import Order from "@/models/Order";
import Link from "next/link";
import { Plus, Package, ShoppingBag } from "lucide-react";
import { DownloadButton } from "@/components/dashboard/DownloadButton";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
        redirect('/');
    }

    await dbConnect();

    const productCount = await Product.countDocuments();
    const orderCount = await Order.countDocuments();
    const products = await Product.find().sort({ createdAt: -1 }).limit(10).lean();

    return (
        <main className="min-h-screen bg-black text-white">
            <Navbar />

            <div className="container mx-auto px-4 py-24">
                <div className="flex justify-between items-center mb-12">
                    <h1 className="text-4xl font-bold">Admin Dashboard</h1>
                    <Link href="/admin/products/new" className="flex items-center gap-2 px-6 py-3 bg-cyan-400 text-black font-bold rounded-lg hover:bg-cyan-300">
                        <Plus className="w-5 h-5" /> New Product
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className="p-8 bg-white/5 rounded-2xl border border-white/10">
                        <div className="flex items-center gap-4 mb-4 text-cyan-400">
                            <Package className="w-8 h-8" />
                            <h2 className="text-xl font-bold">Total Products</h2>
                        </div>
                        <p className="text-5xl font-black">{productCount}</p>
                    </div>
                    <div className="p-8 bg-white/5 rounded-2xl border border-white/10">
                        <div className="flex items-center gap-4 mb-4 text-fuchsia-400">
                            <ShoppingBag className="w-8 h-8" />
                            <h2 className="text-xl font-bold">Total Orders</h2>
                        </div>
                        <p className="text-5xl font-black">{orderCount}</p>
                    </div>
                </div>

                <h2 className="text-2xl font-bold mb-6">Recent Products</h2>
                <div className="bg-white/5 rounded-xl overflow-hidden border border-white/10">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-xs uppercase text-white/50">
                            <tr>
                                <th className="p-4">Title</th>
                                <th className="p-4">Price</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {products.map(p => (
                                <tr key={p._id.toString()}>
                                    <td className="p-4">{p.title}</td>
                                    <td className="p-4">${p.price}</td>
                                    <td className="p-4">{p.category}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-4">
                                            <Link href={`/products/${p._id}`} className="text-cyan-400 hover:underline">View</Link>
                                            <Link href={`/admin/products/${p._id}/edit`} className="text-fuchsia-400 hover:underline">Edit</Link>
                                            <DownloadButton productId={p._id.toString()} fileName={p.title} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
}
