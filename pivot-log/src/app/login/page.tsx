import Link from 'next/link';
import { Terminal, Github } from 'lucide-react';
import { login, signup } from './actions';
import { AnimatedTerminal } from './animated-terminal';
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

                            <div className="mt-6 grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    className="flex w-full items-center justify-center gap-3 border border-zinc-800 bg-black px-3 py-2 text-sm font-semibold text-zinc-300 hover:border-zinc-500 hover:text-white transition-colors focus-visible:ring-transparent group"
                                >
                                    <Github className="h-5 w-5 group-hover:text-white text-zinc-400" />
                                    <span className="text-sm font-bold uppercase tracking-wider leading-6">GitHub</span>
                                </button>
                                <button
                                    type="button"
                                    className="flex w-full items-center justify-center gap-3 border border-zinc-800 bg-black px-3 py-2 text-sm font-semibold text-zinc-300 hover:border-zinc-500 hover:text-white transition-colors focus-visible:ring-transparent grayscale hover:grayscale-0"
                                >
                                    <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                                        <path
                                            d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                                            fill="#EA4335"
                                        />
                                        <path
                                            d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                                            fill="#4285F4"
                                        />
                                        <path
                                            d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                                            fill="#FBBC05"
                                        />
                                        <path
                                            d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.87037 19.245 6.21537 17.135 5.26538 14.29L1.27539 17.385C3.25539 21.31 7.31037 24.0001 12.0004 24.0001Z"
                                            fill="#34A853"
                                        />
                                    </svg>
                                    <span className="text-sm font-bold uppercase tracking-wider leading-6">Google</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AnimatedTerminal />
        </div>
    );
}
