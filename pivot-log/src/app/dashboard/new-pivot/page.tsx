'use client';

import { Terminal, Save, Zap } from 'lucide-react';
import { createPivot } from './actions';
import { useState } from 'react';

export default function NewPivotPage() {
    const [frustration, setFrustration] = useState(5);

    return (
        <div className="p-4 sm:p-8 max-w-4xl mx-auto font-mono selection:bg-green-500/30">
            <div className="mb-8 border-b border-zinc-800 pb-6">
                <h1 className="text-2xl font-black text-white flex items-center gap-3 uppercase tracking-tighter">
                    <Terminal className="w-6 h-6 text-red-500" />
                    [ INIT: NEW_WALL ]
                </h1>
                <p className="text-zinc-500 mt-2 text-sm">Document an active failure state to establish your baseline.</p>
            </div>

            <form action={createPivot} className="space-y-8 bg-black border-2 border-zinc-800 p-8 shadow-2xl relative overflow-hidden group">
                {/* Decorative border glow */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-transparent opacity-50" />

                {/* The Goal */}
                <div>
                    <label htmlFor="initial_goal" className="block text-sm font-bold uppercase tracking-widest text-zinc-400">
                        &gt; Target_Objective
                    </label>
                    <p className="text-xs text-zinc-600 mb-2 mt-1">What were you trying to execute?</p>
                    <input
                        type="text"
                        id="initial_goal"
                        name="initial_goal"
                        required
                        className="w-full bg-black border border-zinc-800 rounded-none px-4 py-3 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                        placeholder="e.g. Implement OAuth Flow"
                    />
                </div>

                {/* The Wall */}
                <div>
                    <label htmlFor="the_wall" className="block text-sm font-bold uppercase tracking-widest text-zinc-400">
                        &gt; The_Wall (Error_State)
                    </label>
                    <p className="text-xs text-zinc-600 mb-2 mt-1">Dump the raw error, bug description, or rejection notice.</p>
                    <textarea
                        id="the_wall"
                        name="the_wall"
                        required
                        rows={5}
                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-none px-4 py-3 text-red-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors placeholder:text-red-900/50"
                        placeholder="[FATAL] Uncaught TypeError: undefined is not a function..."
                    />
                </div>

                {/* Frustration Level */}
                <div className="bg-zinc-900/30 border border-zinc-800 p-6">
                    <label htmlFor="frustration_level" className="block text-sm font-bold uppercase tracking-widest text-zinc-400 flex items-center justify-between">
                        <span className="flex items-center gap-2"><Zap className="w-4 h-4 text-yellow-500" /> System_Stress_Level</span>
                        <span className={`text-xl font-black ${frustration > 7 ? 'text-red-500' : frustration > 4 ? 'text-yellow-500' : 'text-green-500'}`}>
                            {frustration}/10
                        </span>
                    </label>
                    <input
                        type="range"
                        id="frustration_level"
                        name="frustration_level"
                        min="1"
                        max="10"
                        value={frustration}
                        onChange={(e) => setFrustration(parseInt(e.target.value))}
                        className="w-full mt-6 h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-red-500"
                    />
                    <div className="flex justify-between text-xs text-zinc-600 mt-2 uppercase tracking-widest font-bold">
                        <span>Minor Bug</span>
                        <span>Throwing Laptop</span>
                    </div>
                </div>

                {/* Domain & Status row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="domain" className="block text-sm font-bold uppercase tracking-widest text-zinc-400 mb-2 text-zinc-400">Domain_Tag</label>
                        <select
                            id="domain"
                            name="domain"
                            className="w-full bg-black border border-zinc-800 rounded-none px-4 py-3 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 [&>option]:bg-zinc-900"
                        >
                            <option value="Frontend">Frontend</option>
                            <option value="Backend">Backend</option>
                            <option value="Database">Database</option>
                            <option value="Infrastructure">Infrastructure</option>
                            <option value="Design">Design</option>
                            <option value="Logic">Logic/Algo</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="status" className="block text-sm font-bold uppercase tracking-widest text-zinc-400 mb-2">Current_State</label>
                        <select
                            id="status"
                            name="status"
                            className="w-full bg-black border border-zinc-800 rounded-none px-4 py-3 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 [&>option]:bg-zinc-900"
                        >
                            <option value="In Progress">Stuck (In Progress)</option>
                            <option value="Researching">Reading Docs (Researching)</option>
                        </select>
                    </div>
                </div>

                <div className="border border-zinc-800 p-4 bg-black">
                    <label htmlFor="evidence" className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Upload_Evidence (Optional Screenshot)</label>
                    <input
                        type="file"
                        id="evidence"
                        name="evidence"
                        accept="image/*"
                        className="w-full text-xs text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-0 file:text-xs file:font-bold file:uppercase file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 cursor-pointer"
                    />
                </div>

                <div className="flex justify-end pt-6 border-t border-zinc-800">
                    <button
                        type="submit"
                        className="flex items-center gap-2 bg-red-500 hover:bg-red-400 text-black px-8 py-3 font-black uppercase tracking-widest transition-colors shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                    >
                        <Terminal className="w-5 h-5" />
                        Log Failure
                    </button>
                </div>
            </form>
        </div>
    );
}
