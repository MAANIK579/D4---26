import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';

export async function POST(request: NextRequest) {
    try {
        // 1. Validate Authorization header
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'Missing or invalid Authorization header. Expected: Bearer <API_KEY>' },
                { status: 401 }
            );
        }

        const apiKey = authHeader.replace('Bearer ', '').trim();
        if (!apiKey) {
            return NextResponse.json(
                { error: 'API key is empty.' },
                { status: 401 }
            );
        }

        // 2. Look up the user by api_key
        const supabase = createAdminClient();
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('id')
            .eq('api_key', apiKey)
            .single();

        if (userError || !user) {
            return NextResponse.json(
                { error: 'Invalid API key. No user found.' },
                { status: 401 }
            );
        }

        // 3. Parse and validate request body
        const body = await request.json();
        const { log_id, the_pivot } = body;

        if (!log_id || !the_pivot) {
            return NextResponse.json(
                { error: 'Missing required fields: log_id, the_pivot' },
                { status: 400 }
            );
        }

        // 4. Update the pivot — only if it belongs to this user
        const { data: pivot, error: updateError } = await supabase
            .from('pivots')
            .update({
                the_pivot,
                status: 'Resolved',
                resolved_at: new Date().toISOString(),
            })
            .match({ id: log_id, user_id: user.id })
            .select('id')
            .single();

        if (updateError || !pivot) {
            return NextResponse.json(
                { error: 'Failed to resolve log. It may not exist or you may not own it.', details: updateError?.message },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, log_id: pivot.id },
            { status: 200 }
        );
    } catch (error) {
        console.error('MCP Resolve API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error.' },
            { status: 500 }
        );
    }
}
