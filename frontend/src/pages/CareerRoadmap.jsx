import React, { useState } from 'react';
import PremiumGatedContainer from '../components/PremiumGatedContainer';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { premiumAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FiCompass, FiBriefcase, FiBookOpen, FiActivity, FiCpu, FiBookmark, FiList, FiCheckSquare, FiAward } from 'react-icons/fi';
import { toast } from 'react-toastify';

const CareerRoadmapContent = () => {
  const { user } = useAuth();
  const [targetCompany, setTargetCompany] = useState('Google');
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [currentSkills, setCurrentSkills] = useState(user?.skills ? user.skills.join(', ') : '');
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!targetCompany || !targetRole) {
      toast.warn('Please provide a target company and role.');
      return;
    }
    setLoading(true);
    try {
      const res = await premiumAPI.careerRoadmap({ currentSkills, targetCompany, targetRole });
      setRoadmap(res.data);
      toast.success('AI Career Roadmap generated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate career roadmap.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="font-headline-lg text-3xl font-extrabold text-on-background dark:text-white flex items-center gap-3">
          <FiCompass className="text-primary text-3xl animate-spin-slow" /> AI Career Roadmap
        </h1>
        <p className="font-body-md text-sm text-on-surface-variant dark:text-slate-400">
          Create a personalized, step-by-step curriculum to crack interviews at your dream companies.
        </p>
      </div>

      {/* Inputs Form */}
      <form onSubmit={handleGenerate} className="glass-card p-6 rounded-3xl border border-outline-variant/30 dark:border-slate-800/40 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="font-label-caps text-xs font-bold text-outline dark:text-slate-400 uppercase tracking-wider block">Target Company</label>
            <select 
              value={targetCompany}
              onChange={(e) => setTargetCompany(e.target.value)}
              className="w-full px-4 py-3 bg-surface-container dark:bg-slate-800 border border-outline-variant/40 dark:border-slate-700 rounded-xl text-on-background dark:text-white focus:outline-none focus:border-primary text-sm"
            >
              <option value="Google">Google</option>
              <option value="Microsoft">Microsoft</option>
              <option value="Meta">Meta</option>
              <option value="Amazon">Amazon</option>
              <option value="Apple">Apple</option>
              <option value="Stripe">Stripe</option>
              <option value="Netflix">Netflix</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="font-label-caps text-xs font-bold text-outline dark:text-slate-400 uppercase tracking-wider block">Target Role</label>
            <select 
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full px-4 py-3 bg-surface-container dark:bg-slate-800 border border-outline-variant/40 dark:border-slate-700 rounded-xl text-on-background dark:text-white focus:outline-none focus:border-primary text-sm"
            >
              <option value="Software Engineer">Software Engineer</option>
              <option value="Frontend Engineer">Frontend Engineer</option>
              <option value="Backend Engineer">Backend Engineer</option>
              <option value="Full Stack Developer">Full Stack Developer</option>
              <option value="Data Scientist">Data Scientist</option>
              <option value="Product Manager">Product Manager</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="font-label-caps text-xs font-bold text-outline dark:text-slate-400 uppercase tracking-wider block">My Current Skills</label>
            <input 
              type="text" 
              placeholder="React, Node, Python..." 
              value={currentSkills}
              onChange={(e) => setCurrentSkills(e.target.value)}
              className="w-full px-4 py-3 bg-surface-container dark:bg-slate-800 border border-outline-variant/40 dark:border-slate-700 rounded-xl text-on-background dark:text-white focus:outline-none focus:border-primary text-sm"
            />
          </div>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary-container text-on-primary font-bold py-3.5 rounded-xl hover:shadow-lg transition-all hover:scale-95 disabled:opacity-50 text-sm"
        >
          {loading ? 'Consulting Advisor AI...' : 'Generate Learning Roadmap'}
        </button>
      </form>

      {/* Roadmap Output */}
      {roadmap && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
          
          {/* Timeline - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-6 rounded-3xl border border-outline-variant/30 dark:border-slate-800/40 space-y-6">
              <h3 className="font-headline-sm text-lg font-bold text-on-background dark:text-white flex items-center gap-2">
                <FiActivity className="text-primary text-xl" /> Curated Learning Timeline
              </h3>
              
              <div className="relative pl-6 border-l-2 border-primary/20 dark:border-slate-800 space-y-8">
                {roadmap.learningRoadmap.map((phase, i) => (
                  <div key={i} className="relative">
                    {/* Ring dot */}
                    <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-primary border-4 border-white dark:border-slate-900 shadow-md"></div>
                    
                    <div className="space-y-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                        <h4 className="text-sm font-extrabold text-on-background dark:text-white">{phase.phase}</h4>
                        <span className="inline-block bg-primary/10 text-primary dark:bg-primary-container/20 dark:text-inverse-primary text-[10px] font-bold px-2 py-0.5 rounded-full w-fit">
                          {phase.duration}
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant dark:text-slate-300 leading-relaxed">
                        {phase.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Detailed Checklist Plan */}
            <div className="glass-card p-6 rounded-3xl border border-outline-variant/30 dark:border-slate-800/40 space-y-6">
              <h3 className="font-headline-sm text-lg font-bold text-on-background dark:text-white flex items-center gap-2">
                <FiList className="text-primary text-xl" /> Weekly Study Planner
              </h3>

              <div className="space-y-4">
                {roadmap.weeklyPlan.map((week, idx) => (
                  <div key={idx} className="bg-surface-container dark:bg-slate-800/40 p-4 rounded-2xl border border-outline-variant/10">
                    <div className="flex items-center gap-2 mb-2">
                      <FiBookmark className="text-primary" />
                      <span className="font-bold text-xs text-primary uppercase tracking-widest">{week.week}</span>
                      <span className="text-xs text-outline dark:text-slate-400 font-semibold">• {week.topic}</span>
                    </div>
                    
                    <ul className="space-y-2 pl-6">
                      {week.tasks.map((task, tIdx) => (
                        <li key={tIdx} className="flex items-start gap-2.5 text-xs text-on-surface dark:text-slate-300 leading-snug">
                          <input type="checkbox" className="mt-0.5 rounded border-outline-variant/50 focus:ring-primary text-primary" />
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Recommendations & Projects */}
          <div className="space-y-6">
            
            {/* Tech Stack */}
            <div className="glass-card p-6 rounded-3xl border border-outline-variant/30 dark:border-slate-800/40 space-y-4">
              <h3 className="font-headline-sm text-md font-bold text-on-background dark:text-white flex items-center gap-2">
                <FiCpu className="text-primary" /> Recommended Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {roadmap.recommendedTechnologies.map((tech, i) => (
                  <span key={i} className="bg-slate-100 dark:bg-slate-800 text-on-surface-variant dark:text-slate-300 px-3 py-1.5 rounded-xl text-xs font-bold border border-outline-variant/10">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="glass-card p-6 rounded-3xl border border-outline-variant/30 dark:border-slate-800/40 space-y-4">
              <h3 className="font-headline-sm text-md font-bold text-on-background dark:text-white flex items-center gap-2">
                <FiAward className="text-primary" /> Recommended Certifications
              </h3>
              <ul className="space-y-3">
                {roadmap.certifications.map((cert, i) => (
                  <li key={i} className="flex gap-2 text-xs text-on-surface-variant dark:text-slate-300 leading-snug">
                    <span className="text-primary font-bold">•</span>
                    <span>{cert}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Projects to Build */}
            <div className="glass-card p-6 rounded-3xl border border-outline-variant/30 dark:border-slate-800/40 space-y-4">
              <h3 className="font-headline-sm text-md font-bold text-on-background dark:text-white">
                Core Portfolio Projects
              </h3>
              <div className="space-y-4">
                {roadmap.projectsToBuild.map((p, i) => (
                  <div key={i} className="bg-primary/5 dark:bg-primary-container/15 p-4 rounded-2xl border border-primary/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-on-background dark:text-white">{p.title}</span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        p.difficulty === 'Hard' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'
                      }`}>
                        {p.difficulty}
                      </span>
                    </div>
                    <p className="text-[11px] text-on-surface-variant dark:text-slate-400 leading-relaxed">
                      {p.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Interview milestones */}
            <div className="glass-card p-6 rounded-3xl border border-outline-variant/30 dark:border-slate-800/40 space-y-4">
              <h3 className="font-headline-sm text-md font-bold text-on-background dark:text-white flex items-center gap-2">
                <FiCheckSquare className="text-primary" /> Interview Prep Milestones
              </h3>
              <div className="space-y-3">
                {roadmap.interviewTimeline.map((item, i) => (
                  <div key={i} className="flex items-start justify-between gap-2 text-xs">
                    <div>
                      <strong className="block text-on-background dark:text-white font-semibold">{item.milestone}</strong>
                      <span className="text-on-surface-variant dark:text-slate-400">{item.focus}</span>
                    </div>
                    <span className="text-[9px] font-bold bg-secondary/15 text-secondary dark:text-secondary-fixed-dim px-2 py-0.5 rounded-full flex-shrink-0">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
};

const CareerRoadmap = () => {
  return (
    <div className="bg-background text-on-background dark:bg-slate-950 dark:text-slate-100 min-h-screen flex flex-col transition-colors duration-300">
      <Navbar />

      <div className="flex-1 flex max-w-container-max w-full mx-auto">
        <Sidebar />

        <main className="flex-1 md:ml-64 p-margin-mobile md:p-margin-desktop min-h-[calc(100vh-80px)] py-8">
          <PremiumGatedContainer featureName="AI Career Roadmap">
            <CareerRoadmapContent />
          </PremiumGatedContainer>
        </main>
      </div>
    </div>
  );
};

export default CareerRoadmap;
