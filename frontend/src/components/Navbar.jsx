import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  FiMenu, FiX, FiSun, FiMoon, FiBell, FiSettings, FiLogOut, FiAward,
  FiGrid, FiUsers, FiHeart, FiBarChart2, FiUploadCloud, FiUser, FiCpu, FiCompass, FiHelpCircle, FiLock
} from 'react-icons/fi';
import PremiumUpgradeModal from './PremiumUpgradeModal';

const Navbar = () => {
  const { user, logout, isAuthenticated, isRecruiter, isStudent, isPremium } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close open menus automatically on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [location.pathname]);

  // Click outside listener for user profile dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleProfileDropdown = () => {
    if (!profileDropdownOpen) {
      setMobileMenuOpen(false);
    }
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  const handleAvatarClick = () => {
    if (window.innerWidth < 768) {
      toggleMobileMenu();
    } else {
      toggleProfileDropdown();
    }
  };

  const toggleMobileMenu = () => {
    if (!mobileMenuOpen) {
      setProfileDropdownOpen(false);
    }
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = (name) => {
    if (!name) return 'TA';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
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

  const mobileNavLinks = isRecruiter ? recruiterLinks : studentLinks;

  return (
    <>
      <nav className="bg-surface/70 dark:bg-slate-900/80 backdrop-blur-xl border-b border-outline-variant/30 shadow-sm sticky top-0 z-50 transition-all duration-300">
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-4 max-w-container-max mx-auto">
        
        {/* Logo */}
        <div className="flex items-center gap-stack-lg">
          <Link to="/" className="font-headline-md text-headline-md font-bold text-primary dark:text-inverse-primary">
            TalentAI
          </Link>
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

              {/* User Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={handleAvatarClick}
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

                    <button 
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-error hover:bg-error-container/10 transition-colors text-left font-semibold"
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
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-full text-outline dark:text-slate-400"
          >
            {mobileMenuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-outline-variant/30 py-4 px-margin-mobile flex flex-col gap-3 shadow-xl max-h-[85vh] overflow-y-auto">
          {isAuthenticated ? (
            <>
              {/* Portal Header Card */}
              <div className="flex items-center gap-3 p-3 bg-surface-container-low dark:bg-slate-800 rounded-xl mb-1">
                <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-md text-white text-xl flex-shrink-0">
                  {isRecruiter ? <FiUsers /> : <FiUser />}
                </div>
                <div className="min-w-0">
                  <h2 className="font-headline-sm text-sm font-extrabold text-primary dark:text-inverse-primary leading-none truncate">
                    {isRecruiter ? 'Recruiter Portal' : 'Student Portal'}
                  </h2>
                  <p className="text-[10px] font-label-caps text-outline dark:text-slate-400 uppercase tracking-widest mt-1">
                    {isPremium ? 'PREMIUM TIER' : 'TALENT POOL'}
                  </p>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="flex flex-col gap-1">
                {mobileNavLinks.map((link) => {
                  const isLocked = link.premium && !isPremium;

                  if (isLocked) {
                    return (
                      <button
                        key={link.path}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setUpgradeModalOpen(true);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-body-md text-on-surface-variant dark:text-slate-400 hover:bg-surface-container-high dark:hover:bg-slate-800 text-left transition-all"
                      >
                        <span className="text-lg text-outline">{link.icon}</span>
                        <span className="font-medium text-sm">{link.name}</span>
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
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-body-md transition-all ${
                        isActive 
                          ? 'bg-primary/5 dark:bg-primary-container/20 text-primary dark:text-primary-fixed-dim font-bold border-l-4 border-primary' 
                          : 'text-on-surface-variant dark:text-slate-300 hover:bg-surface-container-high dark:hover:bg-slate-800 font-medium text-sm'
                      }`}
                    >
                      <span className="text-lg">{link.icon}</span>
                      <span>{link.name}</span>
                      {link.premium && (
                        <span className="ml-auto text-[10px] bg-gradient-primary text-white px-1.5 py-0.5 rounded flex items-center gap-1 font-bold font-label-caps shadow-sm">
                          PRO
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>

              {/* Bottom Footer Actions */}
              <div className="border-t border-outline-variant/20 pt-2 mt-1 flex flex-col gap-1">
                <a 
                  href="#" 
                  className="flex items-center gap-3 px-3 py-2 text-on-surface-variant dark:text-slate-400 hover:text-primary transition-all text-sm font-medium"
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileMenuOpen(false);
                  }}
                >
                  <FiHelpCircle className="text-lg" />
                  <span>Help Center</span>
                </a>
                <button 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-3 px-3 py-2 text-error hover:bg-error-container/10 transition-all text-sm font-semibold text-left rounded-lg"
                >
                  <FiLogOut className="text-lg text-error" />
                  <span>Sign Out</span>
                </button>
              </div>
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
    </nav>
      {/* Premium Upgrade Modal */}
      <PremiumUpgradeModal 
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
      />
    </>
  );
};

export default Navbar;
