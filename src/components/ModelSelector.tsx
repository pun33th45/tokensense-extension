import { MODELS, type ModelConfig } from '../config/models';
import { cn } from '../lib/utils';

interface Props {
  selectedId: string;
  onSelect: (id: string) => void;
  isDark: boolean;
}

const PROVIDER_ORDER = ['OpenAI', 'Anthropic', 'Google', 'Together AI'];

export function ModelSelector({ selectedId, onSelect, isDark }: Props) {
  const grouped: Record<string, ModelConfig[]> = {};
  for (const m of MODELS) {
    if (!grouped[m.provider]) grouped[m.provider] = [];
    grouped[m.provider].push(m);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium opacity-70">Model</label>
        <span className="text-xs opacity-40">Prices last updated: June 2025</span>
      </div>
      <select
        value={selectedId}
        onChange={(e) => onSelect(e.target.value)}
        className={cn(
          'w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors cursor-pointer',
          isDark
            ? 'bg-slate-900 border-slate-700 text-slate-100 focus:border-blue-500'
            : 'bg-white border-slate-200 text-slate-900 focus:border-blue-500',
        )}
      >
        {PROVIDER_ORDER.map((provider) =>
          grouped[provider] ? (
            <optgroup key={provider} label={provider}>
              {grouped[provider].map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} — ${m.inputPricePerM}/M in · ${m.outputPricePerM}/M out
                </option>
              ))}
            </optgroup>
          ) : null,
        )}
      </select>
    </div>
  );
}
