'use client';

import { jsPDF } from 'jspdf';

interface ResumePDFData {
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

// Color constants (hex) matching the terminal aesthetic
const COLORS = {
    black: '#000000',
    white: '#FFFFFF',
    green: '#22C55E',
    red: '#EF4444',
    zinc300: '#D4D4D8',
    zinc400: '#A1A1AA',
    zinc500: '#71717A',
    zinc600: '#52525B',
    zinc800: '#27272A',
    zinc900: '#18181B',
};

function hexToRgb(hex: string): [number, number, number] {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
}

// Helper to wrap text and return the lines
function wrapText(pdf: jsPDF, text: string, maxWidth: number): string[] {
    return pdf.splitTextToSize(text, maxWidth);
}

export const generateResumePDF = async (data: ResumePDFData) => {
    const { profile, pivots } = data;
    const resolvedPivots = pivots
        .filter(p => p.the_pivot && p.the_pivot.trim() !== '')
        .slice(0, 5);

    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let y = margin;

    // Helper to check and add a new page if needed
    const checkPageBreak = (requiredHeight: number) => {
        if (y + requiredHeight > pageHeight - margin) {
            pdf.addPage();
            // Black background for new page
            pdf.setFillColor(...hexToRgb(COLORS.black));
            pdf.rect(0, 0, pageWidth, pageHeight, 'F');
            y = margin;
        }
    };

    // === BLACK BACKGROUND ===
    pdf.setFillColor(...hexToRgb(COLORS.black));
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');

    // === HEADER ===
    // Terminal icon placeholder (small green square)
    pdf.setFillColor(...hexToRgb(COLORS.green));
    pdf.rect(margin, y, 8, 8, 'F');
    pdf.setFillColor(...hexToRgb(COLORS.black));
    pdf.rect(margin + 2, y + 2, 4, 4, 'F');

    // Name
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(24);
    pdf.setTextColor(...hexToRgb(COLORS.white));
    pdf.text(profile.name || 'Anonymous_Dev', margin + 12, y + 7);

    y += 12;

    // Slug
    pdf.setFontSize(9);
    pdf.setTextColor(...hexToRgb(COLORS.zinc500));
    pdf.text(`/profile/${profile.public_slug}`, margin + 12, y);
    y += 8;

    // Bio
    if (profile.bio) {
        // Left border accent
        pdf.setFillColor(...hexToRgb(COLORS.zinc800));
        const bioLines = wrapText(pdf, profile.bio, contentWidth - 8);
        const bioHeight = bioLines.length * 5;
        pdf.rect(margin, y, 1.5, bioHeight, 'F');

        pdf.setFontSize(10);
        pdf.setTextColor(...hexToRgb(COLORS.zinc300));
        pdf.text(bioLines, margin + 5, y + 4);
        y += bioHeight + 4;
    }

    // Green separator line
    pdf.setDrawColor(...hexToRgb(COLORS.green));
    pdf.setLineWidth(0.8);
    pdf.line(margin, y, pageWidth - margin, y);
    y += 10;

    // === RESILIENCE METRICS BOX ===
    checkPageBreak(30);
    pdf.setFillColor(...hexToRgb(COLORS.zinc900));
    pdf.rect(margin, y, contentWidth, 28, 'F');
    pdf.setDrawColor(...hexToRgb(COLORS.zinc800));
    pdf.setLineWidth(0.3);
    pdf.rect(margin, y, contentWidth, 28, 'S');

    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...hexToRgb(COLORS.green));
    pdf.text('[ RESILIENCE_METRICS ]', margin + 6, y + 7);

    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...hexToRgb(COLORS.white));
    pdf.text(`${pivots.length}`, margin + 6, y + 17);

    pdf.setFontSize(9);
    pdf.setTextColor(...hexToRgb(COLORS.zinc500));
    pdf.text('Total Walls Encountered', margin + 6 + pdf.getTextWidth(`${pivots.length}`) + 3, y + 17);

    pdf.setFontSize(18);
    pdf.setTextColor(...hexToRgb(COLORS.green));
    pdf.text(`${resolvedPivots.length}`, margin + 6, y + 25);

    pdf.setFontSize(9);
    pdf.setTextColor(...hexToRgb(COLORS.zinc500));
    pdf.text('Pivots Successfully Executed', margin + 6 + pdf.getTextWidth(`${resolvedPivots.length}`) + 3, y + 25);

    y += 36;

    // === RECENT BREAKTHROUGHS ===
    checkPageBreak(15);
    pdf.setFontSize(13);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...hexToRgb(COLORS.white));
    pdf.text('[ RECENT_BREAKTHROUGHS ]', margin, y);
    y += 4;

    // Underline
    pdf.setDrawColor(...hexToRgb(COLORS.zinc800));
    pdf.setLineWidth(0.3);
    pdf.line(margin, y, pageWidth - margin, y);
    y += 10;

    // === PIVOT ENTRIES ===
    for (const pivot of resolvedPivots) {
        const wallLines = wrapText(pdf, pivot.the_wall, contentWidth - 16);
        const pivotLines = wrapText(pdf, pivot.the_pivot || '', contentWidth - 16);
        const entryHeight = 20 + wallLines.length * 4.5 + pivotLines.length * 4.5 + 10;

        checkPageBreak(entryHeight);

        // Green timeline line
        pdf.setDrawColor(...hexToRgb(COLORS.green));
        pdf.setLineWidth(0.6);
        pdf.line(margin + 2, y, margin + 2, y + entryHeight - 5);

        // Timeline dot
        pdf.setFillColor(...hexToRgb(COLORS.black));
        pdf.circle(margin + 2, y, 2.5, 'F');
        pdf.setDrawColor(...hexToRgb(COLORS.green));
        pdf.setLineWidth(0.6);
        pdf.circle(margin + 2, y, 2.5, 'S');

        // Domain tag
        pdf.setFontSize(7);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(...hexToRgb(COLORS.zinc500));
        pdf.text(pivot.domain.toUpperCase(), margin + 10, y + 1);
        y += 6;

        // Goal title
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(...hexToRgb(COLORS.white));
        const goalLines = wrapText(pdf, pivot.initial_goal, contentWidth - 12);
        pdf.text(goalLines, margin + 10, y);
        y += goalLines.length * 5 + 4;

        // "The Wall" section
        pdf.setFontSize(7);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(...hexToRgb(COLORS.red));
        pdf.text('> The Wall', margin + 10, y);
        y += 4;

        // Wall left border
        pdf.setFillColor(239, 68, 68); // red-500 with 30% opacity effect — use lighter red
        pdf.rect(margin + 10, y - 1, 0.8, wallLines.length * 4.5 + 2, 'F');

        pdf.setFontSize(8.5);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(...hexToRgb(COLORS.zinc400));
        pdf.text(wallLines, margin + 14, y + 2);
        y += wallLines.length * 4.5 + 5;

        // "The Pivot" section
        pdf.setFontSize(7);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(...hexToRgb(COLORS.green));
        pdf.text('> The Pivot', margin + 10, y);
        y += 4;

        // Pivot left border
        pdf.setFillColor(...hexToRgb(COLORS.green));
        pdf.rect(margin + 10, y - 1, 0.8, pivotLines.length * 4.5 + 2, 'F');

        // Subtle green background
        pdf.setFillColor(34, 197, 94); // green with very low opacity
        pdf.setGState(new (pdf as any).GState({ opacity: 0.05 }));
        pdf.rect(margin + 10, y - 2, contentWidth - 12, pivotLines.length * 4.5 + 4, 'F');
        pdf.setGState(new (pdf as any).GState({ opacity: 1 }));

        pdf.setFontSize(8.5);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(...hexToRgb(COLORS.zinc300));
        pdf.text(pivotLines, margin + 14, y + 2);
        y += pivotLines.length * 4.5 + 12;
    }

    if (resolvedPivots.length === 0) {
        checkPageBreak(15);
        pdf.setFontSize(10);
        pdf.setTextColor(...hexToRgb(COLORS.zinc500));
        pdf.text('No resolved pivots yet. Keep pushing forward.', margin, y);
        y += 10;
    }

    // === FOOTER ===
    checkPageBreak(15);
    y = Math.max(y, pageHeight - 25);
    pdf.setDrawColor(...hexToRgb(COLORS.zinc800));
    pdf.setLineWidth(0.3);
    pdf.line(margin, y, pageWidth - margin, y);
    y += 8;

    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...hexToRgb(COLORS.zinc600));
    const footerText = 'Generated by PivotLog_ | Resilience Proven';
    const footerWidth = pdf.getTextWidth(footerText);
    pdf.text(footerText, (pageWidth - footerWidth) / 2, y);

    // Save
    pdf.save(`${profile.public_slug}_resilience_resume.pdf`);
};
