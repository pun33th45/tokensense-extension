import { useState } from 'react';
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { type HistoryEntry } from '../hooks/useHistory';
import { formatCost } from '../config/models';
import { cn } from '../lib/utils';

interface Props {
  history: HistoryEntry[];
  sessionTotal: number;
  onClear: () => void;
  isDark: boolean;
}

export function SessionHistory({ history, sessionTotal, onClear, isDark }: Props) {
  const [open, setOpen] = useState(false);

  const containerCls = cn(
    'rounded-xl border overflow-hidden',
    isDark ? 'border-slate-700/60' : 'border-slate-200',
  );

  const headerCls = cn(
    'flex items-center justify-between px-4 py-3 cursor-pointer select-none',
    isDark ? 'bg-slate-900/60 hover:bg-slate-800/60' : 'bg-slate-50 hover:bg-slate-100',
  );

  return (
    <div className={containerCls}>
      <div className={headerCls} onClick={() => setOpen((v) => !v)}>
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold">Session History</h3>
          <span className={cn(
            'text-xs px-2 py-0.5 rounded-full',
            isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-200 text-slate-600',
          )}>
            {history.length}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {history.length > 0 && (
            <span className="text-xs font-mono text-blue-400">
              Total: {formatCost(sessionTotal)}
            </span>
          )}
          {open ? <ChevronUp size={16} className="opacity-50" /> : <ChevronDown size={16} className="opacity-50" />}
        </div>
      </div>

      {open && (
        <div>
          {history.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm opacity-40">
              No history yet. Start typing to track usage.
            </div>
          ) : (
            <>
              <div className="divide-y divide-current/5">
                {history.map((entry) => (
                  <div key={entry.id} className={cn(
                    'px-4 py-3 flex items-start justify-between gap-4',
                    isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50',
                  )}>
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="text-xs font-medium truncate opacity-80">{entry.modelName}</span>
                      {entry.promptSnippet && (
                        <span className="text-xs opacity-40 truncate">{entry.promptSnippet}</span>
                      )}
                      <span className="text-xs opacity-40">
                        {new Date(entry.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                      <span className="text-xs font-mono opacity-60">{entry.inputTokens.toLocaleString()} tok</span>
                      <span className="text-sm font-mono font-semibold text-blue-400">
                        {formatCost(entry.totalCost)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className={cn(
                'px-4 py-3 flex items-center justify-between border-t',
                isDark ? 'border-slate-700/60 bg-slate-900/40' : 'border-slate-100 bg-slate-50',
              )}>
                <span className="text-xs opacity-50">Session total</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono font-semibold text-blue-400">
                    {formatCost(sessionTotal)}
                  </span>
                  <button
                    onClick={onClear}
                    className="flex items-center gap-1 text-xs opacity-50 hover:opacity-80 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={12} />
                    Clear
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
