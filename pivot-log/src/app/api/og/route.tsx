import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        // Dynamic params
        const username = searchParams.get('username') || 'Anonymous_Dev';
        const totalPivots = searchParams.get('pivots') || '0';
        const domains = searchParams.get('domains') || 'Various';

        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#0A0A0A',
                        fontFamily: 'monospace',
                        color: '#FFFFFF',
                        borderTop: '20px solid #22c55e', // Green accent
                        position: 'relative',
                    }}
                >
                    {/* Simulated Background Grid */}
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundImage: 'linear-gradient(to right, #ffffff11 1px, transparent 1px), linear-gradient(to bottom, #ffffff11 1px, transparent 1px)',
                            backgroundSize: '40px 40px',
                            zIndex: 0,
                        }}
                    />

                    {/* Content */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            zIndex: 10,
                            padding: '40px',
                            background: 'rgba(0,0,0,0.8)',
                            border: '1px solid #3f3f46', // zinc-700
                        }}
                    >
                        <div style={{ fontSize: 32, color: '#22c55e', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase' }}>
                            [ PivotLog_ ]
                        </div>

                        <div style={{ fontSize: 64, fontWeight: '900', marginBottom: '40px', textAlign: 'center' }}>
                            {username}'s Resilience
                        </div>

                        <div style={{ display: 'flex', gap: '40px', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <span style={{ fontSize: 80, fontWeight: '900', color: '#22c55e' }}>{totalPivots}</span>
                                <span style={{ fontSize: 24, textTransform: 'uppercase', color: '#a1a1aa' }}>Pivots Executed</span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <span style={{ fontSize: 80, fontWeight: '900', color: '#eab308' }}>{domains.split(',').length}</span>
                                <span style={{ fontSize: 24, textTransform: 'uppercase', color: '#a1a1aa' }}>Domains Conquered</span>
                            </div>
                        </div>

                        <div style={{ fontSize: 28, color: '#71717a', marginTop: '20px', fontFamily: 'monospace' }}>
                            &gt; Validated through Proof of Work.
                        </div>
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            }
        );
    } catch (e: any) {
        console.error("OG Image generation failed:", e);
        return new Response(`Failed to generate the image`, {
            status: 500,
        });
    }
}
