import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/ToastProvider';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';
import { BookOpen, Users, ClipboardCheck, FileText, UploadCloud, BarChart3, LogOut, CalendarCheck2 } from 'lucide-react';

const tabs = [
  { key: 'overview', label: 'Overview', icon: BookOpen },
  { key: 'subjects', label: 'Assigned Subjects', icon: Users },
  { key: 'attendance', label: 'Attendance', icon: CalendarCheck2 },
  { key: 'assignments', label: 'Assignments', icon: FileText },
  { key: 'materials', label: 'Study Materials', icon: UploadCloud },
  { key: 'marks', label: 'Marks', icon: BarChart3 }
];

const FacultyDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState({
    subjects: [],
    attendance: [],
    assignments: [],
    materials: [],
    marks: []
  });

  useEffect(() => {
    const fetchFacultyData = async () => {
      setLoading(true);
      setError('');
      try {
        const [subjectsRes, attendanceRes, assignmentsRes, materialsRes, marksRes] = await Promise.all([
          api.get('/faculty-features/assigned-subjects'),
          api.get('/faculty-features/attendance?subjectId=1&date=2026-08-05'),
          api.get('/faculty-features/assignments'),
          api.get('/faculty-features/study-materials'),
          api.get('/faculty-features/marks/subject/1')
        ]);

        setData({
          subjects: subjectsRes.data?.data || [],
          attendance: attendanceRes.data?.data || [],
          assignments: assignmentsRes.data?.data || [],
          materials: materialsRes.data?.data || [],
          marks: marksRes.data?.data || []
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load faculty data from Campus360.');
      } finally {
        setLoading(false);
      }
    };

    fetchFacultyData();
  }, []);

  const stats = useMemo(() => [
    { label: 'Assigned Subjects', value: data.subjects.length, icon: BookOpen },
    { label: 'Attendance Records', value: data.attendance.length, icon: CalendarCheck2 },
    { label: 'Assignments', value: data.assignments.length, icon: FileText },
    { label: 'Study Materials', value: data.materials.length, icon: UploadCloud },
    { label: 'Marks Entries', value: data.marks.length, icon: BarChart3 }
  ], [data]);

  const renderOverview = () => (
    <div>
      <div className="features-grid" style={{ marginBottom: '1.5rem' }}>
        {stats.map(({ label, value, icon: Icon }) => (
          <div className="feature-card" key={label}>
            <div className="feature-icon-wrapper"><Icon size={22} /></div>
            <h3>{label}</h3>
            <p style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>{value}</p>
          </div>
        ))}
      </div>

      <div className="feature-card" style={{ minHeight: '180px' }}>
        <h3>Assigned Subjects</h3>
        {data.subjects.length === 0 ? (
          <p>No assigned subjects found.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {data.subjects.slice(0, 6).map((subject) => (
              <li key={subject.subject_id} style={{ color: 'var(--text-secondary)' }}>
                • {subject.subject_name} ({subject.subject_code}) — Semester {subject.semester}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );

  const renderSubjects = () => (
    <div className="feature-card">
      <h3>Assigned Subjects</h3>
      {data.subjects.length === 0 ? <p>No subjects assigned.</p> : (
        <div style={{ display: 'grid', gap: '0.8rem' }}>
          {data.subjects.map((subject) => (
            <div key={subject.subject_id} style={{ border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1rem' }}>
              <strong>{subject.subject_name}</strong>
              <div style={{ color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
                Code: {subject.subject_code} • Semester: {subject.semester} • Course: {subject.course_name}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderAttendance = () => (
    <div className="feature-card">
      <h3>Attendance</h3>
      {data.attendance.length === 0 ? <p>No attendance data available for the selected date.</p> : (
        <div style={{ display: 'grid', gap: '0.8rem' }}>
          {data.attendance.map((entry) => (
            <div key={entry.attendance_id} style={{ border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1rem' }}>
              <strong>{entry.student_name}</strong>
              <div style={{ color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
                Roll: {entry.roll_number} • Status: {entry.status}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderAssignments = () => (
    <div className="feature-card">
      <h3>Assignments</h3>
      {data.assignments.length === 0 ? <p>No assignments published.</p> : (
        <div style={{ display: 'grid', gap: '0.8rem' }}>
          {data.assignments.map((assignment) => (
            <div key={assignment.id} style={{ border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1rem' }}>
              <strong>{assignment.title}</strong>
              <div style={{ color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
                {assignment.subject_name} • Deadline: {new Date(assignment.deadline).toLocaleString()} • Submissions: {assignment.submission_count || 0}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderMaterials = () => (
    <div className="feature-card">
      <h3>Study Materials</h3>
      {data.materials.length === 0 ? <p>No study materials uploaded.</p> : (
        <div style={{ display: 'grid', gap: '0.8rem' }}>
          {data.materials.map((material) => (
            <div key={material.id} style={{ border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1rem' }}>
              <strong>{material.title}</strong>
              <div style={{ color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
                {material.subject_name} • {material.file_url}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderMarks = () => (
    <div className="feature-card">
      <h3>Marks</h3>
      {data.marks.length === 0 ? <p>No marks available yet.</p> : (
        <div style={{ display: 'grid', gap: '0.8rem' }}>
          {data.marks.map((mark) => (
            <div key={mark.id} style={{ border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1rem' }}>
              <strong>{mark.student_name}</strong>
              <div style={{ color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
                {mark.exam_name} • Total: {mark.total_marks || 0} • Grade: {mark.grade || 'N/A'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'subjects': return renderSubjects();
      case 'attendance': return renderAttendance();
      case 'assignments': return renderAssignments();
      case 'materials': return renderMaterials();
      case 'marks': return renderMarks();
      default: return renderOverview();
    }
  };

  return (
    <div className="landing-page" style={{ padding: '3rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Welcome, {user?.name}</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Campus360 Faculty Portal — Role: <strong style={{ color: '#818cf8' }}>{user?.role}</strong></p>
        </div>
        <button onClick={logout} className="btn btn-secondary" style={{ gap: '0.5rem' }}>
          <LogOut size={18} /> Sign Out
        </button>
      </div>

      <div className="features-grid" style={{ marginBottom: '1.5rem' }}>
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            className="feature-card"
            onClick={() => setActiveTab(key)}
            style={{
              textAlign: 'left',
              cursor: 'pointer',
              border: activeTab === key ? '1px solid rgba(129, 140, 248, 0.9)' : '1px solid var(--border-color)',
              background: activeTab === key ? 'rgba(129,140,248,0.08)' : 'var(--bg-card)'
            }}
          >
            <div className="feature-icon-wrapper"><Icon size={22} /></div>
            <h3>{label}</h3>
          </button>
        ))}
      </div>

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.35)', color: '#fca5a5', padding: '0.9rem 1rem', borderRadius: '10px', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div className="feature-card"><p>Loading faculty workspace...</p></div>
      ) : renderTabContent()}
    </div>
  );
};

export default FacultyDashboard;
