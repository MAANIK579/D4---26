'use client';

import { useState } from 'react';
import { LogCard } from './LogCard';
import { Filter } from 'lucide-react';

interface Log {
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
}

interface TimelineFeedProps {
    initialLogs: Log[];
}

export function TimelineFeed({ initialLogs }: TimelineFeedProps) {
    const [filter, setFilter] = useState<string>('All');

    const domains = ['All', ...Array.from(new Set(initialLogs.map(log => log.domain)))];

    const filteredLogs = filter === 'All'
        ? initialLogs
        : initialLogs.filter(log => log.domain === filter);

    return (
        <div className="mt-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-b border-zinc-800 pb-4">
                <h2 className="text-2xl font-black text-white uppercase tracking-widest flex items-center gap-3">
                    [ Error_Logs ]
                    <span className="text-xs font-mono bg-zinc-900 px-2 py-1 text-zinc-500 border border-zinc-800">
                        Total Count: {filteredLogs.length}
                    </span>
                </h2>

                <div className="flex items-center gap-2 mt-4 sm:mt-0 font-mono text-sm">
                    <Filter className="w-4 h-4 text-zinc-500" />
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="bg-black border border-zinc-800 text-zinc-300 py-1.5 px-3 focus:outline-none focus:border-green-500 transition-colors"
                    >
                        {domains.map(d => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>
                </div>
            </div>

            {filteredLogs.length === 0 ? (
                <div className="text-center py-12 border border-zinc-800 border-dashed bg-black/50">
                    <p className="text-zinc-500 font-mono tracking-widest uppercase">No logs initialized in this domain.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredLogs.map(log => (
                        <LogCard key={log.id} log={log} />
                    ))}
                </div>
            )}
        </div>
    );
}
