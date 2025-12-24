"use client";

import { Navbar } from "@/components/layout/Navbar";
import { useCart } from "@/context/CartContext";
import { Trash2, CreditCard } from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function CartPage() {
    const { items, removeItem, clearCart, total } = useCart();
    const { data: session } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleCheckout = async () => {
        if (!session) {
            alert("Please login to checkout");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: items.map(item => item.id),
                }),
            });

            const data = await res.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                alert("Checkout failed");
            }
        } catch (error) {
            console.error(error);
            alert("Checkout error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-black text-white">
            <Navbar />

            <div className="container mx-auto px-4 py-32 max-w-4xl">
                <h1 className="text-4xl font-bold mb-8">YOUR BAG</h1>

                {items.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                        <p className="text-white/50 text-xl mb-4">Your cart is empty.</p>
                        <a href="/shop" className="text-cyan-400 hover:underline">Continue Shopping</a>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {/* Cart Items */}
                        <div className="md:col-span-2 space-y-4">
                            {items.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                                    <div className="w-24 h-24 bg-black rounded-lg overflow-hidden flex-shrink-0">
                                        {item.image && <img src={item.image} alt={item.title} className="w-full h-full object-cover" />}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg">{item.title}</h3>
                                        <p className="text-cyan-400 font-bold">${item.price}</p>
                                    </div>
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="p-2 hover:bg-white/10 rounded-full text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Summary */}
                        <div className="bg-white/5 p-8 rounded-2xl border border-white/10 h-fit sticky top-24">
                            <h2 className="text-xl font-bold mb-6">Summary</h2>

                            <div className="flex justify-between mb-4 text-white/70">
                                <span>Subtotal</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between mb-8 text-xl font-bold">
                                <span>Total</span>
                                <span className="text-cyan-400">${total.toFixed(2)}</span>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={loading}
                                className="w-full py-4 bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-black font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                            >
                                {loading ? 'Processing...' : (
                                    <>
                                        <CreditCard className="w-5 h-5" /> CHECKOUT
                                    </>
                                )}
                            </button>
                            <p className="text-xs text-white/30 text-center mt-4">
                                Secure Encrypted Payment
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
