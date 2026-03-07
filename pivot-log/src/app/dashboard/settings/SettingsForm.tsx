'use client';

import { Terminal, Save, CheckCircle } from 'lucide-react';
import { updateProfileSettings } from '@/app/actions/profile';
import { useState } from 'react';

type SettingsFormProps = {
    profile: {
        name: string;
        public_slug: string;
        bio: string | null;
        github_url: string | null;
        linkedin_url: string | null;
        website_url: string | null;
    }
};

export function SettingsForm({ profile }: SettingsFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setSuccess(false);

        const formData = new FormData(e.currentTarget);

        try {
            const result = await updateProfileSettings(formData);
            if (result && result.error) {
                setError(result.error);
            } else if (result && result.success) {
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            }
        } catch (err) {
            setError('An unexpected error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="font-mono">
            {error && (
                <div className="mb-8 border border-red-500/50 bg-red-500/10 p-4 text-red-500 text-sm font-bold uppercase tracking-widest flex items-center gap-3">
                    <Terminal className="w-5 h-5 flex-shrink-0" />
                    Error: {error}
                </div>
            )}

            {success && (
                <div className="mb-8 border border-green-500/50 bg-green-500/10 p-4 text-green-500 text-sm font-bold uppercase tracking-widest flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    Profile settings saved successfully.
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8 bg-black border-2 border-zinc-800 p-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] pointer-events-none" />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Basic Info */}
                    <div className="space-y-6">
                        <h2 className="text-lg font-black uppercase tracking-widest text-white border-b border-zinc-800 pb-2 mb-4">
                            Core Identity
                        </h2>

                        <div>
                            <label htmlFor="name" className="block text-sm font-bold uppercase tracking-widest text-zinc-400">
                                &gt; Display_Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                defaultValue={profile.name}
                                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-none px-4 py-3 mt-2 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                                placeholder="Your Name"
                            />
                        </div>

                        <div>
                            <label htmlFor="public_slug" className="block text-sm font-bold uppercase tracking-widest text-zinc-400">
                                &gt; Public_Slug <span className="text-red-500">*</span>
                            </label>
                            <p className="text-xs text-zinc-600 mb-2 mt-1">Unique identifier for your public profile URL.</p>
                            <div className="flex bg-zinc-900/50 border border-zinc-800 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-colors">
                                <span className="px-4 py-3 text-zinc-500 bg-zinc-900 border-r border-zinc-800 shrink-0">/profile/</span>
                                <input
                                    type="text"
                                    id="public_slug"
                                    name="public_slug"
                                    required
                                    defaultValue={profile.public_slug}
                                    pattern="[a-zA-Z0-9_-]+"
                                    title="Only letters, numbers, underscores, and dashes allowed"
                                    className="w-full bg-transparent rounded-none px-4 py-3 text-white focus:outline-none placeholder:text-zinc-700 min-w-0"
                                    placeholder="your-unique-handle"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="bio" className="block text-sm font-bold uppercase tracking-widest text-zinc-400">
                                &gt; Bio
                            </label>
                            <textarea
                                id="bio"
                                name="bio"
                                rows={4}
                                defaultValue={profile.bio || ''}
                                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-none px-4 py-3 mt-2 text-zinc-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors placeholder:text-zinc-700"
                                placeholder="Software engineer bridging the gap between logic and resilience..."
                            />
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="space-y-6">
                        <h2 className="text-lg font-black uppercase tracking-widest text-white border-b border-zinc-800 pb-2 mb-4">
                            Network Links
                        </h2>

                        <div>
                            <label htmlFor="github_url" className="block text-sm font-bold uppercase tracking-widest text-zinc-400">
                                &gt; GitHub_URL
                            </label>
                            <input
                                type="url"
                                id="github_url"
                                name="github_url"
                                defaultValue={profile.github_url || ''}
                                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-none px-4 py-3 mt-2 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                placeholder="https://github.com/..."
                            />
                        </div>

                        <div>
                            <label htmlFor="linkedin_url" className="block text-sm font-bold uppercase tracking-widest text-zinc-400">
                                &gt; LinkedIn_URL
                            </label>
                            <input
                                type="url"
                                id="linkedin_url"
                                name="linkedin_url"
                                defaultValue={profile.linkedin_url || ''}
                                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-none px-4 py-3 mt-2 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                placeholder="https://linkedin.com/in/..."
                            />
                        </div>

                        <div>
                            <label htmlFor="website_url" className="block text-sm font-bold uppercase tracking-widest text-zinc-400">
                                &gt; Personal_Website
                            </label>
                            <input
                                type="url"
                                id="website_url"
                                name="website_url"
                                defaultValue={profile.website_url || ''}
                                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-none px-4 py-3 mt-2 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                placeholder="https://yourdomain.com"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-8 border-t border-zinc-800">
                    <div className="text-xs text-zinc-500 uppercase font-bold tracking-widest hidden sm:block">
                        System &gt; Profile Configuration
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center justify-center w-full sm:w-auto gap-2 bg-indigo-500 hover:bg-indigo-400 text-black px-8 py-3 font-black uppercase tracking-widest transition-colors shadow-[0_0_15px_rgba(99,102,241,0.3)] disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <Terminal className="w-5 h-5 animate-spin" />
                        ) : (
                            <Save className="w-5 h-5" />
                        )}
                        {isSubmitting ? 'Saving...' : 'Save Settings_'}
                    </button>
                </div>
            </form>
        </div>
    );
}
