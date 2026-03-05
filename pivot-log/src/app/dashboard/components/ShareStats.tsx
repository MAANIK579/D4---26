'use client';

import { Share2, Check } from 'lucide-react';
import { useState } from 'react';

interface ShareStatsProps {
    username: string;
    totalPivots: number;
    domains: string; // comma separated list
}

export function ShareStats({ username, totalPivots, domains }: ShareStatsProps) {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        // Build the URL that points to our OG Image route manually for easy sharing of the raw image,
        // or just link them directly to the profile which HAS the OG tags.
        const origin = window.location.origin;

        // We'll share the public profile page, because Next.js metadata on that page
        // will automatically fetch the OG image from /api/og with the right params.
        const profileUrl = `${origin}/profile/${username}`;

        try {
            await navigator.clipboard.writeText(
                `Check out my Resilience Portfolio on PivotLog: I've resolved ${totalPivots} major roadblocks.\n\n${profileUrl}`
            );
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <button
            onClick={handleShare}
            className="flex items-center justify-center w-full mt-4 gap-2 px-4 py-3 bg-zinc-900 border border-zinc-700 hover:border-blue-500 hover:bg-blue-500/10 text-white transition-colors uppercase font-mono text-xs font-bold tracking-widest group"
        >
            {copied ? (
                <>
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-green-500">Copied to Clipboard!_</span>
                </>
            ) : (
                <>
                    <Share2 className="w-4 h-4 text-blue-500 group-hover:animate-pulse" />
                    Share Stats to Network_
                </>
            )}
        </button>
    );
}
