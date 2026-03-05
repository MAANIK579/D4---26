'use client';

import { Activity, Target, Clock, Zap } from 'lucide-react';
import { ShareStats } from './ShareStats';

interface AnalyticsProps {
    username?: string;
    data: {
        totalLogged: number;
        totalResolved: number;
        averageResolutionTimeHours: number;
        activityData: { date: string; count: number }[];
    } | null;
}

export function AnalyticsDashboard({ data, username }: AnalyticsProps) {
    if (!data) return null;

    const resolutionRate = data.totalLogged > 0
        ? Math.round((data.totalResolved / data.totalLogged) * 100)
        : 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
            {/* Resolution Rate */}
            <div className="bg-black border border-zinc-800 p-6 flex flex-col justify-between group hover:border-green-500/50 transition-colors">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Resilience_Rate</span>
                    <Target className="w-5 h-5 text-green-500" />
                </div>
                <div>
                    <div className="text-4xl font-black text-white">{resolutionRate}%</div>
                    <div className="text-xs text-zinc-400 mt-2">
                        {data.totalResolved} / {data.totalLogged} Pivots Resolved
                    </div>
                </div>
                {/* Visual Bar */}
                <div className="w-full bg-zinc-900 h-1.5 mt-6 overflow-hidden">
                    <div
                        className="bg-green-500 h-full transition-all duration-1000 ease-out"
                        style={{ width: `${resolutionRate}%` }}
                    />
                </div>
            </div>

            {/* Time to resolution */}
            <div className="bg-black border border-zinc-800 p-6 flex flex-col justify-between group hover:border-yellow-500/50 transition-colors">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Avg_Resolution_Time</span>
                    <Clock className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                    <div className="text-4xl font-black text-white">{data.averageResolutionTimeHours} <span className="text-xl">hrs</span></div>
                    <div className="text-xs text-zinc-400 mt-2">
                        Average time stuck in "The Wall"
                    </div>
                </div>
                <div className="w-full bg-zinc-900 h-1.5 mt-6 overflow-hidden">
                    <div className="w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(234,179,8,0.2)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px] animate-[slide_1s_linear_infinite]" />
                </div>
            </div>

            {/* Total Walls Hit */}
            <div className="bg-black border border-zinc-800 p-6 flex flex-col justify-between group hover:border-red-500/50 transition-colors">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Walls_Hit</span>
                    <Zap className="w-5 h-5 text-red-500" />
                </div>
                <div>
                    <div className="text-4xl font-black text-white">{data.totalLogged}</div>
                    <div className="text-xs text-zinc-400 mt-2">
                        Total documented failures
                    </div>
                </div>
                {/* Heatmap proxy (simplified squares) */}
                <div className="flex gap-1 mt-6">
                    {Array.from({ length: 14 }).map((_, i) => {
                        // Create a deterministic mock distribution for visuals to avoid hydration errors
                        const intensity = i % 3 === 0 ? 'bg-red-500' : 'bg-zinc-800';
                        return (
                            <div key={i} className={`flex-1 h-1.5 ${i < data.totalLogged ? intensity : 'bg-zinc-900'}`} />
                        );
                    })}
                </div>
            </div>

            {/* Share action spanning all columns */}
            {username && (
                <div className="md:col-span-3">
                    <ShareStats
                        username={username}
                        totalPivots={data.totalResolved}
                        // Simulate unique domains for now based on total
                        domains={Array.from({ length: Math.min(3, data.activityData.length || 1) }).map((_, i) => `Domain_${i}`).join(',')}
                    />
                </div>
            )}
        </div>
    );
}
