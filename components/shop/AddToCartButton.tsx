"use client";

import { useCart } from "@/context/CartContext";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";

interface AddToCartButtonProps {
    product: {
        id: string;
        title: string;
        price: number;
        image: string;
        fileKey: string;
    };
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
    const { addItem } = useCart();
    const [added, setAdded] = useState(false);

    const handleAdd = () => {
        addItem({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            fileKey: product.fileKey,
        });
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <button
            onClick={handleAdd}
            disabled={added}
            className={`flex-1 py-4 font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2
                ${added
                    ? 'bg-green-500 text-black'
                    : 'bg-white text-black hover:bg-cyan-400'
                }`}
        >
            <ShoppingCart className="w-5 h-5" />
            {added ? 'ADDED!' : 'ADD TO CART'}
        </button>
    );
}
