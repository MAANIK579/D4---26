'use client';

import { FileDown, Loader2 } from 'lucide-react';
import { generateResumePDF } from './ResumePDFGenerator';
import { useState } from 'react';

interface ExportResumeButtonProps {
    profile: {
        name: string;
        public_slug: string;
        bio?: string;
    };
    pivots: {
        id: string;
        initial_goal: string;
        the_wall: string;
        the_pivot: string | null;
        domain: string;
        resolved_at: string | null;
    }[];
}

export function ExportResumeButton({ profile, pivots }: ExportResumeButtonProps) {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleExport = async () => {
        setIsGenerating(true);
        try {
            await generateResumePDF({ profile, pivots });
        } catch (error) {
            console.error('Failed to generate PDF', error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <button
            onClick={handleExport}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-400 text-black font-bold uppercase tracking-widest text-xs transition-colors shadow-[0_0_10px_rgba(34,197,94,0.3)] disabled:opacity-50"
        >
            {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <FileDown className="w-4 h-4" />
            )}
            {isGenerating ? 'Compiling...' : 'Export Resume .PDF_'}
        </button>
    );
}
