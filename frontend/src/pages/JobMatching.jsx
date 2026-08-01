import React, { useState } from 'react';
import PremiumGatedContainer from '../components/PremiumGatedContainer';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { premiumAPI } from '../services/api';
import { FiCpu, FiCheckCircle, FiXCircle, FiTrendingUp, FiSearch, FiFileText } from 'react-icons/fi';
import { toast } from 'react-toastify';

const JobMatchingContent = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState([]);
  const [analyzed, setAnalyzed] = useState(false);

  const handleMatch = async (e) => {
    e.preventDefault();
    if (!jobDescription.trim()) {
      toast.warn('Please enter a job description.');
      return;
    }
    setLoading(true);
    try {
      const res = await premiumAPI.jobMatch({ jobDescription });
      setMatches(res.data.matches || []);
      setAnalyzed(true);
      toast.success('Candidates ranked successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to analyze candidates.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="font-headline-lg text-3xl font-extrabold text-on-background dark:text-white flex items-center gap-3">
          <FiCpu className="text-secondary text-3xl" /> AI Job Description Matching
        </h1>
        <p className="font-body-md text-sm text-on-surface-variant dark:text-slate-400">
          Paste a Job Description to instantly parse and rank all candidates in the talent pool by skill alignment.
        </p>
      </div>

      {/* JD Form */}
      <form onSubmit={handleMatch} className="glass-card p-6 rounded-3xl border border-outline-variant/30 dark:border-slate-800/40 space-y-4">
        <div className="space-y-2">
          <label className="font-label-caps text-xs font-bold text-outline dark:text-slate-400 uppercase tracking-wider block">Job Description</label>
          <textarea 
            rows="6"
            placeholder="Paste complete job requirements, core technologies, and experience standards here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="w-full px-4 py-3 bg-surface-container dark:bg-slate-800 border border-outline-variant/40 dark:border-slate-700 rounded-2xl text-on-background dark:text-white focus:outline-none focus:border-primary text-sm font-mono leading-relaxed"
          ></textarea>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-secondary hover:bg-secondary-container text-white font-bold py-3.5 rounded-xl hover:shadow-lg transition-all hover:scale-95 disabled:opacity-50 text-sm flex items-center justify-center gap-2"
        >
          {loading ? 'Comparing Candidate Pool...' : 'Rank Candidates'}
        </button>
      </form>

      {/* Rankings Output */}
      {analyzed && (
        <div className="space-y-6 animate-fade-in">
          <h3 className="font-headline-sm text-lg font-bold text-on-background dark:text-white flex items-center gap-2">
            <FiTrendingUp className="text-secondary" /> AI Recommended Rankings
          </h3>

          {matches.length === 0 ? (
            <div className="text-center py-12 glass-card rounded-3xl border border-outline-variant/30">
              <FiSearch className="text-4xl text-outline mx-auto mb-2" />
              <p className="text-sm text-outline dark:text-slate-400">No candidates available or matching this criteria.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {matches.map((match, index) => (
                <div 
                  key={match.candidateId} 
                  className={`glass-card p-6 rounded-3xl border transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
                    match.ranking === 'Strong Match' 
                      ? 'border-primary/20 bg-primary/5 dark:bg-primary-container/5' 
                      : 'border-outline-variant/30'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    
                    {/* Candidate Identity */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-secondary/10 dark:bg-secondary-container/20 text-secondary text-xs flex items-center justify-center font-extrabold">
                          #{index + 1}
                        </span>
                        <h4 className="font-bold text-on-background dark:text-white">{match.candidateName}</h4>
                      </div>
                      <p className="text-xs text-outline dark:text-slate-400">{match.candidateTitle || 'Software Developer'}</p>
                    </div>

                    {/* Match Score Gauge */}
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <span className="text-2xl font-extrabold text-secondary dark:text-secondary-fixed-dim">{match.matchPercentage}%</span>
                        <span className="text-[10px] block text-outline dark:text-slate-400 uppercase font-bold tracking-widest">Match Index</span>
                      </div>

                      <span className={`text-xs font-bold px-3 py-1 rounded-full font-label-caps ${
                        match.ranking === 'Strong Match' 
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                          : match.ranking === 'Moderate Match' 
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' 
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                      }`}>
                        {match.ranking}
                      </span>
                    </div>

                  </div>

                  {/* Skills Audit */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-4 border-t border-outline-variant/20">
                    {/* Matched */}
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                        <FiCheckCircle /> Matched Competencies
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {match.matchedSkills.map((s, idx) => (
                          <span key={idx} className="bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs px-2.5 py-1 rounded-xl border border-emerald-500/10">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Missing */}
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                        <FiXCircle /> Identified Skill Gaps
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {match.missingSkills.map((s, idx) => (
                          <span key={idx} className="bg-rose-500/5 text-rose-600 dark:text-rose-400 text-xs px-2.5 py-1 rounded-xl border border-rose-500/10">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const JobMatching = () => {
  return (
    <div className="bg-background text-on-background dark:bg-slate-950 dark:text-slate-100 min-h-screen flex flex-col transition-colors duration-300">
      <Navbar />

      <div className="flex-1 flex max-w-container-max w-full mx-auto">
        <Sidebar />

        <main className="flex-1 md:ml-64 p-margin-mobile md:p-margin-desktop min-h-[calc(100vh-80px)] py-8">
          <PremiumGatedContainer featureName="AI Job Description Matching">
            <JobMatchingContent />
          </PremiumGatedContainer>
        </main>
      </div>
    </div>
  );
};

export default JobMatching;
