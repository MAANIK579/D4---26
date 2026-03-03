'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        console.error("LOGIN ERROR DETAILS:", error);
        redirect(`/login?error=true&message=${encodeURIComponent(error.message)}`)
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()
    const headersList = await headers()
    const origin = headersList.get('origin')

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        options: {
            emailRedirectTo: `${origin}/auth/callback`,
        },
    }

    const { error } = await supabase.auth.signUp(data)

    if (error) {
        console.error("SIGNUP ERROR DETAILS:", error);
        return redirect(`/login?error=true&message=${encodeURIComponent(error.message)}`)
    }

    // If email confirmation is ON, we should tell the user to check their email
    // instead of redirecting straight to the dashboard.
    return redirect('/login?error=false&message=Check your email to confirm your account.')
}