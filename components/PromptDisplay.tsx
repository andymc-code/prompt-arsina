import React, { useState } from 'react';
import { IconClipboard } from './icons/IconClipboard';
import { IconSparkles } from './icons/IconSparkles';
import { IconLoader } from './icons/IconLoader';
import { IconArrowLeft } from './icons/IconArrowLeft';

interface PromptDisplayProps {
  finalPrompt: string;
  isEnhancing: boolean;
  onEnhance: () => void;
  onBack?: () => void;
}

export const PromptDisplay: React.FC<PromptDisplayProps> = ({ finalPrompt, isEnhancing, onEnhance, onBack }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!finalPrompt) return;
    navigator.clipboard.writeText(finalPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-brand-secondary/50 p-6 rounded-lg border border-slate-700 h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-4 text-brand-light flex items-center gap-2">
        {onBack && (
          <button 
            onClick={onBack} 
            className="p-2 rounded-full hover:bg-slate-600 transition text-slate-400 hover:text-brand-light mr-2"
            aria-label="Go back"
          >
            <IconArrowLeft className="w-6 h-6" />
          </button>
        )}
        <IconSparkles className="w-6 h-6 text-brand-accent"/>
        Final Prompt
      </h2>

      <div className="relative bg-brand-primary p-4 rounded-md border border-slate-600 flex-grow min-h-[250px] flex">
        <p className="text-brand-light whitespace-pre-wrap break-words my-auto" aria-live="polite">
          {finalPrompt || 'Your assembled prompt will appear here...'}
        </p>
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 p-2 bg-brand-secondary rounded-md hover:bg-slate-600 transition text-slate-400 hover:text-brand-light disabled:opacity-50"
          aria-label="Copy prompt"
          disabled={!finalPrompt}
        >
          {copied ? <span className="text-xs">Copied!</span> : <IconClipboard className="w-5 h-5" />}
        </button>
      </div>

      <button
        onClick={onEnhance}
        disabled={isEnhancing || !finalPrompt}
        className="w-full mt-4 flex items-center justify-center gap-2 bg-brand-accent text-brand-primary font-bold py-3 px-4 rounded-md hover:bg-emerald-500 transition disabled:bg-slate-500 disabled:cursor-not-allowed text-lg"
      >
        {isEnhancing ? <IconLoader /> : <IconSparkles className="w-6 h-6" />}
        <span>{isEnhancing ? 'Enhancing with AI...' : 'Enhance with AI'}</span>
      </button>
    </div>
  );
};