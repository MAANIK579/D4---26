'use client';

import { useState } from 'react';
import { Flame, ChevronDown, ChevronUp, Target, CalendarDays, Zap, Layers, BarChart3 } from 'lucide-react';
import type { GritScoreData } from '@/utils/gritScore';

interface GritScoreCardProps {
    data: GritScoreData;
    compact?: boolean;
}

const BREAKDOWN_CONFIG = [
    { key: 'resolutionRate' as const, label: 'Resolution_Rate', icon: Target, color: 'green' },
    { key: 'consistency' as const, label: 'Consistency', icon: CalendarDays, color: 'blue' },
    { key: 'speed' as const, label: 'Speed', icon: Zap, color: 'yellow' },
    { key: 'volume' as const, label: 'Volume', icon: Layers, color: 'purple' },
    { key: 'breadth' as const, label: 'Domain_Breadth', icon: BarChart3, color: 'cyan' },
];

function getScoreColor(score: number) {
    if (score >= 70) return { text: 'text-green-500', bg: 'bg-green-500', glow: 'rgba(34,197,94,', border: 'border-green-500/50' };
    if (score >= 40) return { text: 'text-yellow-500', bg: 'bg-yellow-500', glow: 'rgba(234,179,8,', border: 'border-yellow-500/50' };
    return { text: 'text-red-500', bg: 'bg-red-500', glow: 'rgba(239,68,68,', border: 'border-red-500/50' };
}

function getBarColor(color: string) {
    const map: Record<string, string> = {
        green: 'bg-green-500',
        blue: 'bg-blue-500',
        yellow: 'bg-yellow-500',
        purple: 'bg-purple-500',
        cyan: 'bg-cyan-500',
    };
    return map[color] || 'bg-zinc-500';
}

function getIconColor(color: string) {
    const map: Record<string, string> = {
        green: 'text-green-500',
        blue: 'text-blue-500',
        yellow: 'text-yellow-500',
        purple: 'text-purple-500',
        cyan: 'text-cyan-500',
    };
    return map[color] || 'text-zinc-500';
}

function getScoreLabel(score: number) {
    if (score >= 90) return 'LEGENDARY';
    if (score >= 70) return 'RESILIENT';
    if (score >= 50) return 'DEVELOPING';
    if (score >= 30) return 'EMERGING';
    return 'INITIATING';
}

export function GritScoreCard({ data, compact = false }: GritScoreCardProps) {
    const [expanded, setExpanded] = useState(false);
    const colors = getScoreColor(data.score);
    const circumference = 2 * Math.PI * 54; // radius=54
    const offset = circumference - (data.score / 100) * circumference;

    if (compact) {
        return (
            <div className={`bg-zinc-900/50 border ${colors.border} px-6 py-4 text-center`}>
                <div className="flex items-center justify-center gap-2 mb-1">
                    <Flame className={`w-4 h-4 ${colors.text}`} />
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Grit_Score</span>
                </div>
                <div className={`text-3xl font-black ${colors.text}`}>{data.score}</div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mt-1">{getScoreLabel(data.score)}</div>
            </div>
        );
    }

    return (
        <div
            className={`bg-black border ${colors.border} p-6 font-mono relative overflow-hidden group hover:border-opacity-80 transition-all duration-500`}
            style={{ boxShadow: `0 0 30px ${colors.glow}0.08)` }}
        >
            {/* Ambient glow */}
            <div
                className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[80px] pointer-events-none opacity-30 transition-opacity group-hover:opacity-50"
                style={{ background: `${colors.glow}0.3)` }}
            />

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                {/* Radial Score Display */}
                <div className="relative flex-shrink-0">
                    <svg width="130" height="130" className="-rotate-90">
                        {/* Background circle */}
                        <circle
                            cx="65" cy="65" r="54"
                            fill="none"
                            stroke="#27272A"
                            strokeWidth="6"
                        />
                        {/* Score arc */}
                        <circle
                            cx="65" cy="65" r="54"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="6"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                            className={`${colors.text} transition-all duration-1000 ease-out`}
                            style={{ filter: `drop-shadow(0 0 6px ${colors.glow}0.5))` }}
                        />
                    </svg>
                    {/* Center content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <Flame className={`w-4 h-4 ${colors.text} mb-0.5`} />
                        <span className={`text-3xl font-black ${colors.text}`}>{data.score}</span>
                        <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">/100</span>
                    </div>
                </div>

                {/* Label & Info */}
                <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                        <span className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Grit_Score</span>
                        <span className={`text-xs font-black uppercase tracking-widest px-2 py-0.5 border ${colors.border} ${colors.text}`}>
                            {getScoreLabel(data.score)}
                        </span>
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed max-w-xs">
                        Composite resilience metric based on resolution rate, consistency, speed, volume, and domain breadth.
                    </p>

                    {/* Expand button */}
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="mt-3 flex items-center gap-1 text-[10px] text-zinc-500 hover:text-white uppercase tracking-widest font-bold transition-colors"
                    >
                        {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        {expanded ? 'Hide' : 'Show'} Breakdown_
                    </button>
                </div>
            </div>

            {/* Breakdown Section */}
            {expanded && (
                <div className="relative z-10 mt-6 pt-6 border-t border-zinc-800 space-y-3 animate-in slide-in-from-top-2 duration-300">
                    {BREAKDOWN_CONFIG.map(({ key, label, icon: Icon, color }) => (
                        <div key={key} className="flex items-center gap-3">
                            <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${getIconColor(color)}`} />
                            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold w-32 flex-shrink-0">{label}</span>
                            <div className="flex-1 bg-zinc-900 h-1.5 overflow-hidden">
                                <div
                                    className={`h-full ${getBarColor(color)} transition-all duration-700 ease-out`}
                                    style={{ width: `${data.breakdown[key]}%` }}
                                />
                            </div>
                            <span className="text-xs text-zinc-400 font-bold w-8 text-right">{data.breakdown[key]}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
