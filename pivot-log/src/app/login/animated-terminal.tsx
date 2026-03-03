'use client';

import { useEffect, useState, useRef } from 'react';
import { Terminal } from 'lucide-react';

const LOG_LINES = [
    "Initializing secure session...",
    "Establishing connection to PivotLog uplink...",
    "Verifying resilience credentials...",
    "Scanning for recent failures component...",
    "ERR_OVERTHINKING: Attempt to be perfect detected.",
    "Bypassing perfectionism filter (1/3)...",
    "Bypassing perfectionism filter (2/3)...",
    "Bypassing perfectionism filter (3/3)...",
    "Filter bypassed. Embracing the mess.",
    "Allocating memory for new breakthroughs...",
    "Awaiting user authentication...",
];

export function AnimatedTerminal() {
    const [lines, setLines] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (currentIndex < LOG_LINES.length) {
            const timeout = setTimeout(() => {
                setLines(prev => [...prev, LOG_LINES[currentIndex]]);
                setCurrentIndex(prev => prev + 1);
            }, Math.random() * 600 + 200); // Random delay between 200ms and 800ms

            return () => clearTimeout(timeout);
        } else {
            // Loop it after a long pause
            const timeout = setTimeout(() => {
                setLines([]);
                setCurrentIndex(0);
            }, 10000);
            return () => clearTimeout(timeout);
        }
    }, [currentIndex]);

    // auto scroll to bottom
    useEffect(() => {
        if (bottomRef.current) {
            // Use standard scroll since scrollIntoView might cause layout jumps in some edge cases
            bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }, [lines]);

    return (
        <div className="hidden lg:flex flex-1 items-center justify-center relative p-12 z-10 h-full">
            <div className="relative w-full max-w-lg p-8 bg-black border-2 border-zinc-800 shadow-2xl font-mono group h-[400px] flex flex-col overflow-hidden">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4 flex-shrink-0 z-20 bg-black">
                    <div className="flex items-center gap-2 text-zinc-500">
                        <Terminal className="w-4 h-4" />
                        <span className="text-xs uppercase tracking-widest text-zinc-400 font-bold">system_auth_log.txt</span>
                    </div>
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 group-hover:bg-red-500/50 transition-colors" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 group-hover:bg-yellow-500/50 transition-colors" />
                        <div className="w-3 h-3 rounded-full bg-green-500/20 group-hover:bg-green-500/50 transition-colors" />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto scrollbar-hide relative z-10 pb-4">
                    <div className="space-y-3">
                        {lines.map((line, i) => (
                            <div key={i} className="flex gap-4 text-sm tracking-tight animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <span className="text-zinc-600 w-6 text-right flex-shrink-0 select-none">
                                    {(i + 1).toString().padStart(2, '0')}
                                </span>
                                <span className={
                                    line.startsWith("ERR_") ? "text-red-500 font-bold bg-red-500/10 px-2 py-0.5 border border-red-500/20" :
                                        line.startsWith("Awaiting") ? "text-green-500 font-bold" :
                                            "text-zinc-400"
                                }>
                                    {line}
                                </span>
                            </div>
                        ))}
                        <div ref={bottomRef} className="flex gap-4 items-center h-6">
                            <span className="text-zinc-600 w-6 text-right flex-shrink-0 invisible select-none">00</span>
                            <span className="w-2.5 h-4 bg-green-500 animate-pulse inline-block" />
                        </div>
                    </div>
                </div>

                {/* Fade out top and bottom for slick scroll effect */}
                <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-black to-transparent pointer-events-none z-20" />
            </div>
        </div>
    );
}
