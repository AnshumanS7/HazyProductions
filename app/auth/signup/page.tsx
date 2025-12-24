"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";

export default function SignUpPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            if (res.ok) {
                // Determine redirect based on logic, usually direct them to login
                router.push("/auth/signin?registered=true");
            } else {
                const data = await res.json();
                setError(data.error || "Registration failed");
            }
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-black text-white">
            <Navbar />

            <div className="container mx-auto px-4 py-32 flex items-center justify-center">
                <div className="w-full max-w-md bg-white/5 p-8 rounded-2xl border border-white/10">
                    <h1 className="text-3xl font-bold mb-6 text-center">Create Account</h1>

                    <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold mb-2 text-white/70">Name</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 focus:border-cyan-400 outline-none transition-colors"
                            />
                        </div>

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
                                minLength={6}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 focus:border-cyan-400 outline-none transition-colors"
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-fuchsia-500 text-white font-bold rounded-lg hover:bg-fuchsia-400 transition-colors disabled:opacity-50"
                        >
                            {loading ? "Creating Account..." : "SIGN UP"}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-white/50">
                        Already have an account? <Link href="/auth/signin" className="text-cyan-400 hover:underline">Log In</Link>
                    </p>
                </div>
            </div>
        </main>
    );
}
