"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";

export default function SignInPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleCredentialsLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            setError("Invalid credentials");
            setLoading(false);
        } else {
            router.push("/");
            router.refresh(); // Update auth session in components
        }
    };

    return (
        <main className="min-h-screen bg-black text-white">
            <Navbar />

            <div className="container mx-auto px-4 py-32 flex items-center justify-center">
                <div className="w-full max-w-md bg-white/5 p-8 rounded-2xl border border-white/10">
                    <h1 className="text-3xl font-bold mb-6 text-center">Welcome Back</h1>

                    <form onSubmit={handleCredentialsLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold mb-2 text-white/70">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 focus:border-cyan-400 outline-none transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2 text-white/70">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 focus:border-cyan-400 outline-none transition-colors"
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-cyan-400 text-black font-bold rounded-lg hover:bg-cyan-300 transition-colors disabled:opacity-50"
                        >
                            {loading ? "Signing In..." : "SIGN IN"}
                        </button>
                    </form>

                    <div className="my-6 flex items-center gap-4 opacity-50">
                        <div className="h-px bg-white/20 flex-1" />
                        <span className="text-sm">OR</span>
                        <div className="h-px bg-white/20 flex-1" />
                    </div>

                    <button
                        onClick={() => signIn("google", { callbackUrl: "/" })}
                        className="w-full py-4 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                    >
                        Sign in with Google
                    </button>

                    <p className="mt-8 text-center text-sm text-white/50">
                        Don't have an account? <Link href="/auth/signup" className="text-cyan-400 hover:underline">Sign Up</Link>
                    </p>
                </div>
            </div>
        </main>
    );
}
