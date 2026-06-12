import { Sun, Moon } from 'lucide-react';

interface Props {
  isDark: boolean;
  onToggle: () => void;
}

export function ThemeToggle({ isDark, onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-2 rounded-lg border border-current/20 px-3 py-1.5 text-sm opacity-70 hover:opacity-100 transition-opacity"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <Sun size={14} /> : <Moon size={14} />}
      {isDark ? 'Light' : 'Dark'}
    </button>
  );
}
