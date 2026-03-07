'use server'

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function addSuggestion(pivotId: string, suggestionText: string) {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return { error: 'You must be logged in to leave a suggestion.' };
    }

    if (!suggestionText.trim()) {
        return { error: 'Suggestion cannot be empty.' };
    }

    const { error: insertError } = await supabase
        .from('suggestions')
        .insert({
            pivot_id: pivotId,
            suggester_id: user.id,
            suggestion_text: suggestionText.trim()
        });

    if (insertError) {
        console.error('Error adding suggestion:', insertError);
        return { error: 'Failed to add suggestion. Please try again.' };
    }

    // Revalidate paths where suggestions might be displayed
    revalidatePath('/explore');
    revalidatePath('/dashboard');
    revalidatePath(`/profile/[username]`, 'page');

    return { success: true };
}

export async function getSuggestions(pivotId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('suggestions')
        .select(`
            id,
            suggestion_text,
            created_at,
            pivot_id,
            suggester_id,
            users ( name, public_slug )
        `)
        .eq('pivot_id', pivotId)
        .order('created_at', { ascending: true }); // Chronological order

    if (error) {
        console.error('Error fetching suggestions:', error);
        return [];
    }

    return data;
}
