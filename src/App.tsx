import { useState, useEffect, useCallback, useRef } from 'react';
import { BarChart3, GitCompare } from 'lucide-react';
import { PromptInput } from './components/PromptInput';
import { ModelSelector } from './components/ModelSelector';
import { CostBreakdown } from './components/CostBreakdown';
import { CompareTable } from './components/CompareTable';
import { PromptOptimizer } from './components/PromptOptimizer';
import { SessionHistory } from './components/SessionHistory';
import { ShareCard } from './components/ShareCard';
import { ThemeToggle } from './components/ThemeToggle';
import { useTokenizer } from './hooks/useTokenizer';
import { useHistory } from './hooks/useHistory';
import { DEFAULT_MODEL_ID, getModel } from './config/models';
import { cn } from './lib/utils';

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [prompt, setPrompt] = useState('');
  const [modelId, setModelId] = useState(DEFAULT_MODEL_ID);
  const [compareMode, setCompareMode] = useState(false);
  const [outputTokens, setOutputTokens] = useState(500);

  const { countTokens, tokenizerReady } = useTokenizer();
  const { history, addEntry, clearHistory, sessionTotal } = useHistory();

  const tokenCount = countTokens(prompt);
  const charCount = prompt.length;
  const model = getModel(modelId);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove('light');
    } else {
      root.classList.add('light');
    }
  }, [isDark]);

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handlePromptChange = useCallback((text: string) => {
    setPrompt(text);
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    if (text.trim().length > 20) {
      saveTimerRef.current = setTimeout(() => {
        const tokens = countTokens(text);
        const m = getModel(modelId);
        const inputCost = (tokens / 1_000_000) * m.inputPricePerM;
        const outCost = (outputTokens / 1_000_000) * m.outputPricePerM;
        addEntry({
          model: m.id,
          modelName: m.name,
          inputTokens: tokens,
          outputTokens,
          totalCost: inputCost + outCost,
          promptSnippet: text.slice(0, 60),
        });
      }, 2000);
    }
  }, [countTokens, modelId, outputTokens, addEntry]);

  const bgCls = isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900';
  const panelCls = cn(
    'rounded-2xl border p-5 flex flex-col gap-5',
    isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200',
  );

  return (
    <div className={cn('min-h-screen', bgCls)}>
      <header className={cn(
        'sticky top-0 z-10 border-b backdrop-blur-sm',
        isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-white/80 border-slate-200',
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
              <BarChart3 size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold leading-none">TokenSense</h1>
              <p className="text-xs opacity-40 leading-none mt-0.5">AI prompt cost estimator</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCompareMode((v) => !v)}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors border',
                compareMode
                  ? 'bg-blue-500 text-white border-blue-500'
                  : isDark
                  ? 'bg-transparent text-slate-300 border-slate-700 hover:border-slate-500'
                  : 'bg-transparent text-slate-600 border-slate-200 hover:border-slate-400',
              )}
            >
              <GitCompare size={14} />
              Compare All
            </button>
            <ThemeToggle isDark={isDark} onToggle={() => setIsDark((v) => !v)} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* LEFT PANEL */}
          <div className="flex flex-col gap-5">
            <div className={panelCls}>
              <PromptInput
                value={prompt}
                onChange={handlePromptChange}
                tokenCount={tokenCount}
                charCount={charCount}
                tokenizerReady={tokenizerReady}
                isDark={isDark}
              />
              <ModelSelector
                selectedId={modelId}
                onSelect={setModelId}
                isDark={isDark}
              />
            </div>

            <div className={panelCls}>
              <PromptOptimizer
                prompt={prompt}
                tokenCount={tokenCount}
                countTokens={countTokens}
                onApply={setPrompt}
                isDark={isDark}
              />
            </div>

            <div className={panelCls}>
              <ShareCard
                prompt={prompt}
                model={model}
                inputTokens={tokenCount}
                outputTokens={outputTokens}
                isDark={isDark}
              />
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="flex flex-col gap-5">
            <div className={panelCls}>
              <CostBreakdown
                inputTokens={tokenCount}
                model={model}
                isDark={isDark}
                onCalculate={setOutputTokens}
              />
            </div>

            {compareMode && (
              <div className={panelCls}>
                <CompareTable
                  inputTokens={tokenCount}
                  outputTokens={outputTokens}
                  isDark={isDark}
                />
              </div>
            )}

            <div className={cn(
              'rounded-2xl border overflow-hidden',
              isDark ? 'border-slate-800' : 'border-slate-200',
            )}>
              <SessionHistory
                history={history}
                sessionTotal={sessionTotal}
                onClear={clearHistory}
                isDark={isDark}
              />
            </div>
          </div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-4 sm:px-6 py-6 mt-4 border-t border-current/10">
        <p className="text-center text-xs opacity-30">
          TokenSense · All calculations are client-side estimates · No data is sent anywhere
        </p>
      </footer>
    </div>
  );
}
