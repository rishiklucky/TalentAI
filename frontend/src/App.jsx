import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import UploadResume from './pages/UploadResume';
import RecruiterDashboard from './pages/RecruiterDashboard';
import CandidateSearch from './pages/CandidateSearch';
import CandidateProfile from './pages/CandidateProfile';
import ShortlistedCandidates from './pages/ShortlistedCandidates';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import ResumeOptimizer from './pages/ResumeOptimizer';
import CareerRoadmap from './pages/CareerRoadmap';
import JobMatching from './pages/JobMatching';
import CandidateComparison from './pages/CandidateComparison';

// Private Route Wrapper
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-slate-950">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Role-based Route Wrapper
const RoleRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-slate-950">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return allowedRoles.includes(user?.role) ? children : <Navigate to="/" replace />;
};

// Guest-only Route Wrapper (redirects authenticated users to their dashboard)
const GuestRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-slate-950">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={user?.role === 'recruiter' ? '/recruiter' : '/dashboard'} replace />;
  }

  return children;
};

function AppContent() {
  return (
    <>
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Routes>
        {/* Public / Guest Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/login" 
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          } 
        />

        {/* Student/Candidate Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <RoleRoute allowedRoles={['student']}>
              <StudentDashboard />
            </RoleRoute>
          } 
        />
        <Route 
          path="/upload" 
          element={
            <RoleRoute allowedRoles={['student']}>
              <UploadResume />
            </RoleRoute>
          } 
        />
        <Route 
          path="/resume-optimizer" 
          element={
            <RoleRoute allowedRoles={['student']}>
              <ResumeOptimizer />
            </RoleRoute>
          } 
        />
        <Route 
          path="/career-roadmap" 
          element={
            <RoleRoute allowedRoles={['student']}>
              <CareerRoadmap />
            </RoleRoute>
          } 
        />

        {/* Recruiter Protected Routes */}
        <Route 
          path="/recruiter" 
          element={
            <RoleRoute allowedRoles={['recruiter']}>
              <RecruiterDashboard />
            </RoleRoute>
          } 
        />
        <Route 
          path="/candidates" 
          element={
            <RoleRoute allowedRoles={['recruiter']}>
              <CandidateSearch />
            </RoleRoute>
          } 
        />
        <Route 
          path="/candidates/:id" 
          element={
            <PrivateRoute>
              <CandidateProfile />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/shortlisted" 
          element={
            <RoleRoute allowedRoles={['recruiter']}>
              <ShortlistedCandidates />
            </RoleRoute>
          } 
        />
        <Route 
          path="/analytics" 
          element={
            <RoleRoute allowedRoles={['recruiter']}>
              <Analytics />
            </RoleRoute>
          } 
        />
        <Route 
          path="/job-matching" 
          element={
            <RoleRoute allowedRoles={['recruiter']}>
              <JobMatching />
            </RoleRoute>
          } 
        />
        <Route 
          path="/candidate-comparison" 
          element={
            <RoleRoute allowedRoles={['recruiter']}>
              <CandidateComparison />
            </RoleRoute>
          } 
        />

        {/* Shared Protected Settings Route */}
        <Route 
          path="/settings" 
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          } 
        />

        {/* Catch-all Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
