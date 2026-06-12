import { useState, useEffect, useCallback } from 'react';

export interface HistoryEntry {
  id: string;
  timestamp: number;
  model: string;
  modelName: string;
  inputTokens: number;
  outputTokens: number;
  totalCost: number;
  promptSnippet: string;
}

const STORAGE_KEY = 'tokensense_history';
const MAX_ENTRIES = 10;

function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(entries: HistoryEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // ignore storage errors
  }
}

export function useHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>(loadHistory);

  useEffect(() => {
    saveHistory(history);
  }, [history]);

  const addEntry = useCallback((entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => {
    const newEntry: HistoryEntry = {
      ...entry,
      id: Math.random().toString(36).slice(2),
      timestamp: Date.now(),
    };
    setHistory((prev) => [newEntry, ...prev].slice(0, MAX_ENTRIES));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const sessionTotal = history.reduce((sum, e) => sum + e.totalCost, 0);

  return { history, addEntry, clearHistory, sessionTotal };
}
