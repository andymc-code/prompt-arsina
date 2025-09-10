
import React from 'react';
import type { PromptState } from '../types';
import { PROMPT_STYLES, PROMPT_COMPOSITION, PROMPT_LIGHTING } from '../constants';

interface PromptBuilderProps {
  promptState: PromptState;
  setPromptState: React.Dispatch<React.SetStateAction<PromptState>>;
}

const FormSection: React.FC<{ title: string; description: string; children: React.ReactNode }> = ({ title, description, children }) => (
  <div className="mb-6">
    <label className="block text-lg font-semibold text-brand-light mb-1">{title}</label>
    <p className="text-sm text-slate-400 mb-2">{description}</p>
    {children}
  </div>
);

const InputField: React.FC<{ value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder: string }> = ({ value, onChange, placeholder }) => (
  <input
    type="text"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="w-full bg-brand-secondary border border-slate-600 rounded-md px-3 py-2 text-brand-light placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-accent transition"
  />
);

const SelectField: React.FC<{ value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: string[] }> = ({ value, onChange, options }) => (
  <select
    value={value}
    onChange={onChange}
    className="w-full bg-brand-secondary border border-slate-600 rounded-md px-3 py-2 text-brand-light focus:outline-none focus:ring-2 focus:ring-brand-accent transition appearance-none"
    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
  >
    {options.map(option => (
      <option key={option} value={option}>{option}</option>
    ))}
  </select>
);


export const PromptBuilder: React.FC<PromptBuilderProps> = ({ promptState, setPromptState }) => {
  const handleChange = <T,>(field: keyof PromptState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setPromptState(prevState => ({ ...prevState, [field]: e.target.value }));
  };

  return (
    <div className="bg-brand-secondary/50 p-6 rounded-lg border border-slate-700 h-full">
      <h2 className="text-2xl font-bold mb-6 text-brand-light border-b border-slate-700 pb-3">1. Build Your Prompt</h2>
      
      <FormSection title="Subject" description="The main focus of your creation (e.g., 'a majestic lion', 'a futuristic city').">
        <InputField value={promptState.subject} onChange={handleChange('subject')} placeholder="e.g., A wise old cyborg wizard" />
      </FormSection>

      <FormSection title="Action / Setting" description="What is the subject doing, and where are they?">
        <InputField value={promptState.action} onChange={handleChange('action')} placeholder="e.g., casting a holographic spell" />
        <InputField value={promptState.setting} onChange={handleChange('setting')} placeholder="e.g., in a neon-lit alley" />
      </FormSection>

      <FormSection title="Artistic Style" description="Define the visual aesthetic.">
        <SelectField value={promptState.style} onChange={handleChange('style')} options={PROMPT_STYLES} />
      </FormSection>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormSection title="Composition" description="How is the scene framed?">
          <SelectField value={promptState.composition} onChange={handleChange('composition')} options={PROMPT_COMPOSITION} />
        </FormSection>
        <FormSection title="Lighting" description="Set the mood with light.">
          <SelectField value={promptState.lighting} onChange={handleChange('lighting')} options={PROMPT_LIGHTING} />
        </FormSection>
      </div>

      <FormSection title="Color Palette" description="Suggest dominant colors (e.g., 'vibrant neon blues and pinks', 'monochromatic earthy tones').">
        <InputField value={promptState.colors} onChange={handleChange('colors')} placeholder="e.g., bioluminescent greens and purples" />
      </FormSection>

      <FormSection title="Negative Prompt" description="What to exclude (e.g., 'blurry, text, watermark, extra limbs').">
        <InputField value={promptState.negative} onChange={handleChange('negative')} placeholder="e.g., cartoonish, poorly drawn hands" />
      </FormSection>
    </div>
  );
};
