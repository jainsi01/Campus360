import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  School, 
  BookOpen, 
  Clock, 
  Award, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw, 
  User, 
  LogOut, 
  LayoutDashboard,
  BarChart3
} from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/common/ToastProvider';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/auth/LoginPage';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import HodDashboard from './pages/hod/HodDashboard';
import UniversityModules from './pages/university/UniversityModules';
import AnalyticsDashboard from './pages/analytics/AnalyticsDashboard';
import UnauthorizedPage from './pages/UnauthorizedPage';
import AIChatbot from './components/common/AIChatbot';

// Navigation Link Helper (adds 'active' class depending on current path)
const NavLink = ({ to, children, className = 'nav-link' }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link to={to} className={`${className} ${isActive ? 'active' : ''}`}>
      {children}
    </Link>
  );
};

// Navbar Component
const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <img src="/campus360-logo.svg" alt="Campus360 logo" className="nav-brand-logo" />
        <span>Campus360</span>
      </Link>
      <ul className="nav-links">
        <li><NavLink to="/">Home</NavLink></li>
        <li><NavLink to="/about">About</NavLink></li>
        <li><NavLink to="/contact">Contact</NavLink></li>
        <li><NavLink to="/api-test">API Health</NavLink></li>

        {isAuthenticated ? (
          <>
            <li>
              <NavLink to="/dashboard" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <LayoutDashboard size={16} />
                Dashboard
              </NavLink>
            </li>
            {user?.role === 'ADMIN' && (
              <li>
                <NavLink to="/analytics" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <BarChart3 size={16} />
                  Analytics
                </NavLink>
              </li>
            )}
            <li>
              <button 
                onClick={logout} 
                className="nav-btn" 
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', border: 'none', cursor: 'pointer' }}
              >
                <LogOut size={16} />
                Sign Out ({user?.name?.split(' ')[0]})
              </button>
            </li>
          </>
        ) : (
          <li><NavLink to="/login" className="nav-btn">Sign In</NavLink></li>
        )}
      </ul>
    </nav>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          Campus360 University System
        </div>
        <p className="footer-text">
          &copy; {new Date().getFullYear()} Campus360. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

// Landing Page Component
const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="landing-page">
      <header className="hero-section">
        <div className="hero-badge">Campus360 Management Suite</div>
        <h1 className="hero-title">Manage Your Entire University in One Place</h1>
        <p className="hero-description">
          A production-quality ERP for students, faculty, heads of departments, and administrators. 
          Streamline courses, schedules, marks, attendance, fees, notices, and academic planning.
        </p>
        <div className="hero-actions">
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
          ) : (
            <Link to="/login" className="btn btn-primary">Go to Portal</Link>
          )}
          <Link to="/api-test" className="btn btn-secondary">Check Connection</Link>
        </div>
      </header>

      <section className="features-section">
        <div className="section-container">
          <h2 className="section-title">Designed for Every Stakeholder</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <BookOpen size={24} />
              </div>
              <h3>Academics & Courses</h3>
              <p>HODs and Faculty can define courses, map subjects, upload study materials, and manage student enrollments easily.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Clock size={24} />
              </div>
              <h3>Conflict-Free Timetables</h3>
              <p>Automated timetable checks prevent scheduling conflicts for classrooms, faculty members, and student cohorts.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Award size={24} />
              </div>
              <h3>Grades & Analytics</h3>
              <p>Track academic performance with marks entries (internal, midterm, practical, and final) with automatic CGPA calculation.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// About Page Component
const About = () => {
  return (
    <div className="test-page">
      <h1 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>About Campus360</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
        Campus360 is a full-featured University Management System built to address coordination challenges in modern universities.
      </p>
      <div style={{ backgroundColor: 'var(--bg-card)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <h3 style={{ marginBottom: '1rem' }}>Architectural Stack</h3>
        <ul style={{ listStylePosition: 'inside', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <li><strong>React + Vite</strong>: Blazing fast user interface updates, micro-animations, and dynamic tables/charts.</li>
          <li><strong>Express + Node.js</strong>: Secure, stateless JWT-based RESTful API service.</li>
          <li><strong>MySQL Database</strong>: Relational integrity, foreign key constraints, and transactional consistency.</li>
          <li><strong>Audit Trail</strong>: Real-time logging of critical system operations for compliance auditing.</li>
        </ul>
      </div>
    </div>
  );
};

// Contact Page Component
const Contact = () => {
  return (
    <div className="test-page" style={{ textAlign: 'center' }}>
      <h1>Contact Campus360 Admin</h1>
      <p style={{ color: 'var(--text-secondary)', marginTop: '1rem', marginBottom: '2rem' }}>
        For support, administrative queries, or access credentials setup, please reach out to the system administrator.
      </p>
      <div style={{ display: 'inline-block', backgroundColor: 'var(--bg-card)', padding: '2.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', minWidth: '320px' }}>
        <p style={{ fontWeight: 600 }}>System Support Desk</p>
        <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0' }}>Email: admin@campus360.edu</p>
        <p style={{ color: 'var(--text-secondary)' }}>Phone: +1 (555) 019-3600</p>
      </div>
    </div>
  );
};

// API Connection Test Page Component
const ApiTest = () => {
  const [status, setStatus] = useState('checking'); // checking | online | offline
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkConnection = async () => {
    setLoading(true);
    setStatus('checking');
    try {
      const res = await axios.get('http://localhost:5000/api/health');
      setStatus('online');
      setResponse(res.data);
    } catch (error) {
      setStatus('offline');
      setResponse({
        message: error.message,
        code: error.code || 'ERR_CONNECTION_REFUSED',
        details: 'Is the backend server running at http://localhost:5000?'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <div className="test-page">
      <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>Backend Connectivity Status</h1>
      <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '2rem' }}>
        Verify that the React frontend is communicating successfully with the Express Node.js API.
      </p>
      
      <div className="status-card">
        {status === 'checking' && (
          <div>
            <div className="status-badge checking">CONNECTING...</div>
            <p>Attempting to reach the Express backend server...</p>
          </div>
        )}
        
        {status === 'online' && (
          <div>
            <div className="status-badge online" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={16} /> CONNECTED
            </div>
            <h3 style={{ color: 'var(--success)', marginBottom: '0.5rem' }}>Connection Successful!</h3>
            <p style={{ color: 'var(--text-secondary)' }}>The frontend and Express API server are fully integrated.</p>
          </div>
        )}

        {status === 'offline' && (
          <div>
            <div className="status-badge offline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={16} /> CONNECTION FAILED
            </div>
            <h3 style={{ color: 'var(--danger)', marginBottom: '0.5rem' }}>Cannot reach server</h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              We tried requesting the backend health check API but did not receive a response.
            </p>
          </div>
        )}

        <button 
          onClick={checkConnection} 
          disabled={loading}
          className="btn btn-secondary" 
          style={{ marginTop: '2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <RefreshCw size={16} className={loading ? 'spin-animation' : ''} />
          Retest Connection
        </button>

        {response && (
          <div style={{ marginTop: '2rem' }}>
            <p style={{ textAlign: 'left', fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Raw API Response:</p>
            <pre className="raw-response">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

// Main App Router Config wrapped in AuthProvider
function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <div className="app-container">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/api-test" element={<ApiTest />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />

                <Route
                  path="/analytics"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <AnalyticsDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/hod/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['HOD', 'ADMIN']}>
                      <HodDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/hod/students"
                  element={
                    <ProtectedRoute allowedRoles={['HOD', 'ADMIN']}>
                      <HodDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/hod/faculty"
                  element={
                    <ProtectedRoute allowedRoles={['HOD', 'ADMIN']}>
                      <HodDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/hod/attendance"
                  element={
                    <ProtectedRoute allowedRoles={['HOD', 'ADMIN']}>
                      <HodDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/hod/analytics"
                  element={
                    <ProtectedRoute allowedRoles={['HOD', 'ADMIN']}>
                      <HodDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/hod/results"
                  element={
                    <ProtectedRoute allowedRoles={['HOD', 'ADMIN']}>
                      <HodDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/hod/reports"
                  element={
                    <ProtectedRoute allowedRoles={['HOD', 'ADMIN']}>
                      <HodDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/faculty/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['FACULTY', 'HOD', 'ADMIN']}>
                      <FacultyDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
                      <StudentDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/university/timetable"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN', 'HOD', 'FACULTY', 'STUDENT']}>
                      <UniversityModules />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/university/exams"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN', 'HOD', 'FACULTY', 'STUDENT']}>
                      <UniversityModules />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/university/fees"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN', 'HOD', 'FACULTY', 'STUDENT']}>
                      <UniversityModules />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/university/notices"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN', 'HOD', 'FACULTY', 'STUDENT']}>
                      <UniversityModules />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/university/notifications"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN', 'HOD', 'FACULTY', 'STUDENT']}>
                      <UniversityModules />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/university/complaints"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN', 'HOD', 'FACULTY', 'STUDENT']}>
                      <UniversityModules />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/university/audit"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN', 'HOD']}>
                      <UniversityModules />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
            <AIChatbot />
          </div>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
