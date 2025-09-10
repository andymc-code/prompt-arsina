import React, { useState, useEffect } from 'react';
import { PromptBuilder } from './components/PromptBuilder';
import { PromptDisplay } from './components/PromptDisplay';
import { ImagePreview } from './components/ImagePreview';
import { enhancePrompt, generateImage } from './services/geminiService';
import type { PromptState } from './types';
import { IconPhoto } from './components/icons/IconPhoto';
import { IconLoader } from './components/icons/IconLoader';
import { IconSparkles } from './components/icons/IconSparkles';


// Fix: This file was missing. Added a complete App component to structure the application,
// manage state, and handle user interactions.
const App: React.FC = () => {
  const [promptState, setPromptState] = useState<PromptState>({
    subject: 'A majestic lion',
    action: 'roaring on a rocky cliff at sunrise',
    setting: '',
    style: 'Photorealistic',
    composition: 'Wide shot',
    lighting: 'Golden hour',
    colors: 'warm, golden tones',
    negative: 'cartoon, blurry',
  });

  const [finalPrompt, setFinalPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { subject, action, setting, style, composition, lighting, colors, negative } = promptState;
    const parts = [
      subject,
      action,
      setting,
      style,
      composition,
      lighting,
      colors,
    ].filter(Boolean);
    let assembledPrompt = parts.join(', ');
    if (negative) {
      assembledPrompt += ` --no ${negative}`;
    }
    setFinalPrompt(assembledPrompt);
  }, [promptState]);

  const handleEnhance = async () => {
    if (!finalPrompt) return;
    setIsEnhancing(true);
    setError(null);
    try {
      const enhanced = await enhancePrompt(finalPrompt);
      setFinalPrompt(enhanced);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred while enhancing.');
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleGenerate = async () => {
    if (!finalPrompt) return;
    setIsGenerating(true);
    setImageUrl(null);
    setError(null);
    try {
      const url = await generateImage(finalPrompt);
      setImageUrl(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred while generating.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-brand-primary min-h-screen text-brand-light font-sans">
      <header className="py-6 px-4 md:px-8 border-b border-slate-700 bg-brand-secondary/30">
        <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-brand-light flex items-center justify-center gap-3">
                <IconSparkles className="w-8 h-8 text-brand-accent" />
                <span>AI Image Prompt Engineer</span>
            </h1>
            <p className="text-slate-400 mt-2 max-w-2xl mx-auto">Craft, refine, and visualize your ideas with the power of Gemini. Deconstruct your concept, let AI enhance it, then generate your masterpiece.</p>
        </div>
      </header>
      <main className="p-4 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
        <div className="space-y-8">
          <PromptBuilder promptState={promptState} setPromptState={setPromptState} />
        </div>
        <div className="space-y-8">
          <PromptDisplay
            finalPrompt={finalPrompt}
            isEnhancing={isEnhancing}
            onEnhance={handleEnhance}
          />
          <div className="bg-brand-secondary/50 p-6 rounded-lg border border-slate-700">
             <h2 className="text-2xl font-bold mb-4 text-brand-light">3. Generate Your Image</h2>
             <p className="text-sm text-slate-400 mb-4">Once your prompt is ready, click generate to bring your vision to life. This may take a few moments.</p>
             <button
                onClick={handleGenerate}
                disabled={isGenerating || !finalPrompt}
                className="w-full mt-2 flex items-center justify-center gap-2 bg-brand-accent text-brand-primary font-bold py-3 px-4 rounded-md hover:bg-emerald-500 transition disabled:bg-slate-500 disabled:cursor-not-allowed text-lg"
              >
                {isGenerating ? <IconLoader /> : <IconPhoto className="w-6 h-6" />}
                <span>{isGenerating ? 'Generating...' : 'Generate Image'}</span>
              </button>
          </div>
          <ImagePreview imageUrl={imageUrl} isLoading={isGenerating} prompt={finalPrompt} />
        </div>
      </main>
      {error && (
        <div 
          role="alert"
          className="fixed bottom-4 right-4 bg-red-800 border border-red-600 text-white p-4 rounded-lg shadow-lg max-w-sm flex items-start gap-4"
        >
          <div>
            <p className="font-bold">An Error Occurred</p>
            <p className="text-sm">{error}</p>
          </div>
          <button onClick={() => setError(null)} aria-label="Dismiss" className="text-lg font-bold leading-none">&times;</button>
        </div>
      )}
    </div>
  );
};

export default App;
