import React, { useState, useEffect, useCallback } from 'react';
import type { PromptState } from './types';
import { PromptBuilder } from './components/PromptBuilder';
import { PromptDisplay } from './components/PromptDisplay';
import { enhancePromptWithAI } from './services/geminiService';
import { IconSparkles } from './components/icons/IconSparkles';

const ApiKeyBanner: React.FC<{ onKeySave: (key: string) => void }> = ({ onKeySave }) => {
  const [key, setKey] = useState('');

  const handleSave = () => {
    if (key.trim()) {
      onKeySave(key.trim());
    }
  };

  return (
    <div className="bg-yellow-900/50 border border-yellow-700 text-yellow-200 px-4 py-3 rounded-lg relative mb-6" role="alert">
      <strong className="font-bold">Configuration Required: </strong>
      <span className="block sm:inline">Please enter your Google Gemini API key to use the AI enhancement features.</span>
      <div className="mt-2 flex flex-col sm:flex-row gap-2">
        <input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Paste your API key here"
          className="flex-grow bg-brand-secondary border border-slate-600 rounded-md px-3 py-2 text-brand-light placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-accent transition"
        />
        <button
          onClick={handleSave}
          className="bg-yellow-600 text-white font-bold py-2 px-4 rounded-md hover:bg-yellow-700 transition"
        >
          Save Key
        </button>
      </div>
      <p className="text-xs mt-1 text-yellow-300">Your key is stored securely in your browser's local storage and is never sent to our servers.</p>
    </div>
  );
};


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
  const [apiKey, setApiKey] = useState<string>('');

  useEffect(() => {
    const storedKey = localStorage.getItem('gemini-api-key');
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const handleKeySave = (key: string) => {
    setApiKey(key);
    localStorage.setItem('gemini-api-key', key);
  };

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
    if (!apiKey) {
      setError('API Key is missing. Please set your API key above.');
      return;
    }
    setIsEnhancing(true);
    setError(null);
    try {
      const enhancedPrompt = await enhancePromptWithAI(finalPrompt, apiKey);
      setFinalPrompt(enhancedPrompt);
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(errorMessage);
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

        {!apiKey && <ApiKeyBanner onKeySave={handleKeySave} />}

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
            isApiConfigured={!!apiKey}
          />
        </main>
      </div>
    </div>
  );
};

export default App;