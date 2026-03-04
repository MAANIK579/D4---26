'use client';

import { Terminal, UserCircle, Save } from 'lucide-react';
import { updateProfile } from '../actions/profile';
import { useState } from 'react';

export default function OnboardingPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const formData = new FormData(e.currentTarget);

        try {
            const result = await updateProfile(formData);
            if (result && result.error) {
                setError(result.error);
            }
        } catch (err) {
            setError('An unexpected error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-4 sm:p-8 max-w-4xl mx-auto font-mono selection:bg-purple-500/30 text-white min-h-screen">
            <div className="mb-12 border-b border-zinc-800 pb-8 mt-12">
                <h1 className="text-3xl font-black text-white flex items-center gap-4 uppercase tracking-tighter">
                    <UserCircle className="w-8 h-8 text-purple-500" />
                    [ INITIALIZE: PROFILE ]
                </h1>
                <p className="text-zinc-500 mt-3 text-sm border-l-2 border-purple-500 pl-3">
                    Welcome to the network. Establish your public identity before proceeding to the dashboard.
                </p>
            </div>

            {error && (
                <div className="mb-8 border border-red-500/50 bg-red-500/10 p-4 text-red-500 text-sm font-bold uppercase tracking-widest flex items-center gap-3">
                    <Terminal className="w-5 h-5" />
                    Error: {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8 bg-black border-2 border-zinc-800 p-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[100px] pointer-events-none" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-none px-4 py-3 mt-2 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                                placeholder="Your Name"
                            />
                        </div>

                        <div>
                            <label htmlFor="public_slug" className="block text-sm font-bold uppercase tracking-widest text-zinc-400">
                                &gt; Public_Slug <span className="text-red-500">*</span>
                            </label>
                            <p className="text-xs text-zinc-600 mb-2 mt-1">Unique identifier for your public profile URL.</p>
                            <div className="flex bg-zinc-900/50 border border-zinc-800 focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500 transition-colors">
                                <span className="px-4 py-3 text-zinc-500 bg-zinc-900 border-r border-zinc-800">/profile/</span>
                                <input
                                    type="text"
                                    id="public_slug"
                                    name="public_slug"
                                    required
                                    pattern="[a-zA-Z0-9_-]+"
                                    title="Only letters, numbers, underscores, and dashes allowed"
                                    className="w-full bg-transparent rounded-none px-4 py-3 text-white focus:outline-none placeholder:text-zinc-700"
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
                                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-none px-4 py-3 mt-2 text-zinc-300 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors placeholder:text-zinc-700"
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
                                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-none px-4 py-3 mt-2 text-white focus:outline-none focus:border-purple-500 transition-colors"
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
                                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-none px-4 py-3 mt-2 text-white focus:outline-none focus:border-purple-500 transition-colors"
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
                                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-none px-4 py-3 mt-2 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                placeholder="https://yourdomain.com"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-8 border-t border-zinc-800">
                    <div className="text-xs text-zinc-500 uppercase font-bold tracking-widest">
                        System &gt; Profile Configuration
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 bg-purple-500 hover:bg-purple-400 text-black px-8 py-3 font-black uppercase tracking-widest transition-colors shadow-[0_0_15px_rgba(168,85,247,0.3)] disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <Terminal className="w-5 h-5 animate-spin" />
                        ) : (
                            <Save className="w-5 h-5" />
                        )}
                        {isSubmitting ? 'Saving...' : 'Save Profile_'}
                    </button>
                </div>
            </form>
        </div>
    );
}
