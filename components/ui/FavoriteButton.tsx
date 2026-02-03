"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface FavoriteButtonProps {
    productId: string;
    initialIsFavorite?: boolean;
    className?: string;
}

export function FavoriteButton({ productId, initialIsFavorite = false, className = "" }: FavoriteButtonProps) {
    const { data: session } = useSession();
    const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    // Sync with server on load if needed, but rely on prop for SSR speed
    useEffect(() => {
        if (session) {
            // Optional: could refine this to check against a global context
        }
    }, [session]);

    const toggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!session) {
            router.push("/auth/signin");
            return;
        }

        // Optimistic update
        const previousState = isFavorite;
        setIsFavorite(!isFavorite);
        setIsLoading(true);

        try {
            const res = await fetch("/api/user/favorites", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId }),
            });

            if (!res.ok) throw new Error("Failed to update favorite");

            const data = await res.json();
            // Ensure state matches server
            setIsFavorite(data.isFavorite);

            router.refresh(); // Refresh to update lists if needed
        } catch (error) {
            console.error(error);
            setIsFavorite(previousState); // Revert on error
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={toggleFavorite}
            disabled={isLoading}
            className={`p-2 rounded-full backdrop-blur-sm transition-colors ${isFavorite
                    ? "bg-red-500/20 text-red-500 hover:bg-red-500/30"
                    : "bg-black/40 text-white/50 hover:bg-black/60 hover:text-white"
                } ${className}`}
        >
            <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
        </motion.button>
    );
}
