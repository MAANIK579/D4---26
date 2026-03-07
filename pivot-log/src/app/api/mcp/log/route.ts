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
        const { initial_goal, the_wall, domain } = body;

        if (!initial_goal || !the_wall || !domain) {
            return NextResponse.json(
                { error: 'Missing required fields: initial_goal, the_wall, domain' },
                { status: 400 }
            );
        }

        // 4. Insert the new pivot log
        const { data: pivot, error: insertError } = await supabase
            .from('pivots')
            .insert({
                user_id: user.id,
                initial_goal,
                the_wall,
                domain,
                status: 'In Progress',
            })
            .select('id')
            .single();

        if (insertError) {
            console.error('MCP Log Insert Error:', insertError);
            return NextResponse.json(
                { error: 'Failed to create log entry.', details: insertError.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { success: true, log_id: pivot.id },
            { status: 201 }
        );
    } catch (error) {
        console.error('MCP Log API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error.' },
            { status: 500 }
        );
    }
}
