import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCostColor(total: number): string {
  if (total < 0.001) return 'text-green-400';
  if (total < 0.01) return 'text-yellow-400';
  return 'text-red-400';
}

export function getCostBg(total: number): string {
  if (total < 0.001) return 'bg-green-500/10 border-green-500/30';
  if (total < 0.01) return 'bg-yellow-500/10 border-yellow-500/30';
  return 'bg-red-500/10 border-red-500/30';
}

export function formatNumber(n: number): string {
  return n.toLocaleString();
}
