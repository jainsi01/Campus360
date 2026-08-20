import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  School, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  UserCheck, 
  GraduationCap, 
  Building2 
} from 'lucide-react';

const DEMO_ACCOUNTS = [
  {
    role: 'ADMIN',
    title: 'Administrator',
    email: 'admin@campus360.edu',
    password: 'password123',
    icon: ShieldCheck,
    badgeClass: 'badge-admin'
  },
  {
    role: 'HOD',
    title: 'Head of Dept',
    email: 'rajesh.kumar@campus360.edu',
    password: 'password123',
    icon: Building2,
    badgeClass: 'badge-hod'
  },
  {
    role: 'FACULTY',
    title: 'Faculty Member',
    email: 'priya.patel@campus360.edu',
    password: 'password123',
    icon: UserCheck,
    badgeClass: 'badge-faculty'
  },
  {
    role: 'STUDENT',
    title: 'Student',
    email: 'aarav.mehta@campus360.edu',
    password: 'password123',
    icon: GraduationCap,
    badgeClass: 'badge-student'
  }
];

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');

  const { login, error: authError, setError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (!email || !password) {
      setLocalError('Please enter both email address and password');
      return;
    }

    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);

    if (result.success) {
      // Redirect based on user role
      const userRole = result.user.role;
      let targetPath = '/dashboard';
      if (userRole === 'ADMIN') targetPath = '/admin/dashboard';
      else if (userRole === 'HOD') targetPath = '/hod/dashboard';
      else if (userRole === 'FACULTY') targetPath = '/faculty/dashboard';
      else if (userRole === 'STUDENT') targetPath = '/student/dashboard';

      navigate(targetPath, { replace: true });
    }
  };

  const handleSelectDemoAccount = (demo) => {
    setEmail(demo.email);
    setPassword(demo.password);
    setLocalError('');
    if (setError) setError(null);
  };

  const displayError = localError || authError;

  return (
    <div className="login-page-wrapper">
      <div className="login-card-container">
        <div className="login-header">
          <div className="brand-logo-large">
            <img src="/campus360-logo.svg" alt="Campus360 logo" className="logo-icon" />
          </div>
          <h1 className="login-title">Campus360 System Sign-In</h1>
          <p className="login-subtitle">
            Enter your credentials to access your academic portal
          </p>
        </div>

        {displayError && (
          <div className="alert alert-danger" role="alert">
            <AlertCircle size={20} className="alert-icon" />
            <span>{displayError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label" htmlFor="email-input">Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} className="field-icon" />
              <input
                id="email-input"
                type="email"
                className="form-input"
                placeholder="name@campus360.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <div className="form-label-row">
              <label className="form-label" htmlFor="password-input">Password</label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Please contact Campus IT Administrator to reset your password.'); }} className="forgot-link">
                Forgot password?
              </a>
            </div>
            <div className="input-with-icon">
              <Lock size={18} className="field-icon" />
              <input
                id="password-input"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg"
            disabled={submitting}
          >
            {submitting ? (
              <span className="btn-spinner-content">
                <span className="spinner"></span> Authenticating...
              </span>
            ) : (
              'Sign In to Campus360'
            )}
          </button>
        </form>

        <div className="demo-accounts-section">
          <div className="demo-divider">
            <span>Quick Demo Accounts</span>
          </div>
          <p className="demo-hint">Select a role below to auto-fill credentials:</p>
          <div className="demo-grid">
            {DEMO_ACCOUNTS.map((demo) => {
              const IconComponent = demo.icon;
              const isSelected = email === demo.email;
              return (
                <button
                  key={demo.role}
                  type="button"
                  className={`demo-pill ${demo.badgeClass} ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelectDemoAccount(demo)}
                >
                  <IconComponent size={16} />
                  <span>{demo.title}</span>
                  {isSelected && <CheckCircle2 size={14} className="ml-auto" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
