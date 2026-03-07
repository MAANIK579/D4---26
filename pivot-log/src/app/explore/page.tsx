import { getExploreFeed } from '@/app/actions/mentorship';
import { LogCard } from '@/app/dashboard/components/LogCard';
import { Terminal, Users, Radio, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';

export default async function ExplorePage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
    const { hallOfGrowth, activeBeacons } = await getExploreFeed();
    const resolvedSearchParams = await searchParams;
    const activeTab = resolvedSearchParams.tab === 'beacons' ? 'beacons' : 'hall';

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#0A0A0A] font-mono text-white p-4 sm:p-8 selection:bg-green-500/30">
            {/* Blueprint Grid Background Pattern */}
            <div
                className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, #ffffff 1px, transparent 1px),
                        linear-gradient(to bottom, #ffffff 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px'
                }}
            />

            <div className="max-w-4xl mx-auto relative z-10 pt-12">
                <div className="mb-12 border-b border-zinc-800 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter flex items-center gap-4">
                            <Users className="w-8 h-8 text-green-500" />
                            Global_Network
                        </h1>
                        <p className="text-zinc-500 mt-3 text-sm max-w-xl leading-relaxed">
                            Monitor the collective resilience matrix. Observe successful pivots in the Hall of Growth or offer assistance to active development blockages.
                        </p>
                    </div>

                    {!user && (
                        <div className="bg-zinc-900 border border-zinc-800 px-4 py-3 flex items-center gap-3">
                            <Terminal className="w-4 h-4 text-green-500" />
                            <span className="text-xs text-zinc-400 font-bold uppercase tracking-widest">Read-Only Mode</span>
                            <Link href="/login" className="text-xs text-green-500 hover:text-green-400 font-bold uppercase tracking-widest underline decoration-green-500/30 underline-offset-4">
                                Auth_Req
                            </Link>
                        </div>
                    )}
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-8">
                    <Link
                        href="/explore?tab=hall"
                        className={`px-6 py-3 text-sm font-bold uppercase tracking-widest transition-colors flex items-center gap-2 ${activeTab === 'hall'
                            ? 'bg-purple-500 text-black shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                            : 'bg-transparent border border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-700'
                            }`}
                    >
                        [ The_Hall_Of_Growth ]
                    </Link>
                    <Link
                        href="/explore?tab=beacons"
                        className={`px-6 py-3 text-sm font-bold uppercase tracking-widest transition-colors flex items-center gap-2 ${activeTab === 'beacons'
                            ? 'bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.3)]'
                            : 'bg-transparent border border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-700'
                            }`}
                    >
                        <Radio className={`w-4 h-4 ${activeTab === 'beacons' ? 'animate-ping' : ''}`} />
                        Active_Beacons
                        {activeBeacons.length > 0 && (
                            <span className={`ml-2 px-2 py-0.5 text-[10px] bg-black text-yellow-500 ${activeTab === 'beacons' ? '' : 'bg-zinc-800 text-zinc-400'}`}>
                                {activeBeacons.length}
                            </span>
                        )}
                    </Link>
                </div>

                {/* Content */}
                <div className="space-y-4">
                    {activeTab === 'hall' && (
                        hallOfGrowth.length === 0 ? (
                            <div className="text-center py-20 border border-zinc-800 border-dashed bg-black/50">
                                <p className="text-zinc-500 uppercase tracking-widest text-sm">No resolved pivots in the network yet.</p>
                            </div>
                        ) : (
                            hallOfGrowth.map((log: any) => (
                                <div key={log.id} className="relative group">
                                    <div className="absolute -left-4 top-0 bottom-0 w-1 bg-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="mb-2 flex items-center gap-2 text-xs text-zinc-500 uppercase tracking-widest font-bold">
                                        <ArrowUpRight className="w-3 h-3" />
                                        <span>User: </span>
                                        <Link href={`/profile/${log.users?.public_slug || log.user_id}`} className="text-purple-400 hover:underline">
                                            {log.users?.name || "Anonymous_Dev"}
                                        </Link>
                                    </div>
                                    <LogCard log={log} readonly={true} />
                                </div>
                            ))
                        )
                    )}

                    {activeTab === 'beacons' && (
                        activeBeacons.length === 0 ? (
                            <div className="text-center py-20 border border-zinc-800 border-dashed bg-black/50">
                                <Radio className="w-8 h-8 text-zinc-700 mx-auto mb-4" />
                                <p className="text-zinc-500 uppercase tracking-widest text-sm">Network clear. No active distress beacons.</p>
                            </div>
                        ) : (
                            activeBeacons.map((log: any) => (
                                <div key={log.id} className="relative group">
                                    <div className="absolute -left-4 top-0 bottom-0 w-1 bg-yellow-500/50 animate-pulse" />
                                    <div className="mb-2 flex items-center justify-between text-xs text-zinc-500 uppercase tracking-widest font-bold">
                                        <div className="flex items-center gap-2">
                                            <Radio className="w-3 h-3 text-yellow-500" />
                                            <span>Beacon By: </span>
                                            <Link href={`/profile/${log.users?.public_slug || log.user_id}`} className="text-yellow-500 hover:underline">
                                                {log.users?.name || "Anonymous_Dev"}
                                            </Link>
                                        </div>
                                    </div>
                                    <LogCard log={log} readonly={true} />
                                </div>
                            ))
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
