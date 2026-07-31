import React from 'react';
import { Link } from 'react-router-dom';
import { FiGlobe } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-surface-container-lowest dark:bg-slate-900 border-t border-outline-variant py-section-gap transition-colors duration-300">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="col-span-2 md:col-span-1 space-y-stack-md">
          <span className="font-headline-sm text-headline-sm font-bold text-on-surface dark:text-white">TalentAI</span>
          <p className="font-body-sm text-body-sm text-on-surface-variant dark:text-slate-400 max-w-xs leading-relaxed">
            Pioneering the future of recruitment through ethical AI and human-centric design.
          </p>
          <p className="font-body-sm text-body-sm text-outline dark:text-slate-500 mt-4">© 2026 TalentAI Technologies Inc.</p>
        </div>

        <div className="flex flex-col gap-stack-sm">
          <span className="font-label-caps text-label-caps text-primary dark:text-primary-fixed mb-2 uppercase font-bold">Product</span>
          <a className="text-on-surface-variant dark:text-slate-400 hover:text-primary dark:hover:text-white hover:underline transition-all font-body-sm text-body-sm" href="#" onClick={(e) => e.preventDefault()}>AI Matching</a>
          <a className="text-on-surface-variant dark:text-slate-400 hover:text-primary dark:hover:text-white hover:underline transition-all font-body-sm text-body-sm" href="#" onClick={(e) => e.preventDefault()}>Candidate Pool</a>
          <a className="text-on-surface-variant dark:text-slate-400 hover:text-primary dark:hover:text-white hover:underline transition-all font-body-sm text-body-sm" href="#" onClick={(e) => e.preventDefault()}>API Docs</a>
        </div>

        <div className="flex flex-col gap-stack-sm">
          <span className="font-label-caps text-label-caps text-primary dark:text-primary-fixed mb-2 uppercase font-bold">Company</span>
          <a className="text-on-surface-variant dark:text-slate-400 hover:text-primary dark:hover:text-white hover:underline transition-all font-body-sm text-body-sm" href="#" onClick={(e) => e.preventDefault()}>About Us</a>
          <a className="text-on-surface-variant dark:text-slate-400 hover:text-primary dark:hover:text-white hover:underline transition-all font-body-sm text-body-sm" href="#" onClick={(e) => e.preventDefault()}>Careers</a>
          <a className="text-on-surface-variant dark:text-slate-400 hover:text-primary dark:hover:text-white hover:underline transition-all font-body-sm text-body-sm" href="#" onClick={(e) => e.preventDefault()}>Privacy</a>
        </div>

        <div className="flex flex-col gap-stack-sm items-start md:items-end">
          <span className="font-label-caps text-label-caps text-primary dark:text-primary-fixed mb-2 uppercase font-bold">Support</span>
          <a className="text-on-surface-variant dark:text-slate-400 hover:text-primary dark:hover:text-white hover:underline transition-all font-body-sm text-body-sm" href="#" onClick={(e) => e.preventDefault()}>Help Center</a>
          <a className="text-on-surface-variant dark:text-slate-400 hover:text-primary dark:hover:text-white hover:underline transition-all font-body-sm text-body-sm" href="#" onClick={(e) => e.preventDefault()}>Contact</a>
          <div className="flex gap-4 mt-4 text-outline dark:text-slate-400">
            <FiGlobe className="text-xl hover:text-primary cursor-pointer transition-colors" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
