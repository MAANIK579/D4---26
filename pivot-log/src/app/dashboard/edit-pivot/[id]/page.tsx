import { Terminal, Zap } from 'lucide-react';
import { updatePivotWithResolve } from '../../../actions/pivot';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function EditPivotPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data: pivot, error } = await supabase
        .from('pivots')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

    if (error || !pivot) {
        redirect('/dashboard');
    }

    // Can only edit 'in progress' pivots
    if (pivot.status === 'Resolved') {
        redirect('/dashboard');
    }

    // Bind ID to action using hidden input or bind
    const updateAction = updatePivotWithResolve.bind(null, id);

    return (
        <div className="p-4 sm:p-8 max-w-4xl mx-auto font-mono selection:bg-green-500/30">
            <div className="mb-8 border-b border-zinc-800 pb-6">
                <h1 className="text-2xl font-black text-white flex items-center gap-3 uppercase tracking-tighter">
                    <Terminal className="w-6 h-6 text-green-500" />
                    [ EXECUTE: PIVOT ]
                </h1>
                <p className="text-zinc-500 mt-2 text-sm">How did you resolve the error? Document the breakthrough.</p>
            </div>

            <div className="bg-black border border-red-500/30 p-6 mb-8 shadow-lg">
                <h2 className="text-xs uppercase tracking-widest text-red-500 font-bold mb-4 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    The Wall
                </h2>
                <div className="text-xl text-white font-bold tracking-tight mb-2">{pivot.initial_goal}</div>
                <div className="text-sm text-zinc-400 border-l-2 border-red-500/50 pl-3 py-1 whitespace-pre-wrap">
                    {pivot.the_wall}
                </div>
            </div>

            <form action={updateAction} className="space-y-8 bg-black border-2 border-green-500/30 p-8 shadow-[0_0_30px_rgba(34,197,94,0.05)] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-[50px] pointer-events-none" />

                <div>
                    <label htmlFor="the_pivot" className="block text-sm font-bold uppercase tracking-widest text-green-500">
                        &gt; The_Pivot (Breakthrough)
                    </label>
                    <p className="text-xs text-zinc-500 mb-2 mt-1">What did you change? What did you learn?</p>
                    <textarea
                        id="the_pivot"
                        name="the_pivot"
                        required
                        rows={6}
                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-none px-4 py-3 text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors placeholder:text-zinc-700"
                        placeholder="e.g. Read the raw body as a buffer before Next.js body parser consumed it..."
                        defaultValue={pivot.the_pivot || ""}
                    />
                </div>

                <div className="flex justify-end pt-6 border-t border-zinc-800">
                    <button
                        type="submit"
                        className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black px-8 py-3 font-black uppercase tracking-widest transition-colors shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                    >
                        <Terminal className="w-5 h-5" />
                        Execute Pivot_
                    </button>
                </div>
            </form>
        </div>
    );
}
