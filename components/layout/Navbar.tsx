"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { ShoppingCart, Menu, User } from "lucide-react"; // Install lucide-react if not present
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";

export function Navbar() {
    const { data: session } = useSession();
    const { items } = useCart();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="text-2xl font-bold italic bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">
                    HAZY
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="/shop" className="text-sm font-medium hover:text-cyan-400 transition-colors">
                        SHOP
                    </Link>
                    <Link href="/about" className="text-sm font-medium hover:text-cyan-400 transition-colors">
                        ABOUT
                    </Link>

                    <div className="flex items-center gap-4">
                        <Link href="/cart" className="relative p-2 hover:bg-white/5 rounded-full transition-colors">
                            <ShoppingCart className="w-5 h-5" />
                            {items.length > 0 && (
                                <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-cyan-400 text-black text-xs font-bold rounded-full">
                                    {items.length}
                                </span>
                            )}
                        </Link>

                        {session ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center gap-2 p-2 hover:bg-white/5 rounded-lg transition-colors"
                                >
                                    <User className="w-5 h-5 text-cyan-400" />
                                    <span className="text-sm">{session.user?.name?.split(' ')[0]}</span>
                                </button>

                                <AnimatePresence>
                                    {isDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute right-0 mt-2 w-48 bg-black border border-white/10 rounded-lg shadow-xl overflow-hidden"
                                        >
                                            <Link href="/dashboard" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm hover:bg-white/10">Dashboard</Link>
                                            {session.user.role === 'admin' && (
                                                <Link href="/admin" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm hover:bg-white/10 text-yellow-400">Admin Panel</Link>
                                            )}
                                            <button onClick={() => { signOut(); setIsDropdownOpen(false); }} className="block w-full text-left px-4 py-2 text-sm hover:bg-red-500/20 text-red-500">Sign Out</button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <button
                                onClick={() => signIn()}
                                className="px-4 py-2 text-sm font-bold bg-white text-black rounded hover:bg-cyan-400 transition-colors"
                            >
                                LOGIN
                            </button>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <Menu />
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-black border-b border-white/10 overflow-hidden"
                    >
                        <div className="p-4 flex flex-col gap-4">
                            <Link href="/shop" className="text-lg">Shop</Link>
                            <Link href="/dashboard" className="text-lg">Dashboard</Link>
                            {session ? (
                                <button onClick={() => signOut()} className="text-left text-red-500">Sign Out</button>
                            ) : (
                                <button onClick={() => signIn()} className="text-left text-cyan-400">Login</button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
