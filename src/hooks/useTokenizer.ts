import { useState, useEffect, useRef, useCallback } from 'react';

// We use a simple approximation when tiktoken isn't loaded yet
function approximateTokens(text: string): number {
  if (!text) return 0;
  // ~4 chars per token is a decent approximation for English
  return Math.ceil(text.length / 4);
}

type TiktokenInstance = {
  encode: (text: string) => Uint32Array;
  free: () => void;
};

export function useTokenizer() {
  const [tokenizerReady, setTokenizerReady] = useState(false);
  const encoderRef = useRef<TiktokenInstance | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function loadEncoder() {
      try {
        const { get_encoding } = await import('@dqbd/tiktoken');
        if (cancelled) return;
        const enc = get_encoding('cl100k_base');
        encoderRef.current = enc;
        setTokenizerReady(true);
      } catch (err) {
        console.warn('tiktoken failed to load, using approximation', err);
      }
    }
    loadEncoder();
    return () => {
      cancelled = true;
      encoderRef.current?.free();
      encoderRef.current = null;
    };
  }, []);

  const countTokens = useCallback((text: string): number => {
    if (!text) return 0;
    if (encoderRef.current) {
      try {
        return encoderRef.current.encode(text).length;
      } catch {
        return approximateTokens(text);
      }
    }
    return approximateTokens(text);
  }, []);

  return { countTokens, tokenizerReady };
}
