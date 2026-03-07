'use client';

import { useState } from 'react';
import { Send, Terminal } from 'lucide-react';
import { addSuggestion } from '@/app/actions/suggestion';

interface SuggestionFormProps {
    pivotId: string;
}

export function SuggestionForm({ pivotId }: SuggestionFormProps) {
    const [suggestion, setSuggestion] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!suggestion.trim()) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const res = await addSuggestion(pivotId, suggestion);
            if (res.error) {
                setError(res.error);
            } else {
                setSuccess(true);
                setSuggestion('');
                setTimeout(() => setSuccess(false), 3000);
            }
        } catch (err) {
            setError('An unexpected error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4 border border-zinc-800 bg-black/80 p-4 relative group transition-colors focus-within:border-yellow-500/50">
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-yellow-500 mb-3 flex items-center gap-2">
                <Terminal className="w-3 h-3" />
                [ Submit Suggestion_ ]
            </h4>

            <div className="relative">
                <textarea
                    value={suggestion}
                    onChange={(e) => setSuggestion(e.target.value)}
                    placeholder="Offer technical assistance or an alternative perspective..."
                    className="w-full bg-zinc-950 border border-zinc-800 p-3 text-sm text-zinc-300 focus:outline-none focus:border-yellow-500/50 transition-colors placeholder:text-zinc-600 min-h-[80px] resize-y custom-scrollbar font-mono leading-relaxed"
                    disabled={isSubmitting}
                />
            </div>

            <div className="flex items-center justify-between mt-3">
                <div className="text-xs">
                    {error && <span className="text-red-500 font-bold uppercase tracking-widest bg-red-500/10 px-2 py-1 border border-red-500/20">{error}</span>}
                    {success && <span className="text-green-500 font-bold uppercase tracking-widest bg-green-500/10 px-2 py-1 border border-green-500/20">Transmission Sent_</span>}
                </div>
                <button
                    type="submit"
                    disabled={isSubmitting || !suggestion.trim()}
                    className="bg-yellow-500/10 border border-yellow-500/50 text-yellow-500 hover:bg-yellow-500 hover:text-black hover:shadow-[0_0_15px_rgba(234,179,8,0.3)] transition-all px-4 py-2 text-xs font-bold uppercase tracking-widest flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Transmitting...' : 'Send Suggestion_'}
                    <Send className="w-3 h-3" />
                </button>
            </div>
        </form>
    );
}
