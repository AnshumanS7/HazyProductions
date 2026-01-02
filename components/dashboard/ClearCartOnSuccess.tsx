"use client";

import { useEffect, useRef } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

export function ClearCartOnSuccess() {
    const { clearCart } = useCart();
    const router = useRouter();
    const hasCleared = useRef(false);

    useEffect(() => {
        if (!hasCleared.current) {
            clearCart();
            hasCleared.current = true;
            // Clean URL to prevent re-triggering (optional, but good UX)
            router.replace('/dashboard');
        }
    }, [clearCart, router]);

    return null;
}
