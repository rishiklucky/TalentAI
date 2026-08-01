import React, { useState } from 'react';
import PremiumGatedContainer from '../components/PremiumGatedContainer';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { premiumAPI, candidateAPI } from '../services/api';
import { FiUsers, FiCheck, FiCpu, FiTrendingUp, FiCheckCircle, FiSearch } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS elements
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const CandidateComparisonContent = () => {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [result, setResult] = useState(null);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) {
      toast.warn('Please enter a search query.');
      return;
    }
    setLoadingList(true);
    try {
      const res = await candidateAPI.list({ search: searchQuery.trim() });
      setCandidates(res.data || []);
      setHasSearched(true);
    } catch (err) {
      toast.error('Failed to search candidates.');
    } finally {
      setLoadingList(false);
    }
  };

  const handleToggleSelect = (candidate) => {
    const isAlreadySelected = selectedCandidates.some(c => c._id === candidate._id);
    if (isAlreadySelected) {
      setSelectedCandidates(selectedCandidates.filter(c => c._id !== candidate._id));
    } else {
      if (selectedCandidates.length >= 3) {
        toast.warn('You can select a maximum of 3 candidates for comparison.');
        return;
      }
      setSelectedCandidates([...selectedCandidates, candidate]);
    }
  };

  const handleCompare = async (e) => {
    e.preventDefault();
    if (selectedCandidates.length < 2) {
      toast.warn('Please select at least 2 candidates to compare.');
      return;
    }
    setLoading(true);
    try {
      const selectedIds = selectedCandidates.map(c => c._id);
      const res = await premiumAPI.compareCandidates({ candidateIds: selectedIds });
      setResult(res.data);
      toast.success('Candidates analyzed successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to compare candidates.');
    } finally {
      setLoading(false);
    }
  };

  const radarData = result ? {
    labels: result.radarChart.labels,
    datasets: result.radarChart.candidates.map((c, idx) => {
      const colors = [
        { border: '#6366f1', bg: 'rgba(99, 102, 241, 0.2)' },
        { border: '#ec4899', bg: 'rgba(236, 72, 153, 0.2)' },
        { border: '#10b981', bg: 'rgba(16, 185, 129, 0.2)' }
      ];
      const color = colors[idx % colors.length];
      return {
        label: c.name,
        data: c.data,
        backgroundColor: color.bg,
        borderColor: color.border,
        borderWidth: 2,
        pointBackgroundColor: color.border,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: color.border
      };
    })
  } : null;

  const radarOptions = {
    scales: {
      r: {
        angleLines: { color: 'rgba(148, 163, 184, 0.1)' },
        grid: { color: 'rgba(148, 163, 184, 0.1)' },
        pointLabels: { color: '#94a3b8', font: { size: 10, weight: 'bold' } },
        ticks: { display: false, maxTicksLimit: 5 },
        suggestedMin: 50,
        suggestedMax: 100
      }
    },
    plugins: {
      legend: {
        labels: { color: '#94a3b8', font: { size: 11, weight: 'bold' } }
      }
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="font-headline-lg text-3xl font-extrabold text-on-background dark:text-white flex items-center gap-3">
          <FiUsers className="text-secondary text-3xl" /> AI Candidate Comparison
        </h1>
        <p className="font-body-md text-sm text-on-surface-variant dark:text-slate-400">
          Search and select up to 3 candidates to compare their technical depth, projects, experience alignment, and core strengths.
        </p>
      </div>

      {/* Select Candidates Box */}
      <div className="glass-card p-6 rounded-3xl border border-outline-variant/30 dark:border-slate-800/40 space-y-5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h3 className="font-headline-sm text-sm font-extrabold text-outline dark:text-slate-400 uppercase tracking-widest">
            Select Candidates ({selectedCandidates.length}/3)
          </h3>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline dark:text-slate-400 text-sm" />
            <input 
              type="text" 
              placeholder="Search candidate by name, title, or skills..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-surface-container dark:bg-slate-800/60 border border-outline-variant/30 dark:border-slate-700/50 rounded-xl font-body-sm text-xs text-on-background dark:text-white focus:outline-none focus:border-primary transition-all"
            />
          </div>
          <button 
            type="submit"
            className="bg-primary hover:bg-primary-container text-on-primary font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all hover:scale-95 duration-150"
          >
            Search
          </button>
        </form>

        {/* Currently Selected Bar */}
        {selectedCandidates.length > 0 && (
          <div className="bg-slate-50 dark:bg-slate-800/30 p-3.5 rounded-2xl border border-outline-variant/20 dark:border-slate-800 space-y-2">
            <span className="text-[10px] font-bold text-outline dark:text-slate-400 uppercase tracking-widest block">Currently Selected:</span>
            <div className="flex flex-wrap gap-2">
              {selectedCandidates.map(c => (
                <div key={c._id} className="flex items-center gap-1.5 px-3 py-1 bg-secondary/15 dark:bg-secondary-container/30 text-secondary border border-secondary/20 rounded-full text-xs font-semibold">
                  <span>{c.name}</span>
                  <button 
                    type="button" 
                    onClick={() => handleToggleSelect(c)}
                    className="hover:text-red-500 font-black text-xs ml-1 flex-shrink-0"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Candidate Search Results */}
        <div>
          {loadingList ? (
            <div className="text-center py-8 text-xs text-outline animate-pulse">Searching candidate database...</div>
          ) : !hasSearched ? (
            <div className="text-center py-8 text-xs text-outline border border-dashed border-outline-variant/20 dark:border-slate-800 rounded-2xl">
              Enter a search query above to find candidates.
            </div>
          ) : candidates.length === 0 ? (
            <div className="text-center py-8 text-xs text-outline border border-dashed border-outline-variant/20 dark:border-slate-800 rounded-2xl">
              No candidates found matching "{searchQuery}". Try searching for another name or keyword.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {candidates.map(cand => {
                const selected = selectedCandidates.some(c => c._id === cand._id);
                return (
                  <button
                    key={cand._id}
                    onClick={() => handleToggleSelect(cand)}
                    className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all ${
                      selected 
                        ? 'bg-secondary/10 dark:bg-secondary-container/15 border-secondary text-secondary' 
                        : 'bg-surface-container dark:bg-slate-800/50 border-outline-variant/20 dark:border-slate-800 text-on-surface-variant dark:text-slate-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${
                      selected ? 'bg-secondary border-secondary text-white' : 'border-outline-variant/50'
                    }`}>
                      {selected && <FiCheck className="text-xs" />}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs text-on-background dark:text-white leading-none truncate">{cand.name}</h4>
                      <span className="text-[10px] text-outline dark:text-slate-500 truncate block mt-1">{cand.title || 'Developer'}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <button 
          onClick={handleCompare}
          disabled={loading || selectedCandidates.length < 2}
          className="w-full bg-secondary hover:bg-secondary-container text-white font-bold py-3.5 rounded-xl hover:shadow-lg transition-all hover:scale-95 disabled:opacity-50 text-sm"
        >
          {loading ? 'Performing Vector Matrix Comparisons...' : 'Compare Selected Candidates'}
        </button>
      </div>

      {/* Comparative Dashboard */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
          
          {/* Radar Chart (left column) */}
          <div className="glass-card p-6 rounded-3xl border border-outline-variant/30 dark:border-slate-800/40 flex flex-col justify-between items-center text-center space-y-6">
            <div className="space-y-1 self-start text-left">
              <h3 className="font-headline-sm text-lg font-bold text-on-background dark:text-white">Comparative Radar Profile</h3>
              <p className="text-xs text-outline dark:text-slate-400">Score metrics computed from profile analysis data.</p>
            </div>
            
            {radarData && (
              <div className="w-full max-w-[280px] py-4">
                <Radar data={radarData} options={radarOptions} />
              </div>
            )}
          </div>

          {/* Table Metrics (middle & right column) */}
          <div className="lg:col-span-2 glass-card p-6 rounded-3xl border border-outline-variant/30 dark:border-slate-800/40 space-y-6 overflow-hidden">
            <h3 className="font-headline-sm text-lg font-bold text-on-background dark:text-white">Side-by-Side Competency Metrics</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant/20 text-outline dark:text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                    {result.comparisonTable.headers.map((h, i) => (
                      <th key={i} className="pb-3.5 px-3 font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10 text-on-surface-variant dark:text-slate-300">
                  {result.comparisonTable.rows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-500/5 transition-colors">
                      <td className="py-3 px-3 font-bold text-on-background dark:text-white">{row[0]}</td>
                      {row.slice(1).map((val, i) => (
                        <td key={i} className="py-3 px-3 max-w-[200px] truncate">{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Winner Recommendation & Outreach */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-3xl border border-primary/20 bg-primary/5 dark:bg-primary-container/5 space-y-4">
              <h3 className="font-headline-sm text-md font-bold text-on-background dark:text-white flex items-center gap-2">
                <FiCheckCircle className="text-primary" /> AI Winner Recommendation
              </h3>
              <p className="text-xs text-on-surface-variant dark:text-slate-300 leading-relaxed">
                {result.winnerRecommendation}
              </p>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-outline-variant/30 dark:border-slate-800/40 space-y-4">
              <h3 className="font-headline-sm text-md font-bold text-on-background dark:text-white flex items-center gap-2">
                <FiCpu className="text-secondary" /> Hiring Strategy Tips
              </h3>
              <p className="text-xs text-on-surface-variant dark:text-slate-300 leading-relaxed">
                {result.hiringRecommendation}
              </p>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

const CandidateComparison = () => {
  return (
    <div className="bg-background text-on-background dark:bg-slate-950 dark:text-slate-100 min-h-screen flex flex-col transition-colors duration-300">
      <Navbar />

      <div className="flex-1 flex max-w-container-max w-full mx-auto">
        <Sidebar />

        <main className="flex-1 md:ml-64 p-margin-mobile md:p-margin-desktop min-h-[calc(100vh-80px)] py-8">
          <PremiumGatedContainer featureName="AI Candidate Comparison">
            <CandidateComparisonContent />
          </PremiumGatedContainer>
        </main>
      </div>
    </div>
  );
};

export default CandidateComparison;
