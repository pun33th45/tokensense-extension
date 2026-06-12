export const FILLER_PATTERNS: Array<{ pattern: RegExp; replacement: string }> = [
  { pattern: /\bPlease\s+/gi, replacement: '' },
  { pattern: /\bCould you please\s+/gi, replacement: '' },
  { pattern: /\bCould you\s+/gi, replacement: '' },
  { pattern: /\bI would like you to\s+/gi, replacement: '' },
  { pattern: /\bI would like to\s+/gi, replacement: '' },
  { pattern: /\bI want you to\s+/gi, replacement: '' },
  { pattern: /\bAs an AI(?: language model)?,?\s*/gi, replacement: '' },
  { pattern: /\bAs a language model,?\s*/gi, replacement: '' },
  { pattern: /\bNote that\s+/gi, replacement: '' },
  { pattern: /\bPlease note that\s+/gi, replacement: '' },
  { pattern: /\bIt is important to note that\s+/gi, replacement: '' },
  { pattern: /\bKindly\s+/gi, replacement: '' },
  { pattern: /\bIn order to\s+/gi, replacement: 'To ' },
  { pattern: /\bDue to the fact that\s+/gi, replacement: 'Because ' },
  { pattern: /\bAt this point in time\b/gi, replacement: 'now' },
  { pattern: /\bIn the event that\b/gi, replacement: 'if' },
  { pattern: /\bFor the purpose of\b/gi, replacement: 'for' },
  { pattern: /\bWith regard to\b/gi, replacement: 'regarding' },
  { pattern: /\bWith respect to\b/gi, replacement: 'regarding' },
  { pattern: /\bThank you[^.!?]*[.!?]?\s*/gi, replacement: '' },
  { pattern: /\bThanks[^.!?]*[.!?]?\s*/gi, replacement: '' },
  { pattern: /[ \t]{2,}/g, replacement: ' ' },
  { pattern: /\n{3,}/g, replacement: '\n\n' },
];

export function optimizePrompt(text: string): string {
  let result = text;
  for (const { pattern, replacement } of FILLER_PATTERNS) {
    result = result.replace(pattern, replacement);
  }
  return result.trim();
}
