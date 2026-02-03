"use client";

import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export function Spotlight() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const springConfig = { damping: 25, stiffness: 700, mass: 0.5 };
    const x = useSpring(0, springConfig);
    const y = useSpring(0, springConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            x.set(e.clientX);
            y.set(e.clientY);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [x, y]);

    return (
        <motion.div
            className="pointer-events-none fixed inset-0 z-[9999] transition-opacity duration-300 mix-blend-screen"
            style={{
                background: `radial-gradient(600px circle at ${x.get()}px ${y.get()}px, rgba(34, 211, 238, 0.15), transparent 40%)`,
            }}
        >
            {/* Secondary smaller, brighter spot for focus */}
            <motion.div
                className="absolute inset-0 z-[9999]"
                style={{
                    background: `radial-gradient(300px circle at ${x.get()}px ${y.get()}px, rgba(34, 211, 238, 0.25), transparent 60%)`,
                }}
            />
        </motion.div>
    );
}
