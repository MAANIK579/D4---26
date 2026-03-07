import { notFound } from 'next/navigation';
import { getPublicProfile } from '../../actions/pivot';
import { LogCard } from '../../dashboard/components/LogCard';
import { Terminal, ShieldCheck, Award, Github, Linkedin, Link2, Target, Clock, Zap, Flame, Layers } from 'lucide-react';
import Link from 'next/link';
import { getEndorsements } from '../../actions/mentorship';
import { EndorsementButton } from '../../dashboard/components/EndorsementButton';
import { createClient } from '@/utils/supabase/server';
import { ExportResumeButton } from '../../dashboard/components/ExportResumeButton';
import { GritScoreCard } from '../../dashboard/components/GritScoreCard';
import type { Metadata, ResolvingMetadata } from 'next';

export async function generateMetadata(
    { params }: { params: Promise<{ username: string }> },
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { username } = await params;
    const data = await getPublicProfile(username);

    if (!data || !data.profile) {
        return { title: 'Not Found | PivotLog' }
    }

    const pivots = data.pivots || [];
    const resolvedPivots = pivots.filter(p => p.status === 'Resolved' || (p.the_pivot && p.the_pivot.trim() !== ''));

    // Extract unique domains
    const domains = Array.from(new Set(pivots.map(p => p.domain))).join(',');

    const ogSearchParams = new URLSearchParams();
    ogSearchParams.set('username', data.profile.name || data.profile.public_slug || 'Anonymous');
    ogSearchParams.set('pivots', resolvedPivots.length.toString());
    ogSearchParams.set('domains', domains || 'Various');

    const ogImageUrl = `/api/og?${ogSearchParams.toString()}`;

    return {
        title: `${data.profile.name || data.profile.public_slug}'s Resilience Portfolio | PivotLog`,
        description: data.profile.bio || 'Proof of Work and Resilience over perfection.',
        openGraph: {
            title: `${data.profile.name || data.profile.public_slug}'s Resilience Portfolio | PivotLog`,
            description: data.profile.bio || 'View my documented roadblocks and the pivots that solved them.',
            images: [
                {
                    url: ogImageUrl,
                    width: 1200,
                    height: 630,
                    alt: 'PivotLog Resilience Stats',
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: `${data.profile.name || data.profile.public_slug}'s Resilience Portfolio | PivotLog`,
            description: data.profile.bio || 'View my documented roadblocks and the pivots that solved them.',
            images: [ogImageUrl],
        },
    }
}

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;
    const data = await getPublicProfile(username);
    const supabase = await createClient();
    const { data: { user: currentUser } } = await supabase.auth.getUser();

    if (!data || !data.profile) {
        notFound();
    }

    const { profile, pivots, gritScore } = data;
    const endorsements = await getEndorsements(profile.id);

    // Group endorsements by trait for rendering
    const traitCounts = endorsements.reduce((acc: Record<string, number>, curr: any) => {
        acc[curr.trait] = (acc[curr.trait] || 0) + 1;
        return acc;
    }, {});

    // Compute stats from pivots
    const totalPivots = pivots?.length || 0;
    const resolvedPivots = pivots?.filter(p => p.status === 'Resolved') || [];
    const resolutionRate = totalPivots > 0 ? Math.round((resolvedPivots.length / totalPivots) * 100) : 0;

    let avgResTime = 0;
    if (resolvedPivots.length > 0) {
        let totalHours = 0;
        resolvedPivots.forEach(p => {
            if (p.resolved_at && p.created_at) {
                totalHours += (new Date(p.resolved_at).getTime() - new Date(p.created_at).getTime()) / (1000 * 60 * 60);
            }
        });
        avgResTime = Math.round(totalHours / resolvedPivots.length);
    }

    // Compute domain stats
    const domainStats: Record<string, { total: number; resolved: number }> = {};
    pivots?.forEach(p => {
        if (!domainStats[p.domain]) domainStats[p.domain] = { total: 0, resolved: 0 };
        domainStats[p.domain].total++;
        if (p.status === 'Resolved') domainStats[p.domain].resolved++;
    });

    const domainColors: Record<string, string> = {
        'Frontend': 'bg-blue-500',
        'Backend': 'bg-green-500',
        'Database': 'bg-yellow-500',
        'Infrastructure': 'bg-orange-500',
        'Design': 'bg-pink-500',
        'Logic': 'bg-purple-500',
        'Other': 'bg-zinc-500',
    };

    const socialLinks = [
        { url: profile.github_url, icon: Github, label: 'GitHub' },
        { url: profile.linkedin_url, icon: Linkedin, label: 'LinkedIn' },
        { url: profile.website_url, icon: Link2, label: 'Website' },
    ].filter(l => l.url);

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#0A0A0A] font-mono text-white selection:bg-green-500/30">
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

            <div className="max-w-4xl mx-auto relative z-10 p-4 sm:p-8">

                {/* ===== HERO SECTION ===== */}
                <section className="mt-8 mb-10 border border-zinc-800 bg-black relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 blur-[100px] pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/5 blur-[80px] pointer-events-none" />

                    <div className="relative z-10 p-6 sm:p-8">
                        {/* Top Row: Avatar + Name + Badge */}
                        <div className="flex items-start gap-5">
                            <div className="w-20 h-20 flex-shrink-0 bg-zinc-900 border-2 border-green-500/30 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                                {profile.avatar_url ? (
                                    <img src={profile.avatar_url} alt={profile.name} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <Terminal className="w-8 h-8 text-green-500" />
                                )}
                            </div>
                            <div className="min-w-0 flex-1">
                                <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-white truncate">
                                    {profile.name || "Anonymous_Dev"}
                                </h1>
                                <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1 flex items-center gap-2">
                                    <ShieldCheck className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                                    <span>Verified Resilience Portfolio</span>
                                </div>
                            </div>
                        </div>

                        {/* Bio */}
                        {profile.bio && (
                            <p className="mt-5 text-sm text-zinc-300 leading-relaxed border-l-2 border-green-500/40 pl-4 max-w-2xl">
                                {profile.bio}
                            </p>
                        )}

                        {/* Social Links */}
                        {socialLinks.length > 0 && (
                            <div className="flex flex-wrap items-center gap-2 mt-5">
                                {socialLinks.map(({ url, icon: Icon, label }) => (
                                    <a
                                        key={label}
                                        href={url!}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 transition-all text-xs uppercase tracking-widest font-bold"
                                    >
                                        <Icon className="w-3.5 h-3.5" />
                                        {label}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* ===== STATS GRID ===== */}
                <section className="mb-10">
                    <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                        Performance_Metrics
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {/* Grit Score — full card spanning left column */}
                        <GritScoreCard data={gritScore} />

                        {/* Right column: 3 mini stat cards */}
                        <div className="grid grid-cols-1 gap-4">
                            <div className="bg-black border border-zinc-800 p-4 flex items-center justify-between hover:border-green-500/50 transition-colors">
                                <div>
                                    <div className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-1">Pivots_Executed</div>
                                    <div className="text-2xl font-black text-white">{totalPivots}</div>
                                </div>
                                <Layers className="w-5 h-5 text-green-500" />
                            </div>
                            <div className="bg-black border border-zinc-800 p-4 flex items-center justify-between hover:border-green-500/50 transition-colors">
                                <div>
                                    <div className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-1">Resolution_Rate</div>
                                    <div className="text-2xl font-black text-white">{resolutionRate}<span className="text-sm text-zinc-500">%</span></div>
                                </div>
                                <Target className="w-5 h-5 text-green-500" />
                            </div>
                            <div className="bg-black border border-zinc-800 p-4 flex items-center justify-between hover:border-yellow-500/50 transition-colors">
                                <div>
                                    <div className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-1">Avg_Resolution</div>
                                    <div className="text-2xl font-black text-white">{avgResTime} <span className="text-sm text-zinc-500">hrs</span></div>
                                </div>
                                <Clock className="w-5 h-5 text-yellow-500" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* ===== DOMAIN EXPERTISE ===== */}
                {Object.keys(domainStats).length > 0 && (
                    <section className="mb-10">
                        <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-purple-500 rounded-full inline-block"></span>
                            Domain_Expertise
                        </h2>

                        <div className="bg-black border border-zinc-800 p-5">
                            <div className="space-y-3">
                                {Object.entries(domainStats)
                                    .sort((a, b) => b[1].total - a[1].total)
                                    .map(([domain, stats]) => {
                                        const pct = stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0;
                                        return (
                                            <div key={domain} className="flex items-center gap-3">
                                                <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold w-28 flex-shrink-0 truncate">{domain}</span>
                                                <div className="flex-1 bg-zinc-900 h-2 overflow-hidden rounded-sm">
                                                    <div
                                                        className={`h-full ${domainColors[domain] || 'bg-zinc-500'} transition-all duration-500`}
                                                        style={{ width: `${pct}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs text-zinc-500 font-bold w-16 text-right flex-shrink-0">
                                                    {stats.resolved}/{stats.total}
                                                </span>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    </section>
                )}

                {/* ===== ENDORSEMENTS ===== */}
                <section className="mb-10">
                    <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full inline-block"></span>
                        Endorsements
                    </h2>

                    <div className="bg-black border border-zinc-800 p-5">
                        {Object.entries(traitCounts).length > 0 ? (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {Object.entries(traitCounts).map(([trait, count]) => (
                                    <div key={trait} className="flex items-center gap-1.5 bg-zinc-900 border border-purple-500/30 px-3 py-1.5 hover:border-purple-500/60 transition-colors">
                                        <Award className="w-3 h-3 text-purple-500" />
                                        <span className="text-[10px] uppercase font-bold text-zinc-300">{trait}</span>
                                        <span className="text-xs font-black text-purple-400 bg-purple-500/10 px-1.5 py-0.5 ml-1">{count as number}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-zinc-600 uppercase tracking-widest mb-4">No endorsements yet. Be the first!</p>
                        )}

                        <EndorsementButton
                            endorseeId={profile.id}
                            endorsements={endorsements}
                            currentUserId={currentUser?.id}
                        />
                    </div>
                </section>

                {/* ===== PIVOT LOGS ===== */}
                <section className="mb-10">
                    <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full inline-block"></span>
                        Pivot_Logs
                        <span className="text-[10px] bg-zinc-900 border border-zinc-800 px-2 py-0.5 ml-1">{totalPivots}</span>
                    </h2>

                    {(!pivots || pivots.length === 0) ? (
                        <div className="text-center py-16 border border-zinc-800 border-dashed bg-black/50">
                            <Terminal className="w-6 h-6 text-zinc-700 mx-auto mb-3" />
                            <p className="text-zinc-500 uppercase tracking-widest text-sm">No pivot logs found for this user yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {pivots.map(pivot => (
                                <LogCard key={pivot.id} log={pivot} readonly={true} />
                            ))}
                        </div>
                    )}
                </section>

                {/* ===== EXPORT + FOOTER ===== */}
                <section className="border-t border-zinc-800 pt-8 pb-12">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <ExportResumeButton profile={profile} pivots={pivots || []} />
                        <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors uppercase font-bold tracking-widest text-xs">
                            <Terminal className="w-4 h-4" />
                            Powered by PivotLog
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}
