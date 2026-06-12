import { useState, useEffect, useRef } from 'react';
import { type ModelConfig, calcInputCost, calcOutputCost, formatCost } from '../config/models';
import { getCostColor, cn } from '../lib/utils';

interface Props {
  inputTokens: number;
  model: ModelConfig;
  isDark: boolean;
  onCalculate: (outputTokens: number) => void;
}

function AnimatedValue({ value }: { value: string }) {
  const [key, setKey] = useState(0);
  const prevRef = useRef(value);

  useEffect(() => {
    if (prevRef.current !== value) {
      setKey((k) => k + 1);
      prevRef.current = value;
    }
  }, [value]);

  return (
    <span key={key} className="animate-count font-mono font-semibold">
      {value}
    </span>
  );
}

export function CostBreakdown({ inputTokens, model, isDark, onCalculate }: Props) {
  const [outputTokens, setOutputTokens] = useState(500);

  const inputCost = calcInputCost(inputTokens, model);
  const outputCost = calcOutputCost(outputTokens, model);
  const totalCost = inputCost + outputCost;

  const cardCls = cn(
    'rounded-xl border p-4 flex flex-col gap-1',
    isDark ? 'bg-slate-900/60 border-slate-700/60' : 'bg-white border-slate-200',
  );

  const labelCls = 'text-xs opacity-50 uppercase tracking-wide';
  const valueCls = `text-lg ${getCostColor(totalCost)}`;

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold opacity-70 uppercase tracking-wide">Cost Breakdown</h3>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className={cardCls}>
          <span className={labelCls}>Input Tokens</span>
          <AnimatedValue value={inputTokens.toLocaleString()} />
        </div>
        <div className={cardCls}>
          <span className={labelCls}>Input Cost</span>
          <span className={valueCls}>
            <AnimatedValue value={formatCost(inputCost)} />
          </span>
        </div>
      </div>

      {/* Output slider */}
      <div className={cn('rounded-xl border p-4 flex flex-col gap-3', isDark ? 'bg-slate-900/60 border-slate-700/60' : 'bg-white border-slate-200')}>
        <div className="flex items-center justify-between">
          <span className={labelCls}>Output Tokens</span>
          <span className="text-sm font-mono font-semibold text-blue-400">{outputTokens.toLocaleString()}</span>
        </div>
        <input
          type="range"
          min={50}
          max={4000}
          step={50}
          value={outputTokens}
          onChange={(e) => {
            const v = Number(e.target.value);
            setOutputTokens(v);
            onCalculate(v);
          }}
          className="w-full accent-blue-500 cursor-pointer"
        />
        <div className="flex justify-between text-xs opacity-40">
          <span>50</span>
          <span>4,000</span>
        </div>
      </div>

      {/* Output + Total */}
      <div className="grid grid-cols-2 gap-3">
        <div className={cardCls}>
          <span className={labelCls}>Output Cost</span>
          <span className={valueCls}>
            <AnimatedValue value={formatCost(outputCost)} />
          </span>
        </div>
        <div className={cn(cardCls, 'col-span-1')}>
          <span className={labelCls}>Total Cost</span>
          <span className={`text-xl font-bold ${getCostColor(totalCost)}`}>
            <AnimatedValue value={formatCost(totalCost)} />
          </span>
        </div>
      </div>
    </div>
  );
}
