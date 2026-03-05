'use client';

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Terminal } from 'lucide-react';

interface ResumePDFProps {
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

export const generatePDF = async (elementId: string, filename: string) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    // Temporarily make the element visible for capturing
    const originalDisplay = element.style.display;
    element.style.display = 'block';

    try {
        const canvas = await html2canvas(element, {
            scale: 2, // High resolution
            useCORS: true,
            backgroundColor: '#000000', // Match our dark aesthetic
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: 'a4',
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(filename);
    } finally {
        element.style.display = originalDisplay; // Restore hidden state
    }
};

export function ResumePDFTemplate({ profile, pivots }: ResumePDFProps) {
    const resolvedPivots = pivots.filter(p => p.the_pivot && p.the_pivot.trim() !== '').slice(0, 5); // Top 5

    return (
        <div id="resume-pdf-template" style={{ display: 'none' }}>
            {/* The canvas container we will capture */}
            <div className="w-[800px] bg-black text-white font-mono p-12 custom-scrollbar">

                {/* Header */}
                <div className="border-b-2 border-green-500 pb-8 mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <Terminal className="w-10 h-10 text-green-500" />
                        <div>
                            <h1 className="text-4xl font-black uppercase tracking-tighter">
                                {profile.name}
                            </h1>
                            <p className="text-zinc-500 tracking-widest uppercase">/profile/{profile.public_slug}</p>
                        </div>
                    </div>
                    {profile.bio && (
                        <p className="text-lg text-zinc-300 border-l-4 border-zinc-800 pl-4">
                            {profile.bio}
                        </p>
                    )}
                </div>

                {/* Stats */}
                <div className="mb-10 p-6 bg-zinc-900/50 border border-zinc-800">
                    <h2 className="text-green-500 text-sm font-bold uppercase tracking-widest mb-2">[ RESILIENCE_METRICS ]</h2>
                    <div className="text-3xl font-black">{pivots.length} <span className="text-lg text-zinc-500 font-normal">Total Walls Encountered</span></div>
                    <div className="text-3xl font-black text-green-500 mt-2">{resolvedPivots.length} <span className="text-lg text-zinc-500 font-normal">Pivots Successfully Executed</span></div>
                </div>

                {/* Pivots */}
                <div>
                    <h2 className="text-xl font-black uppercase tracking-widest mb-6 border-b border-zinc-800 pb-2">
                        [ RECENT_BREAKTHROUGHS ]
                    </h2>

                    <div className="space-y-8">
                        {resolvedPivots.map((pivot, i) => (
                            <div key={pivot.id} className="border-l-2 border-green-500 pl-6 relative">
                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-black border-2 border-green-500" />

                                <div className="text-xs uppercase tracking-widest text-zinc-500 mb-1">{pivot.domain}</div>
                                <h3 className="text-xl font-bold mb-4">{pivot.initial_goal}</h3>

                                <div className="mb-4">
                                    <h4 className="text-xs text-red-500 font-bold uppercase tracking-widest mb-1">&gt; The Wall</h4>
                                    <p className="text-sm text-zinc-400 border-l border-red-500/30 pl-3 py-1">
                                        {pivot.the_wall}
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-xs text-green-500 font-bold uppercase tracking-widest mb-1">&gt; The Pivot</h4>
                                    <p className="text-sm text-zinc-300 border-l border-green-500/30 pl-3 py-1 bg-green-500/5">
                                        {pivot.the_pivot}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-12 pt-8 border-t border-zinc-800 text-center text-xs text-zinc-600 uppercase tracking-widest">
                    Generated by PivotLog_ | Resilience Proven
                </div>
            </div>
        </div>
    );
}
