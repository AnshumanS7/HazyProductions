"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SmokeBackground } from "@/components/ui/SmokeBackground";
import { GlitchText } from "@/components/ui/GlitchText";

export function Hero() {
    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
            <div className="flex items-center justify-center h-full w-full">
                <div className="text-center px-4 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="mb-6"
                    >
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white">
                            <GlitchText text="DIGITAL ASSETS" className="text-white drop-shadow-2xl mb-2" />
                            <br />
                            <GlitchText text="FOR CREATORS" className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500" />
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                        className="text-xl md:text-2xl text-white/60 mb-8 max-w-2xl mx-auto p-4 rounded-xl border border-white/5 bg-black/30 backdrop-blur-sm"
                    >
                        High-quality SFX, Ebooks, and Templates for your next masterpiece.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
                        className="flex items-center justify-center gap-4"
                    >
                        <Link href="/shop" className="group relative px-8 py-4 bg-white text-black font-bold rounded overflow-hidden transition-all hover:scale-105">
                            <span className="relative z-10 text-lg">BROWSE CATALOG</span>
                            <div className="absolute inset-0 bg-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                        </Link>
                        <Link href="/about" className="px-8 py-4 bg-transparent border border-white/20 hover:border-white/60 hover:bg-white/5 rounded transition-all text-lg backdrop-blur-md">
                            LEARN MORE
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
