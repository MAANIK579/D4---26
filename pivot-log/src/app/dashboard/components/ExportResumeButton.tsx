'use client';

import { FileDown, Loader2 } from 'lucide-react';
import { generatePDF } from './ResumePDFGenerator';
import { useState } from 'react';

export function ExportResumeButton({ username }: { username: string }) {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleExport = async () => {
        setIsGenerating(true);
        try {
            await generatePDF('resume-pdf-template', `${username}_resilience_resume.pdf`);
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
