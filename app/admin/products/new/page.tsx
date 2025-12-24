"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";

export default function NewProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        category: "Ebooks",
        tags: "",
        mediaType: "ebook",
        fileKey: "demo-key", // In real app, upload to S3 first
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                    tags: formData.tags.split(",").map(t => t.trim()),
                    images: [], // Logic for images upload would go here
                }),
            });

            if (res.ok) {
                router.push("/admin");
                router.refresh();
            } else {
                alert("Failed to create product");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-black text-white">
            <Navbar />

            <div className="container mx-auto px-4 py-24 max-w-2xl">
                <h1 className="text-3xl font-bold mb-8">Create New Product</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block mb-2 text-sm font-bold">Title</label>
                        <input
                            type="text" required
                            className="w-full bg-white/5 border border-white/10 rounded p-3 focus:border-cyan-400 outline-none"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-bold">Description</label>
                        <textarea
                            required
                            className="w-full bg-white/5 border border-white/10 rounded p-3 focus:border-cyan-400 outline-none h-32"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-2 text-sm font-bold">Price ($)</label>
                            <input
                                type="number" step="0.01" required
                                className="w-full bg-white/5 border border-white/10 rounded p-3 focus:border-cyan-400 outline-none"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-bold">Category</label>
                            <select
                                className="w-full bg-white/5 border border-white/10 rounded p-3 focus:border-cyan-400 outline-none"
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option value="Ebooks">Ebooks</option>
                                <option value="Audio">Audio</option>
                                <option value="Video">Video</option>
                                <option value="Templates">Templates</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-bold">Tags (comma separated)</label>
                        <input
                            type="text"
                            className="w-full bg-white/5 border border-white/10 rounded p-3 focus:border-cyan-400 outline-none"
                            value={formData.tags}
                            onChange={e => setFormData({ ...formData, tags: e.target.value })}
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-cyan-400 text-black font-bold rounded hover:bg-cyan-300 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Creating...' : 'Create Product'}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}
