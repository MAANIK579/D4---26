import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { SettingsForm } from './SettingsForm';
import { ApiKeyDisplay } from '../components/ApiKeyDisplay';
import { Settings } from 'lucide-react';

export const metadata = {
    title: 'Settings - PivotLog',
    description: 'Configure your PivotLog profile and account settings.',
};

export default async function SettingsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data: profile } = await supabase
        .from('users')
        .select('name, public_slug, bio, github_url, linkedin_url, website_url, api_key')
        .eq('id', user.id)
        .single();

    if (!profile) {
        redirect('/onboarding');
    }

    return (
        <div className="p-4 sm:p-8 max-w-5xl mx-auto selection:bg-indigo-500/30">
            <header className="mb-12 border-b border-zinc-800 pb-8">
                <h1 className="text-3xl font-black text-white flex items-center gap-4 uppercase tracking-tighter">
                    <Settings className="w-8 h-8 text-indigo-500" />
                    System_Settings
                </h1>
                <p className="text-sm text-zinc-400 font-mono mt-2 border-l-2 border-indigo-500 pl-3">
                    Configure your public identity and network links.<br />
                    Changes are reflected immediately across the network.
                </p>
            </header>

            <SettingsForm profile={profile} />

            {/* API Key Section */}
            {profile?.api_key && (
                <div className="mt-10">
                    <h2 className="text-lg font-black uppercase tracking-widest text-white border-b border-zinc-800 pb-2 mb-6 font-mono flex items-center gap-2">
                        <span className="text-amber-500">⚡</span> API / MCP Integration
                    </h2>
                    <ApiKeyDisplay apiKey={profile.api_key} />
                </div>
            )}
        </div>
    );
}
