import Link from 'next/link';
import { Terminal } from 'lucide-react';
import { login, signup } from './actions';
import { AnimatedTerminal } from './animated-terminal';
import { OAuthButtons } from './oauth-buttons';
export default async function LoginPage(
    props: {
        searchParams: Promise<{ [key: string]: string | string[] | undefined }>
    }
) {
    const searchParams = await props.searchParams;
    const message = typeof searchParams.message === 'string' ? searchParams.message : null;
    const isError = searchParams.error !== 'false';

    return (
        <div className="flex min-h-screen relative overflow-hidden bg-[#0A0A0A] font-mono selection:bg-green-500/30 text-white">
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

            <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 z-10 w-full lg:w-1/2">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <Link href="/" className="flex items-center gap-3 mb-8 hover:opacity-80 transition-opacity w-fit">
                        <Terminal className="w-6 h-6 text-green-500" />
                        <span className="text-xl font-bold tracking-tight text-white uppercase tracking-widest">PivotLog<span className="animate-pulse text-green-500">_</span></span>
                    </Link>

                    <h2 className="mt-8 text-3xl font-black uppercase tracking-tight text-white">
                        [ SYSTEM AUTH ]
                    </h2>
                    <p className="mt-2 text-sm text-zinc-400 border-l-2 border-green-500 pl-3">
                        Authenticate or initialize new resilience logs.
                    </p>

                    {message && (
                        <div className={`mt-6 p-4 relative animate-in fade-in duration-300 border ${isError ? 'bg-red-500/10 border-red-500/50' : 'bg-green-500/10 border-green-500/50'}`}>
                            <div className={`absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r ${isError ? 'from-red-500' : 'from-green-500'} to-transparent`} />
                            <div className="flex items-start gap-3">
                                <Terminal className={`w-5 h-5 shrink-0 mt-0.5 ${isError ? 'text-red-500' : 'text-green-500'}`} />
                                <div>
                                    <h3 className={`text-sm font-bold uppercase tracking-widest ${isError ? 'text-red-500' : 'text-green-500'}`}>
                                        {isError ? '[ AUTH_ERROR ]' : '[ SYSTEM_NOTICE ]'}
                                    </h3>
                                    <p className={`text-sm mt-1 ${isError ? 'text-red-400' : 'text-green-400'}`}>{message}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-10">
                        <div>
                            <form action={login} className="space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-bold uppercase tracking-wider text-zinc-400">
                                        &gt; Email address
                                    </label>
                                    <div className="mt-2 text-green-500">
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            className="block w-full rounded-none border border-zinc-800 bg-black py-2 md:py-1.5 text-green-500 font-mono shadow-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 sm:text-sm sm:leading-6 px-3 placeholder:text-zinc-700"
                                            placeholder="user@domain.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-bold uppercase tracking-wider text-zinc-400">
                                        &gt; Password
                                    </label>
                                    <div className="mt-2 text-green-500">
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            autoComplete="current-password"
                                            required
                                            className="block w-full rounded-none border border-zinc-800 bg-black py-2 md:py-1.5 text-green-500 font-mono shadow-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 sm:text-sm sm:leading-6 px-3"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <input
                                            id="remember-me"
                                            name="remember-me"
                                            type="checkbox"
                                            className="h-4 w-4 rounded-none border-zinc-800 bg-black text-green-500 focus:ring-green-500 focus:ring-offset-black"
                                        />
                                        <label htmlFor="remember-me" className="ml-3 block text-sm leading-6 text-zinc-400">
                                            Keep session active
                                        </label>
                                    </div>

                                    <div className="text-sm leading-6">
                                        <a href="#" className="font-semibold text-green-500 hover:text-green-400">
                                            Reset Credentials?
                                        </a>
                                    </div>
                                </div>

                                <div>
                                    <button
                                        formAction={login}
                                        type="submit"
                                        className="flex w-full justify-center bg-green-500 px-3 py-2 text-sm font-black uppercase tracking-widest text-black shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:bg-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500 transition-colors mb-4"
                                    >
                                        Execute Login_
                                    </button>
                                    <button
                                        formAction={signup}
                                        type="submit"
                                        className="flex w-full justify-center border-2 border-green-500 bg-transparent px-3 py-2 text-sm font-black uppercase tracking-widest text-green-500 hover:bg-green-500/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500 transition-colors"
                                    >
                                        Initialize User_
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="mt-10">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                    <div className="w-full border-t border-white/10" />
                                </div>
                                <div className="relative flex justify-center text-sm font-medium leading-6">
                                    <span className="bg-[#0A0A0A] px-6 text-zinc-500 uppercase text-xs tracking-widest">Or Auth Via</span>
                                </div>
                            </div>

                            <OAuthButtons />
                        </div>
                    </div>
                </div>
            </div>

            <AnimatedTerminal />
        </div>
    );
}
