import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const UnauthorizedPage = () => {
  return (
    <div className="landing-page" style={{ padding: '6rem 2rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
        color: '#ef4444',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 1.5rem auto'
      }}>
        <ShieldAlert size={48} />
      </div>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>403 - Access Forbidden</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        You do not have permission to view or access this administrative resource. Please contact your system administrator if you believe this is an error.
      </p>
      <Link to="/dashboard" className="btn btn-primary" style={{ gap: '0.5rem' }}>
        <ArrowLeft size={18} /> Back to Dashboard
      </Link>
    </div>
  );
};

export default UnauthorizedPage;
