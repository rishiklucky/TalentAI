import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiLock, FiAward } from 'react-icons/fi';
import PremiumUpgradeModal from './PremiumUpgradeModal';

const PremiumGatedContainer = ({ children, featureName = "This Premium Feature" }) => {
  const { isPremium } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  if (isPremium) {
    return <>{children}</>;
  }

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-3xl overflow-hidden border border-outline-variant/30 dark:border-slate-800/40">
      
      {/* Gated Overlay Content */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-6 bg-slate-950/20 dark:bg-slate-950/50 backdrop-blur-md">
        <div className="glass-card max-w-md p-8 rounded-3xl border border-white/20 dark:border-slate-700/30 flex flex-col items-center space-y-6 shadow-2xl relative animate-pulse-soft">
          
          {/* Glowing Premium Icon */}
          <div className="relative w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/20">
            <FiLock className="text-2xl absolute animate-ping opacity-25" />
            <FiAward className="text-3xl relative z-10" />
          </div>

          <div className="space-y-2">
            <h3 className="font-headline-sm text-xl font-bold text-on-background dark:text-white">
              Unlock with TalentAI Premium
            </h3>
            <p className="font-body-sm text-xs text-on-surface-variant dark:text-slate-300 leading-relaxed">
              Gain access to <span className="text-primary dark:text-inverse-primary font-bold">{featureName}</span> and other premium AI-driven capabilities to supercharge your dashboard.
            </p>
          </div>

          <button 
            onClick={() => setModalOpen(true)}
            className="w-full bg-primary hover:bg-primary-container text-on-primary font-bold py-3.5 rounded-xl hover:shadow-lg transition-all hover:scale-95 duration-150 text-sm"
          >
            Upgrade to Premium
          </button>
        </div>
      </div>

      {/* Blurred Child Mock / Placeholder */}
      <div className="select-none pointer-events-none filter blur-[6px] opacity-40 scale-[1.01] transition-all duration-300 w-full h-full">
        {children}
      </div>

      {/* Premium Upgrade Modal */}
      <PremiumUpgradeModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default PremiumGatedContainer;
