import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { candidateAPI, shortlistAPI } from '../services/api';
import { 
  FiUsers, FiTrendingUp, FiHeart, FiBriefcase, FiArrowRight, FiCheck, FiMapPin, FiCpu, FiBookmark, FiX 
} from 'react-icons/fi';
import { toast } from 'react-toastify';

const RecruiterDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [shortlisted, setShortlisted] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, shortlistedRes] = await Promise.all([
          candidateAPI.analytics(),
          shortlistAPI.list()
        ]);
        setAnalytics(analyticsRes.data);
        setShortlisted(shortlistedRes.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleToggleShortlist = async (id) => {
    try {
      await shortlistAPI.toggle(id);
      // Refresh shortlisted list
      const res = await shortlistAPI.list();
      setShortlisted(res.data);
      toast.success('Shortlist updated.');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="bg-background text-on-background dark:bg-slate-950 dark:text-slate-100 min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="font-label-caps text-label-caps uppercase text-outline">Loading Recruiter Engine...</p>
          </div>
        </div>
      </div>
    );
  }

  const { stats = {}, topSkills = [], topColleges = [] } = analytics || {};

  return (
    <div className="bg-background text-on-background dark:bg-slate-950 dark:text-slate-100 min-h-screen flex flex-col transition-colors duration-300">
      <Navbar />

      <div className="flex-1 flex max-w-container-max w-full mx-auto">
        <Sidebar />

        <main className="flex-1 md:ml-64 p-margin-mobile md:p-margin-desktop min-h-[calc(100vh-80px)] space-y-gutter">
          
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="font-headline-lg text-2xl md:text-3xl font-extrabold text-on-background dark:text-white leading-tight">
                Enterprise Dashboard
              </h1>
              <p className="font-body-md text-on-surface-variant dark:text-slate-400">
                Discover qualified talent parsed with deep semantic analysis.
              </p>
            </div>
            <Link 
              to="/candidates" 
              className="bg-primary text-on-primary px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2"
            >
              Search Candidates <FiArrowRight />
            </Link>
          </div>

          {/* Bento Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
            
            {/* Total candidates */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-[24px] border border-outline-variant/20 flex items-center justify-between">
              <div className="space-y-2">
                <p className="font-label-caps text-xs text-outline dark:text-slate-400 uppercase tracking-wider font-bold">Total Profiles</p>
                <h3 className="font-stats-number text-3xl font-bold">{stats.totalCandidates}</h3>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-primary/5 dark:bg-slate-800 flex items-center justify-center text-primary text-2xl">
                <FiUsers />
              </div>
            </div>

            {/* Average AI Match Rate */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-[24px] border border-outline-variant/20 flex items-center justify-between">
              <div className="space-y-2">
                <p className="font-label-caps text-xs text-outline dark:text-slate-400 uppercase tracking-wider font-bold">Avg Match Rate</p>
                <h3 className="font-stats-number text-3xl font-bold">{stats.averageScore}%</h3>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-secondary/5 dark:bg-slate-800 flex items-center justify-center text-secondary text-2xl">
                <FiTrendingUp />
              </div>
            </div>

            {/* Shortlisted Candidates */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-[24px] border border-outline-variant/20 flex items-center justify-between">
              <div className="space-y-2">
                <p className="font-label-caps text-xs text-outline dark:text-slate-400 uppercase tracking-wider font-bold">Shortlisted</p>
                <h3 className="font-stats-number text-3xl font-bold">{stats.totalShortlisted}</h3>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-tertiary/5 dark:bg-slate-800 flex items-center justify-center text-tertiary text-2xl">
                <FiHeart />
              </div>
            </div>

            {/* Active jobs */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-[24px] border border-outline-variant/20 flex items-center justify-between">
              <div className="space-y-2">
                <p className="font-label-caps text-xs text-outline dark:text-slate-400 uppercase tracking-wider font-bold">Active Roles</p>
                <h3 className="font-stats-number text-3xl font-bold">{stats.activeJobsCount}</h3>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-orange-500/5 dark:bg-slate-800 flex items-center justify-center text-orange-500 text-2xl">
                <FiBriefcase />
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
            
            {/* Top skills / Top Colleges lists */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-[24px] border border-outline-variant/20 space-y-gutter">
              <div>
                <h3 className="font-headline-sm text-lg font-bold mb-4">Top Talent Skill Sets</h3>
                <div className="space-y-3">
                  {topSkills.map((skill, i) => (
                    <div key={i} className="flex justify-between items-center text-sm font-semibold">
                      <span className="text-on-surface-variant dark:text-slate-300">{skill.skill}</span>
                      <span className="bg-primary/5 text-primary dark:bg-primary-container/20 dark:text-primary-fixed-dim px-2.5 py-0.5 rounded-full text-xs font-bold">
                        {skill.count} Candidates
                      </span>
                    </div>
                  ))}
                  {topSkills.length === 0 && (
                    <p className="text-xs text-outline">No skills mapped yet.</p>
                  )}
                </div>
              </div>

              <hr className="border-outline-variant/20" />

              <div>
                <h3 className="font-headline-sm text-lg font-bold mb-4">Primary Sourcing Universities</h3>
                <div className="space-y-3">
                  {topColleges.map((college, i) => (
                    <div key={i} className="flex justify-between items-center text-sm font-semibold">
                      <span className="text-on-surface-variant dark:text-slate-300 truncate max-w-xs">{college.college}</span>
                      <span className="text-outline dark:text-slate-500">{college.count} Candidates</span>
                    </div>
                  ))}
                  {topColleges.length === 0 && (
                    <p className="text-xs text-outline">No sourcing college logs yet.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Shortlisted Candidate list highlight */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-[24px] border border-outline-variant/20 space-y-gutter">
              <div className="flex justify-between items-center">
                <h3 className="font-headline-sm text-lg font-bold">Shortlisted Candidates Pipeline</h3>
                <Link to="/shortlisted" className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
                  View Full Pipeline <FiArrowRight />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-outline-variant/20 text-outline dark:text-slate-400 font-semibold font-label-caps text-xs uppercase tracking-wider">
                      <th className="pb-3">Candidate</th>
                      <th className="pb-3">Location</th>
                      <th className="pb-3">AI Talent Score</th>
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shortlisted.slice(0, 5).map((item, i) => (
                      <tr key={i} className="border-b border-outline-variant/10 hover:bg-surface-container-low/20 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="py-4 flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                            {item.name ? item.name[0] : 'S'}
                          </div>
                          <div>
                            <p className="font-semibold text-on-background dark:text-white">{item.name}</p>
                            <p className="text-xs text-outline dark:text-slate-400">{item.title || 'Developer'}</p>
                          </div>
                        </td>
                        <td className="py-4 text-on-surface-variant dark:text-slate-400 text-xs">
                          {item.location || 'Remote'}
                        </td>
                        <td className="py-4">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                            item.aiScore >= 85 ? 'bg-tertiary/10 text-tertiary' : 'bg-primary/10 text-primary'
                          }`}>
                            {item.aiScore || 80}% - {item.recommendation || 'Match'}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <Link 
                              to={`/candidates/${item._id}`} 
                              className="text-xs font-bold text-primary border border-primary/20 hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-all"
                            >
                              Profile
                            </Link>
                            <button
                              onClick={() => handleToggleShortlist(item._id)}
                              className="text-error p-2 hover:bg-error-container/10 rounded-lg transition-all"
                            >
                              <FiX className="text-lg" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {shortlisted.length === 0 && (
                      <tr>
                        <td colSpan="4" className="py-8 text-center text-outline dark:text-slate-500 font-body-md">
                          No candidates shortlisted yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>

          </div>

        </main>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
