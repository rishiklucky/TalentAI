import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { candidateAPI, shortlistAPI } from '../services/api';
import { 
  FiSearch, FiMapPin, FiCpu, FiBookmark, FiHeart, FiSliders, FiBookOpen, FiStar, FiFilter 
} from 'react-icons/fi';
import { toast } from 'react-toastify';

const CandidateSearch = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState('');
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('');
  const [score, setScore] = useState(60); // Default min score
  const [location, setLocation] = useState('');

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const filters = {};
      if (search) filters.search = search;
      if (skills) filters.skills = skills;
      if (experience) filters.experience = experience;
      if (score) filters.score = score;
      if (location) filters.location = location;

      const res = await candidateAPI.list(filters);
      setCandidates(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load candidate list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCandidates();
  };

  const handleClearFilters = () => {
    setSearch('');
    setSkills('');
    setExperience('');
    setScore(60);
    setLocation('');
    // We cannot immediately query since the state update is asynchronous, so we invoke candidateAPI.list with empty filters.
    setLoading(true);
    candidateAPI.list({})
      .then(res => setCandidates(res.data))
      .catch(() => toast.error('Failed to load candidate list.'))
      .finally(() => setLoading(false));
  };

  const handleToggleShortlist = async (id, index) => {
    try {
      const res = await shortlistAPI.toggle(id);
      
      // Update local state to toggle isShortlisted
      setCandidates(prev => {
        const copy = [...prev];
        copy[index].isShortlisted = res.data.isShortlisted;
        return copy;
      });

      toast.success(res.data.message);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update shortlist.');
    }
  };

  return (
    <div className="bg-background text-on-background dark:bg-slate-950 dark:text-slate-100 min-h-screen flex flex-col transition-colors duration-300">
      <Navbar />

      <div className="flex-1 flex max-w-container-max w-full mx-auto">
        <Sidebar />

        <main className="flex-1 md:ml-64 p-margin-mobile md:p-margin-desktop min-h-[calc(100vh-80px)] space-y-gutter">
          
          {/* Header */}
          <div>
            <h1 className="font-headline-lg text-2xl md:text-3xl font-extrabold text-on-background dark:text-white leading-tight">
              Talent Discovery Engine
            </h1>
            <p className="font-body-md text-on-surface-variant dark:text-slate-400">
              Filter the global applicant pool based on actual parsed technical capability.
            </p>
          </div>

          {/* Filter Panel Form */}
          <form onSubmit={handleSearchSubmit} className="bg-white dark:bg-slate-900 rounded-[24px] p-6 border border-outline-variant/20 shadow-sm space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-outline-variant/20">
              <FiFilter className="text-primary text-xl" />
              <h3 className="font-headline-sm text-base font-bold">Search Filters</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search text */}
              <div className="space-y-1">
                <label className="text-label-caps font-label-caps text-outline dark:text-slate-400 block">Keyword Search</label>
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-surface-container-low dark:bg-slate-800 border-transparent dark:border-slate-700 rounded-xl p-3 pl-9 text-sm text-on-surface dark:text-white input-focus-ring"
                    placeholder="Name, title, key phrases..."
                  />
                </div>
              </div>

              {/* Skills filter */}
              <div className="space-y-1">
                <label className="text-label-caps font-label-caps text-outline dark:text-slate-400 block">Skills (Comma-separated)</label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full bg-surface-container-low dark:bg-slate-800 border-transparent dark:border-slate-700 rounded-xl p-3 text-sm text-on-surface dark:text-white input-focus-ring"
                  placeholder="React, Node.js, Kubernetes"
                />
              </div>

              {/* Experience level */}
              <div className="space-y-1">
                <label className="text-label-caps font-label-caps text-outline dark:text-slate-400 block">Experience Level</label>
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full bg-surface-container-low dark:bg-slate-800 border-transparent dark:border-slate-700 rounded-xl p-3 text-sm text-on-surface dark:text-white input-focus-ring focus:bg-white"
                >
                  <option value="">Any Experience</option>
                  <option value="Junior">Junior (0-2 years)</option>
                  <option value="Mid">Mid (3-5 years)</option>
                  <option value="Senior">Senior (6-10 years)</option>
                  <option value="Lead">Lead (10+ years)</option>
                </select>
              </div>

              {/* Location */}
              <div className="space-y-1">
                <label className="text-label-caps font-label-caps text-outline dark:text-slate-400 block">Location</label>
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-surface-container-low dark:bg-slate-800 border-transparent dark:border-slate-700 rounded-xl p-3 pl-9 text-sm text-on-surface dark:text-white input-focus-ring"
                    placeholder="City, state, or remote"
                  />
                </div>
              </div>
            </div>

            {/* Score slider & Buttons */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4 border-t border-outline-variant/10">
              
              {/* Score range */}
              <div className="w-full md:max-w-md space-y-2">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-on-surface-variant dark:text-slate-400">Minimum AI Suitability Score</span>
                  <span className="text-primary font-bold">{score}% Match</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  className="w-full h-2 bg-surface-container-highest dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-4 w-full md:w-auto">
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="w-full md:w-auto px-6 py-3 border border-outline-variant text-outline dark:text-slate-300 font-semibold rounded-xl hover:bg-surface-container-low dark:hover:bg-slate-800 transition-all text-sm"
                >
                  Clear Filters
                </button>
                <button
                  type="submit"
                  className="w-full md:w-auto bg-primary text-on-primary px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all hover:scale-95 duration-150 text-sm flex items-center justify-center gap-2"
                >
                  Apply Search
                </button>
              </div>
            </div>
          </form>

          {/* Candidates grid list */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {candidates.map((candidate, index) => (
                <div 
                  key={candidate._id}
                  className="bg-white dark:bg-slate-900 rounded-[24px] p-6 border border-outline-variant/20 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  
                  {/* Card Header details */}
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
                      
                      {/* Circle Score Gauge */}
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

                    {/* Skill Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {candidate.skills && candidate.skills.slice(0, 4).map((skill, sIdx) => (
                        <span key={sIdx} className="bg-surface-container dark:bg-slate-800 text-on-surface-variant dark:text-slate-300 px-2 py-0.5 rounded-md text-[10px] font-semibold">
                          {skill}
                        </span>
                      ))}
                      {candidate.skills && candidate.skills.length > 4 && (
                        <span className="text-[10px] text-outline font-semibold self-center">
                          +{candidate.skills.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="flex items-center gap-3 pt-6 border-t border-outline-variant/10 mt-6">
                    <Link
                      to={`/candidates/${candidate._id}`}
                      className="flex-1 bg-surface-container-high dark:bg-slate-800 text-primary dark:text-primary-fixed-dim text-center py-2.5 rounded-xl font-bold text-xs hover:bg-primary hover:text-on-primary transition-all duration-200"
                    >
                      View Profile
                    </Link>
                    <button
                      onClick={() => handleToggleShortlist(candidate._id, index)}
                      className={`p-2.5 rounded-xl border border-outline-variant/30 transition-all ${
                        candidate.isShortlisted 
                          ? 'bg-error-container/10 border-error/20 text-error' 
                          : 'bg-surface-container-low dark:bg-slate-800 text-outline hover:text-primary'
                      }`}
                    >
                      <FiHeart className={candidate.isShortlisted ? 'fill-current' : ''} />
                    </button>
                  </div>

                </div>
              ))}

              {candidates.length === 0 && (
                <div className="col-span-full bg-white dark:bg-slate-900 rounded-[24px] p-12 text-center border border-outline-variant/20">
                  <FiSearch className="text-outline text-4xl mx-auto mb-4" />
                  <h4 className="font-headline-sm text-lg font-bold">No candidates found matching the filters.</h4>
                  <p className="font-body-md text-outline dark:text-slate-500 mt-2">Try adjusting your skill query keywords or lowering the match score threshold.</p>
                </div>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default CandidateSearch;
