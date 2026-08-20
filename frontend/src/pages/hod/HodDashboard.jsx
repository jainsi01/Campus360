import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/ToastProvider';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import SearchBar, { FilterDropdown } from '../../components/common/SearchBar';
import LoadingSpinner, { TableSkeleton } from '../../components/common/LoadingSpinner';
import api from '../../services/api';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import {
  Building2,
  Users,
  GraduationCap,
  BookOpen,
  CalendarCheck2,
  BarChart3,
  Award,
  FileSpreadsheet,
  Search,
  Filter,
  Download,
  Printer,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  BookMarked,
  UserCheck,
  RefreshCw,
  TrendingUp,
  FileText
} from 'lucide-react';

const CHART_COLORS = ['#818cf8', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#38bdf8'];

const tabs = [
  { key: 'overview', label: 'Department Dashboard', icon: Building2 },
  { key: 'students', label: 'Department Students', icon: GraduationCap },
  { key: 'faculty', label: 'Department Faculty', icon: Users },
  { key: 'attendance', label: 'Attendance Analytics', icon: CalendarCheck2 },
  { key: 'academic', label: 'Academic Analytics', icon: BarChart3 },
  { key: 'results', label: 'Results', icon: Award },
  { key: 'reports', label: 'Reports', icon: FileSpreadsheet }
];

const HodDashboard = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Determine initial active tab from URL path
  const getTabFromPath = (pathname) => {
    if (pathname.includes('/hod/students')) return 'students';
    if (pathname.includes('/hod/faculty')) return 'faculty';
    if (pathname.includes('/hod/attendance')) return 'attendance';
    if (pathname.includes('/hod/analytics') || pathname.includes('/hod/academic')) return 'academic';
    if (pathname.includes('/hod/results')) return 'results';
    if (pathname.includes('/hod/reports')) return 'reports';
    return 'overview';
  };

  const [activeTab, setActiveTab] = useState(getTabFromPath(location.pathname));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // HOD Data state
  const [overview, setOverview] = useState({ department: null, stats: {}, courses: [] });
  const [students, setStudents] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [attendance, setAttendance] = useState({ summary: {}, subjectBreakdown: [], lowAttendanceList: [] });
  const [academic, setAcademic] = useState({ gradeDistribution: [], subjectPerformance: [], topPerformers: [], atRiskStudents: [] });
  const [results, setResults] = useState({ summary: {}, results: [] });
  const [reports, setReports] = useState(null);
  const [filters, setFilters] = useState({ courses: [], subjects: [], exams: [] });

  // UI Search & Filter state
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  
  const [facultySearch, setFacultySearch] = useState('');

  const [attendanceSubject, setAttendanceSubject] = useState('');
  
  const [academicExam, setAcademicExam] = useState('');

  const [resultsExam, setResultsExam] = useState('');
  const [resultsSearch, setResultsSearch] = useState('');

  // Sync tab with URL when user navigates
  const handleTabChange = (key) => {
    setActiveTab(key);
    if (key === 'overview') navigate('/hod/dashboard');
    else navigate(`/hod/${key === 'academic' ? 'analytics' : key}`);
  };

  useEffect(() => {
    setActiveTab(getTabFromPath(location.pathname));
  }, [location.pathname]);

  const fetchHodData = async () => {
    setLoading(true);
    setError('');
    try {
      const [
        overviewRes,
        studentsRes,
        facultyRes,
        attendanceRes,
        academicRes,
        resultsRes,
        reportsRes,
        filtersRes
      ] = await Promise.all([
        api.get('/hod-features/dashboard'),
        api.get('/hod-features/students'),
        api.get('/hod-features/faculty'),
        api.get('/hod-features/attendance-analytics'),
        api.get('/hod-features/academic-analytics'),
        api.get('/hod-features/results'),
        api.get('/hod-features/reports'),
        api.get('/hod-features/filters')
      ]);

      setOverview(overviewRes.data?.data || {});
      setStudents(studentsRes.data?.data || []);
      setFaculty(facultyRes.data?.data || []);
      setAttendance(attendanceRes.data?.data || {});
      setAcademic(academicRes.data?.data || {});
      setResults(resultsRes.data?.data || {});
      setReports(reportsRes.data?.data || null);
      setFilters(filtersRes.data?.data || {});
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch HOD department details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHodData();
  }, []);

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchesSearch = !studentSearch || 
        s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.email.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.student_id.toLowerCase().includes(studentSearch.toLowerCase());
      
      const matchesCourse = !selectedCourse || String(s.course_id) === String(selectedCourse);
      const matchesSem = !selectedSemester || String(s.semester) === String(selectedSemester);

      return matchesSearch && matchesCourse && matchesSem;
    });
  }, [students, studentSearch, selectedCourse, selectedSemester]);

  // Filtered Faculty
  const filteredFaculty = useMemo(() => {
    return faculty.filter(f => {
      if (!facultySearch) return true;
      const q = facultySearch.toLowerCase();
      return f.name.toLowerCase().includes(q) ||
        f.email.toLowerCase().includes(q) ||
        f.faculty_id.toLowerCase().includes(q) ||
        f.designation.toLowerCase().includes(q);
    });
  }, [faculty, facultySearch]);

  // Filtered Results
  const filteredResults = useMemo(() => {
    const list = results.results || [];
    return list.filter(r => {
      const matchesExam = !resultsExam || String(r.exam_id) === String(resultsExam);
      const matchesSearch = !resultsSearch ||
        r.student_name.toLowerCase().includes(resultsSearch.toLowerCase()) ||
        r.roll_number.toLowerCase().includes(resultsSearch.toLowerCase()) ||
        r.subject_name.toLowerCase().includes(resultsSearch.toLowerCase()) ||
        r.subject_code.toLowerCase().includes(resultsSearch.toLowerCase());
      return matchesExam && matchesSearch;
    });
  }, [results.results, resultsExam, resultsSearch]);

  // Download CSV Utility
  const downloadCSV = (filename, rows) => {
    if (!rows || !rows.length) return;
    const keys = Object.keys(rows[0]);
    const csvContent = [
      keys.join(','),
      ...rows.map(row => keys.map(k => `"${String(row[k] ?? '').replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const departmentName = overview.department?.name || 'Department Management';
  const departmentCode = overview.department?.code || 'DEPT';
  const hodName = overview.department?.hod_name || user?.name;

  return (
    <div className="landing-page" style={{ padding: '2rem 1.5rem', maxWidth: '1280px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.98))',
        borderRadius: '16px',
        padding: '2rem',
        border: '1px solid rgba(255,255,255,0.1)',
        marginBottom: '2rem',
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(99, 102, 241, 0.2)', padding: '0.35rem 0.85rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, color: '#818cf8', marginBottom: '0.75rem' }}>
            <Building2 size={15} /> Head of Department Portal ({departmentCode})
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
            {departmentName}
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: '0.4rem 0 0 0', fontSize: '0.95rem' }}>
            HOD: <strong style={{ color: '#e2e8f0' }}>{hodName}</strong> • System User: <span style={{ color: '#94a3b8' }}>{user?.email}</span>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={fetchHodData} className="btn btn-secondary" style={{ gap: '0.5rem', background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.15)' }}>
            <RefreshCw size={16} className={loading ? 'spin-animation' : ''} /> Refresh Data
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        overflowX: 'auto',
        paddingBottom: '0.5rem',
        marginBottom: '2rem',
        borderBottom: '1px solid var(--border-color)'
      }}>
        {tabs.map(({ key, label, icon: Icon }) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => handleTabChange(key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.25rem',
                borderRadius: '10px',
                border: 'none',
                background: isActive ? 'var(--primary)' : 'var(--bg-card)',
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                fontWeight: isActive ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                boxShadow: isActive ? '0 4px 12px rgba(99, 102, 241, 0.3)' : 'none'
              }}
            >
              <Icon size={18} />
              {label}
            </button>
          );
        })}
      </div>

      {/* Error Alert */}
      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          color: '#fca5a5',
          padding: '1rem',
          borderRadius: '12px',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <AlertTriangle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-secondary)' }}>
          <RefreshCw size={32} className="spin-animation" style={{ marginBottom: '1rem', color: 'var(--primary)' }} />
          <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>Loading Department Dashboard...</p>
        </div>
      ) : (
        <div>
          {/* TAB 1: OVERVIEW DASHBOARD */}
          {activeTab === 'overview' && (
            <div>
              {/* Stat Cards Grid */}
              <div className="features-grid" style={{ marginBottom: '2rem' }}>
                <div className="feature-card">
                  <div className="feature-icon-wrapper" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
                    <GraduationCap size={24} />
                  </div>
                  <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Department Students</h3>
                  <p style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                    {overview.stats?.totalStudents || 0}
                  </p>
                </div>

                <div className="feature-card">
                  <div className="feature-icon-wrapper" style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#f472b6' }}>
                    <Users size={24} />
                  </div>
                  <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Department Faculty</h3>
                  <p style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                    {overview.stats?.totalFaculty || 0}
                  </p>
                </div>

                <div className="feature-card">
                  <div className="feature-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
                    <BookMarked size={24} />
                  </div>
                  <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Offered Courses</h3>
                  <p style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                    {overview.stats?.totalCourses || 0}
                  </p>
                </div>

                <div className="feature-card">
                  <div className="feature-icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
                    <BookOpen size={24} />
                  </div>
                  <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Total Subjects</h3>
                  <p style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                    {overview.stats?.totalSubjects || 0}
                  </p>
                </div>

                <div className="feature-card">
                  <div className="feature-icon-wrapper" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>
                    <CalendarCheck2 size={24} />
                  </div>
                  <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Overall Attendance</h3>
                  <p style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                    {overview.stats?.attendancePercentage || 0}%
                  </p>
                </div>

                <div className="feature-card">
                  <div className="feature-icon-wrapper" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' }}>
                    <TrendingUp size={24} />
                  </div>
                  <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Average Marks</h3>
                  <p style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                    {overview.stats?.avgScore || 0} / 100
                  </p>
                </div>
              </div>

              {/* Department Courses Overview Table */}
              <div className="feature-card" style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BookMarked size={20} color="var(--primary)" /> Department Degree Programs & Courses
                </h2>
                {(!overview.courses || overview.courses.length === 0) ? (
                  <p style={{ color: 'var(--text-secondary)' }}>No active courses found for this department.</p>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                          <th style={{ padding: '0.8rem 1rem' }}>Code</th>
                          <th style={{ padding: '0.8rem 1rem' }}>Course Name</th>
                          <th style={{ padding: '0.8rem 1rem' }}>Duration</th>
                          <th style={{ padding: '0.8rem 1rem' }}>Total Students</th>
                          <th style={{ padding: '0.8rem 1rem' }}>Total Subjects</th>
                        </tr>
                      </thead>
                      <tbody>
                        {overview.courses.map((course) => (
                          <tr key={course.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td style={{ padding: '0.9rem 1rem', fontWeight: 600, color: '#818cf8' }}>{course.code}</td>
                            <td style={{ padding: '0.9rem 1rem', fontWeight: 600 }}>{course.name}</td>
                            <td style={{ padding: '0.9rem 1rem', color: 'var(--text-secondary)' }}>{course.duration_years} Years</td>
                            <td style={{ padding: '0.9rem 1rem' }}>
                              <span style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '0.25rem 0.6rem', borderRadius: '6px', fontSize: '0.88rem', color: '#818cf8', fontWeight: 600 }}>
                                {course.student_count} Enrolled
                              </span>
                            </td>
                            <td style={{ padding: '0.9rem 1rem', color: 'var(--text-secondary)' }}>{course.subject_count} Subjects</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: DEPARTMENT STUDENTS */}
          {activeTab === 'students' && (
            <div className="feature-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.3rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <GraduationCap size={22} color="var(--primary)" /> Department Enrolled Students
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>
                    Showing {filteredStudents.length} of {students.length} students
                  </p>
                </div>

                {/* Controls */}
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <div style={{ position: 'relative', width: '220px' }}>
                    <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                    <input
                      type="text"
                      placeholder="Search student..."
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.5rem 0.5rem 0.5rem 2.2rem',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-input)',
                        color: 'var(--text-primary)'
                      }}
                    />
                  </div>

                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    style={{ padding: '0.55rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
                  >
                    <option value="">All Courses</option>
                    {(filters.courses || []).map(c => (
                      <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
                    ))}
                  </select>

                  <select
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(e.target.value)}
                    style={{ padding: '0.55rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
                  >
                    <option value="">All Semesters</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                      <option key={s} value={s}>Semester {s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {filteredStudents.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', padding: '1.5rem 0' }}>No matching students found in this department.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                        <th style={{ padding: '0.8rem 1rem' }}>Roll Number</th>
                        <th style={{ padding: '0.8rem 1rem' }}>Student Name</th>
                        <th style={{ padding: '0.8rem 1rem' }}>Course & Semester</th>
                        <th style={{ padding: '0.8rem 1rem' }}>Batch</th>
                        <th style={{ padding: '0.8rem 1rem' }}>Attendance</th>
                        <th style={{ padding: '0.8rem 1rem' }}>Avg Score</th>
                        <th style={{ padding: '0.8rem 1rem' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((student) => {
                        const att = student.attendance_percentage || 0;
                        const isLowAtt = att < 75;
                        return (
                          <tr key={student.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td style={{ padding: '0.9rem 1rem', fontWeight: 600, color: '#818cf8' }}>{student.student_id}</td>
                            <td style={{ padding: '0.9rem 1rem' }}>
                              <div style={{ fontWeight: 600 }}>{student.name}</div>
                              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{student.email}</div>
                            </td>
                            <td style={{ padding: '0.9rem 1rem' }}>
                              <div>{student.course_name}</div>
                              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Sem {student.semester}</div>
                            </td>
                            <td style={{ padding: '0.9rem 1rem', color: 'var(--text-secondary)' }}>{student.batch}</td>
                            <td style={{ padding: '0.9rem 1rem' }}>
                              <span style={{
                                padding: '0.25rem 0.6rem',
                                borderRadius: '6px',
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                background: isLowAtt ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)',
                                color: isLowAtt ? '#f87171' : '#34d399'
                              }}>
                                {att}%
                              </span>
                            </td>
                            <td style={{ padding: '0.9rem 1rem', fontWeight: 600 }}>{student.avg_marks}</td>
                            <td style={{ padding: '0.9rem 1rem' }}>
                              <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
                                {student.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DEPARTMENT FACULTY */}
          {activeTab === 'faculty' && (
            <div className="feature-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.3rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Users size={22} color="var(--primary)" /> Department Faculty Members
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>
                    Total {filteredFaculty.length} faculty staff registered
                  </p>
                </div>

                <div style={{ position: 'relative', width: '250px' }}>
                  <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                  <input
                    type="text"
                    placeholder="Search faculty..."
                    value={facultySearch}
                    onChange={(e) => setFacultySearch(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.5rem 0.5rem 2.2rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-input)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>
              </div>

              {filteredFaculty.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', padding: '1.5rem 0' }}>No matching faculty found.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                        <th style={{ padding: '0.8rem 1rem' }}>Faculty ID</th>
                        <th style={{ padding: '0.8rem 1rem' }}>Faculty Name</th>
                        <th style={{ padding: '0.8rem 1rem' }}>Designation</th>
                        <th style={{ padding: '0.8rem 1rem' }}>Assigned Subjects</th>
                        <th style={{ padding: '0.8rem 1rem' }}>Joining Date</th>
                        <th style={{ padding: '0.8rem 1rem' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredFaculty.map((f) => (
                        <tr key={f.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td style={{ padding: '0.9rem 1rem', fontWeight: 600, color: '#818cf8' }}>{f.faculty_id}</td>
                          <td style={{ padding: '0.9rem 1rem' }}>
                            <div style={{ fontWeight: 600 }}>{f.name}</div>
                            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{f.email}</div>
                          </td>
                          <td style={{ padding: '0.9rem 1rem' }}>
                            <span style={{ background: 'rgba(99, 102, 241, 0.12)', color: '#818cf8', padding: '0.25rem 0.6rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600 }}>
                              {f.designation}
                            </span>
                          </td>
                          <td style={{ padding: '0.9rem 1rem', color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '300px' }}>
                            {f.assigned_subjects_list ? (
                              <div>
                                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>({f.assigned_subjects_count})</span> {f.assigned_subjects_list}
                              </div>
                            ) : (
                              <em style={{ color: '#94a3b8' }}>None Assigned</em>
                            )}
                          </td>
                          <td style={{ padding: '0.9rem 1rem', color: 'var(--text-secondary)' }}>
                            {f.joining_date ? new Date(f.joining_date).toLocaleDateString() : 'N/A'}
                          </td>
                          <td style={{ padding: '0.9rem 1rem' }}>
                            <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
                              {f.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: ATTENDANCE ANALYTICS */}
          {activeTab === 'attendance' && (
            <div>
              {/* Summary Header */}
              <div className="features-grid" style={{ marginBottom: '2rem' }}>
                <div className="feature-card">
                  <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Total Class Records</h3>
                  <p style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0 }}>{attendance.summary?.totalRecords || 0}</p>
                </div>
                <div className="feature-card">
                  <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Present Instances</h3>
                  <p style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0, color: '#34d399' }}>{attendance.summary?.presentCount || 0}</p>
                </div>
                <div className="feature-card">
                  <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Absent Instances</h3>
                  <p style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0, color: '#f87171' }}>{attendance.summary?.absentCount || 0}</p>
                </div>
                <div className="feature-card">
                  <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Department Attendance Rate</h3>
                  <p style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0, color: '#60a5fa' }}>{attendance.summary?.attendancePercentage || 0}%</p>
                </div>
              </div>

              {/* Low Attendance Alert (<75%) */}
              {(attendance.lowAttendanceList || []).length > 0 && (
                <div className="feature-card" style={{ border: '1px solid rgba(239, 68, 68, 0.4)', background: 'rgba(239, 68, 68, 0.05)', marginBottom: '2rem' }}>
                  <h2 style={{ fontSize: '1.2rem', color: '#f87171', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <AlertTriangle size={20} /> Low Attendance Warning List (&lt; 75% Requirement)
                  </h2>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid rgba(239,68,68,0.2)', color: 'var(--text-secondary)' }}>
                          <th style={{ padding: '0.75rem 1rem' }}>Roll No</th>
                          <th style={{ padding: '0.75rem 1rem' }}>Student Name</th>
                          <th style={{ padding: '0.75rem 1rem' }}>Course</th>
                          <th style={{ padding: '0.75rem 1rem' }}>Sem</th>
                          <th style={{ padding: '0.75rem 1rem' }}>Classes Attended</th>
                          <th style={{ padding: '0.75rem 1rem' }}>Attendance Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendance.lowAttendanceList.map(item => (
                          <tr key={item.student_id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <td style={{ padding: '0.8rem 1rem', fontWeight: 600, color: '#fca5a5' }}>{item.roll_number}</td>
                            <td style={{ padding: '0.8rem 1rem', fontWeight: 600 }}>{item.student_name}</td>
                            <td style={{ padding: '0.8rem 1rem', color: 'var(--text-secondary)' }}>{item.course_name}</td>
                            <td style={{ padding: '0.8rem 1rem' }}>Sem {item.semester}</td>
                            <td style={{ padding: '0.8rem 1rem' }}>{item.present_classes} / {item.total_classes}</td>
                            <td style={{ padding: '0.8rem 1rem' }}>
                              <span style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: 700 }}>
                                {item.attendance_percentage}%
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Subject-Wise Attendance Breakdown */}
              <div className="feature-card">
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CalendarCheck2 size={20} color="var(--primary)" /> Subject-Wise Attendance Breakdown
                </h2>
                {(!attendance.subjectBreakdown || attendance.subjectBreakdown.length === 0) ? (
                  <p style={{ color: 'var(--text-secondary)' }}>No attendance records found for department subjects.</p>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                          <th style={{ padding: '0.8rem 1rem' }}>Subject Code</th>
                          <th style={{ padding: '0.8rem 1rem' }}>Subject Name</th>
                          <th style={{ padding: '0.8rem 1rem' }}>Course & Semester</th>
                          <th style={{ padding: '0.8rem 1rem' }}>Total Sessions</th>
                          <th style={{ padding: '0.8rem 1rem' }}>Presents / Absents</th>
                          <th style={{ padding: '0.8rem 1rem' }}>Attendance Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendance.subjectBreakdown.map(sub => (
                          <tr key={sub.subject_id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td style={{ padding: '0.9rem 1rem', fontWeight: 600, color: '#818cf8' }}>{sub.subject_code}</td>
                            <td style={{ padding: '0.9rem 1rem', fontWeight: 600 }}>{sub.subject_name}</td>
                            <td style={{ padding: '0.9rem 1rem', color: 'var(--text-secondary)' }}>{sub.course_name} (Sem {sub.semester})</td>
                            <td style={{ padding: '0.9rem 1rem' }}>{sub.total_marked}</td>
                            <td style={{ padding: '0.9rem 1rem' }}>
                              <span style={{ color: '#34d399', fontWeight: 600 }}>{sub.present_count} P</span> / <span style={{ color: '#f87171', fontWeight: 600 }}>{sub.absent_count} A</span>
                            </td>
                            <td style={{ padding: '0.9rem 1rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                                  <div style={{
                                    height: '100%',
                                    width: `${sub.present_percentage}%`,
                                    background: sub.present_percentage >= 75 ? 'linear-gradient(90deg, #34d399, #10b981)' : 'linear-gradient(90deg, #f87171, #ef4444)',
                                    borderRadius: '4px'
                                  }} />
                                </div>
                                <span style={{ fontWeight: 700, fontSize: '0.9rem', width: '45px' }}>{sub.present_percentage}%</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: ACADEMIC ANALYTICS */}
          {activeTab === 'academic' && (
            <div>
              {/* Full Analytics Engine Shortcut Banner */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.2))',
                border: '1px solid rgba(168,85,247,0.3)',
                padding: '1.25rem 1.5rem',
                borderRadius: '12px',
                marginBottom: '2rem',
                display: 'flex',
                justify: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#a855f7' }}>
                    Phase 10 — Full Campus Analytics & Charts Hub
                  </h3>
                  <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                    Access interactive Recharts visualizers for attendance trends, CGPA distributions, fee collection & assignment rates.
                  </p>
                </div>
                <Link to="/analytics" className="btn btn-primary" style={{ padding: '0.5rem 1.2rem', fontSize: '0.88rem', background: '#8b5cf6', borderColor: '#8b5cf6' }}>
                  View Full Analytics Hub →
                </Link>
              </div>

              {/* Recharts Performance Visualizer */}
              {(academic.subjectPerformance && academic.subjectPerformance.length > 0) && (
                <div className="feature-card" style={{ marginBottom: '2rem' }}>
                  <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <BarChart3 size={20} color="#818cf8" /> Visual Academic Performance Comparison
                  </h2>
                  <div style={{ width: '100%', height: 280 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={academic.subjectPerformance} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                        <XAxis dataKey="subject_code" stroke="var(--text-secondary)" tick={{ fontSize: 11 }} />
                        <YAxis stroke="var(--text-secondary)" tick={{ fontSize: 11 }} />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }} />
                        <Legend wrapperStyle={{ fontSize: '0.8rem' }} />
                        <Bar dataKey="avg_internal" name="Internal (Avg)" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="avg_midterm" name="Midterm (Avg)" fill="#a78bfa" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="avg_final" name="Final (Avg)" fill="#fbbf24" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Grade Distribution */}
              <div className="feature-card" style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BarChart3 size={20} color="var(--primary)" /> Department Grade Distribution
                </h2>
                {(!academic.gradeDistribution || academic.gradeDistribution.length === 0) ? (
                  <p style={{ color: 'var(--text-secondary)' }}>No graded marks records found.</p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem' }}>
                    {academic.gradeDistribution.map(g => (
                      <div key={g.grade} style={{
                        background: 'var(--bg-input)',
                        padding: '1.25rem',
                        borderRadius: '12px',
                        border: '1px solid var(--border-color)',
                        textAlign: 'center'
                      }}>
                        <div style={{ fontSize: '1.6rem', fontWeight: 800, color: g.grade === 'F' ? '#f87171' : '#818cf8' }}>
                          Grade {g.grade}
                        </div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 700, marginTop: '0.3rem' }}>{g.count} Students</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Subject-Wise Performance Breakdown */}
              <div className="feature-card" style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BookOpen size={20} color="var(--primary)" /> Subject Academic Performance Averages
                </h2>
                {(!academic.subjectPerformance || academic.subjectPerformance.length === 0) ? (
                  <p style={{ color: 'var(--text-secondary)' }}>No performance evaluation data recorded yet.</p>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                          <th style={{ padding: '0.8rem 1rem' }}>Subject Code & Name</th>
                          <th style={{ padding: '0.8rem 1rem' }}>Course</th>
                          <th style={{ padding: '0.8rem 1rem' }}>Internal Avg</th>
                          <th style={{ padding: '0.8rem 1rem' }}>Midterm Avg</th>
                          <th style={{ padding: '0.8rem 1rem' }}>Practical Avg</th>
                          <th style={{ padding: '0.8rem 1rem' }}>Final Avg</th>
                          <th style={{ padding: '0.8rem 1rem' }}>Total Avg</th>
                        </tr>
                      </thead>
                      <tbody>
                        {academic.subjectPerformance.map(sp => (
                          <tr key={sp.subject_id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td style={{ padding: '0.9rem 1rem' }}>
                              <div style={{ fontWeight: 600 }}>{sp.subject_name}</div>
                              <div style={{ fontSize: '0.82rem', color: '#818cf8' }}>{sp.subject_code} (Sem {sp.semester})</div>
                            </td>
                            <td style={{ padding: '0.9rem 1rem', color: 'var(--text-secondary)' }}>{sp.course_name}</td>
                            <td style={{ padding: '0.9rem 1rem' }}>{sp.avg_internal}</td>
                            <td style={{ padding: '0.9rem 1rem' }}>{sp.avg_midterm}</td>
                            <td style={{ padding: '0.9rem 1rem' }}>{sp.avg_practical}</td>
                            <td style={{ padding: '0.9rem 1rem' }}>{sp.avg_final}</td>
                            <td style={{ padding: '0.9rem 1rem', fontWeight: 800, color: 'var(--primary)' }}>
                              {sp.avg_total} / 100
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Two Column Grid for Leaders & At-Risk */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.5rem' }}>
                {/* Top Performers */}
                <div className="feature-card">
                  <h3 style={{ fontSize: '1.15rem', color: '#34d399', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Award size={20} /> Department Top Academic Performers
                  </h3>
                  {(!academic.topPerformers || academic.topPerformers.length === 0) ? (
                    <p style={{ color: 'var(--text-secondary)' }}>No performance records yet.</p>
                  ) : (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {academic.topPerformers.map((tp, idx) => (
                        <li key={tp.student_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-input)', padding: '0.75rem 1rem', borderRadius: '8px' }}>
                          <div>
                            <span style={{ fontWeight: 800, color: '#fbbf24', marginRight: '0.5rem' }}>#{idx + 1}</span>
                            <span style={{ fontWeight: 600 }}>{tp.student_name}</span>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginLeft: '0.5rem' }}>({tp.roll_number})</span>
                          </div>
                          <div style={{ fontWeight: 800, color: '#34d399', fontSize: '1.1rem' }}>
                            {tp.avg_score}%
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* At-Risk Students */}
                <div className="feature-card">
                  <h3 style={{ fontSize: '1.15rem', color: '#f87171', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <AlertTriangle size={20} /> Academic At-Risk / Intervention List
                  </h3>
                  {(!academic.atRiskStudents || academic.atRiskStudents.length === 0) ? (
                    <p style={{ color: 'var(--text-secondary)' }}>No at-risk academic alerts.</p>
                  ) : (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {academic.atRiskStudents.map(ar => (
                        <li key={ar.student_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(239,68,68,0.08)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.2)' }}>
                          <div>
                            <span style={{ fontWeight: 600, color: '#ffffff' }}>{ar.student_name}</span>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginLeft: '0.5rem' }}>({ar.roll_number})</span>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: 800, color: '#f87171' }}>{ar.avg_score}% Avg</div>
                            {ar.failed_subjects_count > 0 && (
                              <div style={{ fontSize: '0.78rem', color: '#fca5a5' }}>{ar.failed_subjects_count} Fail Grade(s)</div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: RESULTS */}
          {activeTab === 'results' && (
            <div className="feature-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.3rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Award size={22} color="var(--primary)" /> Department Academic Examination Results
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>
                    Pass Rate: <strong style={{ color: '#34d399' }}>{results.summary?.passPercentage || 0}%</strong> ({results.summary?.passedCount || 0} Passed / {results.summary?.failedCount || 0} Failed)
                  </p>
                </div>

                {/* Filters */}
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <div style={{ position: 'relative', width: '220px' }}>
                    <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                    <input
                      type="text"
                      placeholder="Search results..."
                      value={resultsSearch}
                      onChange={(e) => setResultsSearch(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.5rem 0.5rem 0.5rem 2.2rem',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-input)',
                        color: 'var(--text-primary)'
                      }}
                    />
                  </div>

                  <select
                    value={resultsExam}
                    onChange={(e) => setResultsExam(e.target.value)}
                    style={{ padding: '0.55rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
                  >
                    <option value="">All Examinations</option>
                    {(filters.exams || []).map(ex => (
                      <option key={ex.id} value={ex.id}>{ex.name} ({ex.exam_type})</option>
                    ))}
                  </select>
                </div>
              </div>

              {filteredResults.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', padding: '1.5rem 0' }}>No examination results matching criteria.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                        <th style={{ padding: '0.8rem 1rem' }}>Roll No</th>
                        <th style={{ padding: '0.8rem 1rem' }}>Student Name</th>
                        <th style={{ padding: '0.8rem 1rem' }}>Subject & Course</th>
                        <th style={{ padding: '0.8rem 1rem' }}>Exam Name</th>
                        <th style={{ padding: '0.8rem 1rem' }}>Breakdown Marks</th>
                        <th style={{ padding: '0.8rem 1rem' }}>Total</th>
                        <th style={{ padding: '0.8rem 1rem' }}>Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredResults.map(r => {
                        const isFail = r.grade === 'F';
                        return (
                          <tr key={r.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td style={{ padding: '0.9rem 1rem', fontWeight: 600, color: '#818cf8' }}>{r.roll_number}</td>
                            <td style={{ padding: '0.9rem 1rem', fontWeight: 600 }}>{r.student_name}</td>
                            <td style={{ padding: '0.9rem 1rem' }}>
                              <div>{r.subject_name} ({r.subject_code})</div>
                              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{r.course_name}</div>
                            </td>
                            <td style={{ padding: '0.9rem 1rem', color: 'var(--text-secondary)' }}>{r.exam_name}</td>
                            <td style={{ padding: '0.9rem 1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                              Int: {r.internal_marks} | Mid: {r.midterm_marks} | Prac: {r.practical_marks} | Fin: {r.final_marks}
                            </td>
                            <td style={{ padding: '0.9rem 1rem', fontWeight: 800, fontSize: '1.05rem' }}>
                              {r.total_marks}
                            </td>
                            <td style={{ padding: '0.9rem 1rem' }}>
                              <span style={{
                                padding: '0.25rem 0.65rem',
                                borderRadius: '6px',
                                fontSize: '0.88rem',
                                fontWeight: 800,
                                background: isFail ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                                color: isFail ? '#f87171' : '#34d399'
                              }}>
                                {r.grade || 'N/A'} ({r.grade_point || '0.0'})
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 7: REPORTS COMPLETE PHASE 8 */}
          {activeTab === 'reports' && (
            <div>
              {/* Executive Summary Cards */}
              <div className="features-grid" style={{ marginBottom: '2rem' }}>
                <div className="feature-card">
                  <div className="feature-icon-wrapper" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
                    <FileSpreadsheet size={24} />
                  </div>
                  <h3>Department Audit Report</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                    Consolidated report of department metrics, courses, enrollment counts, and academic standings.
                  </p>
                  <button
                    onClick={() => downloadCSV(`${departmentCode}_Department_Overview_Report.csv`, overview.courses || [])}
                    className="btn btn-secondary"
                    style={{ width: '100%', gap: '0.5rem', justifyContent: 'center' }}
                  >
                    <Download size={16} /> Export CSV
                  </button>
                </div>

                <div className="feature-card">
                  <div className="feature-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
                    <CalendarCheck2 size={24} />
                  </div>
                  <h3>Attendance Summary Report</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                    Subject-wise attendance rates, class counts, low attendance lists, and intervention logs.
                  </p>
                  <button
                    onClick={() => downloadCSV(`${departmentCode}_Attendance_Analytics_Report.csv`, attendance.subjectBreakdown || [])}
                    className="btn btn-secondary"
                    style={{ width: '100%', gap: '0.5rem', justifyContent: 'center' }}
                  >
                    <Download size={16} /> Export CSV
                  </button>
                </div>

                <div className="feature-card">
                  <div className="feature-icon-wrapper" style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#f472b6' }}>
                    <Award size={24} />
                  </div>
                  <h3>Academic Results & Marks Report</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                    Complete list of student examination performance, internal/final score breakdowns, and grades.
                  </p>
                  <button
                    onClick={() => downloadCSV(`${departmentCode}_Academic_Results_Report.csv`, results.results || [])}
                    className="btn btn-secondary"
                    style={{ width: '100%', gap: '0.5rem', justifyContent: 'center' }}
                  >
                    <Download size={16} /> Export CSV
                  </button>
                </div>
              </div>

              {/* Printable Department Status Sheet */}
              <div className="feature-card" style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.4rem', margin: 0 }}>Executive Department Summary — {departmentName}</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: '0.2rem 0 0 0' }}>
                      Generated on: {new Date().toLocaleDateString()} • Campus360 Management Suite
                    </p>
                  </div>
                  <button onClick={() => window.print()} className="btn btn-primary" style={{ gap: '0.5rem' }}>
                    <Printer size={16} /> Print Report
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
                  <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: '10px' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Total Enrolled Students</span>
                    <h4 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0.25rem 0 0 0' }}>{overview.stats?.totalStudents || 0}</h4>
                  </div>
                  <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: '10px' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Faculty Strength</span>
                    <h4 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0.25rem 0 0 0' }}>{overview.stats?.totalFaculty || 0}</h4>
                  </div>
                  <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: '10px' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Overall Attendance</span>
                    <h4 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0.25rem 0 0 0', color: '#60a5fa' }}>{overview.stats?.attendancePercentage || 0}%</h4>
                  </div>
                  <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: '10px' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Department Pass Rate</span>
                    <h4 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0.25rem 0 0 0', color: '#34d399' }}>{overview.stats?.passRate || 0}%</h4>
                  </div>
                </div>

                <div style={{ background: 'rgba(99,102,241,0.06)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(99,102,241,0.2)' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#818cf8', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <CheckCircle2 size={18} /> HOD Sign-off & Audit Status
                  </h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: 0 }}>
                    Phase 8 HOD Management system is active for {departmentName} ({departmentCode}). Department statistics, faculty subject assignments, student attendance analytics, and examination results are validated and synchronized with the Campus360 core system.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HodDashboard;
