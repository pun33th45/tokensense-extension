export interface ModelConfig {
  id: string;
  name: string;
  provider: string;
  inputPricePerM: number;   // USD per 1M input tokens
  outputPricePerM: number;  // USD per 1M output tokens
  color: string;            // provider color
}

export const MODELS: ModelConfig[] = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    inputPricePerM: 2.50,
    outputPricePerM: 10.00,
    color: '#10a37f',
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o mini',
    provider: 'OpenAI',
    inputPricePerM: 0.150,
    outputPricePerM: 0.600,
    color: '#10a37f',
  },
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'OpenAI',
    inputPricePerM: 10.00,
    outputPricePerM: 30.00,
    color: '#10a37f',
  },
  {
    id: 'claude-opus-4',
    name: 'Claude Opus 4',
    provider: 'Anthropic',
    inputPricePerM: 15.00,
    outputPricePerM: 75.00,
    color: '#d4622a',
  },
  {
    id: 'claude-sonnet-4-5',
    name: 'Claude Sonnet 4.5',
    provider: 'Anthropic',
    inputPricePerM: 3.00,
    outputPricePerM: 15.00,
    color: '#d4622a',
  },
  {
    id: 'claude-haiku-3-5',
    name: 'Claude Haiku 3.5',
    provider: 'Anthropic',
    inputPricePerM: 0.80,
    outputPricePerM: 4.00,
    color: '#d4622a',
  },
  {
    id: 'gemini-1-5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'Google',
    inputPricePerM: 1.25,
    outputPricePerM: 5.00,
    color: '#4285f4',
  },
  {
    id: 'gemini-1-5-flash',
    name: 'Gemini 1.5 Flash',
    provider: 'Google',
    inputPricePerM: 0.075,
    outputPricePerM: 0.30,
    color: '#4285f4',
  },
  {
    id: 'llama-3-1-70b',
    name: 'Llama 3.1 70B',
    provider: 'Together AI',
    inputPricePerM: 0.88,
    outputPricePerM: 0.88,
    color: '#7c3aed',
  },
];

export const DEFAULT_MODEL_ID = 'gpt-4o';

export function getModel(id: string): ModelConfig {
  return MODELS.find((m) => m.id === id) ?? MODELS[0];
}

export function calcInputCost(tokens: number, model: ModelConfig): number {
  return (tokens / 1_000_000) * model.inputPricePerM;
}

export function calcOutputCost(tokens: number, model: ModelConfig): number {
  return (tokens / 1_000_000) * model.outputPricePerM;
}

export function formatCost(cost: number): string {
  if (cost === 0) return '$0.000000';
  if (cost >= 0.01) return `$${cost.toFixed(2)}`;
  return `$${cost.toFixed(6)}`;
}
