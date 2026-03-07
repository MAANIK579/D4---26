import { getAnalytics, getUserLogs } from '../actions/pivot';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { TimelineFeed } from './components/TimelineFeed';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Users, ExternalLink, FileDown } from 'lucide-react';
import { ExportResumeButton } from './components/ExportResumeButton';

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data: profile } = await supabase
        .from('users')
        .select('name, public_slug')
        .eq('id', user.id)
        .single();

    // Fetch data via Server Actions
    const [analyticsData, logsData] = await Promise.all([
        getAnalytics(),
        getUserLogs(),
    ]);

    return (
        <div className="p-4 sm:p-8 max-w-5xl mx-auto selection:bg-green-500/30">
            {/* Header */}
            <header className="mb-10 border-b border-zinc-800 pb-6">
                <div className="flex items-center justify-between gap-4">
                    {/* Left: Title + Greeting */}
                    <div className="min-w-0">
                        <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
                            <span className="text-green-500">_</span>Dash<span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">Board</span>
                        </h1>
                        <p className="text-sm text-zinc-400 font-mono mt-1.5 border-l-2 border-green-500 pl-3 truncate">
                            Welcome back, {profile?.name || user.email}.
                        </p>
                    </div>

                    {/* Right: Public Profile Icon */}
                    {profile?.public_slug && (
                        <a
                            href={`/profile/${profile.public_slug}`}
                            target="_blank"
                            title={`View public profile: /profile/${profile.public_slug}`}
                            className="flex-shrink-0 w-10 h-10 rounded-full bg-zinc-900 border-2 border-green-500/30 flex items-center justify-center hover:border-green-500 hover:shadow-[0_0_12px_rgba(34,197,94,0.2)] transition-all group"
                        >
                            <ExternalLink className="w-4 h-4 text-green-500 group-hover:scale-110 transition-transform" />
                        </a>
                    )}
                </div>

                {/* Action Bar */}
                <div className="flex items-center gap-3 mt-5">
                    <Link
                        href="/explore"
                        className="flex items-center gap-2 px-4 py-2 border border-zinc-800 bg-black text-white hover:border-zinc-600 transition-colors uppercase font-mono text-xs font-bold tracking-widest"
                    >
                        <Users className="w-3.5 h-3.5 text-green-500" />
                        Explore_
                    </Link>
                    {profile && (
                        <ExportResumeButton profile={profile} pivots={logsData || []} />
                    )}
                </div>
            </header>

            {/* Section: Analytics */}
            <section className="mb-12">
                <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-500 mb-5 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                    Resilience_Metrics
                </h2>
                <AnalyticsDashboard data={analyticsData} username={profile?.public_slug} />
            </section>

            {/* Section: Timeline */}
            <section>
                <TimelineFeed initialLogs={logsData || []} />
            </section>
        </div>
    );
}
