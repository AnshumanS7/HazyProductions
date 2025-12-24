"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Play, FileText, ShoppingCart } from "lucide-react";

interface ProductProps {
    id: string;
    title: string;
    price: number;
    image: string;
    category: string;
    mediaType: string;
}

export function ProductCard({ id, title, price, image, category, mediaType }: ProductProps) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="group relative bg-white/5 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm"
        >
            <div className="aspect-video relative overflow-hidden bg-black/50">
                {/* Placeholder or Image */}
                {image ? (
                    <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20">
                        {mediaType === 'audio' ? <Play /> : <FileText />}
                    </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <Link href={`/products/${id}`} className="px-4 py-2 bg-white text-black rounded-full font-bold hover:bg-cyan-400 transition-colors">
                        View
                    </Link>
                </div>
            </div>

            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <span className="text-xs text-cyan-400 uppercase tracking-wider">{category}</span>
                        <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">{title}</h3>
                    </div>
                    <span className="text-lg font-bold text-white">${price}</span>
                </div>
            </div>
        </motion.div>
    );
}
