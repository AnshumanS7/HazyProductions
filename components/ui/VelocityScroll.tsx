"use client";

import { motion, useScroll, useVelocity, useSpring, useTransform } from "framer-motion";
import React, { useRef } from "react";

interface VelocityScrollProps {
    children: React.ReactNode;
}

export function VelocityScroll({ children }: VelocityScrollProps) {
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);

    const smoothVelocity = useSpring(scrollVelocity, {
        damping: 50,
        stiffness: 400
    });

    // Map velocity to skew degrees. 
    // High velocity range (-2000 to 2000) maps to subtle skew (-5deg to 5deg)
    const skewY = useTransform(smoothVelocity, [-2000, 2000], [-2, 2]);

    return (
        <motion.div style={{ skewY, transformOrigin: "center" }} className="w-full">
            {children}
        </motion.div>
    );
}
