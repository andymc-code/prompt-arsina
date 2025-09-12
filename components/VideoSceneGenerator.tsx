import React, { useState, useEffect } from 'react';
import { generateVideoScenes, generateExampleSceneIdeas } from '../services/geminiService';
import { IconSparkles } from './icons/IconSparkles';
import { IconLoader } from './icons/IconLoader';
import { IconLightbulb } from './icons/IconLightbulb';
import { IconExternalLink } from './icons/IconExternalLink';

interface VideoSceneGeneratorProps {
  onSelectPrompt: (prompt: string) => void;
}

export const VideoSceneGenerator: React.FC<VideoSceneGeneratorProps> = ({ onSelectPrompt }) => {
  const [description, setDescription] = useState('');
  const [scenes, setScenes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [exampleIdeas, setExampleIdeas] = useState<string[]>([]);
  const [isGeneratingExamples, setIsGeneratingExamples] = useState(false);

  useEffect(() => {
    // Clear examples if input is cleared
    if (description.trim().length < 20) {
      setExampleIdeas([]);
      return;
    }
    
    const handler = setTimeout(async () => {
      setIsGeneratingExamples(true);
      const examples = await generateExampleSceneIdeas(description);
      setExampleIdeas(examples);
      setIsGeneratingExamples(false);
    }, 1000); // 1-second debounce

    return () => {
      clearTimeout(handler);
    };
  }, [description]);


  const handleGenerate = async () => {
    if (!description.trim()) {
      setError('Please describe your scene first.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setScenes([]);
    setExampleIdeas([]); // Clear examples when generating final scenes

    try {
      const generatedScenes = await generateVideoScenes(description);
      setScenes(generatedScenes);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleClick = (idea: string) => {
    setDescription(idea);
    setExampleIdeas([]);
  };

  return (
    <div className="bg-brand-secondary/50 p-6 rounded-lg border border-slate-700 h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-6 text-brand-light border-b border-slate-700 pb-3">1. Describe Your Scene</h2>
      
      <div className="mb-4">
        <label htmlFor="scene-description" className="block text-lg font-semibold text-brand-light mb-1">Scene Idea</label>
        <p className="text-sm text-slate-400 mb-2">
          Write 1-2 sentences about the scene you want to create.
          <a
            href="https://alidocs.dingtalk.com/i/nodes/EpGBa2Lm8aZxe5myC99MelA2WgN7R35y?utm_scene=team_space"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-brand-accent hover:underline ml-2"
            aria-label="Learn more about video prompt best practices"
          >
            learn video prompt best practices
            <IconExternalLink className="w-3 h-3" />
          </a>
        </p>
        <textarea
          id="scene-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g., A lone astronaut discovers a glowing alien artifact on Mars."
          className="w-full h-24 bg-brand-secondary border border-slate-600 rounded-md px-3 py-2 text-brand-light placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-accent transition resize-none"
        />
      </div>

      {(isGeneratingExamples || exampleIdeas.length > 0) && (
        <div className="mb-4 p-4 bg-brand-primary/50 rounded-md border border-slate-700">
            <h4 className="text-sm font-semibold text-brand-accent flex items-center gap-2 mb-2">
                <IconLightbulb className="w-4 h-4"/>
                Inspiration
            </h4>
            {isGeneratingExamples && <div className="text-slate-400 text-sm">Generating ideas...</div>}
            <div className="flex flex-wrap gap-2">
                {exampleIdeas.map((idea, index) => (
                    <button
                        key={index}
                        onClick={() => handleExampleClick(idea)}
                        className="bg-slate-600 text-slate-200 text-sm py-1 px-3 rounded-full hover:bg-slate-500 transition"
                    >
                        {idea}
                    </button>
                ))}
            </div>
        </div>
      )}

      <button
        onClick={handleGenerate}
        disabled={isLoading || !description.trim()}
        className="w-full flex items-center justify-center gap-2 bg-brand-accent text-brand-primary font-bold py-3 px-4 rounded-md hover:bg-emerald-500 transition disabled:bg-slate-500 disabled:cursor-not-allowed text-lg"
      >
        {isLoading ? <IconLoader /> : <IconSparkles className="w-6 h-6" />}
        <span>{isLoading ? 'Generating...' : 'Generate Scene Ideas'}</span>
      </button>

      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative mt-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="mt-6 flex-grow overflow-y-auto pr-2 -mr-2">
          {scenes.length > 0 && <h3 className="text-xl font-bold text-brand-light mb-4">Generated Scenes</h3>}
          <div className="space-y-4">
              {scenes.map((scene, index) => (
                  <div key={index} className="bg-brand-primary p-4 rounded-md border border-slate-600 animate-fade-in">
                      <p className="text-brand-light whitespace-pre-wrap break-words">{scene}</p>
                      <button 
                          onClick={() => onSelectPrompt(scene)}
                          className="mt-3 bg-slate-600 text-white font-bold py-1 px-3 rounded-md hover:bg-slate-700 transition text-sm">
                          Use this Prompt
                      </button>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
};