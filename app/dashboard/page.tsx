import { Navbar } from "@/components/layout/Navbar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { DownloadButton } from "@/components/dashboard/DownloadButton";
import { CheckCircle, Clock } from "lucide-react";
import Link from "next/link";
import { Metadata } from 'next';
import { ClearCartOnSuccess } from "@/components/dashboard/ClearCartOnSuccess";

export const metadata: Metadata = {
    title: 'Dashboard | HazyProductions',
    description: 'Manage your orders and downloads.',
};

export const dynamic = 'force-dynamic';

export default async function DashboardPage(props: { searchParams: Promise<{ success?: string }> }) {
    const searchParams = await props.searchParams;
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/auth/signin?callbackUrl=/dashboard');
    }

    await dbConnect();

    // Fetch confirmed and pending orders
    const orders = await Order.find({
        userId: session.user.id,
        status: { $in: ['completed', 'pending'] }
    })
        .sort({ createdAt: -1 })
        .populate('items')
        .lean();

    return (
        <main className="min-h-screen bg-black text-white">
            <Navbar />

            {/* Logic to clear cart if redirected from payment */}
            {searchParams?.success === 'true' && <ClearCartOnSuccess />}

            <div className="container mx-auto px-4 py-24 max-w-4xl">
                <h1 className="text-4xl font-bold mb-2">My Dashboard</h1>
                <p className="text-white/60 mb-8">Welcome back, <span className="text-cyan-400">{session.user.name}</span></p>

                {searchParams?.success === 'true' && (
                    <div className="mb-8 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-4 text-green-400">
                        <CheckCircle className="w-6 h-6" />
                        <div>
                            <p className="font-bold">Payment Successful!</p>
                            <p className="text-sm text-green-400/80">Your digital assets are ready to download below.</p>
                        </div>
                    </div>
                )}

                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <Clock className="w-6 h-6 text-fuchsia-400" />
                    Order History
                </h2>

                {orders.length === 0 ? (
                    <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
                        <p className="text-xl mb-4 text-white/60">You haven't purchased anything yet.</p>
                        <Link href="/shop" className="inline-block px-6 py-3 bg-cyan-400 text-black font-bold rounded hover:bg-cyan-300">
                            Browse Shop
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order: any) => (
                            <div key={order._id.toString()} className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                                <div className="bg-white/5 p-4 flex justify-between items-center text-sm text-white/60">
                                    <span>#{order._id.toString().slice(-6).toUpperCase()}</span>
                                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-6">
                                        {order.items.map((item: any) => (
                                            <div key={item._id.toString()} className="flex items-center justify-between gap-4">
                                                <div className="flex items-center gap-4">
                                                    {item.images?.[0] && (
                                                        <img src={item.images[0]} alt={item.title} className="w-16 h-16 object-cover rounded bg-black" />
                                                    )}
                                                    <div>
                                                        <h3 className="font-bold text-lg">{item.title}</h3>
                                                        <p className="text-sm text-cyan-400">${item.price}</p>
                                                    </div>
                                                </div>

                                                {order.status === 'completed' ? (
                                                    <DownloadButton
                                                        productId={item._id.toString()}
                                                        fileName={item.title}
                                                    />
                                                ) : (
                                                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-500 text-xs font-bold rounded-full border border-yellow-500/20 animate-pulse">
                                                        PROCESSING
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-6 pt-6 border-t border-white/10 flex justify-between items-center">
                                        <span className="text-sm text-white/50">Total Paid</span>
                                        <span className="text-xl font-bold">${order.amount}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
