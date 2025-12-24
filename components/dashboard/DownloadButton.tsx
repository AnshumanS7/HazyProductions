"use client";

import { Download } from "lucide-react";
import { useState } from "react";

interface DownloadButtonProps {
    productId: string;
    fileName: string;
}

export function DownloadButton({ productId, fileName }: DownloadButtonProps) {
    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/downloads/${productId}`, {
                method: 'POST',
            });

            if (!res.ok) {
                const err = await res.json();
                alert(err.error || "Download failed");
                return;
            }

            const { url } = await res.json();

            // Trigger download by opening in new window/tab
            window.open(url, '_blank');

        } catch (error) {
            console.error(error);
            alert("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleDownload}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-400 text-black font-bold rounded hover:bg-cyan-300 transition-colors disabled:opacity-50 text-sm"
        >
            <Download className="w-4 h-4" />
            {loading ? "Generating Link..." : "Download"}
        </button>
    );
}
