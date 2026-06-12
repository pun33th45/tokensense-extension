import { useState } from 'react';
import { Wand2, Copy, Check } from 'lucide-react';
import { optimizePrompt } from '../config/optimizer';
import { cn } from '../lib/utils';

interface Props {
  prompt: string;
  tokenCount: number;
  countTokens: (text: string) => number;
  onApply: (optimized: string) => void;
  isDark: boolean;
}

export function PromptOptimizer({ prompt, tokenCount, countTokens, onApply, isDark }: Props) {
  const [result, setResult] = useState<{ text: string; tokens: number } | null>(null);
  const [copied, setCopied] = useState(false);

  function handleOptimize() {
    const optimized = optimizePrompt(prompt);
    const tokens = countTokens(optimized);
    setResult({ text: optimized, tokens });
  }

  async function handleCopy() {
    if (!result) return;
    await navigator.clipboard.writeText(result.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const saved = result ? tokenCount - result.tokens : 0;
  const pct = tokenCount > 0 && result ? Math.round((saved / tokenCount) * 100) : 0;

  const btnCls = cn(
    'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
    isDark
      ? 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border border-purple-500/30'
      : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200',
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold opacity-70 uppercase tracking-wide">Prompt Optimizer</h3>
        <button onClick={handleOptimize} disabled={!prompt} className={cn(btnCls, !prompt && 'opacity-40 cursor-not-allowed')}>
          <Wand2 size={14} />
          Optimize
        </button>
      </div>

      {result && (
        <div className={cn(
          'rounded-xl border p-4 flex flex-col gap-3',
          isDark ? 'bg-slate-900/60 border-slate-700/60' : 'bg-white border-slate-200',
        )}>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex flex-col">
              <span className="text-xs opacity-50">Before</span>
              <span className="font-mono font-semibold">{tokenCount.toLocaleString()} tokens</span>
            </div>
            <span className="opacity-30">→</span>
            <div className="flex flex-col">
              <span className="text-xs opacity-50">After</span>
              <span className="font-mono font-semibold text-green-400">{result.tokens.toLocaleString()} tokens</span>
            </div>
            {saved > 0 && (
              <div className="ml-auto">
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full font-semibold">
                  -{pct}% saved
                </span>
              </div>
            )}
            {saved <= 0 && (
              <span className="ml-auto text-xs opacity-50">No savings found</span>
            )}
          </div>

          {saved > 0 && (
            <>
              <div className={cn(
                'rounded-lg p-3 text-xs font-mono leading-relaxed max-h-32 overflow-y-auto',
                isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-50 text-slate-600',
              )}>
                {result.text}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onApply(result.text)}
                  className={cn(
                    'flex-1 rounded-lg py-1.5 text-sm font-medium transition-colors',
                    isDark
                      ? 'bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 border border-blue-500/30'
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200',
                  )}
                >
                  Apply
                </button>
                <button onClick={handleCopy} className={cn(
                  'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                  isDark ? 'bg-slate-800 hover:bg-slate-700 border border-slate-700' : 'bg-slate-100 hover:bg-slate-200 border border-slate-200',
                )}>
                  {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
