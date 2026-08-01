import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FiMenu, FiX, FiSun, FiMoon, FiBell, FiSettings, FiLogOut, FiAward } from 'react-icons/fi';
import PremiumUpgradeModal from './PremiumUpgradeModal';

const Navbar = () => {
  const { user, logout, isAuthenticated, isRecruiter, isStudent, isPremium } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = (name) => {
    if (!name) return 'TA';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <nav className="bg-surface/70 dark:bg-slate-900/80 backdrop-blur-xl border-b border-outline-variant/30 shadow-sm sticky top-0 z-50 transition-all duration-300">
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-4 max-w-container-max mx-auto">
        
        {/* Logo */}
        <div className="flex items-center gap-stack-lg">
          <Link to="/" className="font-headline-md text-headline-md font-bold text-primary dark:text-inverse-primary">
            TalentAI
          </Link>
          
          {/* Desktop Nav Links */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-stack-md ml-stack-lg">
              {isRecruiter ? (
                <>
                  <NavLink to="/candidates" className={({ isActive }) => `font-label-caps text-label-caps uppercase pb-1 transition-colors ${isActive ? 'text-primary dark:text-primary-fixed border-b-2 border-primary' : 'text-on-surface-variant dark:text-slate-400 hover:text-primary'}`}>
                    Discover
                  </NavLink>
                  <NavLink to="/shortlisted" className={({ isActive }) => `font-label-caps text-label-caps uppercase pb-1 transition-colors ${isActive ? 'text-primary dark:text-primary-fixed border-b-2 border-primary' : 'text-on-surface-variant dark:text-slate-400 hover:text-primary'}`}>
                    Shortlisted
                  </NavLink>
                  <NavLink to="/analytics" className={({ isActive }) => `font-label-caps text-label-caps uppercase pb-1 transition-colors ${isActive ? 'text-primary dark:text-primary-fixed border-b-2 border-primary' : 'text-on-surface-variant dark:text-slate-400 hover:text-primary'}`}>
                    Analytics
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink to="/dashboard" className={({ isActive }) => `font-label-caps text-label-caps uppercase pb-1 transition-colors ${isActive ? 'text-primary dark:text-primary-fixed border-b-2 border-primary' : 'text-on-surface-variant dark:text-slate-400 hover:text-primary'}`}>
                    My Profile
                  </NavLink>
                  <NavLink to="/upload" className={({ isActive }) => `font-label-caps text-label-caps uppercase pb-1 transition-colors ${isActive ? 'text-primary dark:text-primary-fixed border-b-2 border-primary' : 'text-on-surface-variant dark:text-slate-400 hover:text-primary'}`}>
                    Upload Resume
                  </NavLink>
                </>
              )}
            </div>
          )}
        </div>

        {/* Right side buttons */}
        <div className="flex items-center gap-stack-md">
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-primary/5 text-outline dark:text-slate-400 hover:text-primary transition-all"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <FiSun className="text-xl" /> : <FiMoon className="text-xl" />}
          </button>

          {isAuthenticated ? (
            <>
              {/* Notifications */}
              <button className="p-2 rounded-full hover:bg-primary/5 text-outline dark:text-slate-400 hover:text-primary transition-all">
                <FiBell className="text-xl" />
              </button>

              {/* Settings Icon */}
              <Link to="/settings" className="p-2 rounded-full hover:bg-primary/5 text-outline dark:text-slate-400 hover:text-primary transition-all">
                <FiSettings className="text-xl" />
              </Link>

              {/* User Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  <div className="relative">
                    {user?.avatar ? (
                      <img 
                        className="w-10 h-10 rounded-full border border-outline-variant/30 object-cover" 
                        src={user.avatar} 
                        alt={user.name} 
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-sm">
                        {getInitials(user?.name)}
                      </div>
                    )}
                    {isPremium && (
                      <span className="absolute -bottom-1 -right-1 bg-gradient-primary text-white p-0.5 rounded-full border border-white dark:border-slate-900 shadow-md">
                        <FiAward className="text-[10px]" />
                      </span>
                    )}
                  </div>
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-800 rounded-xl shadow-xl py-2 border border-outline-variant/30 z-50">
                    <div className="px-4 py-2 border-b border-outline-variant/20">
                      <div className="flex items-center gap-1.5">
                        <p className="font-semibold text-sm text-on-background dark:text-white truncate">{user?.name}</p>
                        {isPremium && (
                          <span className="bg-gradient-primary text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">PRO</span>
                        )}
                      </div>
                      <p className="text-xs text-outline dark:text-slate-400 capitalize">{user?.role}</p>
                    </div>
                    
                    {!isPremium && (
                      <button 
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          setUpgradeModalOpen(true);
                        }}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-primary dark:text-inverse-primary hover:bg-surface-container-low dark:hover:bg-slate-700 font-bold transition-colors"
                      >
                        <FiAward className="text-secondary" /> Upgrade to Premium
                      </button>
                    )}

                    <Link 
                      to={isRecruiter ? "/recruiter" : "/dashboard"} 
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-on-surface-variant dark:text-slate-300 hover:bg-surface-container-low dark:hover:bg-slate-700 transition-colors"
                    >
                      Dashboard
                    </Link>
                    <button 
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-error hover:bg-error-container/10 transition-colors text-left"
                    >
                      <FiLogOut /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              <Link to="/login" className="text-primary hover:text-primary/80 font-semibold px-4 py-2 transition-colors">
                Sign In
              </Link>
              <Link to="/register" className="bg-primary text-on-primary px-5 py-2.5 rounded-xl font-bold hover:shadow-lg transition-all hover:scale-95 duration-150">
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile menu trigger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full text-outline dark:text-slate-400"
          >
            {mobileMenuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-outline-variant/30 py-4 px-margin-mobile flex flex-col gap-4 shadow-inner">
          {isAuthenticated ? (
            <>
              {isRecruiter ? (
                <>
                  <Link to="/candidates" onClick={() => setMobileMenuOpen(false)} className="text-on-surface-variant dark:text-slate-300 hover:text-primary font-semibold">Discover</Link>
                  <Link to="/shortlisted" onClick={() => setMobileMenuOpen(false)} className="text-on-surface-variant dark:text-slate-300 hover:text-primary font-semibold">Shortlisted</Link>
                  <Link to="/analytics" onClick={() => setMobileMenuOpen(false)} className="text-on-surface-variant dark:text-slate-300 hover:text-primary font-semibold">Analytics</Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-on-surface-variant dark:text-slate-300 hover:text-primary font-semibold">My Profile</Link>
                  <Link to="/upload" onClick={() => setMobileMenuOpen(false)} className="text-on-surface-variant dark:text-slate-300 hover:text-primary font-semibold">Upload Resume</Link>
                </>
              )}
              <Link to="/settings" onClick={() => setMobileMenuOpen(false)} className="text-on-surface-variant dark:text-slate-300 hover:text-primary font-semibold">Settings</Link>
              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="text-error font-semibold flex items-center gap-2 text-left"
              >
                <FiLogOut /> Sign Out
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-center text-primary font-semibold py-2 border border-primary/20 rounded-lg">
                Sign In
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="text-center bg-primary text-on-primary font-bold py-2 rounded-lg">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
      {/* Premium Upgrade Modal */}
      <PremiumUpgradeModal 
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
      />
    </nav>
  );
};

export default Navbar;
