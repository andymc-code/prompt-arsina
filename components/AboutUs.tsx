import React from 'react';
import { IconGroup } from './icons/IconGroup';

export const AboutUs: React.FC = () => {
  return (
    <div className="py-12 mt-8">
      <div className="max-w-4xl mx-auto text-center">
        <IconGroup className="w-12 h-12 text-brand-accent mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-brand-light mb-4">Our Story</h2>
        <p className="text-lg text-slate-400 leading-relaxed">
          We're a team of AI lovers and creators. We were constantly amazed by the power of image and video generation models, but found ourselves spending too much time trying to craft the 'perfect' prompt. We wanted a tool that could act as a creative co-pilot, helping us build master-level prompts systematically and inject a bit of AI-powered inspiration. That's why we created AI Prompt Architect.
        </p>
      </div>
    </div>
  );
};