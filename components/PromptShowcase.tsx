import React, { useState } from 'react';
import type { PromptState } from '../types';
import { IconArrowLeft } from './icons/IconArrowLeft';
import { IconArrowRight } from './icons/IconArrowRight';

interface ShowcaseItem {
  beforePrompt: string;
  afterPrompt: string;
  imageUrl: string;
  template: PromptState;
}

const showcaseData: ShowcaseItem[] = [
  {
    beforePrompt: 'Cyborg wizard',
    afterPrompt: 'A wise old cyborg wizard, casting a holographic spell in a neon-lit alley, style of Photorealistic, Close-up shot, lighting is Dramatic lighting, color palette of bioluminescent greens and purples, --no cartoonish, poorly drawn hands',
    imageUrl: 'https://ik.imagekit.io/wnwu0xxx5/cyborgwiz_B&A_imgupscaler.ai_Upscaler_4K.png?updatedAt=1758525315037',
    template: {
      subject: 'A wise old cyborg wizard',
      action: 'casting a holographic spell',
      setting: 'in a neon-lit alley',
      style: 'Photorealistic',
      composition: 'Close-up shot',
      lighting: 'Dramatic lighting',
      colors: 'bioluminescent greens and purples',
      negative: 'cartoonish, poorly drawn hands',
    }
  },
  {
    beforePrompt: 'Cat astronaut',
    afterPrompt: 'An adorable cat astronaut wearing a detailed spacesuit, floating weightlessly inside a futuristic spaceship cockpit, style of 3D Render, Eye-level shot, lighting is Soft light from control panels, color palette of cool blues and silver metallics, --no text, logos',
    imageUrl: 'https://ik.imagekit.io/wnwu0xxx5/catastro_B&A_imgupscaler.ai_Upscaler_4K.png?updatedAt=1758525281897',
    template: {
      subject: 'An adorable cat astronaut wearing a detailed spacesuit',
      action: 'floating weightlessly',
      setting: 'inside a futuristic spaceship cockpit',
      style: '3D Render',
      composition: 'Eye-level shot',
      lighting: 'Soft light from control panels',
      colors: 'cool blues and silver metallics',
      negative: 'text, logos',
    }
  },
  {
    beforePrompt: 'Fantasy forest',
    afterPrompt: 'An enchanted, bioluminescent forest at twilight, with massive glowing mushrooms and sparkling streams, style of Fantasy Art, Wide shot, lighting is Golden hour, color palette of deep greens, blues, and magical purples, --no people, man-made objects',
    imageUrl: 'https://ik.imagekit.io/wnwu0xxx5/catastro_B&A%20(1)_imgupscaler.ai_Upscaler_4K.png?updatedAt=1758526009920',
    template: {
      subject: 'An enchanted, bioluminescent forest',
      action: 'with massive glowing mushrooms and sparkling streams',
      setting: 'at twilight',
      style: 'Fantasy Art',
      composition: 'Wide shot',
      lighting: 'Golden hour',
      colors: 'deep greens, blues, and magical purples',
      negative: 'people, man-made objects',
    }
  },
];

interface PromptShowcaseProps {
  onUseTemplate: (template: PromptState) => void;
}

export const PromptShowcase: React.FC<PromptShowcaseProps> = ({ onUseTemplate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? showcaseData.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === showcaseData.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };
  
  const { beforePrompt, afterPrompt, imageUrl, template } = showcaseData[currentIndex];

  return (
    <div className="py-12 mt-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-brand-light">See the Transformation</h2>
        <p className="mt-2 text-lg text-slate-400">From a simple idea to a masterpiece-ready prompt.</p>
      </div>

      <div className="max-w-4xl mx-auto bg-brand-secondary/50 rounded-lg border border-slate-700 shadow-2xl overflow-hidden">
        <div className="relative aspect-video">
          <img src={imageUrl} alt={afterPrompt} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          
          <button onClick={prevSlide} className="absolute top-1/2 left-4 -translate-y-1/2 p-2 bg-black/40 rounded-full hover:bg-black/60 transition text-white" aria-label="Previous slide">
            <IconArrowLeft className="w-6 h-6" />
          </button>
          <button onClick={nextSlide} className="absolute top-1/2 right-4 -translate-y-1/2 p-2 bg-black/40 rounded-full hover:bg-black/60 transition text-white" aria-label="Next slide">
            <IconArrowRight className="w-6 h-6" />
          </button>
          <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-2">
            {showcaseData.map((_, index) => (
              <div 
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${currentIndex === index ? 'bg-brand-accent scale-125' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </div>

        <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div>
                    <h3 className="text-sm font-bold uppercase text-slate-500 tracking-wider mb-2">Before</h3>
                    <p className="bg-brand-primary p-3 rounded-md border border-slate-600 text-brand-light italic">"{beforePrompt}"</p>
                </div>
                 <div>
                    <h3 className="text-sm font-bold uppercase text-brand-accent tracking-wider mb-2">After</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">{afterPrompt}</p>
                </div>
            </div>
            <div className="mt-8 text-center">
                <button 
                    onClick={() => onUseTemplate(template)}
                    className="bg-brand-accent text-brand-primary font-bold py-3 px-6 rounded-md hover:bg-emerald-500 transition disabled:bg-slate-500 text-lg">
                    Use this as a Template
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};