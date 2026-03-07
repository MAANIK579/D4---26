'use server'

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function toggleMentorBeacon(pivotId: string, currentState: boolean) {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        redirect('/login');
    }

    const { error: dbError } = await supabase
        .from('pivots')
        .update({ needs_mentor: !currentState })
        .eq('id', pivotId)
        .eq('user_id', user.id); // Ensure user owns the pivot

    if (dbError) {
        console.error('Error toggling mentor beacon:', dbError);
        return { error: 'Failed to update beacon status.' };
    }

    revalidatePath('/dashboard');
    revalidatePath('/explore');

    return { success: true };
}

export async function getExploreFeed() {
    const supabase = await createClient();

    // Get the current user from the same client to avoid creating multiple clients
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch the latest 30 Hall of Growth pivots
    const { data: hallData, error: hallError } = await supabase
        .from('pivots')
        .select(`
            id, user_id, initial_goal, the_wall, the_pivot, evidence_url, status, domain, frustration_level, created_at, resolved_at, needs_mentor,
            users ( name, avatar_url, public_slug )
        `)
        .or('status.eq.Resolved,the_pivot.neq.')
        .order('created_at', { ascending: false })
        .limit(30);

    // Fetch the latest 30 active distress beacons
    const { data: beaconData, error: beaconError } = await supabase
        .from('pivots')
        .select(`
            id, user_id, initial_goal, the_wall, the_pivot, evidence_url, status, domain, frustration_level, created_at, resolved_at, needs_mentor,
            users ( name, avatar_url, public_slug )
        `)
        .eq('needs_mentor', true)
        .neq('status', 'Resolved')
        .or('the_pivot.is.null,the_pivot.eq.')
        .order('created_at', { ascending: false })
        .limit(30);

    if (hallError || beaconError) {
        console.error('Error fetching explore feed:', { hallError, beaconError });
    }

    // the_pivot.neq. matches anything not exactly empty, but Supabase text blank check is safer handled in memory too just in case
    const hallOfGrowth = (hallData || []).filter((p: any) => p.status === 'Resolved' || (p.the_pivot && p.the_pivot.trim() !== ''));
    const activeBeacons = (beaconData || []).filter((p: any) => p.needs_mentor === true && p.status !== 'Resolved' && (!p.the_pivot || p.the_pivot.trim() === ''));

    return {
        hallOfGrowth,
        activeBeacons,
        user
    };
}

export async function toggleEndorsement(endorseeId: string, trait: string) {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        redirect('/login');
    }

    if (user.id === endorseeId) {
        return { error: 'You cannot endorse yourself.' };
    }

    // Check if endorsement already exists
    const { data: existing, error: checkError } = await supabase
        .from('endorsements')
        .select('id')
        .eq('endorsee_id', endorseeId)
        .eq('endorser_id', user.id)
        .eq('trait', trait)
        .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        console.error('Error checking endorsement:', checkError);
        return { error: 'Failed to process endorsement.' };
    }

    if (existing) {
        // Delete endorsement
        const { error: deleteError } = await supabase
            .from('endorsements')
            .delete()
            .eq('id', existing.id);

        if (deleteError) {
            console.error('Error deleting endorsement:', deleteError);
            return { error: 'Failed to remove endorsement.' };
        }
    } else {
        // Insert endorsement
        const { error: insertError } = await supabase
            .from('endorsements')
            .insert({
                endorsee_id: endorseeId,
                endorser_id: user.id,
                trait: trait
            });

        if (insertError) {
            console.error('Error inserting endorsement:', insertError);
            return { error: 'Failed to add endorsement.' };
        }
    }

    revalidatePath(`/profile/[username]`, 'page');
    revalidatePath('/explore');

    return { success: true };
}

export async function getEndorsements(userId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('endorsements')
        .select('trait')
        .eq('endorsee_id', userId);

    if (error) {
        console.error('Error fetching endorsements:', error);
        return [];
    }

    return data;
}
