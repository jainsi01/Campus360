import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { BookOpen, CheckCircle2, ClipboardCheck, FileText, UploadCloud, BarChart3, CalendarClock, Clock3, BadgeDollarSign, Bell, AlertCircle, MessageSquareText, LogOut, Award } from 'lucide-react';

const tabs = [
  { key: 'overview', label: 'Overview', icon: BookOpen },
  { key: 'subjects', label: 'Subjects', icon: BookOpen },
  { key: 'attendance', label: 'Attendance', icon: CheckCircle2 },
  { key: 'assignments', label: 'Assignments', icon: FileText },
  { key: 'submissions', label: 'Submissions', icon: ClipboardCheck },
  { key: 'materials', label: 'Materials', icon: UploadCloud },
  { key: 'marks', label: 'Marks', icon: BarChart3 },
  { key: 'results', label: 'Results', icon: Award },
  { key: 'timetable', label: 'Timetable', icon: CalendarClock },
  { key: 'exams', label: 'Exams', icon: Clock3 },
  { key: 'fees', label: 'Fees', icon: BadgeDollarSign },
  { key: 'notices', label: 'Notices', icon: Bell },
  { key: 'notifications', label: 'Notifications', icon: AlertCircle },
  { key: 'complaints', label: 'Complaints', icon: MessageSquareText }
];

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState({
    subjects: [],
    attendance: [],
    assignments: [],
    submissions: [],
    materials: [],
    marks: [],
    results: [],
    timetable: [],
    exams: [],
    fees: [],
    notices: [],
    notifications: [],
    complaints: []
  });

  useEffect(() => {
    const fetchStudentData = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/student-features/dashboard');
        const payload = res.data?.data || {};
        setData({
          subjects: payload.subjects || [],
          attendance: payload.attendance || [],
          assignments: payload.assignments || [],
          submissions: payload.submissions || [],
          materials: payload.materials || [],
          marks: payload.marks || [],
          results: payload.results || [],
          timetable: payload.timetable || [],
          exams: payload.exams || [],
          fees: payload.fees || [],
          notices: payload.notices || [],
          notifications: payload.notifications || [],
          complaints: payload.complaints || []
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load student portal data.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  const stats = useMemo(() => [
    { label: 'Subjects', value: data.subjects.length, icon: BookOpen },
    { label: 'Attendance', value: data.attendance.length, icon: CheckCircle2 },
    { label: 'Assignments', value: data.assignments.length, icon: FileText },
    { label: 'Materials', value: data.materials.length, icon: UploadCloud },
    { label: 'Marks', value: data.marks.length, icon: BarChart3 },
    { label: 'Notices', value: data.notices.length, icon: Bell }
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

      <div className="feature-card">
        <h3>Current Enrollment</h3>
        {data.subjects.length === 0 ? <p>No enrolled subjects.</p> : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {data.subjects.slice(0, 6).map((subject) => (
              <li key={subject.subject_id} style={{ color: 'var(--text-secondary)' }}>
                • {subject.subject_name} ({subject.subject_code}) — {subject.course_name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );

  const renderSection = (title, items, emptyMessage, itemRenderer) => (
    <div className="feature-card">
      <h3>{title}</h3>
      {items.length === 0 ? <p>{emptyMessage}</p> : (
        <div style={{ display: 'grid', gap: '0.8rem' }}>
          {items.map(itemRenderer)}
        </div>
      )}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'subjects':
        return renderSection('Subjects', data.subjects, 'No subjects enrolled.', (s) => (
          <div key={s.subject_id || s.id} style={{ border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1rem' }}>
            <strong>{s.subject_name}</strong>
            <div style={{ color: 'var(--text-secondary)', marginTop: '0.4rem' }}>Code: {s.subject_code} • Credits: {s.credits} • Sem: {s.semester}</div>
          </div>
        ));
      case 'attendance':
        return renderSection('Attendance', data.attendance, 'No attendance records available.', (a) => (
          <div key={a.id} style={{ border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1rem' }}>
            <strong>{a.subject_name}</strong>
            <div style={{ color: 'var(--text-secondary)', marginTop: '0.4rem' }}>Date: {a.date} • Status: {a.status}</div>
          </div>
        ));
      case 'assignments':
        return renderSection('Assignments', data.assignments, 'No assignments available.', (a) => (
          <div key={a.id} style={{ border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1rem' }}>
            <strong>{a.title}</strong>
            <div style={{ color: 'var(--text-secondary)', marginTop: '0.4rem' }}>{a.subject_name} • Deadline: {new Date(a.deadline).toLocaleString()} • Submitted: {a.submission_status || 'Not yet'}</div>
          </div>
        ));
      case 'submissions':
        return renderSection('Submissions', data.submissions, 'No submissions made yet.', (s) => (
          <div key={s.id} style={{ border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1rem' }}>
            <strong>{s.assignment_title}</strong>
            <div style={{ color: 'var(--text-secondary)', marginTop: '0.4rem' }}>{s.subject_name} • Status: {s.status} • Marks: {s.marks ?? '—'}</div>
          </div>
        ));
      case 'materials':
        return renderSection('Study Materials', data.materials, 'No materials shared yet.', (m) => (
          <div key={m.id} style={{ border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1rem' }}>
            <strong>{m.title}</strong>
            <div style={{ color: 'var(--text-secondary)', marginTop: '0.4rem' }}>{m.subject_name} • <a href={m.file_url} target="_blank" rel="noreferrer" style={{ color: '#818cf8' }}>Open file</a></div>
          </div>
        ));
      case 'marks':
        return renderSection('Marks', data.marks, 'No marks recorded yet.', (m) => (
          <div key={m.id} style={{ border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1rem' }}>
            <strong>{m.subject_name}</strong>
            <div style={{ color: 'var(--text-secondary)', marginTop: '0.4rem' }}>{m.exam_name} • Total: {m.total_marks} • Grade: {m.grade || 'N/A'}</div>
          </div>
        ));
      case 'results':
        return renderSection('Results', data.results, 'No results published.', (r) => (
          <div key={r.id} style={{ border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1rem' }}>
            <strong>{r.subject_name}</strong>
            <div style={{ color: 'var(--text-secondary)', marginTop: '0.4rem' }}>{r.exam_name} • Total: {r.total_marks} • Grade: {r.grade || 'N/A'}</div>
          </div>
        ));
      case 'timetable':
        return renderSection('Timetable', data.timetable, 'No timetable slots found.', (t) => (
          <div key={t.id} style={{ border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1rem' }}>
            <strong>{t.subject_name}</strong>
            <div style={{ color: 'var(--text-secondary)', marginTop: '0.4rem' }}>{t.day_of_week} • {t.start_time} - {t.end_time} • {t.faculty_name} • Room {t.room_number}</div>
          </div>
        ));
      case 'exams':
        return renderSection('Exams', data.exams, 'No exam schedule available.', (e) => (
          <div key={e.id} style={{ border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1rem' }}>
            <strong>{e.name}</strong>
            <div style={{ color: 'var(--text-secondary)', marginTop: '0.4rem' }}>{e.subject_name} • {e.exam_date} • {e.start_time}-{e.end_time} • Room {e.room_number}</div>
          </div>
        ));
      case 'fees':
        return renderSection('Fees', data.fees, 'No fee records found.', (f) => (
          <div key={f.id} style={{ border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1rem' }}>
            <strong>Semester {f.semester}</strong>
            <div style={{ color: 'var(--text-secondary)', marginTop: '0.4rem' }}>Due: ₹{f.due_amount} • Paid: ₹{f.paid_amount} • Status: {f.status}</div>
          </div>
        ));
      case 'notices':
        return renderSection('Notices', data.notices, 'No notices published.', (n) => (
          <div key={n.id} style={{ border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1rem' }}>
            <strong>{n.title}</strong>
            <div style={{ color: 'var(--text-secondary)', marginTop: '0.4rem' }}>{n.description}</div>
          </div>
        ));
      case 'notifications':
        return renderSection('Notifications', data.notifications, 'No notifications.', (n) => (
          <div key={n.id} style={{ border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1rem' }}>
            <strong>{n.title}</strong>
            <div style={{ color: 'var(--text-secondary)', marginTop: '0.4rem' }}>{n.message}</div>
          </div>
        ));
      case 'complaints':
        return renderSection('Complaints', data.complaints, 'No complaints submitted.', (c) => (
          <div key={c.id} style={{ border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1rem' }}>
            <strong>{c.subject}</strong>
            <div style={{ color: 'var(--text-secondary)', marginTop: '0.4rem' }}>{c.description} • Status: {c.status}</div>
          </div>
        ));
      default:
        return renderOverview();
    }
  };

  return (
    <div className="landing-page" style={{ padding: '3rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Welcome, {user?.name}</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Campus360 Student Portal — Role: <strong style={{ color: '#818cf8' }}>{user?.role}</strong></p>
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
        <div className="feature-card"><p>Loading student workspace...</p></div>
      ) : renderTabContent()}
    </div>
  );
};

export default StudentDashboard;
