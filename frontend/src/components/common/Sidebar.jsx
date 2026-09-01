import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  FileText,
  ClipboardList,
  Calendar,
  Award,
  Bell,
  MessageSquare,
  BarChart3,
  ShieldCheck,
  LogOut
} from 'lucide-react';

const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const userRole = user?.role || 'GUEST';

  const isNavActive = (path) => {
    if (path === '/' || path === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const handleNavigate = (path) => {
    navigate(path);
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  const navSections = [
    {
      label: 'MAIN',
      items: [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard }
      ]
    },
    {
      label: 'ACADEMICS',
      items: [
        { label: 'Students', path: userRole === 'STUDENT' ? '/student/dashboard' : (userRole === 'HOD' ? '/hod/students' : '/admin/dashboard'), icon: GraduationCap },
        { label: 'Faculty', path: userRole === 'HOD' ? '/hod/faculty' : '/admin/dashboard', icon: Users, roles: ['ADMIN', 'HOD'] },
        { label: 'Courses', path: '/admin/dashboard', icon: BookOpen, roles: ['ADMIN', 'HOD'] },
        { label: 'Subjects', path: '/hod/subjects', icon: BookOpen, roles: ['HOD', 'FACULTY', 'ADMIN'] },
        { label: 'Assignments', path: userRole === 'FACULTY' ? '/faculty/dashboard' : (userRole === 'STUDENT' ? '/student/dashboard' : '/hod/assignments'), icon: FileText },
        { label: 'Attendance', path: userRole === 'FACULTY' ? '/faculty/dashboard' : (userRole === 'STUDENT' ? '/student/dashboard' : '/hod/attendance'), icon: ClipboardList },
        { label: 'Timetable', path: '/university/timetable', icon: Calendar },
        { label: 'Examinations', path: '/university/exams', icon: Award },
        { label: 'Results', path: userRole === 'STUDENT' ? '/student/dashboard' : '/hod/results', icon: Award }
      ]
    },
    {
      label: 'COMMUNICATION',
      items: [
        { label: 'Notices', path: '/university/notices', icon: Bell },
        { label: 'Complaints', path: '/university/complaints', icon: MessageSquare }
      ]
    },
    {
      label: 'SYSTEM',
      items: [
        { label: 'Analytics', path: '/analytics', icon: BarChart3, roles: ['ADMIN', 'HOD', 'FACULTY'] },
        { label: 'Audit Trail', path: '/university/audit', icon: ShieldCheck, roles: ['ADMIN'] }
      ]
    }
  ];

  return (
    <aside className={`dashboard-sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-header" onClick={() => handleNavigate('/dashboard')} style={{ cursor: 'pointer' }}>
        <img src="/campus360-logo.svg" alt="Campus360 Logo" className="sidebar-logo" />
        <div className="sidebar-brand-text">
          <h1>Campus360</h1>
          <p>University System</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        {navSections.map((section, idx) => {
          const visibleItems = section.items.filter(item => !item.roles || item.roles.includes(userRole));
          if (visibleItems.length === 0) return null;

          return (
            <div key={idx} className="nav-section">
              <div className="nav-section-label">{section.label}</div>
              <ul className="nav-item-list">
                {visibleItems.map((item, itemIdx) => {
                  const Icon = item.icon;
                  const active = isNavActive(item.path);

                  return (
                    <li key={itemIdx}>
                      <button
                        onClick={() => handleNavigate(item.path)}
                        className={`nav-link-btn ${active ? 'active' : ''}`}
                      >
                        <Icon size={18} className="nav-icon" />
                        <span>{item.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>

      {/* Sidebar Footer User Profile */}
      <div className="sidebar-footer">
        <div className="user-profile-pill">
          <div className="user-avatar-circle">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="user-info-text">
            <strong>{user?.name || 'Academic User'}</strong>
            <span className="user-role-badge">{userRole}</span>
          </div>
          <button
            onClick={logout}
            title="Sign Out"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '0.35rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
