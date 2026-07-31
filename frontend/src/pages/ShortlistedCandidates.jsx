import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { shortlistAPI } from '../services/api';
import { 
  FiGrid, FiList, FiMapPin, FiCpu, FiTrash2, FiArrowRight, FiBookOpen 
} from 'react-icons/fi';
import { toast } from 'react-toastify';

const ShortlistedCandidates = () => {
  const [shortlisted, setShortlisted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table'); // Default layout is Table

  const fetchShortlist = async () => {
    setLoading(true);
    try {
      const res = await shortlistAPI.list();
      setShortlisted(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load shortlisted candidate pipeline.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShortlist();
  }, []);

  const handleRemoveShortlist = async (id) => {
    try {
      const res = await shortlistAPI.toggle(id);
      // Filter out item locally
      setShortlisted(prev => prev.filter(cand => cand._id !== id));
      toast.success('Removed candidate from shortlist pipeline.');
    } catch (err) {
      console.error(err);
      toast.error('Failed to remove from shortlist.');
    }
  };

  return (
    <div className="bg-background text-on-background dark:bg-slate-950 dark:text-slate-100 min-h-screen flex flex-col transition-colors duration-300">
      <Navbar />

      <div className="flex-1 flex max-w-container-max w-full mx-auto">
        <Sidebar />

        <main className="flex-1 md:ml-64 p-margin-mobile md:p-margin-desktop min-h-[calc(100vh-80px)] space-y-gutter">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-headline-lg text-2xl md:text-3xl font-extrabold text-on-background dark:text-white leading-tight">
                Shortlisted Pipeline
              </h1>
              <p className="font-body-md text-on-surface-variant dark:text-slate-400">
                Manage your bookmarked high-scoring candidates in one place.
              </p>
            </div>
            
            {/* View Toggle */}
            <div className="flex bg-surface-container-low dark:bg-slate-800 rounded-lg p-1 w-fit self-start sm:self-auto border border-outline-variant/30">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2.5 rounded-md transition-all ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-slate-700 text-primary dark:text-white shadow-sm'
                    : 'text-outline dark:text-slate-400 hover:text-primary'
                }`}
                title="Table View"
              >
                <FiList className="text-lg" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 rounded-md transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-700 text-primary dark:text-white shadow-sm'
                    : 'text-outline dark:text-slate-400 hover:text-primary'
                }`}
                title="Grid Card View"
              >
                <FiGrid className="text-lg" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : shortlisted.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-[24px] p-12 text-center border border-outline-variant/20 flex flex-col items-center justify-center space-y-6">
              <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary mb-2">
                <FiGrid className="text-3xl" />
              </div>
              <div className="space-y-2 max-w-md">
                <h3 className="font-headline-sm text-xl font-bold">Your Shortlist is Empty</h3>
                <p className="font-body-md text-outline dark:text-slate-500">
                  Head over to Candidate Search page to analyze and add high-signal profiles to your recruitment shortlist.
                </p>
              </div>
              <div className="pt-2">
                <Link to="/candidates" className="bg-primary text-on-primary px-8 py-3.5 rounded-xl font-bold hover:shadow-lg transition-all inline-flex items-center gap-2">
                  Browse Candidates <FiArrowRight />
                </Link>
              </div>
            </div>
          ) : viewMode === 'table' ? (
            
            /* Table View */
            <div className="bg-white dark:bg-slate-900 rounded-[24px] p-6 border border-outline-variant/20 overflow-x-auto shadow-sm">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-outline-variant/20 text-outline dark:text-slate-400 font-semibold font-label-caps text-xs uppercase tracking-wider">
                    <th className="pb-4">Candidate</th>
                    <th className="pb-4">Location</th>
                    <th className="pb-4">Experience</th>
                    <th className="pb-4">AI Score</th>
                    <th className="pb-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {shortlisted.map((candidate) => (
                    <tr key={candidate._id} className="border-b border-outline-variant/10 hover:bg-surface-container-low/20 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                          {candidate.name ? candidate.name[0] : 'S'}
                        </div>
                        <div>
                          <p className="font-bold text-on-background dark:text-white text-sm leading-snug">{candidate.name}</p>
                          <p className="text-xs text-outline dark:text-slate-400">{candidate.title || 'Developer'}</p>
                        </div>
                      </td>
                      <td className="py-4 text-on-surface-variant dark:text-slate-400 text-xs">
                        {candidate.location || 'Remote'}
                      </td>
                      <td className="py-4 text-on-surface-variant dark:text-slate-400 text-xs">
                        {candidate.yearsOfExperience || 0} years
                      </td>
                      <td className="py-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                          candidate.aiScore >= 85 ? 'bg-tertiary/10 text-tertiary' : 'bg-primary/10 text-primary'
                        }`}>
                          {candidate.aiScore || 80}% - {candidate.recommendation || 'Match'}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <Link 
                            to={`/candidates/${candidate._id}`} 
                            className="bg-surface-container-high dark:bg-slate-800 text-primary dark:text-primary-fixed-dim px-4 py-2 rounded-xl font-bold text-xs hover:bg-primary hover:text-on-primary transition-all duration-150"
                          >
                            Profile Details
                          </Link>
                          <button
                            onClick={() => handleRemoveShortlist(candidate._id)}
                            className="text-error p-2.5 hover:bg-error-container/10 rounded-xl transition-all"
                            title="Remove"
                          >
                            <FiTrash2 className="text-lg" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          ) : (
            
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {shortlisted.map((candidate) => (
                <div 
                  key={candidate._id}
                  className="bg-white dark:bg-slate-900 rounded-[24px] p-6 border border-outline-variant/20 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                          {candidate.name ? candidate.name[0] : 'S'}
                        </div>
                        <div>
                          <h4 className="font-headline-sm text-base font-bold text-on-background dark:text-white truncate max-w-[140px]">{candidate.name}</h4>
                          <p className="text-xs text-outline dark:text-slate-400 font-semibold truncate max-w-[140px]">{candidate.title || 'Developer'}</p>
                        </div>
                      </div>
                      
                      <div className="relative w-12 h-12 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="42" fill="transparent" stroke="rgba(226, 232, 240, 0.5)" strokeWidth="10" />
                          <circle 
                            cx="50" 
                            cy="50" 
                            r="42" 
                            fill="transparent" 
                            stroke="#004ac6" 
                            strokeWidth="10"
                            strokeDasharray={Math.PI * 2 * 42}
                            strokeDashoffset={((100 - (candidate.aiScore || 0)) / 100) * (Math.PI * 2 * 42)}
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="absolute text-[10px] font-bold text-on-background dark:text-white">
                          {candidate.aiScore || 0}%
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-on-surface-variant dark:text-slate-400">
                      <span className="flex items-center gap-1"><FiMapPin /> {candidate.location || 'Remote'}</span>
                      <span className="flex items-center gap-1"><FiBookOpen /> {candidate.yearsOfExperience} yrs Exp</span>
                    </div>

                    <p className="font-body-sm text-xs text-outline dark:text-slate-400 line-clamp-3 leading-relaxed">
                      {candidate.bio || 'Candidate profile parsed with TalentAI discovery algorithms.'}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {candidate.skills && candidate.skills.slice(0, 4).map((skill, sIdx) => (
                        <span key={sIdx} className="bg-surface-container dark:bg-slate-800 text-on-surface-variant dark:text-slate-300 px-2 py-0.5 rounded-md text-[10px] font-semibold">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-6 border-t border-outline-variant/10 mt-6 font-bold text-xs">
                    <Link
                      to={`/candidates/${candidate._id}`}
                      className="flex-1 bg-surface-container-high dark:bg-slate-800 text-primary dark:text-primary-fixed-dim text-center py-2.5 rounded-xl font-bold hover:bg-primary hover:text-on-primary transition-all duration-200"
                    >
                      View Profile
                    </Link>
                    <button
                      onClick={() => handleRemoveShortlist(candidate._id)}
                      className="p-2.5 rounded-xl border border-error/20 bg-error-container/10 text-error hover:bg-error-container/20 transition-all"
                    >
                      <FiTrash2 className="text-base" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default ShortlistedCandidates;
