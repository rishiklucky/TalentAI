import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  FiUser, FiMail, FiLock, FiBookOpen, FiBriefcase, FiMapPin, FiCheck, FiPlus, FiTrash2, FiSun, FiMoon 
} from 'react-icons/fi';
import { toast } from 'react-toastify';

const Settings = () => {
  const { user, updateProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // General profile state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [title, setTitle] = useState(user?.title || '');
  const [location, setLocation] = useState(user?.location || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [college, setCollege] = useState(user?.college || '');
  const [github, setGithub] = useState(user?.github || '');
  const [portfolio, setPortfolio] = useState(user?.portfolio || '');
  const [yearsOfExperience, setYearsOfExperience] = useState(user?.yearsOfExperience || 0);

  // Education state
  const [education, setEducation] = useState(user?.education || []);
  const [newDegree, setNewDegree] = useState('');
  const [newSchool, setNewSchool] = useState('');
  const [newEduYear, setNewEduYear] = useState('');

  // Experience state
  const [experience, setExperience] = useState(user?.experience || []);
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newExpYear, setNewExpYear] = useState('');

  const [loading, setLoading] = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name,
      email,
      title,
      location,
      bio,
      college,
      github,
      portfolio,
      yearsOfExperience: parseInt(yearsOfExperience, 10),
      education,
      experience
    };

    try {
      await updateProfile(payload);
      toast.success('Profile settings updated successfully!');
    } catch (err) {
      console.error(err);
      toast.error(err || 'Failed to save profile settings.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEducation = () => {
    if (!newDegree || !newSchool) {
      toast.warning('Please specify both degree and school.');
      return;
    }
    const item = { degree: newDegree, school: newSchool, year: newEduYear, description: '' };
    setEducation(prev => [...prev, item]);
    setNewDegree('');
    setNewSchool('');
    setNewEduYear('');
  };

  const handleRemoveEducation = (index) => {
    setEducation(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleAddExperience = () => {
    if (!newJobTitle || !newCompany) {
      toast.warning('Please specify both job title and company.');
      return;
    }
    const item = { title: newJobTitle, company: newCompany, year: newExpYear, description: '' };
    setExperience(prev => [...prev, item]);
    setNewJobTitle('');
    setNewCompany('');
    setNewExpYear('');
  };

  const handleRemoveExperience = (index) => {
    setExperience(prev => prev.filter((_, idx) => idx !== index));
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
              Portal Settings
            </h1>
            <p className="font-body-md text-on-surface-variant dark:text-slate-400">
              Customize your profile parameters, links, timelines, and appearance.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter items-start">
            
            {/* Left form fields */}
            <div className="lg:col-span-2 space-y-gutter">
              
              {/* Profile Card Form */}
              <form onSubmit={handleSaveProfile} className="bg-white dark:bg-slate-900 rounded-[24px] p-6 md:p-8 border border-outline-variant/20 shadow-sm space-y-6">
                <h3 className="font-headline-sm text-lg font-bold border-b border-outline-variant/20 pb-4">Personal Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-label-caps font-label-caps text-outline dark:text-slate-400 block">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full bg-surface-container-low dark:bg-slate-800 border-transparent dark:border-slate-700 rounded-xl p-3 text-sm text-on-surface dark:text-white input-focus-ring"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-label-caps font-label-caps text-outline dark:text-slate-400 block">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-surface-container-low dark:bg-slate-800 border-transparent dark:border-slate-700 rounded-xl p-3 text-sm text-on-surface dark:text-white input-focus-ring"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-label-caps font-label-caps text-outline dark:text-slate-400 block">Professional Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Software Engineer"
                      className="w-full bg-surface-container-low dark:bg-slate-800 border-transparent dark:border-slate-700 rounded-xl p-3 text-sm text-on-surface dark:text-white input-focus-ring"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-label-caps font-label-caps text-outline dark:text-slate-400 block">Location</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Chicago, IL or Remote"
                      className="w-full bg-surface-container-low dark:bg-slate-800 border-transparent dark:border-slate-700 rounded-xl p-3 text-sm text-on-surface dark:text-white input-focus-ring"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-label-caps font-label-caps text-outline dark:text-slate-400 block">Biography</label>
                  <textarea
                    rows="3"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full bg-surface-container-low dark:bg-slate-800 border-transparent dark:border-slate-700 rounded-xl p-3 text-sm text-on-surface dark:text-white input-focus-ring resize-none"
                    placeholder="Short bio..."
                  ></textarea>
                </div>

                {user?.role === 'student' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-label-caps font-label-caps text-outline dark:text-slate-400 block">University / School</label>
                        <input
                          type="text"
                          value={college}
                          onChange={(e) => setCollege(e.target.value)}
                          className="w-full bg-surface-container-low dark:bg-slate-800 border-transparent dark:border-slate-700 rounded-xl p-3 text-sm text-on-surface dark:text-white input-focus-ring"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-label-caps font-label-caps text-outline dark:text-slate-400 block">Years of Experience</label>
                        <input
                          type="number"
                          value={yearsOfExperience}
                          onChange={(e) => setYearsOfExperience(e.target.value)}
                          className="w-full bg-surface-container-low dark:bg-slate-800 border-transparent dark:border-slate-700 rounded-xl p-3 text-sm text-on-surface dark:text-white input-focus-ring"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-label-caps font-label-caps text-outline dark:text-slate-400 block">GitHub Link</label>
                        <input
                          type="url"
                          value={github}
                          onChange={(e) => setGithub(e.target.value)}
                          className="w-full bg-surface-container-low dark:bg-slate-800 border-transparent dark:border-slate-700 rounded-xl p-3 text-sm text-on-surface dark:text-white input-focus-ring"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-label-caps font-label-caps text-outline dark:text-slate-400 block">Portfolio Link</label>
                        <input
                          type="url"
                          value={portfolio}
                          onChange={(e) => setPortfolio(e.target.value)}
                          className="w-full bg-surface-container-low dark:bg-slate-800 border-transparent dark:border-slate-700 rounded-xl p-3 text-sm text-on-surface dark:text-white input-focus-ring"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto bg-primary text-on-primary px-8 py-3.5 rounded-xl font-bold hover:shadow-lg transition-all active:scale-95 duration-150 text-sm flex justify-center items-center gap-2"
                  >
                    {loading ? 'Saving...' : 'Save General Settings'}
                  </button>
                </div>
              </form>

              {/* Student Timeline Manager: Education & Experience */}
              {user?.role === 'student' && (
                <div className="space-y-gutter">
                  
                  {/* Experience Timeline */}
                  <div className="bg-white dark:bg-slate-900 rounded-[24px] p-6 md:p-8 border border-outline-variant/20 shadow-sm space-y-6">
                    <h3 className="font-headline-sm text-lg font-bold border-b border-outline-variant/20 pb-4">Professional Work History</h3>
                    
                    <div className="space-y-4">
                      {experience.map((exp, i) => (
                        <div key={i} className="flex justify-between items-start gap-4 p-4 bg-surface-container-low dark:bg-slate-800 rounded-xl">
                          <div>
                            <p className="font-bold text-sm text-on-background dark:text-white">{exp.title}</p>
                            <p className="text-xs text-outline dark:text-slate-400">{exp.company} | {exp.year}</p>
                          </div>
                          <button 
                            onClick={() => handleRemoveExperience(i)}
                            className="text-error p-1 hover:bg-error-container/10 rounded-lg transition-colors"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      ))}
                      {experience.length === 0 && <p className="text-xs text-outline">No jobs listed yet.</p>}
                    </div>

                    <div className="border-t border-outline-variant/10 pt-6 grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                      <div className="space-y-1">
                        <label className="text-[10px] font-label-caps text-outline dark:text-slate-400 uppercase">Role / Title</label>
                        <input
                          type="text"
                          value={newJobTitle}
                          onChange={(e) => setNewJobTitle(e.target.value)}
                          placeholder="Front-End Lead"
                          className="w-full bg-surface-container-low dark:bg-slate-800 border-transparent dark:border-slate-700 rounded-xl p-2.5 text-xs text-on-surface dark:text-white input-focus-ring"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-label-caps text-outline dark:text-slate-400 uppercase">Company</label>
                        <input
                          type="text"
                          value={newCompany}
                          onChange={(e) => setNewCompany(e.target.value)}
                          placeholder="Meta"
                          className="w-full bg-surface-container-low dark:bg-slate-800 border-transparent dark:border-slate-700 rounded-xl p-2.5 text-xs text-on-surface dark:text-white input-focus-ring"
                        />
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1 space-y-1">
                          <label className="text-[10px] font-label-caps text-outline dark:text-slate-400 uppercase">Year / Range</label>
                          <input
                            type="text"
                            value={newExpYear}
                            onChange={(e) => setNewExpYear(e.target.value)}
                            placeholder="2022 - Present"
                            className="w-full bg-surface-container-low dark:bg-slate-800 border-transparent dark:border-slate-700 rounded-xl p-2.5 text-xs text-on-surface dark:text-white input-focus-ring"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleAddExperience}
                          className="bg-primary text-on-primary p-3 rounded-xl hover:shadow-lg transition-all"
                        >
                          <FiPlus />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Education Timeline */}
                  <div className="bg-white dark:bg-slate-900 rounded-[24px] p-6 md:p-8 border border-outline-variant/20 shadow-sm space-y-6">
                    <h3 className="font-headline-sm text-lg font-bold border-b border-outline-variant/20 pb-4">Academic Background</h3>
                    
                    <div className="space-y-4">
                      {education.map((edu, i) => (
                        <div key={i} className="flex justify-between items-start gap-4 p-4 bg-surface-container-low dark:bg-slate-800 rounded-xl">
                          <div>
                            <p className="font-bold text-sm text-on-background dark:text-white">{edu.degree}</p>
                            <p className="text-xs text-outline dark:text-slate-400">{edu.school} | {edu.year}</p>
                          </div>
                          <button 
                            onClick={() => handleRemoveEducation(i)}
                            className="text-error p-1 hover:bg-error-container/10 rounded-lg transition-colors"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      ))}
                      {education.length === 0 && <p className="text-xs text-outline">No academic degrees logged.</p>}
                    </div>

                    <div className="border-t border-outline-variant/10 pt-6 grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                      <div className="space-y-1">
                        <label className="text-[10px] font-label-caps text-outline dark:text-slate-400 uppercase">Degree</label>
                        <input
                          type="text"
                          value={newDegree}
                          onChange={(e) => setNewDegree(e.target.value)}
                          placeholder="M.S. in CS"
                          className="w-full bg-surface-container-low dark:bg-slate-800 border-transparent dark:border-slate-700 rounded-xl p-2.5 text-xs text-on-surface dark:text-white input-focus-ring"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-label-caps text-outline dark:text-slate-400 uppercase">School / College</label>
                        <input
                          type="text"
                          value={newSchool}
                          onChange={(e) => setNewSchool(e.target.value)}
                          placeholder="Stanford University"
                          className="w-full bg-surface-container-low dark:bg-slate-800 border-transparent dark:border-slate-700 rounded-xl p-2.5 text-xs text-on-surface dark:text-white input-focus-ring"
                        />
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1 space-y-1">
                          <label className="text-[10px] font-label-caps text-outline dark:text-slate-400 uppercase">Year</label>
                          <input
                            type="text"
                            value={newEduYear}
                            onChange={(e) => setNewEduYear(e.target.value)}
                            placeholder="2020"
                            className="w-full bg-surface-container-low dark:bg-slate-800 border-transparent dark:border-slate-700 rounded-xl p-2.5 text-xs text-on-surface dark:text-white input-focus-ring"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleAddEducation}
                          className="bg-primary text-on-primary p-3 rounded-xl hover:shadow-lg transition-all"
                        >
                          <FiPlus />
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </div>

            {/* Right column settings details */}
            <div className="space-y-gutter">
              
              {/* Appearance card */}
              <div className="bg-white dark:bg-slate-900 rounded-[24px] p-6 border border-outline-variant/20 shadow-sm space-y-4">
                <h3 className="font-headline-sm text-base font-bold">Appearance Settings</h3>
                <p className="font-body-sm text-xs text-outline dark:text-slate-400 leading-relaxed">
                  Toggle between the premium light mode and deep developer dark mode theme.
                </p>
                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center justify-between p-4 bg-surface-container-low dark:bg-slate-800 rounded-xl border border-outline-variant/10 text-sm font-semibold hover:bg-surface-container-high dark:hover:bg-slate-700 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    {theme === 'dark' ? <FiMoon className="text-secondary" /> : <FiSun className="text-primary" />}
                    {theme === 'dark' ? 'Dark Theme Active' : 'Light Theme Active'}
                  </span>
                  <span className="text-[10px] font-label-caps uppercase text-outline">Toggle</span>
                </button>
              </div>

              {/* Security info card */}
              <div className="bg-white dark:bg-slate-900 rounded-[24px] p-6 border border-outline-variant/20 shadow-sm space-y-4">
                <h3 className="font-headline-sm text-base font-bold">Security</h3>
                <div className="space-y-2">
                  <p className="font-body-sm text-xs text-outline dark:text-slate-400">Account status:</p>
                  <span className="inline-block px-3 py-1 bg-tertiary/10 text-tertiary rounded-full text-xs font-bold uppercase">
                    Active & Verified
                  </span>
                </div>
                <p className="font-body-sm text-[11px] text-outline dark:text-slate-500 leading-relaxed">
                  All communications are signed using SSL certificates. Resume uploads utilize industry-standard sandboxed Docker parsers.
                </p>
              </div>

            </div>

          </div>

        </main>
      </div>
    </div>
  );
};

export default Settings;
