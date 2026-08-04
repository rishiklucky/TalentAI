import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiAlertCircle, FiUsers, FiUser } from 'react-icons/fi';
import Navbar from '../components/Navbar';

const Login = () => {
  const { user, isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === 'recruiter' ? '/recruiter' : '/dashboard', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student'); // Default role is Student
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const user = await login(email, password);
      // Ensure the logged in user matches the role they selected on login
      if (user.role !== role) {
        setError(`This account is registered as a ${user.role}. Please select the correct portal.`);
        setLoading(false);
        return;
      }
      
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

      <main className="flex-1 flex items-center justify-center py-16 px-4 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-md space-y-8 relative z-10">
          
          {/* Header Card */}
          <div className="text-center space-y-2">
            <h1 className="font-headline-lg text-3xl font-extrabold text-on-background dark:text-white">
              Welcome Back
            </h1>
            <p className="font-body-md text-on-surface-variant dark:text-slate-400">
              Sign in to manage your pipeline or parse your skills.
            </p>
          </div>

          {/* Login Form Container */}
          <div className="glass-card rounded-[24px] p-8 shadow-xl border border-outline-variant/30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
            
            {/* Role Select Tabs */}
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
                <FiUser /> Student / Candidate
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
                <FiUsers /> Recruiter Portal
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-4 bg-error-container/10 border border-error/20 text-error rounded-xl mb-6 text-sm">
                <FiAlertCircle className="text-lg flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
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
                    className="w-full bg-surface-container-low dark:bg-slate-800 border-transparent dark:border-slate-700 rounded-xl p-3.5 pl-10 text-body-md text-on-surface dark:text-white focus:bg-white dark:focus:bg-slate-750 input-focus-ring"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-label-caps font-label-caps text-outline dark:text-slate-400 block">
                    Password
                  </label>
                  <a href="#" className="text-xs text-primary hover:underline" onClick={(e) => e.preventDefault()}>
                    Forgot?
                  </a>
                </div>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-outline dark:text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-surface-container-low dark:bg-slate-800 border-transparent dark:border-slate-700 rounded-xl p-3.5 pl-10 text-body-md text-on-surface dark:text-white focus:bg-white dark:focus:bg-slate-750 input-focus-ring"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-primary text-on-primary py-4 rounded-xl font-bold hover:shadow-lg transition-all active:scale-95 duration-150 flex justify-center items-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Signing in...' : `Enter ${role === 'recruiter' ? 'Recruiter' : 'Student'} Portal`}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-outline dark:text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary font-semibold hover:underline">
                Create one
              </Link>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
};

export default Login;
