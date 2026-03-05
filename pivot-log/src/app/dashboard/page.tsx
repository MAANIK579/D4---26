import { getAnalytics, getUserLogs } from '../actions/pivot';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { TimelineFeed } from './components/TimelineFeed';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Users } from 'lucide-react';
import { ExportResumeButton } from './components/ExportResumeButton';
import { ResumePDFTemplate } from './components/ResumePDFGenerator';

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
            <header className="mb-12 border-b border-zinc-800 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
                        <span className="text-green-500">_</span>Dash<span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">Board</span>
                    </h1>
                    <p className="text-sm text-zinc-400 font-mono mt-2 border-l-2 border-green-500 pl-3">
                        Welcome back, {profile?.name || user.email}.<br />
                        Analyzing resilience telemetry...
                    </p>
                </div>

                <div className="flex flex-col items-end gap-4">
                    {profile?.public_slug && (
                        <div className="font-mono text-xs border border-zinc-800 bg-black p-3">
                            <div className="text-zinc-500 mb-1 uppercase tracking-widest font-bold">Public Endpoint:</div>
                            <a href={`/profile/${profile.public_slug}`} target="_blank" className="text-green-500 hover:underline">
                                /profile/{profile.public_slug}
                            </a>
                        </div>
                    )}
                    <Link
                        href="/explore"
                        className="flex items-center justify-center w-full sm:w-auto gap-2 px-4 py-2 border border-zinc-800 bg-black text-white hover:border-zinc-500 transition-colors uppercase font-mono text-xs font-bold tracking-widest"
                    >
                        <Users className="w-4 h-4 text-green-500" />
                        Explore Network_
                    </Link>
                    {profile?.public_slug && (
                        <ExportResumeButton username={profile.public_slug} />
                    )}
                </div>
            </header>

            {/* Top Level Stats */}
            <AnalyticsDashboard data={analyticsData} username={profile?.public_slug} />

            {/* Dynamic Timeline Feed */}
            <TimelineFeed initialLogs={logsData || []} />

            {/* Hidden PDF Template Container */}
            {profile && (
                <ResumePDFTemplate profile={profile} pivots={logsData || []} />
            )}
        </div>
    );
}
