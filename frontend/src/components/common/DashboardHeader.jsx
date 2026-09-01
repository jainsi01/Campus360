import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Search, Bell, Sun, Moon, Menu, ChevronDown } from 'lucide-react';

const DashboardHeader = ({ onToggleMobileMenu }) => {
  const { user } = useAuth();
  const [theme, setTheme] = useState(() => localStorage.getItem('campus360_theme') || 'light');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('campus360_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const displayName = user?.name ? (user.name.startsWith('Dr.') || user.name.startsWith('Prof.') ? user.name : `Dr. ${user.name}`) : 'Dr. Andrea';

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <button className="mobile-menu-toggle" onClick={onToggleMobileMenu} title="Toggle Navigation">
          <Menu size={22} />
        </button>
        <div>
          <div className="breadcrumb-nav">
            Dashboard / <span>Home</span>
          </div>
          <h2 className="header-greeting-text">
            {getGreeting()}, {displayName} 👋
          </h2>
        </div>
      </div>

      <div className="header-right">
        {/* Search Bar */}
        <div className="header-search-bar">
          <Search size={16} style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search portal, courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Notification Bell */}
        <button className="header-icon-btn" title="Notifications">
          <Bell size={18} />
          <span className="notification-badge-dot"></span>
        </button>

        {/* Theme Toggle */}
        <button className="header-icon-btn" onClick={toggleTheme} title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}>
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* Profile Avatar Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.35rem 0.65rem',
            borderRadius: '9999px',
            background: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
            cursor: 'pointer'
          }}
        >
          <div className="user-avatar-circle" style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            {user?.name?.split(' ')[0] || 'User'}
          </span>
          <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
