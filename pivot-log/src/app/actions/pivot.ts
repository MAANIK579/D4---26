'use server'

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createPivot(formData: FormData) {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        redirect('/login');
    }

    const initial_goal = formData.get('initial_goal') as string;
    const the_wall = formData.get('the_wall') as string;
    const the_pivot = formData.get('the_pivot') as string;
    const domain = formData.get('domain') as string;
    const status = formData.get('status') as string;
    const frustration_level = formData.get('frustration_level') ? parseInt(formData.get('frustration_level') as string) : null;
    const evidenceFile = formData.get('evidence') as File | null;

    let evidence_url = null;

    // Handle file upload
    if (evidenceFile && evidenceFile.size > 0) {
        const fileExt = evidenceFile.name.split('.').pop();
        const fileName = `${user.id}/${Math.random()}.${fileExt}`;

        const { error: uploadError, data: uploadData } = await supabase.storage
            .from('evidence')
            .upload(fileName, evidenceFile);

        if (uploadError) {
            console.error('Upload Error:', uploadError);
        } else if (uploadData) {
            const { data: publicUrlData } = supabase.storage
                .from('evidence')
                .getPublicUrl(uploadData.path);
            evidence_url = publicUrlData.publicUrl;
        }
    }

    const isResolved = status === 'Resolved' && the_pivot && the_pivot.trim() !== '';

    const { error: dbError } = await supabase
        .from('pivots')
        .insert({
            user_id: user.id,
            initial_goal,
            the_wall,
            the_pivot: the_pivot || null,
            domain,
            status: isResolved ? 'Resolved' : status, // Override if pivot text exists
            frustration_level,
            evidence_url,
            resolved_at: isResolved ? new Date().toISOString() : null,
        });

    if (dbError) {
        console.error('DB Error:', dbError);
        redirect(`/dashboard/new-pivot?error=${encodeURIComponent(dbError.message)}`);
    }

    revalidatePath('/dashboard');
    redirect('/dashboard');
}

export async function updatePivotWithResolve(id: string, formData: FormData) {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        redirect('/login');
    }

    const the_pivot = formData.get('the_pivot') as string;

    if (!the_pivot || the_pivot.trim() === '') {
        redirect(`/dashboard/edit-pivot/${id}?error=Pivot description is required to resolve`);
    }

    const { error: dbError } = await supabase
        .from('pivots')
        .update({
            the_pivot,
            status: 'Resolved',
            resolved_at: new Date().toISOString(),
        })
        .match({ id, user_id: user.id }); // Ensure user owns the pivot

    if (dbError) {
        console.error('DB Error:', dbError);
        redirect(`/dashboard/edit-pivot/${id}?error=${encodeURIComponent(dbError.message)}`);
    }

    revalidatePath('/dashboard');
    redirect('/dashboard');
}

export async function getUserLogs(tagFilter?: string | null) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    let query = supabase
        .from('pivots')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (tagFilter) {
        query = query.eq('domain', tagFilter);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching logs:', error);
        return [];
    }

    return data;
}

export async function getAnalytics() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    // Fetch all user pivots
    const { data, error } = await supabase
        .from('pivots')
        .select('created_at, resolved_at, status')
        .eq('user_id', user.id);

    if (error) {
        console.error('Error fetching analytics:', error);
        return null;
    }

    const totalPivots = data.length;
    const resolvedPivots = data.filter(p => p.status === 'Resolved');

    // Calculate Average Time to Resolution (in hours)
    let totalTimeHours = 0;
    resolvedPivots.forEach(p => {
        if (p.resolved_at && p.created_at) {
            const start = new Date(p.created_at).getTime();
            const end = new Date(p.resolved_at).getTime();
            totalTimeHours += (end - start) / (1000 * 60 * 60);
        }
    });

    const averageResolutionTimeHours = resolvedPivots.length > 0
        ? Math.round(totalTimeHours / resolvedPivots.length)
        : 0;

    // Format for heat map (daily counts)
    const heatMapData = data.reduce((acc, pivot) => {
        const date = new Date(pivot.created_at).toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Convert to array format often used by charting libraries
    const activityData = Object.entries(heatMapData)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(-30); // Last 30 days of activity

    return {
        totalLogged: totalPivots,
        totalResolved: resolvedPivots.length,
        averageResolutionTimeHours,
        activityData,
    };
}

export async function getPublicProfile(username: string) {
    const supabase = await createClient();

    // 1. Find user by public_slug
    const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, name, avatar_url, public_slug')
        .eq('public_slug', username)
        .single();

    if (userError || !userData) {
        return null; // Handle 404 in the page component
    }

    // 2. Fetch ALL their pivots (Resolved, In Progress, etc.)
    const { data: pivotData, error: pivotError } = await supabase
        .from('pivots')
        .select('*')
        .eq('user_id', userData.id)
        .order('created_at', { ascending: false });

    return {
        profile: userData,
        pivots: pivotError ? [] : pivotData
    };
}
