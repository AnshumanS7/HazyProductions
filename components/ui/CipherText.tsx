"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface CipherTextProps {
    text: string;
    className?: string;
    interval?: number;
}

const CHARS = "-_~=+*!@#%&^<>";

export function CipherText({ text, className = "", interval = 50 }: CipherTextProps) {
    const [displayText, setDisplayText] = useState(text);
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isHovering) {
            let iteration = 0;
            timer = setInterval(() => {
                setDisplayText(prev =>
                    text.split("")
                        .map((char, index) => {
                            if (index < iteration) return text[index];
                            return CHARS[Math.floor(Math.random() * CHARS.length)];
                        })
                        .join("")
                );

                if (iteration >= text.length) {
                    clearInterval(timer);
                }

                iteration += 1 / 3; // Slow down the reveal
            }, interval);
        } else {
            setDisplayText(text);
        }

        return () => clearInterval(timer);
    }, [isHovering, text, interval]);

    return (
        <motion.span
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className={`inline-block font-mono cursor-pointer ${className}`}
        >
            {displayText}
        </motion.span>
    );
}
