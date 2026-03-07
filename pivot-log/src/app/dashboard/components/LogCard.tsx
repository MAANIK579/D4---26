'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Terminal, CheckCircle2, CircleDashed, Image as ImageIcon, Radio } from 'lucide-react';
import { toggleMentorBeacon } from '@/app/actions/mentorship';
import { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, UIMessage } from 'ai';
import { MessageSquare, Send, Search, ExternalLink } from 'lucide-react';
import { getRelatedPivots } from '@/app/actions/pivot';
import { useEffect } from 'react';
import { getSuggestions } from '@/app/actions/suggestion';
import { SuggestionForm } from './SuggestionForm';
import { SuggestionList } from './SuggestionList';
import { createClient } from '@/utils/supabase/client';

interface LogCardProps {
    log: {
        id: string;
        user_id: string;
        initial_goal: string;
        the_wall: string;
        the_pivot: string | null;
        evidence_url: string | null;
        status: string;
        domain: string;
        frustration_level: number | null;
        created_at: string;
        resolved_at: string | null;
        needs_mentor?: boolean;
    };
    readonly?: boolean;
}

export function LogCard({ log, readonly = false }: LogCardProps) {
    const isResolved = log.status === 'Resolved' || (log.the_pivot && log.the_pivot.trim() !== '');
    const [isUpdating, setIsUpdating] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [input, setInput] = useState('');

    const [relatedPivots, setRelatedPivots] = useState<any[]>([]);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [isSuggestionFormOpen, setIsSuggestionFormOpen] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const isOwner = currentUserId === log.user_id;

    const { messages, sendMessage, status } = useChat({
        transport: new DefaultChatTransport({ api: '/api/chat' }),
        messages: [
            {
                id: 'system-context',
                role: 'system',
                parts: [{ type: 'text', text: `Context: The user is currently facing the following error/wall: "${log.the_wall}". Their initial goal was: "${log.initial_goal}". Please provide Socratic guidance.` }]
            } as UIMessage
        ]
    });

    useEffect(() => {
        const fetchMatches = async () => {
            if (!isResolved && log.the_wall) {
                const matches = await getRelatedPivots(log.the_wall, log.domain, log.user_id);
                console.log('Related matches for:', log.initial_goal, matches);
                setRelatedPivots(matches);
            }
        };

        const fetchSuggestions = async () => {
            const fetchedSuggestions = await getSuggestions(log.id);
            setSuggestions(fetchedSuggestions);
        };

        const fetchUser = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setCurrentUserId(user.id);
            }
        };

        fetchMatches();
        fetchSuggestions();
        fetchUser();
    }, [isResolved, log.the_wall, log.domain, log.user_id, log.id]);

    const getPublicSlug = (match: any) => {
        if (Array.isArray(match.users)) return match.users[0]?.public_slug;
        return match.users?.public_slug;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        const messageText = input;
        setInput('');
        await sendMessage({ text: messageText });
    };

    const isLoading = status === 'streaming' || status === 'submitted';

    const handleToggleBeacon = async () => {
        setIsUpdating(true);
        try {
            await toggleMentorBeacon(log.id, !!log.needs_mentor);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div id={`pivot-${log.id}`} className={`relative border-l-2 pl-6 py-2 mb-8 ${isResolved ? 'border-green-500' : 'border-red-500/80'} font-mono scroll-mt-20`}>
            {/* Timeline Dot */}
            <div className={`absolute -left-[11px] top-6 w-5 h-5 rounded-full bg-black border-2 flex items-center justify-center ${isResolved ? 'border-green-500' : 'border-red-500'}`}>
                {isResolved ? (
                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                ) : (
                    <CircleDashed className="w-3 h-3 text-red-500 animate-spin-slow" />
                )}
            </div>

            <div className={`border bg-black/50 p-6 shadow-lg ${isResolved ? 'border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.1)]' : 'border-red-500/30'}`}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-zinc-800">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-xs uppercase tracking-widest bg-zinc-900 border border-zinc-800 px-2 py-1 text-zinc-400">
                                {log.domain}
                            </span>
                            <span className="text-xs text-zinc-500 flex items-center gap-1">
                                <Terminal className="w-3 h-3" />
                                {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-white tracking-tight">{log.initial_goal}</h3>
                    </div>

                    {!isResolved && (
                        <div className="flex flex-wrap items-center gap-3">
                            {!readonly && (
                                <button
                                    onClick={() => setIsChatOpen(!isChatOpen)}
                                    className={`text-xs font-bold uppercase tracking-widest px-3 py-1.5 transition-colors shadow-[0_0_10px_rgba(168,85,247,0.3)] whitespace-nowrap flex items-center gap-2 ${isChatOpen
                                        ? 'bg-purple-500 text-black hover:bg-purple-400'
                                        : 'bg-transparent border border-purple-500/50 text-purple-500 hover:bg-purple-500/10'
                                        }`}
                                >
                                    <MessageSquare className="w-3 h-3" />
                                    {isChatOpen ? 'Close Duck_' : 'Ask the Duck_'}
                                </button>
                            )}

                            {/* Suggestion Form Toggle for Non-Owners */}
                            {!isOwner && (
                                <button
                                    onClick={() => setIsSuggestionFormOpen(!isSuggestionFormOpen)}
                                    className={`text-xs font-bold uppercase tracking-widest px-3 py-1.5 transition-colors shadow-[0_0_10px_rgba(234,179,8,0.3)] whitespace-nowrap flex items-center gap-2 ${isSuggestionFormOpen
                                        ? 'bg-yellow-500 text-black hover:bg-yellow-400'
                                        : 'bg-transparent border border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10'
                                        }`}
                                >
                                    <Terminal className="w-3 h-3" />
                                    {isSuggestionFormOpen ? 'Close Terminal_' : 'Send Suggestion_'}
                                </button>
                            )}

                            {/* See Suggestions Toggle for Owners */}
                            {isOwner && suggestions.length > 0 && (
                                <button
                                    onClick={() => setShowSuggestions(!showSuggestions)}
                                    className={`text-xs font-bold uppercase tracking-widest px-3 py-1.5 transition-colors shadow-[0_0_10px_rgba(234,179,8,0.3)] whitespace-nowrap flex items-center gap-2 ${showSuggestions
                                        ? 'bg-yellow-500 text-black hover:bg-yellow-400'
                                        : 'bg-transparent border border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10'
                                        }`}
                                >
                                    <MessageSquare className="w-3 h-3" />
                                    {showSuggestions ? 'Hide Suggestions_' : 'See Suggestions_'}
                                </button>
                            )}

                            {!readonly && (
                                <>
                                    <button
                                        onClick={handleToggleBeacon}
                                        disabled={isUpdating}
                                        className={`text-xs font-bold uppercase tracking-widest px-3 py-1.5 transition-colors shadow-[0_0_10px_rgba(234,179,8,0.3)] whitespace-nowrap flex items-center gap-2 ${log.needs_mentor
                                            ? 'bg-yellow-500 text-black hover:bg-yellow-400 animate-pulse'
                                            : 'bg-transparent border border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10'
                                            } disabled:opacity-50`}
                                    >
                                        <Radio className={`w-3 h-3 ${log.needs_mentor ? 'animate-ping' : ''}`} />
                                        {log.needs_mentor ? 'Beacon Active_' : 'Trigger Beacon_'}
                                    </button>

                                    <Link
                                        href={`/dashboard/edit-pivot/${log.id}`}
                                        className="text-xs font-bold uppercase tracking-widest text-black bg-green-500 px-3 py-1.5 hover:bg-green-400 transition-colors shadow-[0_0_10px_rgba(34,197,94,0.3)] whitespace-nowrap"
                                    >
                                        Update / Resolve_
                                    </Link>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {!isResolved && relatedPivots.length > 0 && (
                <div className="mb-6 animate-in fade-in slide-in-from-left-4 duration-1000">
                    <div className="border border-zinc-800 bg-zinc-950/30 p-4 relative overflow-hidden group">
                        {/* Radar Pulse Effect */}
                        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-zinc-500/20 to-transparent animate-scan" />

                        <div className="relative z-10">
                            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-3 flex items-center gap-2">
                                <Search className="w-3 h-3 animate-pulse" />
                                [ SYSTEM MATCH: Related Pivots Found ]
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {relatedPivots.map((match) => (
                                    <div key={match.id} className="border border-zinc-800/50 p-3 hover:border-zinc-700 transition-colors bg-black/40">
                                        <p className="text-xs text-zinc-400 line-clamp-1 mb-2 italic">“{match.initial_goal}”</p>
                                        <Link
                                            href={`/profile/${getPublicSlug(match)}#pivot-${match.id}`}
                                            className="text-[10px] uppercase font-bold text-zinc-500 hover:text-white flex items-center gap-1.5 transition-colors"
                                        >
                                            View @{getPublicSlug(match)}&apos;s Pivot <ExternalLink className="w-2.5 h-2.5" />
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-6 text-sm">
                <div className="border-l-2 border-red-500/50 pl-4">
                    <h4 className="text-red-500 font-bold uppercase tracking-wider mb-2 flex items-center justify-between">
                        <span>[ The Wall ]</span>
                        {log.frustration_level && (
                            <span className="text-xs text-red-500/70">Frustration: {log.frustration_level}/10</span>
                        )}
                    </h4>
                    <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">{log.the_wall}</p>

                    {log.evidence_url && (
                        <div className="mt-4 border border-zinc-800 bg-black p-2 inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors cursor-pointer group">
                            <ImageIcon className="w-4 h-4" />
                            <a href={log.evidence_url} target="_blank" rel="noopener noreferrer" className="group-hover:underline">View _Evidence</a>
                        </div>
                    )}
                </div>

                {isResolved && log.the_pivot && (
                    <div className="border-l-2 border-green-500/50 pl-4 animate-in fade-in duration-500 mt-6 pt-4 border-t border-zinc-800/50">
                        <h4 className="text-green-500 font-bold uppercase tracking-wider mb-2 flex items-center justify-between">
                            <span>[ The Pivot ]</span>
                            {log.resolved_at && (
                                <span className="text-xs text-green-500/70">
                                    Resolved {formatDistanceToNow(new Date(log.resolved_at), { addSuffix: true })}
                                </span>
                            )}
                        </h4>
                        <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">{log.the_pivot}</p>
                    </div>
                )}

                {/* Socratic Duck Chat UI */}
                {isChatOpen && !readonly && !isResolved && (
                    <div className="mt-6 pt-6 border-t border-zinc-800 animate-in slide-in-from-top-4 duration-300">
                        <div className="bg-black border border-purple-500/30 p-4">
                            <h4 className="text-purple-500 font-bold uppercase tracking-wider mb-4 flex items-center gap-2 text-sm">
                                <Terminal className="w-4 h-4" />
                                [ Socratic_Duck Terminal ]
                            </h4>

                            <div className="space-y-4 mb-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                {messages.filter(m => m.role !== 'system').length === 0 ? (
                                    <p className="text-sm text-zinc-500 italic">Duck initialized. Awaiting queries...</p>
                                ) : (
                                    messages.filter(m => m.role !== 'system').map(m => (
                                        <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[85%] p-3 text-sm ${m.role === 'user'
                                                ? 'bg-zinc-900 border border-zinc-700 text-zinc-300'
                                                : 'bg-purple-500/10 border border-purple-500/30 text-purple-300'
                                                }`}>
                                                <span className="text-xs font-bold uppercase tracking-widest opacity-50 block mb-1">
                                                    {m.role === 'user' ? '> YOU' : '> DUCK'}
                                                </span>
                                                <div className="whitespace-pre-wrap leading-relaxed">
                                                    {m.parts?.map((p, i) => p.type === 'text' ? <span key={i}>{p.text}</span> : null)}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <form onSubmit={handleSubmit} className="flex gap-2">
                                <input
                                    value={input}
                                    onChange={handleInputChange}
                                    placeholder="Explain the error roughly..."
                                    className="flex-1 bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading || !input.trim()}
                                    className="bg-purple-500 hover:bg-purple-400 text-black px-4 py-2 font-bold uppercase tracking-widest transition-colors flex items-center justify-center disabled:opacity-50"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Rendering Suggestion Form if toggled */}
                {isSuggestionFormOpen && !isResolved && !isOwner && (
                    <div className="animate-in slide-in-from-top-4 duration-300">
                        <SuggestionForm pivotId={log.id} />
                    </div>
                )}

                {/* Showing Suggestions if any (Owners must toggle, Non-owners see immediately) */}
                {(showSuggestions || !isOwner) && suggestions.length > 0 && (
                    <SuggestionList suggestions={suggestions} />
                )}
            </div>
        </div>
    );
}
