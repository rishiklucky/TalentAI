import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { candidateAPI, shortlistAPI, resumeAPI } from '../services/api';
import { 
  FiMapPin, FiCpu, FiGithub, FiLink, FiCheck, FiChevronDown, FiAlertCircle, FiArrowLeft, FiHeart, FiBriefcase, FiBookOpen 
} from 'react-icons/fi';
import { toast } from 'react-toastify';

const CandidateProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeQuestion, setActiveQuestion] = useState(null);

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const res = await candidateAPI.get(id);
        setCandidate(res.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load candidate details.');
        navigate('/candidates');
      } finally {
        setLoading(false);
      }
    };
    fetchCandidate();
  }, [id]);

  const handleToggleShortlist = async () => {
    try {
      const res = await shortlistAPI.toggle(candidate._id);
      
      setCandidate(prev => ({
        ...prev,
        isShortlisted: res.data.isShortlisted
      }));

      toast.success(res.data.message);
    } catch (err) {
      console.error(err);
      toast.error('Failed to toggle shortlist.');
    }
  };

  const handleViewResume = async () => {
    try {
      const res = await resumeAPI.viewCandidate(id);
      const file = new Blob([res.data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    } catch (err) {
      console.error(err);
      toast.error('Failed to open candidate resume document.');
    }
  };

  if (loading) {
    return (
      <div className="bg-background text-on-background dark:bg-slate-950 dark:text-slate-100 min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="font-label-caps text-label-caps uppercase text-outline">Parsing Candidate Profile...</p>
          </div>
        </div>
      </div>
    );
  }

  const { analysis } = candidate || {};

  return (
    <div className="bg-background text-on-background dark:bg-slate-950 dark:text-slate-100 min-h-screen flex flex-col transition-colors duration-300">
      <Navbar />

      <div className="flex-1 flex max-w-container-max w-full mx-auto">
        <Sidebar />

        <main className="flex-1 md:ml-64 p-margin-mobile md:p-margin-desktop min-h-[calc(100vh-80px)] space-y-gutter">
          
          {/* Back button */}
          <div className="flex items-center justify-between">
            <Link to="/candidates" className="text-sm font-bold text-outline dark:text-slate-400 hover:text-primary transition-colors flex items-center gap-2">
              <FiArrowLeft /> Back to Candidates
            </Link>
            <div className="flex items-center gap-3">
              <button
                onClick={handleViewResume}
                className="px-5 py-2.5 border border-outline-variant/60 dark:border-slate-700 text-on-background dark:text-slate-200 rounded-xl font-bold text-sm hover:bg-surface-container-high transition-all flex items-center gap-2"
              >
                <FiBookOpen /> View Resume
              </button>
              <button
                onClick={handleToggleShortlist}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                  candidate.isShortlisted 
                    ? 'bg-error-container/10 border border-error/20 text-error hover:bg-error-container/20' 
                    : 'bg-primary text-on-primary hover:shadow-lg active:scale-95 duration-150'
                }`}
              >
                <FiHeart className={candidate.isShortlisted ? 'fill-current' : ''} />
                {candidate.isShortlisted ? 'Shortlisted' : 'Shortlist Candidate'}
              </button>
            </div>
          </div>

          {/* Header Title Card */}
          <div className="glass-card rounded-[24px] p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border border-outline-variant/30">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-primary flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {candidate.name ? candidate.name[0] : 'S'}
              </div>
              <div className="space-y-2">
                <h1 className="font-headline-md text-2xl md:text-3xl font-extrabold text-on-background dark:text-white leading-none">
                  {candidate.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-on-surface-variant dark:text-slate-400">
                  <span className="flex items-center gap-1 font-semibold">
                    <FiCpu /> {candidate.title || 'Developer'}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiMapPin /> {candidate.location || 'Remote'}
                  </span>
                  {candidate.college && (
                    <span className="flex items-center gap-1">
                      <FiBookOpen /> {candidate.college}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="flex items-center gap-3">
              {candidate.github && (
                <a href={candidate.github} target="_blank" rel="noreferrer" className="p-3 bg-surface-container dark:bg-slate-800 rounded-xl hover:text-primary transition-all">
                  <FiGithub className="text-xl" />
                </a>
              )}
              {candidate.portfolio && (
                <a href={candidate.portfolio} target="_blank" rel="noreferrer" className="p-3 bg-surface-container dark:bg-slate-800 rounded-xl hover:text-primary transition-all">
                  <FiLink className="text-xl" />
                </a>
              )}
            </div>
          </div>

          {/* Profile Bio */}
          {candidate.bio && (
            <div className="bg-white dark:bg-slate-900 rounded-[24px] p-6 border border-outline-variant/20">
              <h3 className="font-headline-sm text-lg font-bold mb-3">Professional Statement</h3>
              <p className="font-body-md text-on-surface-variant dark:text-slate-400 leading-relaxed">{candidate.bio}</p>
            </div>
          )}

          {/* AI Metrics vs Details grid */}
          {!analysis ? (
            <div className="bg-white dark:bg-slate-900 rounded-[24px] p-8 text-center border border-outline-variant/20">
              <p className="text-outline">No AI analysis reports have been indexed for this candidate yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
              
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-gutter">
                
                {/* Skill align */}
                <div className="bg-white dark:bg-slate-900 rounded-[24px] p-6 md:p-8 border border-outline-variant/20">
                  <h3 className="font-headline-sm text-xl font-bold mb-6">Skill Alignment & Match Metrics</h3>
                  <div className="space-y-5">
                    {analysis.skillGap && analysis.skillGap.map((gap, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between items-center text-sm font-semibold">
                          <span className="text-on-background dark:text-slate-200">{gap.skill}</span>
                          <span className={gap.matchPercentage >= 75 ? 'text-tertiary' : 'text-primary'}>
                            {gap.matchPercentage}% Alignment
                          </span>
                        </div>
                        <div className="w-full h-3.5 bg-surface-container-high dark:bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              gap.matchPercentage >= 80 ? 'bg-tertiary' : gap.matchPercentage >= 60 ? 'bg-primary' : 'bg-secondary'
                            }`} 
                            style={{ width: `${gap.matchPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Interview Questions Accordion */}
                <div className="bg-white dark:bg-slate-900 rounded-[24px] p-6 md:p-8 border border-outline-variant/20">
                  <h3 className="font-headline-sm text-xl font-bold mb-6">Suggested Candidate Interview Questions</h3>
                  <div className="space-y-4">
                    {analysis.interviewQuestions && analysis.interviewQuestions.map((q, i) => (
                      <div key={i} className="border border-outline-variant/30 rounded-xl overflow-hidden">
                        <button
                          onClick={() => setActiveQuestion(activeQuestion === i ? null : i)}
                          className="w-full flex items-center justify-between p-5 text-left hover:bg-surface-container-low dark:hover:bg-slate-800 transition-all font-semibold focus:outline-none"
                        >
                          <div className="space-y-1">
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-label-caps text-primary bg-primary/5 dark:bg-primary-container/20 uppercase tracking-wider mb-2">
                              {q.category || 'Technical'}
                            </span>
                            <p className="text-on-background dark:text-slate-200 text-sm md:text-base leading-snug">{q.question}</p>
                          </div>
                          <FiChevronDown className={`text-xl text-outline transition-transform duration-300 ${activeQuestion === i ? 'rotate-180' : ''} flex-shrink-0 ml-4`} />
                        </button>
                        
                        {activeQuestion === i && (
                          <div className="p-5 border-t border-outline-variant/20 bg-surface-container-low/50 dark:bg-slate-900/50 space-y-3">
                            <p className="text-xs font-label-caps text-outline dark:text-slate-400 uppercase tracking-widest">
                              Evaluation guidelines & target responses:
                            </p>
                            <p className="font-body-md text-sm text-on-surface-variant dark:text-slate-300 leading-relaxed">
                              {q.hints}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Edu & Exp */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                  
                  <div className="bg-white dark:bg-slate-900 rounded-[24px] p-6 border border-outline-variant/20">
                    <h3 className="font-headline-sm text-lg font-bold mb-4 flex items-center gap-2 text-primary">
                      <FiBriefcase /> Experience
                    </h3>
                    <div className="space-y-4">
                      {candidate.experience && candidate.experience.length > 0 ? (
                        candidate.experience.map((exp, i) => (
                          <div key={i} className="border-l-2 border-outline-variant/40 pl-4 space-y-1">
                            <h4 className="font-body-md font-bold text-sm text-on-background dark:text-white leading-tight">{exp.title}</h4>
                            <p className="text-xs text-on-surface-variant dark:text-slate-400 font-semibold">{exp.company} | {exp.year}</p>
                            <p className="text-xs text-outline dark:text-slate-500 leading-relaxed">{exp.description}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-outline dark:text-slate-500">No experience logged.</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 rounded-[24px] p-6 border border-outline-variant/20">
                    <h3 className="font-headline-sm text-lg font-bold mb-4 flex items-center gap-2 text-secondary">
                      <FiBookOpen /> Education
                    </h3>
                    <div className="space-y-4">
                      {candidate.education && candidate.education.length > 0 ? (
                        candidate.education.map((edu, i) => (
                          <div key={i} className="border-l-2 border-outline-variant/40 pl-4 space-y-1">
                            <h4 className="font-body-md font-bold text-sm text-on-background dark:text-white leading-tight">{edu.degree}</h4>
                            <p className="text-xs text-on-surface-variant dark:text-slate-400 font-semibold">{edu.school} | {edu.year}</p>
                            <p className="text-xs text-outline dark:text-slate-500 leading-relaxed">{edu.description}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-outline dark:text-slate-500">No education logged.</p>
                      )}
                    </div>
                  </div>

                </div>

              </div>

              {/* Right Column - Suitability Index */}
              <div className="space-y-gutter">
                
                {/* Radial suitability */}
                <div className="bg-white dark:bg-slate-900 rounded-[24px] p-6 border border-outline-variant/20 flex flex-col items-center justify-center text-center space-y-6">
                  <h3 className="font-headline-sm text-base font-bold text-outline dark:text-slate-400 uppercase tracking-widest">
                    Suitability Index
                  </h3>
                  
                  {/* Gauge */}
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" fill="transparent" stroke="rgba(226, 232, 240, 0.5)" strokeWidth="8" />
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="42" 
                        fill="transparent" 
                        stroke="url(#gradientScoreCand)" 
                        strokeWidth="8"
                        strokeDasharray={Math.PI * 2 * 42}
                        strokeDashoffset={((100 - (analysis.candidateScore || 0)) / 100) * (Math.PI * 2 * 42)}
                        className="skill-ring"
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="gradientScoreCand" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#2563eb" />
                          <stop offset="100%" stopColor="#7c3aed" />
                        </linearGradient>
                      </defs>
                    </svg>
                    
                    <div className="absolute flex flex-col items-center">
                      <span className="font-stats-number text-3xl font-extrabold">{analysis.candidateScore || 0}%</span>
                      <span className="text-[10px] font-label-caps uppercase text-outline dark:text-slate-400">Match Rate</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="bg-primary/5 text-primary dark:bg-primary-container/20 dark:text-primary-fixed px-3 py-1 rounded-full text-xs font-bold uppercase">
                      {analysis.recommendation || 'Match'}
                    </span>
                  </div>

                  <p className="font-body-sm text-xs text-on-surface-variant dark:text-slate-400 leading-relaxed">
                    {analysis.summary}
                  </p>
                </div>

                {/* Strengths */}
                <div className="bg-white dark:bg-slate-900 rounded-[24px] p-6 border border-outline-variant/20">
                  <h3 className="font-headline-sm text-lg font-bold mb-4 text-tertiary">Primary Suitability Strengths</h3>
                  <ul className="space-y-3">
                    {analysis.strengths && analysis.strengths.map((str, i) => (
                      <li key={i} className="flex gap-3 text-sm">
                        <FiCheck className="text-tertiary text-lg flex-shrink-0 mt-0.5" />
                        <span className="text-on-surface-variant dark:text-slate-300 leading-snug">{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Growth Areas */}
                <div className="bg-white dark:bg-slate-900 rounded-[24px] p-6 border border-outline-variant/20">
                  <h3 className="font-headline-sm text-lg font-bold mb-4 text-secondary">Growth Areas / Deficiencies</h3>
                  <ul className="space-y-3">
                    {analysis.weaknesses && analysis.weaknesses.map((weak, i) => (
                      <li key={i} className="flex gap-3 text-sm">
                        <FiAlertCircle className="text-secondary text-lg flex-shrink-0 mt-0.5" />
                        <span className="text-on-surface-variant dark:text-slate-300 leading-snug">{weak}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default CandidateProfile;
