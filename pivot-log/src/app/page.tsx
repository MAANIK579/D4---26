import Link from 'next/link';
import { Terminal, GitCommit, ChevronRight, AlertCircle, CheckCircle2, Zap } from 'lucide-react';



export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] font-mono selection:bg-green-500/30 overflow-hidden relative">
      {/* Blueprint Grid Background Pattern */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #ffffff 1px, transparent 1px),
            linear-gradient(to bottom, #ffffff 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Terminal Glow Effects */}
      <div className="absolute top-1/4 -left-64 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-64 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Navigation */}
      <nav className="w-full px-8 py-6 flex items-center justify-between z-10 border-b border-white/5 bg-black/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Terminal className="w-6 h-6 text-green-500" />
          <span className="text-xl font-bold tracking-tight text-white uppercase tracking-widest">PivotLog<span className="animate-pulse text-green-500">_</span></span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors uppercase tracking-wider">
            [ Login ]
          </Link>
          <Link href="/login" className="text-sm font-bold bg-green-500 text-black px-5 py-2 hover:bg-green-400 transition-colors uppercase tracking-wider shadow-[0_0_15px_rgba(34,197,94,0.3)]">
            Run &gt;
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 z-10 py-24 sm:py-32">
        <div className="max-w-4xl mx-auto w-full">

          <div className="inline-flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-12 border border-white/10 p-4 bg-black/50 text-xs sm:text-sm text-zinc-400 w-full rounded-md font-mono">
            <span className="text-red-500 font-bold">ERROR:</span> Grades show the finish line. We show the marathon.
            <span className="text-green-500 hidden sm:inline ml-auto animate-pulse">Fixing...</span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white leading-[1.1] tracking-tighter uppercase mb-6 drop-shadow-lg">
            The <span className="text-green-500">Resume</span><br />
            Of Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-green-500">Resilience</span>.
          </h1>

          <p className="mt-6 text-xl sm:text-2xl text-zinc-400 max-w-2xl leading-relaxed border-l-4 border-green-500 pl-6">
            Stop hiding your mistakes.<br />
            Start proving you can solve any problem.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center gap-6">
            <Link href="/login" className="w-full sm:w-auto px-8 py-5 bg-green-500 hover:bg-green-400 text-black font-black uppercase tracking-widest transition-all shadow-[0_0_30px_rgba(34,197,94,0.4)] flex items-center justify-center gap-3 group">
              Start Your First Log
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <p className="text-sm text-zinc-500 italic">It's Free. Show the messy part.</p>
          </div>

        </div>
      </main>

      {/* The Problem / Solution Section */}
      <section className="border-y border-white/10 bg-zinc-950 px-4 py-24 sm:px-6 z-10 relative">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">

          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 text-red-500 text-xs font-bold uppercase tracking-wider border border-red-500/20">
              <AlertCircle className="w-4 h-4" />
              The "Perfect" Trap
            </div>
            <p className="text-zinc-300 text-lg">Standard resumes are a list of trophies. They tell employers <em className="text-white">what</em> you did, but not <em className="text-white">how</em> you did it.</p>
            <ul className="space-y-4 text-zinc-400">
              <li className="flex gap-3"><span className="text-red-500 font-bold">×</span> Traditional Education punishes the mistake.</li>
              <li className="flex gap-3"><span className="text-green-500 font-bold">✓</span> The Real World rewards the fix.</li>
            </ul>
            <p className="text-red-400 text-sm font-bold bg-red-500/5 p-4 border-l-2 border-red-500">RESULT: A generation afraid to take risks because they can't afford a "B".</p>
          </div>

          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-500 text-xs font-bold uppercase tracking-wider border border-green-500/20">
              <Zap className="w-4 h-4" />
              The Solution: PivotLog
            </div>
            <p className="text-zinc-300 text-lg">A digital space to document the bugs, the rejections, and the "I want to quit" moments—and exactly how you beat them.</p>
            <blockquote className="border-l-2 border-zinc-700 pl-4 text-zinc-500 italic">
              "The person who has failed 100 times and found 100 fixes is infinitely more valuable than the person who has never failed at all."
            </blockquote>
          </div>

        </div>
      </section>

      {/* How It Works Steps */}
      <section className="px-4 py-32 sm:px-6 z-10 max-w-5xl mx-auto w-full">
        <h2 className="text-3xl font-black text-white text-center uppercase tracking-widest mb-20">How It Executes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="p-8 border-2 border-zinc-800 bg-black hover:border-red-500/50 transition-colors relative group">
            <div className="absolute -top-5 left-8 bg-black px-2 text-red-500 font-bold text-xl">STEP 01</div>
            <h3 className="text-xl font-bold text-white mb-4 mt-2">Hit The Wall</h3>
            <p className="text-zinc-400">Stuck on a line of code? A design layout? A physics problem? Log it. Snap a photo of the error. Record your frustration. This is your baseline.</p>
          </div>
          <div className="p-8 border-2 border-zinc-800 bg-black hover:border-yellow-500/50 transition-colors relative group">
            <div className="absolute -top-5 left-8 bg-black px-2 text-yellow-500 font-bold text-xl">STEP 02</div>
            <h3 className="text-xl font-bold text-white mb-4 mt-2">Find The Pivot</h3>
            <p className="text-zinc-400">Document the "Aha!" moment. Did you read a doc? Ask a friend? Try 15 different things until one worked? Map the logic of your breakthrough.</p>
          </div>
          <div className="p-8 border-2 border-zinc-800 bg-black hover:border-green-500/50 transition-colors relative group">
            <div className="absolute -top-5 left-8 bg-black px-2 text-green-500 font-bold text-xl">STEP 03</div>
            <h3 className="text-xl font-bold text-white mb-4 mt-2">Prove The Growth</h3>
            <p className="text-zinc-400">Our dashboard turns logs into Resilience Analytics. Show recruiters a heatmap of your journey that proves you don't break when things get hard.</p>
          </div>
        </div>
      </section>

    </div>
  );
}
