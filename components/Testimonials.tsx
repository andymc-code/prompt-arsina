import React, { useState } from 'react';
import { IconStar } from './icons/IconStar';

const testimonials = [
  {
    quote: "Prompt Architect transformed my workflow. I spend less time guessing and more time creating. The AI enhancement is a game-changer for getting the exact detail I need.",
    author: "Alex R.",
    role: "Digital Artist",
  },
  {
    quote: "As an indie filmmaker, brainstorming cinematic scenes used to be a bottleneck. The Video Scenes generator gives me incredible, detailed starting points in seconds.",
    author: "Jasmine K.",
    role: "Indie Filmmaker",
  },
  {
    quote: "I thought I was good at writing Midjourney prompts, but this tool took it to another level. The AI enhancement adds layers of creativity I wouldn't have thought of.",
    author: "Marcus L.",
    role: "Midjourney Power User",
  },
  {
    quote: "Coming up with unique visuals daily is a grind. This image prompt helper has become my secret weapon for generating stunning AI art prompts that stop the scroll.",
    author: "Chloe T.",
    role: "Social Media Manager",
  },
  {
    quote: "The detail this AI prompt generator provides is insane. I'm creating concept art for characters and environments with a level of specificity I couldn't achieve before.",
    author: "Ben Carter",
    role: "Game Developer",
  },
  {
    quote: "Crafting detailed prompts is the difference between a generic piece and a masterpiece. This app helps me articulate my vision perfectly for DALL-E and other models.",
    author: "Sofia Nguyen",
    role: "NFT Artist",
  },
  {
    quote: "I'm new to AI art, and prompt engineering felt so intimidating. This tool breaks it down beautifully. I'm making incredible images for Stable Diffusion that look professional.",
    author: "David Chen",
    role: "Creative Hobbyist",
  },
  {
    quote: "The video prompt generator is perfect for fleshing out keyframes. I can describe a mood and get back three distinct, cinematic scenes. It's like having a co-writer for visual storytelling.",
    author: "Emily Rodriguez",
    role: "Storyboard Artist",
  },
];

const TESTIMONIALS_PER_PAGE = 4;

export const Testimonials: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const pages = [];
  for (let i = 0; i < testimonials.length; i += TESTIMONIALS_PER_PAGE) {
    pages.push(testimonials.slice(i, i + TESTIMONIALS_PER_PAGE));
  }
  const pageCount = pages.length;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const deltaX = touchStart - touchEnd;

    // Swipe left
    if (deltaX > 50 && currentPage < pageCount - 1) {
      setCurrentPage(currentPage + 1);
    }
    // Swipe right
    if (deltaX < -50 && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
    setTouchStart(null);
  };
  
  return (
    <div className="py-12 mt-8">
      <h2 className="text-center text-3xl font-bold text-brand-light mb-2">From the Community</h2>
      <p className="text-center text-lg text-slate-400 mb-4">See how creators are leveling up their prompts.</p>
      
      <div className="flex justify-center items-center gap-2 mb-8">
        {Array.from({ length: 5 }).map((_, index) => (
          <IconStar 
            key={index}
            className="w-6 h-6 text-yellow-400 opacity-0 animate-pop-in"
            style={{ animationDelay: `${index * 100}ms` }}
            aria-hidden="true"
          />
        ))}
      </div>
      
      <div 
        className="overflow-hidden relative"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className="flex transition-transform duration-500 ease-in-out" 
          style={{ transform: `translateX(-${currentPage * 100}%)` }}
        >
          {pages.map((page, pageIndex) => (
            <div key={pageIndex} className="w-full flex-shrink-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-1">
              {page.map((testimonial, index) => (
                <div key={index} className="bg-brand-secondary/50 p-6 rounded-lg border border-slate-700 flex flex-col h-full">
                  <div className="flex-grow">
                    <p className="text-brand-light italic text-lg before:content-['“'] before:mr-1 before:-ml-4 after:content-['”'] after:ml-1">
                      {testimonial.quote}
                    </p>
                  </div>
                  <footer className="mt-4 pt-4 border-t border-slate-600">
                    <p className="font-bold text-brand-accent">{testimonial.author}</p>
                    <p className="text-sm text-slate-400">{testimonial.role}</p>
                  </footer>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-8">
        {Array.from({ length: pageCount }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index)}
            aria-label={`Go to page ${index + 1}`}
            className={`w-3 h-3 rounded-full transition-colors ${currentPage === index ? 'bg-brand-accent' : 'bg-slate-600 hover:bg-slate-500'}`}
          />
        ))}
      </div>
    </div>
  );
};