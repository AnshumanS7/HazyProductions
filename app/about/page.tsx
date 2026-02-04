import { Navbar } from "@/components/layout/Navbar";
import { SmokeBackground } from "@/components/ui/SmokeBackground";
import { AboutSection } from "@/components/home/AboutSection";

export const dynamic = 'force-dynamic';

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-black text-white selection:bg-cyan-500/30">
            <SmokeBackground>
                <Navbar />
                <div className="pt-20">
                    <AboutSection />
                </div>
            </SmokeBackground>
        </main>
    );
}
