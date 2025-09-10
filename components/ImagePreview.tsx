
import React from 'react';
import { IconPhoto } from './icons/IconPhoto';
import { IconLoader } from './icons/IconLoader';

interface ImagePreviewProps {
  imageUrl: string | null;
  isLoading: boolean;
  prompt: string;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ imageUrl, isLoading, prompt }) => {
  return (
    <div className="bg-brand-secondary/50 p-6 rounded-lg border border-slate-700">
      <h2 className="text-2xl font-bold mb-4 text-brand-light">4. Generated Image</h2>
      <div className="aspect-video bg-brand-primary rounded-md border border-slate-600 flex items-center justify-center overflow-hidden">
        {isLoading && (
          <div className="text-center text-slate-400">
            <IconLoader className="text-4xl mb-2" />
            <p className="font-semibold">Generating your masterpiece...</p>
            <p className="text-sm">This can take a moment.</p>
          </div>
        )}
        {!isLoading && imageUrl && (
          <img src={imageUrl} alt={prompt} className="w-full h-full object-contain" />
        )}
        {!isLoading && !imageUrl && (
          <div className="text-center text-slate-500 p-4">
            <IconPhoto className="w-16 h-16 mx-auto mb-2" />
            <p>Your generated image will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};
