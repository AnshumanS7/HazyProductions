"use client";

import { useState, useEffect, useRef } from "react";
import { Star, User, MessageSquare } from "lucide-react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface Review {
    _id: string;
    user: {
        _id: string;
        name: string;
        image?: string;
    };
    rating: number;
    comment: string;
    createdAt: string;
}

interface ReviewSectionProps {
    productId: string;
}

export function ReviewSection({ productId }: ReviewSectionProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form State
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");

    const fetchReviews = async () => {
        try {
            const res = await fetch(`/api/products/${productId}/reviews`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setReviews(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!session) {
            router.push("/auth/signin");
            return;
        }

        if (rating === 0) {
            setError("Please select a rating.");
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await fetch(`/api/products/${productId}/reviews`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rating, comment }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to submit review");
            }

            // Success: Add new review to top
            setReviews([data, ...reviews]);
            setRating(0);
            setComment("");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="py-12 border-t border-white/10 mt-12">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-cyan-400" />
                Wait, there's more... Reviews
            </h2>

            {/* ERROR MESSAGE */}
            {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-200 text-sm">
                    {error}
                </div>
            )}

            {/* REVIEW FORM */}
            {session ? (
                <form onSubmit={handleSubmit} className="mb-12 p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                    <h3 className="text-lg font-semibold mb-4">Rate this drop</h3>

                    {/* Stars */}
                    <div className="flex gap-2 mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star)}
                                className="focus:outline-none transition-transform hover:scale-110"
                            >
                                <Star
                                    className={`w-6 h-6 ${star <= (hoverRating || rating)
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-white/20"
                                        }`}
                                />
                            </button>
                        ))}
                    </div>

                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Tell others what you think..."
                        className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors h-32 mb-4"
                        required
                    />

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-white text-black font-bold rounded-full hover:bg-cyan-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "Posting..." : "Post Review"}
                    </button>
                    {!reviews.find(r => r.user?._id === session.user?.id) && (
                        <p className="text-xs text-white/30 mt-2">* Only verified purchasers can review.</p>
                    )}
                </form>
            ) : (
                <div className="mb-12 p-6 bg-white/5 rounded-2xl border border-dashed border-white/10 text-center">
                    <p className="text-white/50 mb-4">Own this product? Log in to leave a review.</p>
                    <button onClick={() => router.push('/auth/signin')} className="px-6 py-2 bg-white/10 hover:bg-white text-white hover:text-black rounded-full transition-colors font-bold text-sm">
                        Login
                    </button>
                </div>
            )}

            {/* REVIEW LIST */}
            {isLoading ? (
                <div className="flex gap-2 animate-pulse">
                    <div className="w-10 h-10 bg-white/10 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <div className="h-4 w-1/4 bg-white/10 rounded" />
                        <div className="h-4 w-3/4 bg-white/10 rounded" />
                    </div>
                </div>
            ) : reviews.length > 0 ? (
                <div className="space-y-6">
                    {reviews.map((review) => (
                        <div key={review._id} className="flex gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors">
                            <div className="shrink-0">
                                {review.user?.image ? (
                                    <img src={review.user.image} alt={review.user.name} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                                ) : (
                                    <div className="w-10 h-10 bg-cyan-500/20 rounded-full flex items-center justify-center border border-cyan-500/30">
                                        <User className="w-5 h-5 text-cyan-400" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-sm">{review.user?.name || "Anonymous"}</span>
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-3 h-3 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-white/10"}`} />
                                        ))}
                                    </div>
                                    <span className="text-xs text-white/30 ml-auto">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-sm text-white/70 leading-relaxed">{review.comment}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-white/30 italic">No reviews yet. Be the first.</p>
            )}
        </section>
    );
}
