import React from 'react';
import { IconWarnerBros } from './icons/IconWarnerBros';
import { IconMax } from './icons/IconMax';
import { IconPixar } from './icons/IconPixar';
import { IconNetflix } from './icons/IconNetflix';
import { IconA24 } from './icons/IconA24';

const companies = [
  { name: 'Warner Bros.', icon: IconWarnerBros },
  { name: 'Max', icon: IconMax },
  { name: 'Pixar', icon: IconPixar },
  { name: 'Netflix', icon: IconNetflix },
  { name: 'A24', icon: IconA24 },
];

export const SocialProof: React.FC = () => {
  return (
    <div className="text-center pb-8">
      <h3 className="text-sm font-bold uppercase text-slate-500 tracking-wider mb-6">
        Trusted by creative teams at
      </h3>
      <div className="flex justify-center items-center gap-x-8 sm:gap-x-12 lg:gap-x-16 gap-y-4 flex-wrap">
        {companies.map(({ name, icon: Icon }) => (
          <div key={name} title={name}>
            <Icon className="h-6 w-auto text-slate-500 hover:text-slate-300 transition-colors duration-300" />
          </div>
        ))}
      </div>
    </div>
  );
};