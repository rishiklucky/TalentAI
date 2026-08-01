import React, { useState } from 'react';
import PremiumGatedContainer from '../components/PremiumGatedContainer';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { premiumAPI } from '../services/api';
import { FiCpu, FiPlus, FiAlertCircle, FiCheck, FiArrowUpRight, FiSearch } from 'react-icons/fi';
import { toast } from 'react-toastify';

const ResumeOptimizerContent = () => {
  const [company, setCompany] = useState('Google');
  const [role, setRole] = useState('Software Engineer');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleOptimize = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await premiumAPI.optimizeResume({ company, role });
      setResult(res.data);
      toast.success('Resume optimized successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to optimize resume.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="font-headline-lg text-3xl font-extrabold text-on-background dark:text-white flex items-center gap-3">
          <FiCpu className="text-primary text-3xl" /> AI Resume Optimizer
        </h1>
        <p className="font-body-md text-sm text-on-surface-variant dark:text-slate-400">
          Optimize your resume for applicant tracking systems (ATS) of specific organizations.
        </p>
      </div>

      {/* Target Form */}
      <form onSubmit={handleOptimize} className="glass-card p-6 rounded-3xl border border-outline-variant/30 dark:border-slate-800/40 flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 space-y-2">
          <label className="font-label-caps text-xs font-bold text-outline dark:text-slate-400 uppercase tracking-wider block">Target Company</label>
          <select 
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full px-4 py-3 bg-surface-container dark:bg-slate-800 border border-outline-variant/40 dark:border-slate-700 rounded-xl text-on-background dark:text-white focus:outline-none focus:border-primary text-sm"
          >
            <option value="Google">Google</option>
            <option value="Microsoft">Microsoft</option>
            <option value="Meta">Meta</option>
            <option value="Amazon">Amazon</option>
            <option value="Netflix">Netflix</option>
            <option value="Apple">Apple</option>
            <option value="Stripe">Stripe</option>
            <option value="Uber">Uber</option>
          </select>
        </div>

        <div className="flex-1 space-y-2">
          <label className="font-label-caps text-xs font-bold text-outline dark:text-slate-400 uppercase tracking-wider block">Target Role</label>
          <select 
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-3 bg-surface-container dark:bg-slate-800 border border-outline-variant/40 dark:border-slate-700 rounded-xl text-on-background dark:text-white focus:outline-none focus:border-primary text-sm"
          >
            <option value="Software Engineer">Software Engineer</option>
            <option value="Frontend Engineer">Frontend Engineer</option>
            <option value="Backend Engineer">Backend Engineer</option>
            <option value="Full Stack Developer">Full Stack Developer</option>
            <option value="Data Scientist">Data Scientist</option>
            <option value="Product Manager">Product Manager</option>
            <option value="Cloud Architect">Cloud Architect</option>
          </select>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="bg-primary hover:bg-primary-container text-on-primary font-bold px-8 py-3.5 rounded-xl hover:shadow-lg transition-all hover:scale-95 disabled:opacity-50 text-sm whitespace-nowrap"
        >
          {loading ? 'Analyzing Profile...' : 'Optimize Profile'}
        </button>
      </form>

      {/* Results Dashboard */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
          {/* Left Column: ATS Score gauge */}
          <div className="glass-card p-6 rounded-3xl border border-outline-variant/30 dark:border-slate-800/40 space-y-6 flex flex-col justify-between">
            <div className="space-y-1">
              <h3 className="font-headline-sm text-lg font-bold text-on-background dark:text-white">ATS Benchmarking</h3>
              <p className="text-xs text-outline dark:text-slate-400">Score projections based on candidate profile.</p>
            </div>

            {/* Score Ring */}
            <div className="flex justify-around items-center gap-4 py-4">
              <div className="text-center space-y-2">
                <div className="relative w-28 h-28 flex items-center justify-center rounded-full border-4 border-slate-200 dark:border-slate-800">
                  <div className="text-center">
                    <span className="text-3xl font-extrabold text-slate-500 dark:text-slate-400">{result.currentScore}</span>
                    <span className="text-xs block text-slate-400">%</span>
                  </div>
                </div>
                <span className="text-xs text-outline dark:text-slate-400 font-bold uppercase tracking-wider block">Current</span>
              </div>

              <div className="text-center space-y-2">
                <div className="relative w-28 h-28 flex items-center justify-center rounded-full border-4 border-primary/20 dark:border-primary-container/20">
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-primary animate-spin-slow"></div>
                  <div className="text-center relative z-10">
                    <span className="text-3xl font-extrabold text-primary dark:text-inverse-primary">{result.optimizedScore}</span>
                    <span className="text-xs block text-primary/80 dark:text-slate-400">%</span>
                  </div>
                </div>
                <span className="text-xs text-primary dark:text-inverse-primary font-bold uppercase tracking-wider block">Optimized</span>
              </div>
            </div>

            {/* Skill match index progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-on-background dark:text-white">
                <span>Keyword Match Index</span>
                <span>{result.keywordMatch}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-primary h-full rounded-full transition-all duration-1000"
                  style={{ width: `${result.keywordMatch}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Middle Column: Missing Keywords & Suggested Skills */}
          <div className="lg:col-span-2 glass-card p-6 rounded-3xl border border-outline-variant/30 dark:border-slate-800/40 space-y-6">
            <h3 className="font-headline-sm text-lg font-bold text-on-background dark:text-white flex items-center gap-2">
              <FiAlertCircle className="text-amber-500" /> Critical Keyword Gaps
            </h3>
            
            <p className="text-xs text-on-surface-variant dark:text-slate-400">
              Integrating these phrases within your experiences and skills section increases your match probability.
            </p>

            <div className="flex flex-wrap gap-2.5">
              {result.missingKeywords.map((kw, i) => (
                <span 
                  key={i} 
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                >
                  <FiPlus /> {kw}
                </span>
              ))}
            </div>

            <div className="space-y-3 pt-4 border-t border-outline-variant/20">
              <h4 className="text-xs font-bold uppercase tracking-wider text-outline dark:text-slate-400">Recommended Skill Ordering</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {result.skillOrdering.map((group, i) => (
                  <div key={i} className="bg-surface-container dark:bg-slate-800/50 p-3 rounded-xl border border-outline-variant/20 dark:border-slate-800 text-xs text-on-surface dark:text-slate-300">
                    {group}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Full Width Suggestions */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ATS Suggestions */}
            <div className="glass-card p-6 rounded-3xl border border-outline-variant/30 dark:border-slate-800/40 space-y-4">
              <h3 className="font-headline-sm text-md font-bold text-on-background dark:text-white flex items-center gap-2">
                <FiCheck className="text-primary text-lg" /> Formatting & ATS Adjustments
              </h3>
              <ul className="space-y-3">
                {result.atsSuggestions.map((sug, i) => (
                  <li key={i} className="flex gap-2.5 text-xs text-on-surface-variant dark:text-slate-300 leading-snug">
                    <span className="text-primary font-bold mt-0.5">•</span>
                    <span>{sug}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resume Bullet Optimizations */}
            <div className="glass-card p-6 rounded-3xl border border-outline-variant/30 dark:border-slate-800/40 space-y-4">
              <h3 className="font-headline-sm text-md font-bold text-on-background dark:text-white flex items-center gap-2">
                <FiArrowUpRight className="text-primary text-lg" /> AI Bullet Enhancements
              </h3>
              <ul className="space-y-3">
                {result.improvements.map((imp, i) => (
                  <li key={i} className="flex gap-2.5 text-xs text-on-surface-variant dark:text-slate-300 leading-snug">
                    <span className="text-primary font-bold mt-0.5">•</span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Project Enhancements */}
            <div className="glass-card p-6 rounded-3xl border border-outline-variant/30 dark:border-slate-800/40 space-y-4">
              <h3 className="font-headline-sm text-md font-bold text-on-background dark:text-white">
                Suggested Resume Projects
              </h3>
              <ul className="space-y-3">
                {result.strongerProjects.map((proj, i) => (
                  <li key={i} className="bg-primary/5 dark:bg-primary-container/10 p-3.5 rounded-2xl border border-primary/10 text-xs text-on-surface-variant dark:text-slate-300 leading-relaxed">
                    {proj}
                  </li>
                ))}
              </ul>
            </div>

            {/* Recruiter Visibility Tips */}
            <div className="glass-card p-6 rounded-3xl border border-outline-variant/30 dark:border-slate-800/40 space-y-4">
              <h3 className="font-headline-sm text-md font-bold text-on-background dark:text-white">
                Recruiter Visibility & Outreach Tips
              </h3>
              <ul className="space-y-3">
                {result.visibilityTips.map((tip, i) => (
                  <li key={i} className="flex gap-2.5 text-xs text-on-surface-variant dark:text-slate-300 leading-snug">
                    <span className="text-primary font-bold mt-0.5">→</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ResumeOptimizer = () => {
  return (
    <div className="bg-background text-on-background dark:bg-slate-950 dark:text-slate-100 min-h-screen flex flex-col transition-colors duration-300">
      <Navbar />

      <div className="flex-1 flex max-w-container-max w-full mx-auto">
        <Sidebar />

        <main className="flex-1 md:ml-64 p-margin-mobile md:p-margin-desktop min-h-[calc(100vh-80px)] py-8">
          <PremiumGatedContainer featureName="AI Resume Optimizer">
            <ResumeOptimizerContent />
          </PremiumGatedContainer>
        </main>
      </div>
    </div>
  );
};

export default ResumeOptimizer;
