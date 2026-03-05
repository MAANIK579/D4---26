'use client';

import { Share2, Check, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface ShareStatsProps {
    username: string;
    totalPivots: number;
    domains: string; // comma separated list
}

export function ShareStats({ username, totalPivots, domains }: ShareStatsProps) {
    const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle');

    const getShareText = () => {
        return `Check out my Resilience Portfolio on PivotLog: I've resolved ${totalPivots} major roadblocks.\n\n${window.location.origin}/profile/${username}`;
    };

    const getShareUrl = () => {
        return `${window.location.origin}/profile/${username}`;
    };

    const handleShare = async () => {
        const shareText = getShareText();
        const shareUrl = getShareUrl();

        // Try Web Share API first (works on mobile and some desktop browsers)
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'My Resilience Portfolio | PivotLog',
                    text: `I've resolved ${totalPivots} major roadblocks on PivotLog.`,
                    url: shareUrl,
                });
                setStatus('copied');
                setTimeout(() => setStatus('idle'), 2000);
                return;
            } catch (err: any) {
                // User cancelled the share dialog — that's fine, don't show error
                if (err?.name === 'AbortError') return;
                // Fall through to clipboard
            }
        }

        // Fallback: Clipboard API
        try {
            await navigator.clipboard.writeText(shareText);
            setStatus('copied');
            setTimeout(() => setStatus('idle'), 2000);
        } catch (err) {
            // Final fallback: use execCommand for older browsers  
            try {
                const textarea = document.createElement('textarea');
                textarea.value = shareText;
                textarea.style.position = 'fixed';
                textarea.style.left = '-9999px';
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                setStatus('copied');
                setTimeout(() => setStatus('idle'), 2000);
            } catch (fallbackErr) {
                console.error('Failed to share:', fallbackErr);
                setStatus('error');
                setTimeout(() => setStatus('idle'), 3000);
            }
        }
    };

    return (
        <button
            onClick={handleShare}
            className="flex items-center justify-center w-full mt-4 gap-2 px-4 py-3 bg-zinc-900 border border-zinc-700 hover:border-blue-500 hover:bg-blue-500/10 text-white transition-colors uppercase font-mono text-xs font-bold tracking-widest group"
        >
            {status === 'copied' ? (
                <>
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-green-500">Copied to Clipboard!_</span>
                </>
            ) : status === 'error' ? (
                <>
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span className="text-red-500">Failed to Share_</span>
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
