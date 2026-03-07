import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Terminal, ArrowUpRight, MessageSquare } from 'lucide-react';

interface SuggestionNode {
    id: string;
    suggestion_text: string;
    created_at: string;
    pivot_id: string;
    suggester_id: string;
    users: {
        name: string | null;
        public_slug: string | null;
    } | null;
}

interface SuggestionListProps {
    suggestions: SuggestionNode[];
}

export function SuggestionList({ suggestions }: SuggestionListProps) {
    if (!suggestions || suggestions.length === 0) return null;

    return (
        <div className="mt-8 border-t border-zinc-800 pt-6 animate-in fade-in duration-500">
            <h4 className="text-[12px] font-bold uppercase tracking-[0.2em] text-yellow-500 mb-6 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                [ SYSTEM LOG: User Suggestions ]
            </h4>

            <div className="space-y-4">
                {suggestions.map((suggestion) => (
                    <div
                        key={suggestion.id}
                        className="relative border-l-2 border-yellow-500/50 pl-4 py-2 group hover:border-yellow-500 transition-colors bg-black/40 pr-4"
                    >
                        {/* Connecting Line Effect */}
                        <div className="absolute -left-[18px] top-4 w-4 h-[1px] bg-yellow-500/30 group-hover:bg-yellow-500 transition-colors" />

                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Terminal className="w-3 h-3 text-zinc-600" />
                                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                                    {formatDistanceToNow(new Date(suggestion.created_at), { addSuffix: true })}
                                </span>
                            </div>

                            <Link
                                href={`/profile/${suggestion.users?.public_slug || suggestion.suggester_id}`}
                                className="text-[10px] text-yellow-500/80 hover:text-yellow-400 font-bold uppercase tracking-widest flex items-center gap-1 group/link transition-colors"
                            >
                                @{suggestion.users?.name || "Anonymous_Dev"}
                                <ArrowUpRight className="w-3 h-3 text-transparent group-hover/link:text-yellow-400 transition-colors" />
                            </Link>
                        </div>

                        <p className="text-sm text-zinc-300 leading-relaxed font-mono whitespace-pre-wrap">
                            {suggestion.suggestion_text}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
