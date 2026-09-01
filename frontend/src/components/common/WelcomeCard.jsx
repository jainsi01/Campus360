import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, ArrowRight, User } from 'lucide-react';

const WelcomeCard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const userRole = user?.role || 'FACULTY';
  const displayName = user?.name ? (user.name.startsWith('Dr.') || user.name.startsWith('Prof.') ? user.name : `Dr. ${user.name}`) : 'Dr. Andrea';

  const getDashboardPath = () => {
    switch (userRole) {
      case 'ADMIN': return '/admin/dashboard';
      case 'HOD': return '/hod/dashboard';
      case 'FACULTY': return '/faculty/dashboard';
      case 'STUDENT': return '/student/dashboard';
      default: return '/dashboard';
    }
  };

  return (
    <div className="welcome-hero-card">
      <div className="welcome-hero-text">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.75rem', borderRadius: '9999px', background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 700, fontSize: '0.75rem', marginBottom: '0.75rem', letterSpacing: '0.04em' }}>
          CAMPUS360 UNIVERSITY ERP • {userRole} PORTAL
        </div>
        <h2>Good morning, {displayName} 👋</h2>
        <p>
          Welcome back to Campus360. Manage your academic activities, courses, students, and university operations seamlessly from your unified dashboard.
        </p>
        <div className="welcome-hero-actions">
          <button className="btn btn-primary" onClick={() => navigate(getDashboardPath())}>
            View Portal Workspace <ArrowRight size={16} />
          </button>
          <button className="btn btn-secondary" onClick={() => navigate(getDashboardPath())}>
            <User size={16} /> Profile Details
          </button>
        </div>
      </div>

      <div className="welcome-illustration">
        <GraduationCap size={72} strokeWidth={1.5} />
      </div>
    </div>
  );
};

export default WelcomeCard;
