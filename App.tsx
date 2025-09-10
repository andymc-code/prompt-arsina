import React, { useState, useEffect, useCallback } from 'react';
import type { PromptState } from './types';
import { PromptBuilder } from './components/PromptBuilder';
import { PromptDisplay } from './components/PromptDisplay';
import { enhancePromptWithAI } from './services/geminiService';
import { IconSparkles } from './components/icons/IconSparkles';

const App: React.FC = () => {
  const [promptState, setPromptState] = useState<PromptState>({
    subject: '',
    action: '',
    setting: '',
    style: 'Photorealistic',
    composition: 'Eye-level shot',
    lighting: 'Natural lighting',
    colors: '',
    negative: '',
  });

  const [finalPrompt, setFinalPrompt] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const assemblePrompt = useCallback(() => {
    const parts = [
      promptState.subject,
      promptState.action,
      promptState.setting,
      `style of ${promptState.style}`,
      promptState.composition,
      `lighting is ${promptState.lighting}`,
      promptState.colors ? `color palette of ${promptState.colors}` : '',
      promptState.negative ? `--no ${promptState.negative}` : '',
    ];
    const assembled = parts.filter(part => part && part.trim() !== '').join(', ');
    setFinalPrompt(assembled);
  }, [promptState]);

  useEffect(() => {
    assemblePrompt();
  }, [promptState, assemblePrompt]);

  const handleEnhance = async () => {
    if (!finalPrompt) {
      setError('Please build a base prompt before enhancing.');
      return;
    }
    setIsEnhancing(true);
    setError(null);
    try {
      const enhancedPrompt = await enhancePromptWithAI(finalPrompt);
      setFinalPrompt(enhancedPrompt);
    } catch (e) {
      console.error(e);
      setError('Failed to enhance prompt. Please check your API key and try again.');
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-primary text-brand-text font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-brand-light flex items-center justify-center gap-3">
            <IconSparkles className="w-10 h-10 text-brand-accent" />
            AI Prompt Architect
          </h1>
          <p className="mt-2 text-lg text-slate-400">Your Co-pilot for Crafting Master-Level Prompts</p>
        </header>

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative mb-6" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <PromptBuilder promptState={promptState} setPromptState={setPromptState} />
          <PromptDisplay
            finalPrompt={finalPrompt}
            isEnhancing={isEnhancing}
            onEnhance={handleEnhance}
          />
        </main>
      </div>
    </div>
  );
};

export default App;