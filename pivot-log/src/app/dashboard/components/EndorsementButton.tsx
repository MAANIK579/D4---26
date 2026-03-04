'use client';

import { useState } from 'react';
import { toggleEndorsement } from '@/app/actions/mentorship';
import { Award, Loader2 } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

const ENDORSEMENT_TRAITS = [
    { id: 'grit', label: 'Grit' },
    { id: 'creative', label: 'Creative Solution' },
    { id: 'technical', label: 'Technical Depth' },
];

export function EndorsementButton({ endorseeId, endorsements = [], currentUserId }: { endorseeId: string, endorsements: any[], currentUserId?: string }) {
    const [isUpdating, setIsUpdating] = useState(false);

    const handleEndorse = async (trait: string) => {
        setIsUpdating(true);
        try {
            await toggleEndorsement(endorseeId, trait);
        } finally {
            setIsUpdating(false);
        }
    };

    if (!currentUserId || currentUserId === endorseeId) {
        return null;
    }

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <button
                    disabled={isUpdating}
                    className="flex items-center gap-2 bg-purple-500/10 border border-purple-500 text-purple-500 px-4 py-2 hover:bg-purple-500 hover:text-black transition-colors shadow-[0_0_10px_rgba(168,85,247,0.2)] font-bold uppercase tracking-widest text-xs disabled:opacity-50"
                >
                    {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Award className="w-4 h-4" />}
                    Endorse_
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    className="min-w-[200px] bg-black border border-zinc-800 p-2 shadow-2xl font-mono text-sm z-50 animate-in fade-in slide-in-from-top-2"
                    sideOffset={5}
                >
                    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest px-2 pb-2 mb-2 border-b border-zinc-800">
                        Select_Trait
                    </div>
                    {ENDORSEMENT_TRAITS.map(trait => {
                        const count = endorsements.filter(e => e.trait === trait.label).length;
                        return (
                            <DropdownMenu.Item
                                key={trait.id}
                                onSelect={() => handleEndorse(trait.label)}
                                className="flex items-center justify-between px-2 py-2 text-zinc-300 hover:bg-purple-500/20 hover:text-purple-400 cursor-pointer outline-none transition-colors"
                            >
                                <span>{trait.label}</span>
                                {count > 0 && <span className="text-xs bg-zinc-900 px-1.5 py-0.5 text-zinc-500">{count}</span>}
                            </DropdownMenu.Item>
                        );
                    })}
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
}
