import { MODELS, calcInputCost, calcOutputCost, formatCost } from '../config/models';
import { cn } from '../lib/utils';

interface Props {
  inputTokens: number;
  outputTokens: number;
  isDark: boolean;
}

export function CompareTable({ inputTokens, outputTokens, isDark }: Props) {
  const rows = MODELS.map((m) => {
    const inputCost = calcInputCost(inputTokens, m);
    const outputCost = calcOutputCost(outputTokens, m);
    const totalCost = inputCost + outputCost;
    return { model: m, inputCost, outputCost, totalCost };
  }).sort((a, b) => a.totalCost - b.totalCost);

  const minTotal = rows[0].totalCost;
  const maxTotal = rows[rows.length - 1].totalCost;

  const thCls = 'text-left text-xs font-medium uppercase tracking-wide opacity-50 pb-2 pr-4';
  const tdCls = 'py-2.5 pr-4 text-sm';

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold opacity-70 uppercase tracking-wide">Compare All Models</h3>
      <div className={cn(
        'rounded-xl border overflow-hidden',
        isDark ? 'border-slate-700' : 'border-slate-200',
      )}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={isDark ? 'bg-slate-800/60' : 'bg-slate-50'}>
              <tr>
                <th className={cn(thCls, 'pl-4')}>Model</th>
                <th className={thCls}>Provider</th>
                <th className={thCls}>Input Cost</th>
                <th className={thCls}>Output Cost</th>
                <th className={cn(thCls, 'pr-4')}>Total</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ model, inputCost, outputCost, totalCost }) => {
                const isCheapest = totalCost === minTotal;
                const isExpensive = totalCost === maxTotal && minTotal !== maxTotal;
                const rowCls = cn(
                  'border-t transition-colors',
                  isDark ? 'border-slate-700/50' : 'border-slate-100',
                  isCheapest && 'bg-green-500/10',
                  isExpensive && 'bg-red-500/10',
                  !isCheapest && !isExpensive && (isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'),
                );
                return (
                  <tr key={model.id} className={rowCls}>
                    <td className={cn(tdCls, 'pl-4 font-medium')}>
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: model.color }}
                        />
                        {model.name}
                        {isCheapest && (
                          <span className="text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full">
                            cheapest
                          </span>
                        )}
                        {isExpensive && (
                          <span className="text-xs bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full">
                            priciest
                          </span>
                        )}
                      </div>
                    </td>
                    <td className={cn(tdCls, 'opacity-60')}>{model.provider}</td>
                    <td className={cn(tdCls, 'font-mono text-xs')}>{formatCost(inputCost)}</td>
                    <td className={cn(tdCls, 'font-mono text-xs')}>{formatCost(outputCost)}</td>
                    <td className={cn(
                      tdCls,
                      'pr-4 font-mono font-semibold',
                      isCheapest ? 'text-green-400' : isExpensive ? 'text-red-400' : 'text-yellow-400',
                    )}>
                      {formatCost(totalCost)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
