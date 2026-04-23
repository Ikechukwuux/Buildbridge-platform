import { useState } from 'react';

interface UseAIGeneratorResult {
  isGenerating: boolean;
  error: string | null;
  generateImpactStatement: (trade: string, itemName: string, story: string) => Promise<string | null>;
}

export function useAIGenerator(): UseAIGeneratorResult {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateImpactStatement = async (trade: string, itemName: string, story: string): Promise<string | null> => {
    setIsGenerating(true);
    setError(null);
    try {
      const response = await fetch('/api/impact-statement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trade, item_name: itemName, story }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate impact statement');
      }

      return data.statement || null;
    } catch (err: any) {
      console.error('Error generating AI impact statement:', err);
      setError(err.message || 'An unexpected error occurred.');
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return { isGenerating, error, generateImpactStatement };
}
