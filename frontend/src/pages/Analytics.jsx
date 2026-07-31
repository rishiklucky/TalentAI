import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { candidateAPI } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { Line, Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement 
} from 'chart.js';
import { FiBarChart2, FiUsers, FiTrendingUp, FiActivity } from 'react-icons/fi';
import { toast } from 'react-toastify';

// Register ChartJS elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analytics = () => {
  const { theme } = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await candidateAPI.analytics();
        setData(res.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load recruiting analytics.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="bg-background text-on-background dark:bg-slate-950 dark:text-slate-100 min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="font-label-caps text-label-caps uppercase text-outline">Calculating Analytics Metrics...</p>
          </div>
        </div>
      </div>
    );
  }

  const { stats = {}, topSkills = [], topColleges = [], trends = [] } = data || {};

  const isDark = theme === 'dark';
  const textColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? 'rgba(51, 65, 85, 0.2)' : 'rgba(226, 232, 240, 0.8)';

  // Chart 1: Sourcing/Hiring Trends Line Chart
  const lineChartData = {
    labels: trends.map(t => t.month),
    datasets: [
      {
        label: 'Applicants',
        data: trends.map(t => t.applicants),
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Shortlisted',
        data: trends.map(t => t.hired),
        borderColor: '#7c3aed',
        backgroundColor: 'rgba(124, 58, 237, 0.1)',
        tension: 0.4,
        fill: true,
      }
    ]
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: textColor, font: { family: 'Inter', weight: '500' } }
      }
    },
    scales: {
      x: {
        grid: { color: gridColor },
        ticks: { color: textColor }
      },
      y: {
        grid: { color: gridColor },
        ticks: { color: textColor }
      }
    }
  };

  // Chart 2: Skill Distribution Bar Chart
  const barChartData = {
    labels: topSkills.map(s => s.skill),
    datasets: [
      {
        label: 'Candidates count',
        data: topSkills.map(s => s.count),
        backgroundColor: 'rgba(37, 99, 235, 0.8)',
        borderRadius: 8,
      }
    ]
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: textColor }
      },
      y: {
        grid: { color: gridColor },
        ticks: { color: textColor }
      }
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
              Recruitment Analytics
            </h1>
            <p className="font-body-md text-on-surface-variant dark:text-slate-400">
              Aggregated skill densities and candidate suitability distributions across your active applicant pipeline.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-[24px] border border-outline-variant/20 flex items-center justify-between shadow-sm">
              <div className="space-y-1">
                <span className="font-label-caps text-xs text-outline dark:text-slate-400 uppercase tracking-widest font-bold">Talent Pool size</span>
                <h3 className="font-stats-number text-2xl font-bold">{stats.totalCandidates} Mapped Profiles</h3>
              </div>
              <FiUsers className="text-primary text-3xl" />
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-[24px] border border-outline-variant/20 flex items-center justify-between shadow-sm">
              <div className="space-y-1">
                <span className="font-label-caps text-xs text-outline dark:text-slate-400 uppercase tracking-widest font-bold">Shortlisted Size</span>
                <h3 className="font-stats-number text-2xl font-bold">{stats.totalShortlisted} Shortlisted</h3>
              </div>
              <FiActivity className="text-secondary text-3xl" />
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-[24px] border border-outline-variant/20 flex items-center justify-between shadow-sm">
              <div className="space-y-1">
                <span className="font-label-caps text-xs text-outline dark:text-slate-400 uppercase tracking-widest font-bold">Index Match Rate</span>
                <h3 className="font-stats-number text-2xl font-bold">{stats.averageScore}% Accuracy</h3>
              </div>
              <FiTrendingUp className="text-tertiary text-3xl" />
            </div>
          </div>

          {/* Bento Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
            
            {/* Chart 1 Card */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-[24px] border border-outline-variant/20 shadow-sm flex flex-col justify-between h-96">
              <div>
                <h3 className="font-headline-sm text-lg font-bold mb-1">Applicant pipeline Trends</h3>
                <p className="font-body-sm text-xs text-outline dark:text-slate-400 mb-4">Monthly application vs shortlisting rate metric</p>
              </div>
              <div className="flex-1 min-h-0">
                <Line data={lineChartData} options={lineChartOptions} />
              </div>
            </div>

            {/* Chart 2 Card */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-[24px] border border-outline-variant/20 shadow-sm flex flex-col justify-between h-96">
              <div>
                <h3 className="font-headline-sm text-lg font-bold mb-1">Technical Skill Densities</h3>
                <p className="font-body-sm text-xs text-outline dark:text-slate-400 mb-4">Frequency count of skills across candidate pool</p>
              </div>
              <div className="flex-1 min-h-0">
                <Bar data={barChartData} options={barChartOptions} />
              </div>
            </div>

          </div>

          {/* Sourcing details list */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-[24px] border border-outline-variant/20 shadow-sm">
            <h3 className="font-headline-sm text-lg font-bold mb-6">Talent Acquisition Source Distribution</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {topColleges.map((college, i) => (
                <div key={i} className="flex items-center gap-4 bg-surface-container-low dark:bg-slate-800 p-4 rounded-xl border border-outline-variant/10">
                  <div className="w-10 h-10 bg-primary/10 text-primary flex items-center justify-center rounded-lg font-bold font-stats-number">
                    {i + 1}
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-semibold text-sm truncate dark:text-slate-200">{college.college}</p>
                    <p className="text-xs text-outline dark:text-slate-400">{college.count} candidates sourced</p>
                  </div>
                </div>
              ))}
              {topColleges.length === 0 && (
                <p className="text-sm text-outline col-span-full text-center">No college sourcing statistics logged yet.</p>
              )}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default Analytics;
