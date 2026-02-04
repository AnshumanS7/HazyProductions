import { Navbar } from "@/components/layout/Navbar";
import { SmokeBackground } from "@/components/ui/SmokeBackground";
import { MoveRight, Zap, Combine, Aperture } from "lucide-react";
import Link from "next/link";
import { MagneticButton } from "@/components/ui/MagneticButton";

export const dynamic = 'force-dynamic'; // Prevent static build issues with random elements if any

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-black text-white selection:bg-cyan-500/30">
            <SmokeBackground>
                <Navbar />

                <div className="container mx-auto px-4 py-32 relative z-10">

                    {/* Hero Section */}
                    <div className="max-w-4xl mx-auto text-center mb-20">
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter">
                            CRAFTING <span className="bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">THE UNSEEN</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-white/60 font-light leading-relaxed">
                            HazyProductions is a digital arsenal for the modern creator.
                            We bridge the gap between imagination and execution.
                        </p>
                    </div>

                    {/* Mission Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                        <div className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors group">
                            <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center mb-6 text-cyan-400 group-hover:scale-110 transition-transform">
                                <Zap className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">High Voltage SFX</h3>
                            <p className="text-white/50 leading-relaxed">
                                Sonic textures that cut through the mix. From Glitch to Cinematic Impacts, our sound libraries are engineered for maximum impact.
                            </p>
                        </div>

                        <div className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors group">
                            <div className="w-12 h-12 bg-fuchsia-500/20 rounded-full flex items-center justify-center mb-6 text-fuchsia-400 group-hover:scale-110 transition-transform">
                                <Aperture className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Visual Alchemy</h3>
                            <p className="text-white/50 leading-relaxed">
                                LUTs, overlays, and motion graphics designed to give your footage a premium, filmic look instantly.
                            </p>
                        </div>

                        <div className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors group">
                            <div className="w-12 h-12 bg-teal-500/20 rounded-full flex items-center justify-center mb-6 text-teal-400 group-hover:scale-110 transition-transform">
                                <Combine className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Creator Templates</h3>
                            <p className="text-white/50 leading-relaxed">
                                Drag-and-drop project files that save you hours. Focus on the creative cut, not the technical setup.
                            </p>
                        </div>
                    </div>

                    {/* Story / Manifesto */}
                    <div className="max-w-3xl mx-auto border-l-2 border-cyan-500/30 pl-8 md:pl-12 py-4 mb-24">
                        <blockquote className="text-2xl md:text-3xl font-light italic text-white/80 mb-6">
                            "We believe that high-quality assets shouldn't be gated behind studio budgets. Every creator deserves access to industry-standard tools."
                        </blockquote>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-black rounded-full border border-white/10" />
                            <div>
                                <div className="font-bold text-white">Anshuman S.</div>
                                <div className="text-cyan-400 text-sm tracking-wider uppercase">Founder, HazyProductions</div>
                            </div>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="text-center">
                        <h2 className="text-3xl font-bold mb-8">Ready to upgrade your workflow?</h2>
                        <MagneticButton strength={0.3}>
                            <Link
                                href="/shop"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-full text-lg hover:bg-cyan-400 transition-colors"
                            >
                                Explore the Shop <MoveRight className="w-5 h-5" />
                            </Link>
                        </MagneticButton>
                    </div>

                </div>
            </SmokeBackground>
        </main>
    );
}
