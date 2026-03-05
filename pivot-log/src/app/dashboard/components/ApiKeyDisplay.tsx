'use client';

import { useState } from 'react';
import { Key, Copy, CheckCircle, Eye, EyeOff } from 'lucide-react';

export function ApiKeyDisplay({ apiKey }: { apiKey: string }) {
    const [copied, setCopied] = useState(false);
    const [revealed, setRevealed] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(apiKey);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = apiKey;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const maskedKey = apiKey.slice(0, 8) + '••••••••••••••••••••' + apiKey.slice(-4);

    return (
        <div className="font-mono text-xs border border-zinc-800 bg-black p-3">
            <div className="text-zinc-500 mb-2 uppercase tracking-widest font-bold flex items-center gap-2">
                <Key className="w-3 h-3 text-amber-500" />
                MCP / API Key:
            </div>
            <div className="flex items-center gap-2">
                <code className="text-amber-500/90 bg-zinc-900/50 px-2 py-1 border border-zinc-800 flex-1 truncate select-all">
                    {revealed ? apiKey : maskedKey}
                </code>
                <button
                    onClick={() => setRevealed(!revealed)}
                    className="p-1.5 border border-zinc-800 bg-zinc-900 hover:border-zinc-600 text-zinc-400 hover:text-white transition-colors"
                    title={revealed ? 'Hide key' : 'Reveal key'}
                >
                    {revealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
                <button
                    onClick={handleCopy}
                    className={`p-1.5 border transition-colors ${copied
                            ? 'border-green-500/50 bg-green-500/10 text-green-500'
                            : 'border-zinc-800 bg-zinc-900 hover:border-zinc-600 text-zinc-400 hover:text-white'
                        }`}
                    title="Copy to clipboard"
                >
                    {copied ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
            </div>
            <p className="text-zinc-600 mt-2 text-[10px] uppercase tracking-wider">
                Use this key to connect Antigravity MCP or VS Code extension.
            </p>
        </div>
    );
}
