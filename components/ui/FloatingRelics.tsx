"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Box, Pyramid, Octagon, Hexagon, Triangle } from "lucide-react"; // Using lucide icons as simplified wireframes

export function FloatingRelics() {
    const { scrollY } = useScroll();

    // Parallax transforms
    const y1 = useTransform(scrollY, [0, 1000], [0, 300]);
    const y2 = useTransform(scrollY, [0, 1000], [0, -150]);
    const y3 = useTransform(scrollY, [0, 1000], [0, 400]);

    return (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden h-full w-full">
            {/* Relic 1: Cube Top Left */}
            <motion.div
                style={{ y: y1 }}
                animate={{ rotate: 360, y: [0, -20, 0] }}
                transition={{
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    y: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                }}
                className="absolute top-1/4 left-10 opacity-20 text-cyan-500/50"
            >
                <Box className="w-32 h-32 stroke-1" />
            </motion.div>

            {/* Relic 2: Pyramid Right Center */}
            <motion.div
                style={{ y: y2 }}
                animate={{ rotate: -360, y: [0, 30, 0] }}
                transition={{
                    rotate: { duration: 25, repeat: Infinity, ease: "linear" },
                    y: { duration: 7, repeat: Infinity, ease: "easeInOut" }
                }}
                className="absolute top-1/2 right-20 opacity-15 text-fuchsia-500/50"
            >
                <Pyramid className="w-48 h-48 stroke-1" />
            </motion.div>

            {/* Relic 3: Octagon Bottom Left */}
            <motion.div
                style={{ y: y3 }}
                animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                transition={{
                    rotate: { duration: 30, repeat: Infinity, ease: "linear" },
                    scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
                }}
                className="absolute bottom-1/4 left-32 opacity-10 text-teal-400/50"
            >
                <Octagon className="w-64 h-64 stroke-1" />
            </motion.div>

            {/* Relic 4: Hexagon Top Center */}
            <motion.div
                style={{ y: y2 }}
                animate={{ rotate: -180, x: [0, 50, 0] }}
                transition={{
                    rotate: { duration: 35, repeat: Infinity, ease: "linear" },
                    x: { duration: 10, repeat: Infinity, ease: "easeInOut" }
                }}
                className="absolute top-10 left-1/2 opacity-10 text-purple-500/50"
            >
                <Hexagon className="w-40 h-40 stroke-1" />
            </motion.div>

            {/* Relic 5: Triangle Bottom Right */}
            <motion.div
                style={{ y: y1 }}
                animate={{ rotate: 180, scale: [1, 1.2, 1] }}
                transition={{
                    rotate: { duration: 28, repeat: Infinity, ease: "linear" },
                    scale: { duration: 6, repeat: Infinity, ease: "easeInOut" }
                }}
                className="absolute bottom-20 right-10 opacity-15 text-blue-500/50"
            >
                <Triangle className="w-56 h-56 stroke-1" />
            </motion.div>

        </div>
    );
}
