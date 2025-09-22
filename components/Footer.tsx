import React from 'react';
import { IconHeart } from './icons/IconHeart';
import { IconLinkedIn } from './icons/IconLinkedIn';
import { IconX } from './icons/IconX';

export const Footer: React.FC = () => {
  return (
    <footer className="py-6 mt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p className="text-slate-500 flex items-center gap-1.5 order-2 sm:order-1">
        Made with <IconHeart className="w-4 h-4 text-brand-accent" /> from Vancouver, Canada
      </p>
      <div className="flex items-center gap-4 order-1 sm:order-2">
        <a 
          href="https://www.linkedin.com/in/haz-tayeh-05b61125b/" 
          target="_blank" 
          rel="noopener noreferrer" 
          aria-label="Haz Tayeh's LinkedIn profile"
        >
          <IconLinkedIn className="w-5 h-5 text-slate-500 hover:text-brand-accent transition-colors" />
        </a>
        <a 
          href="https://x.com/HazFound" 
          target="_blank" 
          rel="noopener noreferrer" 
          aria-label="Haz Tayeh's X profile"
        >
          <IconX className="w-5 h-5 text-slate-500 hover:text-brand-accent transition-colors" />
        </a>
      </div>
    </footer>
  );
};
