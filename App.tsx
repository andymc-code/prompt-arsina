import React, { useState, useEffect, useCallback } from 'react';
import type { PromptState } from './types';
import { PromptBuilder } from './components/PromptBuilder';
import { PromptDisplay } from './components/PromptDisplay';
import { VideoSceneGenerator } from './components/VideoSceneGenerator';
import { enhancePromptWithAI } from './services/geminiService';
import { IconSparkles } from './components/icons/IconSparkles';
import { IconPhoto } from './components/icons/IconPhoto';
import { IconVideo } from './components/icons/IconVideo';

const App: React.FC = () => {
  const [mode, setMode] = useState<'image' | 'video'>('image');
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
    if (mode === 'video') {
      setFinalPrompt('');
    } else {
      assemblePrompt();
    }
  }, [mode, promptState, assemblePrompt]);

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

        <div className="mb-8 flex justify-center">
          <div className="inline-flex rounded-md shadow-sm bg-brand-secondary/50 border border-slate-700" role="group">
            <button
              onClick={() => setMode('image')}
              type="button"
              className={`px-6 py-2 text-sm font-bold rounded-l-lg flex items-center gap-2 transition ${mode === 'image' ? 'bg-brand-accent text-brand-primary' : 'text-slate-300 hover:bg-slate-700'}`}
              aria-pressed={mode === 'image'}
            >
              <IconPhoto className="w-5 h-5" />
              Image Prompt
            </button>
            <button
              onClick={() => setMode('video')}
              type="button"
              className={`px-6 py-2 text-sm font-bold rounded-r-lg flex items-center gap-2 transition ${mode === 'video' ? 'bg-brand-accent text-brand-primary' : 'text-slate-300 hover:bg-slate-700'}`}
              aria-pressed={mode === 'video'}
            >
              <IconVideo className="w-5 h-5" />
              Video Scenes
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative mb-6" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <main className={`grid grid-cols-1 ${mode === 'image' ? 'lg:grid-cols-2' : 'lg:grid-cols-1'} gap-8`}>
          {mode === 'image' ? (
            <>
              <PromptBuilder promptState={promptState} setPromptState={setPromptState} />
              <PromptDisplay
                finalPrompt={finalPrompt}
                isEnhancing={isEnhancing}
                onEnhance={handleEnhance}
              />
            </>
          ) : (
            <>
              {!finalPrompt ? (
                <VideoSceneGenerator onSelectPrompt={setFinalPrompt} />
              ) : (
                <PromptDisplay
                  finalPrompt={finalPrompt}
                  isEnhancing={isEnhancing}
                  onEnhance={handleEnhance}
                  onBack={() => setFinalPrompt('')}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;