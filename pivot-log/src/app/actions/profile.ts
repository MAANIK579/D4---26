'use server'

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function updateProfile(formData: FormData) {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        redirect('/login');
    }

    const name = formData.get('name') as string;
    const public_slug = formData.get('public_slug') as string;
    const bio = formData.get('bio') as string;
    const github_url = formData.get('github_url') as string;
    const linkedin_url = formData.get('linkedin_url') as string;
    const website_url = formData.get('website_url') as string;

    // Validate minimum requirements
    if (!public_slug || public_slug.trim() === '') {
        return { error: 'Public slug is required' };
    }

    // Check if slug is taken by someone else
    const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('public_slug', public_slug)
        .not('id', 'eq', user.id)
        .single();

    if (existingUser) {
        return { error: 'This slug is already taken' };
    }

    const updates = {
        name,
        public_slug: public_slug.toLowerCase().replace(/[^a-z0-9_-]/g, ''), // strict format
        bio,
        github_url,
        linkedin_url,
        website_url,
    };

    const { error: dbError } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id);

    if (dbError) {
        console.error('Update Profile DB Error:', dbError);
        return { error: `Failed to update user profile: ${dbError.message}` };
    }

    revalidatePath('/', 'layout');
    revalidatePath(`/profile/${public_slug}`);

    redirect('/dashboard');
}
