"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Upload, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { use } from "react";

export default function EditProductPage(props: { params: Promise<{ id: string }> }) {
    const params = use(props.params);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [uploading, setUploading] = useState(false);

    interface ProductData {
        title: string;
        description: string;
        price: string;
        category: string;
        tags: string;
        mediaType: string;
        fileKey: string;
    }

    const [formData, setFormData] = useState<ProductData>({
        title: "",
        description: "",
        price: "",
        category: "Ebooks",
        tags: "",
        mediaType: "ebook",
        fileKey: "",
    });

    useEffect(() => {
        fetch(`/api/products/${params.id}`)
            .then(async res => {
                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.error || "Failed to fetch product");
                }
                return res.json();
            })
            .then(data => {
                console.log("EditPage received data:", data); // Debug log
                if (!data) throw new Error("No data received");

                try {
                    setFormData({
                        title: data.title || "",
                        description: data.description || "",
                        // Ensure price is treated safely. If it's a number, toString works. If string, it works. If undefined/null, default to "0".
                        price: (data.price !== undefined && data.price !== null) ? String(data.price) : "0",
                        category: data.category || "Ebooks",
                        tags: Array.isArray(data.tags) ? data.tags.join(", ") : (data.tags || ""),
                        mediaType: data.mediaType || "ebook",
                        fileKey: data.fileKey || "",
                    });
                    setFetching(false);
                } catch (e: any) {
                    console.error("Error setting form data:", e);
                    throw new Error("Error processing product data: " + e.message);
                }
            })
            .catch(err => {
                console.error("Fetch error:", err);
                alert(`Error loading product: ${err.message}`);
                setFetching(false);
            });
    }, [params.id]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            // 1. Get presigned URL
            const res = await fetch("/api/products/upload", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    filename: file.name,
                    contentType: file.type,
                }),
            });

            const { url, fileKey } = await res.json();
            if (!url) throw new Error("Failed to get upload URL");

            // 2. Upload to S3
            const uploadRes = await fetch(url, {
                method: "PUT",
                body: file,
                headers: { "Content-Type": file.type },
            });

            if (!uploadRes.ok) throw new Error("S3 Upload Failed");

            // 3. Update State
            setFormData(prev => ({ ...prev, fileKey }));
            alert("File uploaded successfully!");
        } catch (error) {
            console.error(error);
            alert("Upload failed.");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`/api/products/${params.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                    tags: formData.tags.split(",").map(t => t.trim()),
                }),
            });

            if (res.ok) {
                router.push("/admin");
                router.refresh();
            } else {
                alert("Failed to update product");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="min-h-screen bg-black text-white p-24 text-center">Loading...</div>;

    return (
        <main className="min-h-screen bg-black text-white">
            <Navbar />

            <div className="container mx-auto px-4 py-24 max-w-2xl">
                <div className="mb-8">
                    <Link href="/admin" className="inline-flex items-center text-white/50 hover:text-white mb-4">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold">Edit Product</h1>
                </div>

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

                    {/* File Upload Section */}
                    <div className="p-6 bg-white/5 border border-dashed border-white/20 rounded-xl">
                        <label className="block mb-4 text-sm font-bold text-cyan-400 flex items-center gap-2">
                            <Upload className="w-4 h-4" /> Digital Asset File
                        </label>

                        <div className="flex items-center gap-4">
                            <input
                                type="file"
                                onChange={handleFileUpload}
                                disabled={uploading}
                                className="text-sm text-white/70 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-cyan-400 file:text-black hover:file:bg-cyan-300 transition-colors"
                            />
                            {uploading && <span className="text-sm text-yellow-500 animate-pulse">Uploading...</span>}
                        </div>

                        {formData.fileKey && (
                            <p className="mt-2 text-xs text-green-400">
                                Current File Key: {formData.fileKey}
                            </p>
                        )}
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
                                <option value="SFX">SFX</option>
                                <option value="Templates">Templates</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-bold">Tags</label>
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
                            disabled={loading || uploading}
                            className="w-full py-4 bg-fuchsia-500 text-white font-bold rounded hover:bg-fuchsia-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <Save className="w-5 h-5" />
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}
