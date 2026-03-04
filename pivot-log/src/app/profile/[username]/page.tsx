import { notFound } from 'next/navigation';
import { getPublicProfile } from '../../actions/pivot';
import { LogCard } from '../../dashboard/components/LogCard';
import { Terminal, ShieldCheck, Award } from 'lucide-react';
import Link from 'next/link';
import { getEndorsements } from '../../actions/mentorship';
import { EndorsementButton } from '../../dashboard/components/EndorsementButton';
import { createClient } from '@/utils/supabase/server';

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;
    const data = await getPublicProfile(username);
    const supabase = await createClient();
    const { data: { user: currentUser } } = await supabase.auth.getUser();

    if (!data || !data.profile) {
        notFound();
    }

    const { profile, pivots } = data;
    const endorsements = await getEndorsements(profile.id);

    // Group endorsements by trait for rendering
    const traitCounts = endorsements.reduce((acc: Record<string, number>, curr: any) => {
        acc[curr.trait] = (acc[curr.trait] || 0) + 1;
        return acc;
    }, {});

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

            {/* Terminal Glow Effects */}
            <div className="absolute top-1/4 -right-64 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 -left-64 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Header Profile Section */}
                <div className="mt-12 mb-16 border border-zinc-800 bg-black p-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 blur-[100px] pointer-events-none" />

                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 bg-zinc-900 border-2 border-green-500/30 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                                {profile.avatar_url ? (
                                    <img src={profile.avatar_url} alt={profile.name} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <Terminal className="w-8 h-8 text-green-500" />
                                )}
                            </div>
                            <div>
                                <h1 className="text-3xl font-black uppercase tracking-tighter text-white">
                                    {profile.name || "Anonymous_Dev"}
                                </h1>
                                <div className="text-sm font-bold text-zinc-500 uppercase tracking-widest mt-1 flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-green-500" />
                                    <span>Verified Resilience Portfolio</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-zinc-900/50 border border-green-500/20 px-6 py-4 text-center">
                            <div className="text-3xl font-black text-green-500">{pivots?.length || 0}</div>
                            <div className="text-xs text-zinc-400 uppercase tracking-widest font-bold mt-1">Pivots Executed</div>
                        </div>

                        {/* Endorsements summary & button */}
                        <div className="flex flex-col items-end gap-3 z-10">
                            {Object.entries(traitCounts).length > 0 && (
                                <div className="flex flex-wrap justify-end gap-2 mb-2 max-w-[250px]">
                                    {Object.entries(traitCounts).map(([trait, count]) => (
                                        <div key={trait} className="flex items-center gap-1.5 bg-black border border-purple-500/30 px-2 py-1">
                                            <Award className="w-3 h-3 text-purple-500" />
                                            <span className="text-[10px] uppercase font-bold text-zinc-300">{trait}</span>
                                            <span className="text-xs font-black text-purple-400 bg-purple-500/10 px-1">{count as number}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <EndorsementButton
                                endorseeId={profile.id}
                                endorsements={endorsements}
                                currentUserId={currentUser?.id}
                            />
                        </div>
                    </div>
                </div>

                {/* Feed of Resolved Pivots */}
                <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-widest flex items-center gap-3 mb-10 border-b border-zinc-800 pb-4">
                        [ Resolved_Logs ]
                    </h2>

                    {(!pivots || pivots.length === 0) ? (
                        <div className="text-center py-20 border border-zinc-800 border-dashed bg-black/50">
                            <p className="text-zinc-500 uppercase tracking-widest text-sm">No resolved pivots found for this user yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {pivots.map(pivot => (
                                <LogCard key={pivot.id} log={pivot} readonly={true} />
                            ))}
                        </div>
                    )}
                </div>

                <div className="mt-20 text-center border-t border-zinc-800 pt-8 pb-12">
                    <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors uppercase font-bold tracking-widest text-xs">
                        <Terminal className="w-4 h-4" />
                        Powered by PivotLog
                    </Link>
                </div>
            </div>
        </div>
    );
}
