"use client";

import React from "react";
import { FloatingRelics } from "./FloatingRelics";

export const SmokeBackground = ({ children }: { children?: React.ReactNode }) => {
    return (
        <div className="relative w-full min-h-screen overflow-hidden bg-black">
            {/* Video Layer */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="fixed inset-0 w-full h-full object-cover opacity-50 mix-blend-screen z-0"
            >
                <source src="/smoke-background.mp4" type="video/mp4" />
                {/* Fallback if external link fails */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black" />
            </video>

            {/* Gradient Overlay to ensure text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/80 z-0" />

            {/* Parallax Relics */}
            <FloatingRelics />

            {/* Content */}
            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </div>
    );
};
