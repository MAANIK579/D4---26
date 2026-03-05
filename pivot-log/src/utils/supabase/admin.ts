import { createClient } from '@supabase/supabase-js';

/**
 * Creates a Supabase admin client using the service role key.
 * This bypasses RLS and should ONLY be used in server-side API routes.
 * Never import this on the client side.
 */
export function createAdminClient() {
    let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    if (supabaseUrl && !supabaseUrl.startsWith('http://') && !supabaseUrl.startsWith('https://')) {
        supabaseUrl = `https://${supabaseUrl}`;
    }

    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey) {
        throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set in environment variables.');
    }

    return createClient(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}
