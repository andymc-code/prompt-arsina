import React, { useState } from 'react';
import { IconMail } from './icons/IconMail';
import { IconLoader } from './icons/IconLoader';
import { IconSparkles } from './icons/IconSparkles';

type Status = 'idle' | 'submitting' | 'success';

export const NewsletterCTA: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim() || status !== 'idle') return;

    setStatus('submitting');
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
    }, 1500);
  };

  return (
    <div className="py-12 mt-8">
      <div className="max-w-4xl mx-auto bg-gradient-to-r from-brand-secondary to-slate-800 rounded-lg border border-slate-700 shadow-2xl overflow-hidden p-8 md:p-12 text-center">
        {status === 'success' ? (
          <div className="animate-pop-in">
            <IconSparkles className="w-12 h-12 text-brand-accent mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-brand-light">You're on the list!</h2>
            <p className="mt-2 text-lg text-slate-400">Thanks for subscribing. Keep an eye on your inbox for exciting updates.</p>
          </div>
        ) : (
          <>
            <IconMail className="w-12 h-12 text-brand-accent mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-brand-light">Be the First to Know</h2>
            <p className="mt-2 text-lg text-slate-400 max-w-2xl mx-auto">
              Subscribe to our newsletter for the latest product releases, exclusive prompt engineering tips, and community highlights.
            </p>
            <form onSubmit={handleSubmit} className="mt-8 max-w-lg mx-auto flex flex-col sm:flex-row gap-4" aria-busy={status === 'submitting'}>
              <label htmlFor="email-subscribe" className="sr-only">Email address</label>
              <input
                id="email-subscribe"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
                className="flex-grow w-full bg-brand-primary border border-slate-600 rounded-md px-4 py-3 text-brand-light placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-accent transition"
                disabled={status === 'submitting'}
              />
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="flex items-center justify-center gap-2 bg-brand-accent text-brand-primary font-bold py-3 px-6 rounded-md hover:bg-emerald-500 transition disabled:bg-slate-500 disabled:cursor-not-allowed"
              >
                {status === 'submitting' ? <IconLoader className="w-6 h-6" /> : 'Subscribe'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};