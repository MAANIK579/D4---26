'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createPivot(formData: FormData) {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        redirect('/login')
    }

    const initial_goal = formData.get('initial_goal') as string
    const the_wall = formData.get('the_wall') as string
    const the_pivot = formData.get('the_pivot') as string
    const domain = formData.get('domain') as string
    const status = formData.get('status') as string
    const evidenceFile = formData.get('evidence') as File | null

    let evidence_url = null

    // Handle file upload
    if (evidenceFile && evidenceFile.size > 0) {
        const fileExt = evidenceFile.name.split('.').pop()
        const fileName = `${user.id}/${Math.random()}.${fileExt}`

        const { error: uploadError, data: uploadData } = await supabase.storage
            .from('evidence')
            .upload(fileName, evidenceFile)

        if (uploadError) {
            console.error('Upload Error:', uploadError)
            // For now, continue saving the pivot even if evidence fails to upload
        } else if (uploadData) {
            const { data: publicUrlData } = supabase.storage
                .from('evidence')
                .getPublicUrl(uploadData.path)
            evidence_url = publicUrlData.publicUrl
        }
    }

    const isResolved = status === 'Resolved'

    const { error: dbError } = await supabase
        .from('pivots')
        .insert({
            user_id: user.id,
            initial_goal,
            the_wall,
            the_pivot: the_pivot || null,
            domain,
            status,
            evidence_url,
            resolved_at: isResolved ? new Date().toISOString() : null,
        })

    if (dbError) {
        console.error('DB Error:', dbError)
        redirect('/dashboard/new-pivot?error=Failed to save pivot')
    }

    revalidatePath('/dashboard')
    revalidatePath(`/${user.id}`) // In reality, we revalidate the public URL

    redirect('/dashboard');
}
