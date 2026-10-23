import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/dashboard'

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            // Check if user needs onboarding (no profile/slug yet)
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data: profile } = await supabase
                    .from('users')
                    .select('public_slug')
                    .eq('id', user.id)
                    .single()

                if (!profile || !profile.public_slug) {
                    return NextResponse.redirect(`${origin}/onboarding`)
                }
            }

            return NextResponse.redirect(`${origin}${next}`)
        }
    }

    return NextResponse.redirect(`${origin}/login?error=true&message=${encodeURIComponent('Authentication failed. Please try again.')}`)
}

