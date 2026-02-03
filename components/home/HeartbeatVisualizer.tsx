"use client";

import { motion } from "framer-motion";

export function HeartbeatVisualizer() {
    // Total duration: 4s (3s draw, 1s fade out/delay)
    const duration = 4;

    const pathVariants = {
        animate: {
            pathLength: [0, 1, 1, 0], // Draw -> Hold -> Disappear
            opacity: [0, 1, 1, 0],    // Fade In -> Stay -> Fade Out
            transition: {
                duration: duration,
                times: [0, 0.6, 0.85, 1], // 0-60% draw (2.4s), 60%-85% hold, 85%-100% fade out
                ease: "linear" as const,
                repeat: Infinity,
            }
        }
    };

    const labelVariants = {
        animate: (custom: number) => ({
            opacity: [0, 1, 1, 0],
            y: [10, 0, 0, 10],
            scale: [0.8, 1, 1, 0.8],
            transition: {
                duration: duration,
                // Calculate times based on the custom delay (position on line)
                // Line reaches points approximately at 20%, 50%, 80% of draw time
                // Draw time is 60% of total duration = 2.4s
                // Point 1: 0.2 * 0.6 = 0.12 (start appear), hold until 0.85, fade at 1
                times: [
                    custom,          // Start appearing
                    custom + 0.05,   // Fully visible
                    0.85,            // Start fading out
                    0.95             // Fully faded
                ],
                repeat: Infinity,
            }
        })
    };

    return (
        <div className="w-full py-10 overflow-hidden relative z-10">
            <div className="max-w-5xl mx-auto relative h-32 flex items-center justify-center">
                {/* SVG Line */}
                <svg
                    viewBox="0 0 1000 100"
                    className="w-full h-full drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]"
                    preserveAspectRatio="none"
                >
                    <motion.path
                        d="M 0,50 L 150,50 L 175,10 L 200,90 L 225,50 L 450,50 L 475,10 L 500,90 L 525,50 L 750,50 L 775,10 L 800,90 L 825,50 L 1000,50"
                        fill="transparent"
                        stroke="#22d3ee"
                        strokeWidth="3"
                        variants={pathVariants}
                        animate="animate"
                    />
                </svg>

                {/* Labels */}

                {/* Spike 1: SFX (At ~225px / 1000px = ~22%) */}
                {/* Time: 22% of draw time (0.6 total) = ~0.13 */}
                <motion.div
                    custom={0.13}
                    variants={labelVariants}
                    animate="animate"
                    className="absolute left-[20%] -top-2 flex flex-col items-center"
                >
                    <div className="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee]" />
                    <span className="text-cyan-400 font-bold text-sm tracking-widest mt-2 uppercase text-shadow-glow">SFX</span>
                </motion.div>

                {/* Spike 2: Ebooks (At ~500px / 1000px = 50%) */}
                {/* Time: 50% of draw time (0.6 total) = 0.3 */}
                <motion.div
                    custom={0.3}
                    variants={labelVariants}
                    animate="animate"
                    className="absolute left-[48%] -top-2 flex flex-col items-center"
                >
                    <div className="w-2 h-2 bg-fuchsia-400 rounded-full shadow-[0_0_10px_#e879f9]" />
                    <span className="text-fuchsia-400 font-bold text-sm tracking-widest mt-2 uppercase text-shadow-glow">Ebooks</span>
                </motion.div>

                {/* Spike 3: Templates (At ~800px / 1000px = 80%) */}
                {/* Time: 80% of draw time (0.6 total) = 0.48 */}
                <motion.div
                    custom={0.48}
                    variants={labelVariants}
                    animate="animate"
                    className="absolute left-[78%] -top-2 flex flex-col items-center"
                >
                    <div className="w-2 h-2 bg-teal-400 rounded-full shadow-[0_0_10px_#2dd4bf]" />
                    <span className="text-teal-400 font-bold text-sm tracking-widest mt-2 uppercase text-shadow-glow">Templates</span>
                </motion.div>
            </div>
        </div>
    );
}
