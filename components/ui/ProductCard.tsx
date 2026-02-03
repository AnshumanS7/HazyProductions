"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Play, FileText } from "lucide-react";
import React, { useRef } from "react";
import { MagneticButton } from "./MagneticButton";
import { FavoriteButton } from "./FavoriteButton";

interface ProductProps {
    id: string;
    title: string;
    price: number;
    image: string;
    category: string;
    mediaType: string;
    initialFavorite?: boolean;
}

export function ProductCard({ id, title, price, image, category, mediaType, initialFavorite = false }: ProductProps) {
    const ref = useRef<HTMLDivElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();

        const width = rect.width;
        const height = rect.height;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateY,
                rotateX,
                transformStyle: "preserve-3d",
            }}
            className="group relative h-80 w-full max-w-sm rounded-xl bg-gradient-to-br from-white/10 to-white/5 p-4 backdrop-blur-md border border-white/10 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all duration-300"
        >
            {/* Blue Lightning Effect Check: hover:border-cyan-400 and hover:shadow */}

            <div
                style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }}
                className="absolute inset-4 overflow-hidden rounded-xl bg-black/50 shadow-2xl"
            >
                {/* Placeholder or Image */}
                {image ? (
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20">
                        {mediaType === 'audio' ? <Play className="w-12 h-12" /> : <FileText className="w-12 h-12" />}
                    </div>
                )}

                {/* Favorites Button */}
                <div className="absolute top-4 right-4 z-20">
                    <FavoriteButton productId={id} initialIsFavorite={initialFavorite} />
                </div>

                {/* Overlay Action */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <MagneticButton strength={0.2}>
                        <Link href={`/products/${id}`} className="inline-block px-6 py-2 bg-white text-black font-bold rounded-full hover:bg-cyan-400 transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300">
                            View Product
                        </Link>
                    </MagneticButton>
                </div>
            </div>

            <div
                style={{ transform: "translateZ(30px)" }}
                className="absolute bottom-6 left-8 right-8"
            >
                <div className="flex justify-between items-end">
                    <div>
                        <span className="text-xs font-bold text-cyan-400 tracking-wider uppercase">{category}</span>
                        <h3 className="text-lg font-bold text-white mt-1 group-hover:text-cyan-200 transition-colors truncate">{title}</h3>
                    </div>
                    <span className="text-xl font-black text-white drop-shadow-lg">${price}</span>
                </div>
            </div>
        </motion.div>
    );
}
