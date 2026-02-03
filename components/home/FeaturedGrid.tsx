"use client";

import { motion } from "framer-motion";
import { ProductCard } from "@/components/ui/ProductCard";

interface FeaturedGridProps {
    products: any[];
    forceFavorite?: boolean;
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 50 }
    }
};

export function FeaturedGrid({ products, forceFavorite = false }: FeaturedGridProps) {
    if (products.length === 0) {
        return (
            <div className="col-span-3 text-center py-20 border border-dashed border-white/10 rounded-xl">
                <p className="text-white/40">No featured products yet. Check back soon.</p>
            </div>
        );
    }

    return (
        <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
            {products.map((product) => (
                <motion.div key={product._id} variants={item}>
                    <ProductCard
                        id={product._id}
                        title={product.title}
                        price={product.price}
                        image={product.images?.[0] || ""}
                        category={product.category}
                        mediaType={product.mediaType}
                        initialFavorite={forceFavorite}
                    />
                </motion.div>
            ))}
        </motion.div>
    );
}
