export interface GritScoreData {
    score: number;
    breakdown: {
        resolutionRate: number;
        consistency: number;
        speed: number;
        volume: number;
        breadth: number;
    };
}

export function calculateGritScore(
    pivots: { created_at: string; resolved_at: string | null; status: string; domain?: string }[]
): GritScoreData {
    if (pivots.length === 0) {
        return { score: 0, breakdown: { resolutionRate: 0, consistency: 0, speed: 0, volume: 0, breadth: 0 } };
    }

    const resolved = pivots.filter(p => p.status === 'Resolved');

    // 1. Resolution Rate (0-100)
    const resolutionRate = (resolved.length / pivots.length) * 100;

    // 2. Consistency — active logging days in the last 30 days (0-100)
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const recentDays = new Set(
        pivots
            .filter(p => new Date(p.created_at) >= thirtyDaysAgo)
            .map(p => new Date(p.created_at).toISOString().split('T')[0])
    );
    const consistency = (recentDays.size / 30) * 100;

    // 3. Speed — inverse of avg resolution time, capped (0-100)
    let avgResHours = 0;
    if (resolved.length > 0) {
        let totalHours = 0;
        resolved.forEach(p => {
            if (p.resolved_at && p.created_at) {
                const diff = new Date(p.resolved_at).getTime() - new Date(p.created_at).getTime();
                totalHours += diff / (1000 * 60 * 60);
            }
        });
        avgResHours = totalHours / resolved.length;
    }
    // Under 1 hour = 100, over 72 hours = 0, linear in between
    const speed = avgResHours <= 0 && resolved.length > 0
        ? 100
        : Math.max(0, Math.min(100, ((72 - avgResHours) / 71) * 100));

    // 4. Volume — log-scaled, capped at 50 walls (0-100)
    const volume = Math.min(100, (Math.log(pivots.length + 1) / Math.log(51)) * 100);

    // 5. Domain Breadth — unique domains out of 7 (0-100)
    const uniqueDomains = new Set(pivots.map(p => p.domain).filter(Boolean));
    const breadth = Math.min(100, (uniqueDomains.size / 7) * 100);

    const score = Math.round(
        0.30 * resolutionRate +
        0.25 * consistency +
        0.15 * speed +
        0.15 * volume +
        0.15 * breadth
    );

    return {
        score: Math.min(100, Math.max(0, score)),
        breakdown: {
            resolutionRate: Math.round(resolutionRate),
            consistency: Math.round(consistency),
            speed: Math.round(speed),
            volume: Math.round(volume),
            breadth: Math.round(breadth),
        },
    };
}
