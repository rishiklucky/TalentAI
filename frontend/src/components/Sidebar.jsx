import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FiGrid, FiUsers, FiCalendar, FiHeart, FiBarChart2, FiHelpCircle, FiLogOut, FiUploadCloud, FiSettings, FiUser, FiAward, FiLock, FiCpu, FiCompass
} from 'react-icons/fi';
import PremiumUpgradeModal from './PremiumUpgradeModal';

const Sidebar = () => {
  const { logout, isRecruiter, isPremium, user } = useAuth();
  const navigate = useNavigate();
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const recruiterLinks = [
    { name: 'Dashboard', path: '/recruiter', icon: <FiGrid /> },
    { name: 'Candidates', path: '/candidates', icon: <FiUsers /> },
    { name: 'Shortlisted', path: '/shortlisted', icon: <FiHeart /> },
    { name: 'Analytics', path: '/analytics', icon: <FiBarChart2 /> },
    { name: 'Job Matching', path: '/job-matching', icon: <FiCpu />, premium: true },
    { name: 'Candidate Comparison', path: '/candidate-comparison', icon: <FiBarChart2 />, premium: true },
    { name: 'Settings', path: '/settings', icon: <FiSettings /> },
  ];

  const studentLinks = [
    { name: 'My Profile', path: '/dashboard', icon: <FiUser /> },
    { name: 'Upload Resume', path: '/upload', icon: <FiUploadCloud /> },
    { name: 'Resume Optimizer', path: '/resume-optimizer', icon: <FiCpu />, premium: true },
    { name: 'Career Roadmap', path: '/career-roadmap', icon: <FiCompass />, premium: true },
    { name: 'Settings', path: '/settings', icon: <FiSettings /> },
  ];

  const links = isRecruiter ? recruiterLinks : studentLinks;

  return (
    <aside className="bg-surface dark:bg-slate-900 h-[calc(100vh-80px)] w-64 fixed left-0 top-20 border-r border-outline-variant/20 shadow-md flex flex-col p-stack-md pt-8 hidden md:flex transition-colors duration-300 z-30">
      
      {/* Recruiter / Student Title Card */}
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg text-white text-xl">
          {isRecruiter ? <FiUsers /> : <FiUser />}
        </div>
        <div>
          <h2 className="font-headline-sm text-sm font-extrabold text-primary dark:text-inverse-primary leading-none flex items-center gap-1">
            {isRecruiter ? 'Recruiter Portal' : 'Student Portal'}
          </h2>
          <p className="text-[10px] font-label-caps text-outline dark:text-slate-400 uppercase tracking-widest mt-1">
            {isPremium ? 'Premium Tier' : 'Talent Pool'}
          </p>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 flex flex-col gap-1">
        {links.map((link) => {
          const isLocked = link.premium && !isPremium;

          if (isLocked) {
            return (
              <button
                key={link.path}
                onClick={() => setUpgradeModalOpen(true)}
                className="w-full flex items-center gap-3 px-4 py-3 transition-all rounded-lg group text-body-md text-on-surface-variant dark:text-slate-400 hover:bg-surface-container-high dark:hover:bg-slate-800 text-left"
              >
                <span className="text-lg group-hover:translate-x-1 duration-200 text-outline">{link.icon}</span>
                <span>{link.name}</span>
                <span className="ml-auto text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded flex items-center gap-1 font-bold font-label-caps">
                  <FiLock className="text-[10px]" /> PRO
                </span>
              </button>
            );
          }

          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => `flex items-center gap-3 px-4 py-3 transition-all rounded-lg group text-body-md ${
                isActive 
                  ? 'bg-primary/5 dark:bg-primary-container/20 text-primary dark:text-primary-fixed-dim border-l-4 border-primary font-semibold' 
                  : 'text-on-surface-variant dark:text-slate-400 hover:bg-surface-container-high dark:hover:bg-slate-800'
              }`}
            >
              <span className="text-lg group-hover:translate-x-1 duration-200">{link.icon}</span>
              <span>{link.name}</span>
              {link.premium && (
                <span className="ml-auto text-[10px] bg-gradient-primary text-white px-1.5 py-0.5 rounded flex items-center gap-1 font-bold font-label-caps shadow-sm">
                  PRO
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Footer Actions */}
      <div className="mt-auto pt-6 border-t border-outline-variant/20 flex flex-col gap-1">
        {isRecruiter && (
          <button className="bg-primary/10 text-primary dark:bg-primary-container/20 dark:text-primary-fixed-dim w-full py-3 rounded-xl font-label-caps text-label-caps font-bold mb-4 hover:bg-primary/20 transition-all">
            Invite Team
          </button>
        )}
        <a 
          href="#" 
          className="flex items-center gap-3 px-4 py-2.5 text-on-surface-variant dark:text-slate-400 hover:text-primary transition-all text-sm"
          onClick={(e) => e.preventDefault()}
        >
          <FiHelpCircle className="text-lg" />
          <span>Help Center</span>
        </a>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 text-on-surface-variant dark:text-slate-400 hover:text-error transition-all text-sm text-left"
        >
          <FiLogOut className="text-lg text-error" />
          <span className="text-error">Sign Out</span>
        </button>
      </div>

      <PremiumUpgradeModal 
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
      />
    </aside>
  );
};

export default Sidebar;
