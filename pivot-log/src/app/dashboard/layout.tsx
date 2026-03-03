import Link from 'next/link';
import { Activity, LayoutDashboard, PlusCircle, Settings, User } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let userSlug = 'profile';
    if (user) {
        const { data: profile } = await supabase
            .from('users')
            .select('public_slug')
            .eq('id', user.id)
            .single();
        if (profile?.public_slug) {
            userSlug = profile.public_slug;
        }
    }

    return (
        <div className="flex min-h-screen bg-black text-white selection:bg-indigo-500/30">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 bg-black/50 backdrop-blur-md flex-col hidden md:flex">
                <div className="h-16 flex items-center px-6 border-b border-white/10">
                    <Link href="/dashboard" className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity">
                        <Activity className="w-6 h-6 text-indigo-500" />
                        <span className="text-xl font-display font-semibold tracking-tight">PivotLog</span>
                    </Link>
                </div>
                <div className="flex-1 py-6 px-4 space-y-1">
                    <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md bg-white/5 text-white">
                        <LayoutDashboard className="w-5 h-5 text-indigo-400" />
                        Dashboard
                    </Link>
                    <Link href="/dashboard/new-pivot" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-zinc-400 hover:bg-white/5 hover:text-white transition-colors">
                        <PlusCircle className="w-5 h-5" />
                        New Pivot
                    </Link>
                    <Link href={`/${userSlug}`} className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-zinc-400 hover:bg-white/5 hover:text-white transition-colors" target="_blank">
                        <User className="w-5 h-5" />
                        Public Profile
                    </Link>
                </div>
                <div className="p-4 border-t border-white/10">
                    <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-zinc-400 hover:bg-white/5 hover:text-white transition-colors">
                        <Settings className="w-5 h-5" />
                        Settings
                    </Link>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
