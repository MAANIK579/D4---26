'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Terminal, CheckCircle2, CircleDashed, Image as ImageIcon, Radio } from 'lucide-react';
import { toggleMentorBeacon } from '@/app/actions/mentorship';
import { useState } from 'react';

interface LogCardProps {
    log: {
        id: string;
        user_id: string;
        initial_goal: string;
        the_wall: string;
        the_pivot: string | null;
        evidence_url: string | null;
        status: string;
        domain: string;
        frustration_level: number | null;
        created_at: string;
        resolved_at: string | null;
        needs_mentor?: boolean;
    };
    readonly?: boolean;
}

export function LogCard({ log, readonly = false }: LogCardProps) {
    const isResolved = log.status === 'Resolved' || (log.the_pivot && log.the_pivot.trim() !== '');
    const [isUpdating, setIsUpdating] = useState(false);

    const handleToggleBeacon = async () => {
        setIsUpdating(true);
        try {
            await toggleMentorBeacon(log.id, !!log.needs_mentor);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className={`relative border-l-2 pl-6 py-2 mb-8 ${isResolved ? 'border-green-500' : 'border-red-500/80'} font-mono`}>
            {/* Timeline Dot */}
            <div className={`absolute -left-[11px] top-6 w-5 h-5 rounded-full bg-black border-2 flex items-center justify-center ${isResolved ? 'border-green-500' : 'border-red-500'}`}>
                {isResolved ? (
                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                ) : (
                    <CircleDashed className="w-3 h-3 text-red-500 animate-spin-slow" />
                )}
            </div>

            <div className={`border bg-black/50 p-6 shadow-lg ${isResolved ? 'border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.1)]' : 'border-red-500/30'}`}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-zinc-800">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-xs uppercase tracking-widest bg-zinc-900 border border-zinc-800 px-2 py-1 text-zinc-400">
                                {log.domain}
                            </span>
                            <span className="text-xs text-zinc-500 flex items-center gap-1">
                                <Terminal className="w-3 h-3" />
                                {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-white tracking-tight">{log.initial_goal}</h3>
                    </div>

                    {!readonly && !isResolved && (
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleToggleBeacon}
                                disabled={isUpdating}
                                className={`text-xs font-bold uppercase tracking-widest px-3 py-1.5 transition-colors shadow-[0_0_10px_rgba(234,179,8,0.3)] whitespace-nowrap flex items-center gap-2 ${log.needs_mentor
                                    ? 'bg-yellow-500 text-black hover:bg-yellow-400 animate-pulse'
                                    : 'bg-transparent border border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10'
                                    } disabled:opacity-50`}
                            >
                                <Radio className={`w-3 h-3 ${log.needs_mentor ? 'animate-ping' : ''}`} />
                                {log.needs_mentor ? 'Beacon Active_' : 'Trigger Beacon_'}
                            </button>
                            <Link
                                href={`/dashboard/edit-pivot/${log.id}`}
                                className="text-xs font-bold uppercase tracking-widest text-black bg-green-500 px-3 py-1.5 hover:bg-green-400 transition-colors shadow-[0_0_10px_rgba(34,197,94,0.3)] whitespace-nowrap"
                            >
                                Update / Resolve_
                            </Link>
                        </div>
                    )}
                </div>

                <div className="space-y-6 text-sm">
                    <div className="border-l-2 border-red-500/50 pl-4">
                        <h4 className="text-red-500 font-bold uppercase tracking-wider mb-2 flex items-center justify-between">
                            <span>[ The Wall ]</span>
                            {log.frustration_level && (
                                <span className="text-xs text-red-500/70">Frustration: {log.frustration_level}/10</span>
                            )}
                        </h4>
                        <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">{log.the_wall}</p>

                        {log.evidence_url && (
                            <div className="mt-4 border border-zinc-800 bg-black p-2 inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors cursor-pointer group">
                                <ImageIcon className="w-4 h-4" />
                                <a href={log.evidence_url} target="_blank" rel="noopener noreferrer" className="group-hover:underline">View _Evidence</a>
                            </div>
                        )}
                    </div>

                    {isResolved && log.the_pivot && (
                        <div className="border-l-2 border-green-500/50 pl-4 animate-in fade-in duration-500 mt-6 pt-4 border-t border-zinc-800/50">
                            <h4 className="text-green-500 font-bold uppercase tracking-wider mb-2 flex items-center justify-between">
                                <span>[ The Pivot ]</span>
                                {log.resolved_at && (
                                    <span className="text-xs text-green-500/70">
                                        Resolved {formatDistanceToNow(new Date(log.resolved_at), { addSuffix: true })}
                                    </span>
                                )}
                            </h4>
                            <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">{log.the_pivot}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
