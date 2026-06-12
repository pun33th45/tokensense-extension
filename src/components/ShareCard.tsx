import { useRef, useState } from 'react';
import { Download, Share2 } from 'lucide-react';
import { type ModelConfig, formatCost, calcInputCost, calcOutputCost, MODELS } from '../config/models';
import { cn } from '../lib/utils';

interface Props {
  prompt: string;
  model: ModelConfig;
  inputTokens: number;
  outputTokens: number;
  isDark: boolean;
}

export function ShareCard({ prompt, model, inputTokens, outputTokens, isDark }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [generating, setGenerating] = useState(false);

  const totalCost = calcInputCost(inputTokens, model) + calcOutputCost(outputTokens, model);

  const allCosts = MODELS.map((m) => ({
    name: m.name,
    total: calcInputCost(inputTokens, m) + calcOutputCost(outputTokens, m),
  })).sort((a, b) => a.total - b.total);

  const cheapest = allCosts[0];
  const priciest = allCosts[allCosts.length - 1];

  async function handleDownload() {
    if (!cardRef.current || generating) return;
    setGenerating(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: '#0f172a',
        useCORS: true,
      });
      const link = document.createElement('a');
      link.download = 'tokensense-card.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  }

  const snippet = prompt.slice(0, 100) + (prompt.length > 100 ? '…' : '');

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold opacity-70 uppercase tracking-wide">Share</h3>
        <button
          onClick={handleDownload}
          disabled={!prompt || generating}
          className={cn(
            'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
            isDark
              ? 'bg-slate-800 hover:bg-slate-700 border border-slate-700'
              : 'bg-slate-100 hover:bg-slate-200 border border-slate-200',
            (!prompt || generating) && 'opacity-40 cursor-not-allowed',
          )}
        >
          <Download size={14} />
          {generating ? 'Generating…' : 'Download PNG'}
        </button>
      </div>

      {/* Shareable card preview */}
      <div
        ref={cardRef}
        className="rounded-xl p-5 flex flex-col gap-4 bg-slate-900 border border-slate-700"
        style={{ minWidth: 320 }}
      >
        {/* Header */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center">
            <Share2 size={14} className="text-white" />
          </div>
          <span className="font-bold text-white text-sm">TokenSense</span>
          <span className="ml-auto text-xs text-slate-500">cost estimate</span>
        </div>

        {/* Prompt snippet */}
        {snippet && (
          <div className="rounded-lg bg-slate-800 p-3">
            <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">{snippet || 'No prompt entered'}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-slate-500">Model</span>
            <span className="text-sm font-semibold text-white">{model.name}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-slate-500">Tokens</span>
            <span className="text-sm font-semibold text-blue-400">{inputTokens.toLocaleString()}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-slate-500">Total Cost</span>
            <span className="text-sm font-semibold text-blue-400">{formatCost(totalCost)}</span>
          </div>
        </div>

        {/* Comparison */}
        <div className="flex gap-3">
          <div className="flex-1 rounded-lg bg-green-500/10 border border-green-500/20 p-2.5">
            <div className="text-xs text-green-400 font-medium">Cheapest</div>
            <div className="text-xs text-slate-300 mt-0.5">{cheapest.name}</div>
            <div className="text-sm font-mono font-bold text-green-400">{formatCost(cheapest.total)}</div>
          </div>
          <div className="flex-1 rounded-lg bg-red-500/10 border border-red-500/20 p-2.5">
            <div className="text-xs text-red-400 font-medium">Priciest</div>
            <div className="text-xs text-slate-300 mt-0.5">{priciest.name}</div>
            <div className="text-sm font-mono font-bold text-red-400">{formatCost(priciest.total)}</div>
          </div>
        </div>

        {/* Watermark */}
        <div className="text-center text-xs text-slate-600">
          Built with TokenSense · tokensense.app
        </div>
      </div>
    </div>
  );
}
