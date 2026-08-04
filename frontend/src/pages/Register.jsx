import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiLock, FiAlertCircle, FiGithub, FiLink, FiBookOpen, FiBriefcase } from 'react-icons/fi';
import Navbar from '../components/Navbar';

const Register = () => {
  const { user, isAuthenticated, register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === 'recruiter' ? '/recruiter' : '/dashboard', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('student');
  
  // Student conditional fields
  const [college, setCollege] = useState('');
  const [github, setGithub] = useState('');
  const [portfolio, setPortfolio] = useState('');

  // Recruiter conditional fields
  const [company, setCompany] = useState('');
  const [recruiterTitle, setRecruiterTitle] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    const payload = {
      name,
      email,
      password,
      role,
      college: role === 'student' ? college : undefined,
      github: role === 'student' ? github : undefined,
      portfolio: role === 'student' ? portfolio : undefined,
      company: role === 'recruiter' ? company : undefined,
      title: role === 'recruiter' ? recruiterTitle : undefined
    };

    try {
      const user = await register(payload);
      if (user.role === 'recruiter') {
        navigate('/recruiter');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-background dark:bg-slate-950 dark:text-slate-100 min-h-screen flex flex-col transition-colors duration-300">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-lg space-y-8 relative z-10">
          
          <div className="text-center space-y-2">
            <h1 className="font-headline-lg text-3xl font-extrabold text-on-background dark:text-white">
              Create an Account
            </h1>
            <p className="font-body-md text-on-surface-variant dark:text-slate-400">
              Join TalentAI and evaluate candidates beyond standard keywords.
            </p>
          </div>

          <div className="glass-card rounded-[24px] p-8 shadow-xl border border-outline-variant/30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
            
            {/* Role selection */}
            <div className="flex bg-surface-container-low dark:bg-slate-800 rounded-xl p-1.5 mb-6">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm transition-all ${
                  role === 'student'
                    ? 'bg-white dark:bg-slate-700 text-primary dark:text-white shadow-sm'
                    : 'text-on-surface-variant dark:text-slate-400 hover:text-primary'
                }`}
              >
                <FiUser /> Student
              </button>
              <button
                type="button"
                onClick={() => setRole('recruiter')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm transition-all ${
                  role === 'recruiter'
                    ? 'bg-white dark:bg-slate-700 text-primary dark:text-white shadow-sm'
                    : 'text-on-surface-variant dark:text-slate-400 hover:text-primary'
                }`}
              >
                <FiBriefcase /> Recruiter
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-4 bg-error-container/10 border border-error/20 text-error rounded-xl mb-6 text-sm">
                <FiAlertCircle className="text-lg flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Name */}
              <div className="space-y-1">
                <label className="text-label-caps font-label-caps text-outline dark:text-slate-400 block">
                  Full Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-outline dark:text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-surface-container-low dark:bg-slate-800 border-transparent dark:border-slate-700 rounded-xl p-3 pl-10 text-body-md text-on-surface dark:text-white focus:bg-white dark:focus:bg-slate-750 input-focus-ring"
                    placeholder="Alex Rivera"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-label-caps font-label-caps text-outline dark:text-slate-400 block">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-outline dark:text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-surface-container-low dark:bg-slate-800 border-transparent dark:border-slate-700 rounded-xl p-3 pl-10 text-body-md text-on-surface dark:text-white focus:bg-white dark:focus:bg-slate-750 input-focus-ring"
                    placeholder="alex@talentai.io"
                  />
                </div>
              </div>

              {/* Student conditional fields */}
              {role === 'student' && (
                <>
                  <div className="space-y-1">
                    <label className="text-label-caps font-label-caps text-outline dark:text-slate-400 block">
                      College / University
                    </label>
                    <div className="relative">
                      <FiBookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-outline dark:text-slate-400" />
                      <input
                        type="text"
                        value={college}
                        onChange={(e) => setCollege(e.target.value)}
                        required
                        className="w-full bg-surface-container-low dark:bg-slate-800 border-transparent dark:border-slate-700 rounded-xl p-3 pl-10 text-body-md text-on-surface dark:text-white focus:bg-white dark:focus:bg-slate-750 input-focus-ring"
                        placeholder="Savannah College of Art and Design"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-label-caps font-label-caps text-outline dark:text-slate-400 block">
                        GitHub Profile URL
                      </label>
                      <div className="relative">
                        <FiGithub className="absolute left-3 top-1/2 -translate-y-1/2 text-outline dark:text-slate-400" />
                        <input
                          type="url"
                          value={github}
                          onChange={(e) => setGithub(e.target.value)}
                          className="w-full bg-surface-container-low dark:bg-slate-800 border-transparent dark:border-slate-700 rounded-xl p-3 pl-10 text-body-md text-on-surface dark:text-white focus:bg-white dark:focus:bg-slate-750 input-focus-ring"
                          placeholder="https://github.com/..."
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-label-caps font-label-caps text-outline dark:text-slate-400 block">
                        Portfolio Link
                      </label>
                      <div className="relative">
                        <FiLink className="absolute left-3 top-1/2 -translate-y-1/2 text-outline dark:text-slate-400" />
                        <input
                          type="url"
                          value={portfolio}
                          onChange={(e) => setPortfolio(e.target.value)}
                          className="w-full bg-surface-container-low dark:bg-slate-800 border-transparent dark:border-slate-700 rounded-xl p-3 pl-10 text-body-md text-on-surface dark:text-white focus:bg-white dark:focus:bg-slate-750 input-focus-ring"
                          placeholder="https://portfolio.me"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Recruiter conditional fields */}
              {role === 'recruiter' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-label-caps font-label-caps text-outline dark:text-slate-400 block">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      required
                      className="w-full bg-surface-container-low dark:bg-slate-800 border-transparent dark:border-slate-700 rounded-xl p-3 text-body-md text-on-surface dark:text-white focus:bg-white dark:focus:bg-slate-750 input-focus-ring"
                      placeholder="Google"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-label-caps font-label-caps text-outline dark:text-slate-400 block">
                      Job Title
                    </label>
                    <input
                      type="text"
                      value={recruiterTitle}
                      onChange={(e) => setRecruiterTitle(e.target.value)}
                      required
                      className="w-full bg-surface-container-low dark:bg-slate-800 border-transparent dark:border-slate-700 rounded-xl p-3 text-body-md text-on-surface dark:text-white focus:bg-white dark:focus:bg-slate-750 input-focus-ring"
                      placeholder="Tech Recruiter"
                    />
                  </div>
                </div>
              )}

              {/* Password */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-label-caps font-label-caps text-outline dark:text-slate-400 block">
                    Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-outline dark:text-slate-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full bg-surface-container-low dark:bg-slate-800 border-transparent dark:border-slate-700 rounded-xl p-3 pl-10 text-body-md text-on-surface dark:text-white focus:bg-white dark:focus:bg-slate-750 input-focus-ring"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-label-caps font-label-caps text-outline dark:text-slate-400 block">
                    Confirm
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-outline dark:text-slate-400" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full bg-surface-container-low dark:bg-slate-800 border-transparent dark:border-slate-700 rounded-xl p-3 pl-10 text-body-md text-on-surface dark:text-white focus:bg-white dark:focus:bg-slate-750 input-focus-ring"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-primary text-on-primary py-4 rounded-xl font-bold hover:shadow-lg transition-all active:scale-95 duration-150 flex justify-center items-center gap-2 disabled:opacity-50 mt-2"
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-outline dark:text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                Sign In
              </Link>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
};

export default Register;
