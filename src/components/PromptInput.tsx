import { useRef, useEffect } from 'react';
import { cn } from '../lib/utils';

interface Props {
  value: string;
  onChange: (v: string) => void;
  tokenCount: number;
  charCount: number;
  tokenizerReady: boolean;
  isDark: boolean;
}

export function PromptInput({ value, onChange, tokenCount, charCount, tokenizerReady, isDark }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.max(200, el.scrollHeight) + 'px';
  }, [value]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium opacity-70">Prompt Input</label>
        <div className="flex items-center gap-3 text-xs opacity-60">
          {!tokenizerReady && (
            <span className="text-yellow-400">⚡ Approx.</span>
          )}
          <span>{charCount.toLocaleString()} chars</span>
          <span className="opacity-40">·</span>
          <span className="font-mono font-semibold text-blue-400">{tokenCount.toLocaleString()} tokens</span>
        </div>
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste your prompt here..."
        className={cn(
          'w-full resize-none rounded-lg border p-4 text-sm leading-relaxed outline-none transition-colors',
          'font-mono placeholder:font-sans placeholder:opacity-40',
          'min-h-[200px]',
          isDark
            ? 'bg-slate-900 border-slate-700 text-slate-100 focus:border-blue-500'
            : 'bg-white border-slate-200 text-slate-900 focus:border-blue-500',
        )}
        style={{ height: 'auto', minHeight: '200px' }}
      />
    </div>
  );
}
