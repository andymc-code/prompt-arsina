
import React, { useState } from 'react';
import { IconClipboard } from './icons/IconClipboard';
import { IconSparkles } from './icons/IconSparkles';
import { IconPhoto } from './icons/IconPhoto';
import { IconLoader } from './icons/IconLoader';

interface PromptDisplayProps {
  finalPrompt: string;
  isEnhancing: boolean;
  onEnhance: (baseIdea: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export const PromptDisplay: React.FC<PromptDisplayProps> = ({ finalPrompt, isEnhancing, onEnhance, onGenerate, isGenerating }) => {
  const [copied, setCopied] = useState(false);
  const [baseIdea, setBaseIdea] = useState('');

  const handleCopy = () => {
    navigator.clipboard.writeText(finalPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEnhanceClick = () => {
    onEnhance(baseIdea);
  };

  return (
    <div className="space-y-8">
      {/* AI Enhancement Section */}
      <div className="bg-brand-secondary/50 p-6 rounded-lg border border-slate-700">
        <h2 className="text-2xl font-bold mb-4 text-brand-light flex items-center gap-2">
          <IconSparkles className="w-6 h-6 text-brand-accent"/> 2. Enhance with AI
        </h2>
        <p className="text-sm text-slate-400 mb-4">Stuck? Provide a simple idea and let AI create a detailed prompt for you.</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={baseIdea}
            onChange={(e) => setBaseIdea(e.target.value)}
            placeholder="e.g., 'a dragon in a library'"
            className="flex-grow bg-brand-secondary border border-slate-600 rounded-md px-3 py-2 text-brand-light placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-accent transition"
            disabled={isEnhancing}
          />
          <button
            onClick={handleEnhanceClick}
            disabled={isEnhancing || !baseIdea}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-brand-accent text-brand-primary font-bold py-2 px-4 rounded-md hover:bg-sky-400 transition disabled:bg-slate-500 disabled:cursor-not-allowed"
          >
            {isEnhancing ? <IconLoader /> : <IconSparkles className="w-5 h-5" />}
            <span>{isEnhancing ? 'Enhancing...' : 'Enhance'}</span>
          </button>
        </div>
      </div>

      {/* Final Prompt and Generation Section */}
      <div className="bg-brand-secondary/50 p-6 rounded-lg border border-slate-700">
        <h2 className="text-2xl font-bold mb-4 text-brand-light">3. Final Prompt</h2>
        <div className="relative bg-brand-primary p-4 rounded-md border border-slate-600 min-h-[100px]">
          <p className="text-brand-light whitespace-pre-wrap break-words">{finalPrompt || 'Your generated prompt will appear here...'}</p>
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 p-2 bg-brand-secondary rounded-md hover:bg-slate-600 transition text-slate-400 hover:text-brand-light"
            aria-label="Copy prompt"
          >
            {copied ? <span className="text-xs">Copied!</span> : <IconClipboard className="w-5 h-5" />}
          </button>
        </div>
        <button
          onClick={onGenerate}
          disabled={isGenerating || !finalPrompt}
          className="w-full mt-4 flex items-center justify-center gap-2 bg-green-500 text-white font-bold py-3 px-4 rounded-md hover:bg-green-600 transition disabled:bg-slate-500 disabled:cursor-not-allowed text-lg"
        >
          {isGenerating ? <IconLoader /> : <IconPhoto className="w-6 h-6" />}
          <span>{isGenerating ? 'Generating Image...' : 'Generate Image'}</span>
        </button>
      </div>
    </div>
  );
};
