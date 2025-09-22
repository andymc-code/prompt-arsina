import React from 'react';
import { IconDeconstruct } from './icons/IconDeconstruct';
import { IconSparkles } from './icons/IconSparkles';
import { IconClipboard } from './icons/IconClipboard';

const steps = [
  {
    icon: IconDeconstruct,
    title: 'Deconstruct',
    description: 'Break down your idea into its core components.'
  },
  {
    icon: IconSparkles,
    title: 'Enhance',
    description: 'Let our AI co-pilot add creative detail and nuance.'
  },
  {
    icon: IconClipboard,
    title: 'Create',
    description: 'Copy your master-level prompt and use it anywhere.'
  }
];

export const HowItWorks: React.FC = () => {
  return (
    <div className="py-12 mt-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-brand-light">How It Works in 3 Simple Steps</h2>
        <p className="mt-2 text-lg text-slate-400">Demystifying the art of the perfect prompt.</p>
      </div>

      <div className="relative">
        {/* Dotted line for desktop */}
        <div className="hidden md:block absolute top-8 left-0 w-full h-px">
            <div className="absolute top-0 left-0 w-full h-full"
                 style={{
                     backgroundImage: `linear-gradient(to right, #475569 50%, transparent 50%)`,
                     backgroundSize: '16px 1px',
                     backgroundRepeat: 'repeat-x'
                 }}>
            </div>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-y-12 md:gap-x-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center px-4">
              <div className="relative bg-brand-primary p-1 rounded-full z-10">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-brand-secondary border-2 border-slate-700">
                  <step.icon className="w-8 h-8 text-brand-accent" />
                </div>
              </div>
              <h3 className="mt-4 text-xl font-bold text-brand-light">{`Step ${index + 1}: ${step.title}`}</h3>
              <p className="mt-2 text-slate-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};