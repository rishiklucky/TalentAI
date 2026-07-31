import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { resumeAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { FiUploadCloud, FiFileText, FiX, FiCheck, FiShield, FiZap, FiPieChart, FiCpu } from 'react-icons/fi';
import { toast } from 'react-toastify';

const UploadResume = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [readyForAnalysis, setReadyForAnalysis] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      processFile(droppedFile);
    } else {
      toast.error('Only PDF files are supported.');
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      processFile(selectedFile);
    } else if (selectedFile) {
      toast.error('Only PDF files are supported.');
    }
  };

  const processFile = (selectedFile) => {
    setFile(selectedFile);
    simulateUpload();
  };

  const simulateUpload = () => {
    setUploading(true);
    setProgress(0);
    setReadyForAnalysis(false);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          setReadyForAnalysis(true);
          toast.success('Resume uploaded successfully. Ready for AI Analysis!');
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 200);
  };

  const triggerBrowse = () => {
    fileInputRef.current.click();
  };

  const cancelUpload = (e) => {
    e.stopPropagation();
    setFile(null);
    setProgress(0);
    setReadyForAnalysis(false);
    setUploading(false);
  };

  const handleAnalyze = async (e) => {
    e.stopPropagation();
    if (!file) return;

    setAnalyzing(true);
    const formData = new FormData();
    formData.append('resume', file);

    try {
      await resumeAPI.upload(formData);
      toast.success('AI Resume analysis complete!');
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Error analyzing resume with Gemini.');
      setAnalyzing(false);
    }
  };

  return (
    <div className="bg-background text-on-background dark:bg-slate-950 dark:text-slate-100 min-h-screen flex flex-col transition-colors duration-300">
      <Navbar />
      
      <div className="flex-1 flex max-w-container-max w-full mx-auto">
        <Sidebar />
        
        <main className="flex-1 md:ml-64 p-margin-mobile md:p-margin-desktop flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="w-full max-w-3xl space-y-stack-lg">
            
            {/* Header */}
            <div className="text-center space-y-stack-sm mb-stack-lg">
              <h1 className="font-headline-lg text-3xl md:text-4xl text-on-background dark:text-white font-bold tracking-tight">
                Upload Your Resume
              </h1>
              <p className="font-body-lg text-on-surface-variant dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
                Let our AI engine dissect your expertise and map your skillset in seconds.
              </p>
            </div>

            {/* Drag & Drop Area */}
            <div 
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={triggerBrowse}
              className="group relative bg-white dark:bg-slate-900 border-2 border-transparent transition-all duration-300 rounded-[24px] shadow-sm hover:shadow-xl p-8 md:p-12 text-center overflow-hidden cursor-pointer"
            >
              {/* Custom Dashed Border */}
              <div className="absolute inset-0 upload-dashed-border opacity-40 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="application/pdf"
                className="hidden"
              />

              <div className="relative z-10 flex flex-col items-center justify-center space-y-stack-md py-stack-lg">
                <div className="w-20 h-20 bg-primary-container/10 rounded-2xl flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                  <FiUploadCloud className="text-4xl" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-headline-sm text-xl font-bold text-on-background dark:text-white">
                    Drag & Drop Resume
                  </h3>
                  <p className="font-body-md text-outline dark:text-slate-400">Supported formats: PDF (Max 10MB)</p>
                </div>
                <div className="pt-stack-md">
                  <button 
                    type="button"
                    className="bg-surface-container-high dark:bg-slate-800 text-primary dark:text-primary-fixed-dim px-8 py-3 rounded-full font-label-caps text-label-caps uppercase font-bold hover:bg-primary hover:text-on-primary transition-all"
                  >
                    Browse Files
                  </button>
                </div>
              </div>

              {/* Active Upload State */}
              {(file) && (
                <div className="absolute inset-0 glass-panel dark:bg-slate-900/90 z-20 flex flex-col items-center justify-center p-stack-lg">
                  <div className="w-full max-w-md space-y-stack-lg">
                    
                    {/* File Box */}
                    <div className="flex items-center gap-stack-md bg-surface-container dark:bg-slate-800 rounded-xl p-stack-md border border-outline-variant/30">
                      <FiFileText className="text-primary text-3xl flex-shrink-0" />
                      <div className="flex-1 text-left overflow-hidden">
                        <p className="font-body-md text-on-background dark:text-white font-semibold truncate">
                          {file.name}
                        </p>
                        <p className="font-label-caps text-label-caps text-outline dark:text-slate-400 uppercase">
                          {(file.size / (1024 * 1024)).toFixed(1)} MB
                        </p>
                      </div>
                      {!analyzing && (
                        <button 
                          onClick={cancelUpload}
                          className="text-outline hover:text-error transition-colors p-1"
                        >
                          <FiX className="text-xl" />
                        </button>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-stack-sm">
                      <div className="flex justify-between items-center px-1">
                        <span className={`font-label-caps text-label-caps uppercase font-bold ${readyForAnalysis ? 'text-tertiary' : 'text-primary'}`}>
                          {analyzing ? 'AI System Parsing...' : readyForAnalysis ? 'Ready for Analysis' : 'Uploading...'}
                        </span>
                        <span className="font-stats-number text-sm font-bold">
                          {analyzing ? 'Analyzing...' : `${progress}%`}
                        </span>
                      </div>
                      <div className="w-full h-3 bg-surface-container-highest dark:bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-350 ease-out shimmer ${readyForAnalysis ? 'bg-tertiary' : 'bg-primary'}`} 
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* AI Button */}
                    <div className="flex flex-col gap-stack-sm pt-stack-md">
                      <button
                        onClick={handleAnalyze}
                        disabled={!readyForAnalysis || analyzing}
                        className={`w-full py-4 rounded-xl font-label-caps text-label-caps uppercase font-bold transition-all flex items-center justify-center gap-2 ${
                          readyForAnalysis && !analyzing
                            ? 'bg-primary text-on-primary hover:shadow-lg active:scale-95 animate-pulse-soft'
                            : 'bg-primary/20 text-on-primary-container/40 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed'
                        }`}
                      >
                        <FiCpu className={analyzing ? 'animate-spin' : ''} />
                        {analyzing ? 'Analyzing Skills...' : 'Analyze with AI'}
                      </button>
                      <p className="font-body-sm text-xs text-outline dark:text-slate-400 text-center">
                        AI analysis typically takes 3-5 seconds
                      </p>
                    </div>

                  </div>
                </div>
              )}
            </div>

            {/* Footer Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mt-stack-lg">
              <div className="bg-surface-container-low dark:bg-slate-900/50 p-stack-md rounded-xl border border-outline-variant/20 flex items-center gap-stack-md">
                <div className="w-10 h-10 rounded-lg bg-tertiary/10 flex items-center justify-center text-tertiary">
                  <FiShield />
                </div>
                <div>
                  <p className="font-label-caps text-[10px] text-outline dark:text-slate-400 uppercase">Privacy</p>
                  <p className="font-body-sm text-sm text-on-background dark:text-slate-200 font-medium">Fully Encrypted</p>
                </div>
              </div>
              <div className="bg-surface-container-low dark:bg-slate-900/50 p-stack-md rounded-xl border border-outline-variant/20 flex items-center gap-stack-md">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <FiZap />
                </div>
                <div>
                  <p className="font-label-caps text-[10px] text-outline dark:text-slate-400 uppercase">Speed</p>
                  <p className="font-body-sm text-sm text-on-background dark:text-slate-200 font-medium">Instant Parsing</p>
                </div>
              </div>
              <div className="bg-surface-container-low dark:bg-slate-900/50 p-stack-md rounded-xl border border-outline-variant/20 flex items-center gap-stack-md">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
                  <FiPieChart />
                </div>
                <div>
                  <p className="font-label-caps text-[10px] text-outline dark:text-slate-400 uppercase">Insights</p>
                  <p className="font-body-sm text-sm text-on-background dark:text-slate-200 font-medium">Skill Mapping</p>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default UploadResume;
