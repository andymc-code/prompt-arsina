import React, { useState } from 'react';
import { IconChevronDown } from './icons/IconChevronDown';

const faqData = [
  {
    question: "What AI models is this compatible with?",
    answer: "This tool is designed to work with any AI model that accepts detailed text prompts. It's perfect for image generators like Midjourney, DALL-E 3, Stable Diffusion, and video models like Sora, Veo, or Runway."
  },
  {
    question: "Is this tool free to use?",
    answer: "Yes, AI Prompt Architect is currently free for everyone to use. We wanted to provide a powerful tool to the creative community to help democratize prompt engineering."
  },
  {
    question: "How does the 'Enhance with AI' feature work?",
    answer: "When you click 'Enhance with AI', your assembled prompt is sent to a powerful large language model (LLM). We've instructed the AI to act as an expert prompt engineer, and it creatively expands on your base idea, adding rich details, nuance, and artistic flair to generate a more descriptive prompt."
  },
  {
    question: "Do you save or store my prompts?",
    answer: "No, we respect your privacy and creativity. All prompt building and enhancing happens in real-time. We do not store your prompts on our servers."
  }
];

const FaqItem: React.FC<{ question: string; answer: string; isOpen: boolean; onClick: () => void }> = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border-b border-slate-700">
      <button
        onClick={onClick}
        className="w-full flex justify-between items-center text-left py-4"
        aria-expanded={isOpen}
      >
        <span className="text-lg font-semibold text-brand-light">{question}</span>
        <IconChevronDown className={`w-6 h-6 text-slate-400 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
            <p className="pb-4 text-slate-400 leading-relaxed">
            {answer}
            </p>
        </div>
      </div>
    </div>
  );
};

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="py-12 mt-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-brand-light text-center mb-8">Frequently Asked Questions</h2>
        <div className="space-y-2">
          {faqData.map((item, index) => (
            <FaqItem
              key={index}
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === index}
              onClick={() => handleToggle(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};