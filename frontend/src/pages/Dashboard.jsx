import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { ShieldCheck, User, Mail, LogOut, CheckCircle, Award, BookOpen, Clock, Building2, GraduationCap, Users, ClipboardList, DoorOpen, BookMarked, BarChart3, ArrowRight } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';

const getDisplayName = (item) => {
  if (!item) return 'Unknown';
  return item.name || item.fullName || item.roomNumber || item.email || item.code || item.subjectName || 'Record';
};

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [adminData, setAdminData] = useState({
    departments: [],
    courses: [],
    subjects: [],
    faculty: [],
    students: [],
    rooms: [],
    enrollments: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    if (!isAdmin) return;

    let mounted = true;

    const fetchAdminData = async () => {
      setLoading(true);
      setError('');

      try {
        const [departmentsRes, coursesRes, subjectsRes, facultyRes, studentsRes, roomsRes, enrollmentsRes] = await Promise.all([
          api.get('/departments'),
          api.get('/courses'),
          api.get('/subjects'),
          api.get('/faculty'),
          api.get('/students'),
          api.get('/rooms'),
          api.get('/enrollments/me')
        ]);

        if (!mounted) return;

        setAdminData({
          departments: departmentsRes.data?.data || [],
          courses: coursesRes.data?.data || [],
          subjects: subjectsRes.data?.data || [],
          faculty: facultyRes.data?.data || [],
          students: studentsRes.data?.data || [],
          rooms: roomsRes.data?.data || [],
          enrollments: enrollmentsRes.data?.data || []
        });
      } catch (err) {
        if (!mounted) return;
        setError(err.response?.data?.message || 'Unable to load Campus360 admin data.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAdminData();

    return () => {
      mounted = false;
    };
  }, [isAdmin]);

  // Students must use their role-specific dashboard, never the shared/admin portal.
  if (user?.role === 'STUDENT') {
    return <Navigate to="/student/dashboard" replace />;
  }

  const adminStats = [
    { label: 'Departments', value: adminData.departments.length, icon: Building2 },
    { label: 'Courses', value: adminData.courses.length, icon: BookMarked },
    { label: 'Subjects', value: adminData.subjects.length, icon: BookOpen },
    { label: 'Faculty', value: adminData.faculty.length, icon: Users },
    { label: 'Students', value: adminData.students.length, icon: GraduationCap },
    { label: 'Rooms', value: adminData.rooms.length, icon: DoorOpen },
    { label: 'Enrollments', value: adminData.enrollments.length, icon: ClipboardList }
  ];

  const renderPreview = (title, items, accent) => (
    <div className="feature-card" key={title} style={{ minHeight: '220px' }}>
      <div className="feature-icon-wrapper" style={{ background: accent }}>
        <ShieldCheck size={22} />
      </div>
      <h3>{title}</h3>
      {items.length === 0 ? (
        <p>No records available yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {items.slice(0, 4).map((item, index) => (
            <li key={`${title}-${index}`} style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              • {getDisplayName(item)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="landing-page" style={{ padding: '3rem 2rem', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Welcome, {user?.name}</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Campus360 System Portal — Role: <strong style={{ color: '#818cf8' }}>{user?.role}</strong>
          </p>
        </div>
        <button onClick={logout} className="btn btn-secondary" style={{ gap: '0.5rem' }}>
          <LogOut size={18} /> Sign Out
        </button>
      </div>

      {/* Phase 10 Analytics Spotlight Banner */}
      <div style={{ 
        background: 'linear-gradient(135deg, rgba(99,102,241,0.18), rgba(168,85,247,0.22))', 
        border: '1px solid rgba(168,85,247,0.35)', 
        borderRadius: '16px', 
        padding: '1.75rem 2rem', 
        marginBottom: '2rem',
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a855f7', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.2rem' }}>
            <BarChart3 size={18} /> PHASE 10 ANALYTICS ENGINE
          </div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 0.3rem 0' }}>Recharts Interactive Dashboard & Visualizations</h3>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.92rem', maxWidth: '650px' }}>
            Explore department distributions, attendance trends, average marks by subject, CGPA grade brackets, fee collection recovery, and assignment completion rates.
          </p>
        </div>
        <Link to="/analytics" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.4rem', background: '#8b5cf6', borderColor: '#8b5cf6' }}>
          Open Analytics Hub <ArrowRight size={18} />
        </Link>
      </div>

      <div className="features-grid" style={{ marginBottom: '3rem' }}>
        <div className="feature-card">
          <div className="feature-icon-wrapper">
            <User size={24} />
          </div>
          <h3>Account Information</h3>
          <p style={{ marginBottom: '0.5rem' }}><strong>Email:</strong> {user?.email}</p>
          <p style={{ marginBottom: '0.5rem' }}><strong>Role Tier:</strong> {user?.role}</p>
          <p><strong>Status:</strong> <span style={{ color: 'var(--success)', fontWeight: 600 }}>Active</span></p>
        </div>

        <div className="feature-card">
          <div className="feature-icon-wrapper">
            <Award size={24} />
          </div>
          <h3>Active Modules Engine</h3>
          <p>Campus360 admin modules are live: departments, courses, subjects, faculty, students, timetables, exams, fees, and Phase 10 Recharts Analytics.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon-wrapper">
            <BookOpen size={24} />
          </div>
          <h3>Quick Navigation</h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
            <li><Link to="/analytics" style={{ color: '#a855f7', fontWeight: 600, textDecoration: 'underline' }}>📊 Analytics & Charts Hub</Link></li>
            <li><Link to="/university/timetable" style={{ color: '#818cf8', textDecoration: 'underline' }}>Timetable Scheduler</Link></li>
            <li><Link to="/university/exams" style={{ color: '#818cf8', textDecoration: 'underline' }}>Exams & Schedules</Link></li>
            <li><Link to="/university/fees" style={{ color: '#818cf8', textDecoration: 'underline' }}>Fee Record Tracker</Link></li>
            <li><Link to="/university/notices" style={{ color: '#818cf8', textDecoration: 'underline' }}>Noticeboard & Bulletin</Link></li>
            <li><Link to="/university/complaints" style={{ color: '#818cf8', textDecoration: 'underline' }}>Complaints & Grievances</Link></li>
            <li><Link to="/university/audit" style={{ color: '#818cf8', textDecoration: 'underline' }}>System Audit Logs</Link></li>
          </ul>
        </div>
      </div>

      {isAdmin && (
        <div style={{ marginTop: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 style={{ fontSize: '1.6rem', margin: 0 }}>Admin Control Center</h2>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              {loading ? 'Refreshing live data...' : 'Live from Campus360 backend'}
            </span>
          </div>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.35)', color: '#fca5a5', padding: '0.9rem 1rem', borderRadius: '10px', marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          <div className="features-grid" style={{ marginBottom: '1.5rem' }}>
            {adminStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div className="feature-card" key={stat.label}>
                  <div className="feature-icon-wrapper">
                    <Icon size={22} />
                  </div>
                  <h3>{stat.label}</h3>
                  <p style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>{stat.value}</p>
                </div>
              );
            })}
          </div>

          <div className="features-grid">
            {renderPreview('Departments', adminData.departments, 'linear-gradient(135deg, rgba(96,165,250,0.18), rgba(59,130,246,0.35))')}
            {renderPreview('Courses', adminData.courses, 'linear-gradient(135deg, rgba(167,139,250,0.18), rgba(139,92,246,0.35))')}
            {renderPreview('Subjects', adminData.subjects, 'linear-gradient(135deg, rgba(52,211,153,0.18), rgba(16,185,129,0.35))')}
            {renderPreview('Faculty', adminData.faculty, 'linear-gradient(135deg, rgba(251,191,36,0.18), rgba(245,158,11,0.35))')}
            {renderPreview('Students', adminData.students, 'linear-gradient(135deg, rgba(244,114,182,0.16), rgba(236,72,153,0.35))')}
            {renderPreview('Rooms', adminData.rooms, 'linear-gradient(135deg, rgba(96,165,250,0.16), rgba(59,130,246,0.35))')}
            {renderPreview('Enrollments', adminData.enrollments, 'linear-gradient(135deg, rgba(45,212,191,0.14), rgba(20,184,166,0.32))')}
          </div>
        </div>
      )}

      {!isAdmin && (
        <div style={{ backgroundColor: 'var(--bg-card)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginTop: '1rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Authenticated System Access Granted</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            You have successfully logged into Campus360. Next phases will unlock full role-tailored dashboards for Admins, HODs, Faculty members, and Students.
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
