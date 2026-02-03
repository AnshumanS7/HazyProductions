"use client";

import { motion } from "framer-motion";

interface GlitchTextProps {
    text: string;
    className?: string;
}

export function GlitchText({ text, className = "" }: GlitchTextProps) {
    const glitchVariants = {
        hidden: { opacity: 0, x: 0 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.1,
                staggerChildren: 0.05
            }
        }
    };

    const spanVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: {
            opacity: 1,
            x: 0,
        }
    };

    // Shadow variants for continuous glitching
    const shadowVariants = {
        animate: {
            opacity: [0, 0, 0.8, 0, 0, 0.8, 0],
            x: [0, 0, 2, -2, 0, 3, 0],
            y: [0, 0, 1, -1, 0, -2, 0],
            transition: {
                duration: 2.5,
                ease: "linear" as const,
                repeat: Infinity,
                repeatType: "mirror" as const,
                times: [0, 0.9, 0.92, 0.94, 0.96, 0.98, 1] // Glitch only happens at the very end of the cycle
            }
        }
    };

    const cyanShadowVariants = {
        animate: {
            opacity: [0, 0, 0.8, 0, 0, 0.8, 0],
            x: [0, 0, -2, 2, 0, -3, 0],
            y: [0, 0, -1, 1, 0, 2, 0],
            transition: {
                duration: 2.5,
                ease: "linear" as const,
                repeat: Infinity,
                repeatType: "mirror" as const,
                times: [0, 0.9, 0.92, 0.94, 0.96, 0.98, 1]
            }
        }
    };

    return (
        <div className={`relative inline-block ${className}`}>
            {/* Main Text */}
            <motion.span
                className="relative z-10 inline-block"
                variants={glitchVariants}
                initial="hidden"
                animate="visible"
            >
                {text.split("").map((char, i) => (
                    <motion.span key={i} variants={spanVariants} className="inline-block relative">
                        {char === " " ? "\u00A0" : char}
                        {/* Continuous Glitch Shadows */}
                        <motion.span
                            variants={shadowVariants}
                            animate="animate"
                            className="absolute top-0 left-0 -z-10 text-red-500 mix-blend-screen"
                        >
                            {char}
                        </motion.span>
                        <motion.span
                            variants={cyanShadowVariants}
                            animate="animate"
                            className="absolute top-0 left-0 -z-10 text-cyan-500 mix-blend-screen"
                        >
                            {char}
                        </motion.span>
                    </motion.span>
                ))}
            </motion.span>
        </div>
    );
}
