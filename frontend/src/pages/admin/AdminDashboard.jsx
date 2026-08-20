import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Users,
  UserCheck,
  Building2,
  BookOpen,
  Layers,
  DoorOpen,
  UserPlus,
  CalendarCheck,
  Clock,
  DollarSign,
  Bell,
  ShieldCheck,
  FileText,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  RefreshCw,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useToast } from '../../components/common/ToastProvider';

const AdminDashboard = () => {
  const { showSuccess, showError } = useToast();
  const [activeTab, setActiveTab] = useState('students');
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  // Data states
  const [students, setStudents] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [exams, setExams] = useState([]);
  const [timetables, setTimetables] = useState([]);
  const [fees, setFees] = useState([]);
  const [notices, setNotices] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); // 'ADD' or 'EDIT'
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  const token = localStorage.getItem('campus360_token');
  const apiHeader = { headers: { Authorization: `Bearer ${token}` } };

  // Fetch data depending on active tab
  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'students') {
        const res = await axios.get('http://localhost:5000/api/students', apiHeader);
        setStudents(res.data.data || []);
      } else if (activeTab === 'faculty') {
        const res = await axios.get('http://localhost:5000/api/faculty', apiHeader);
        setFaculty(res.data.data || []);
      } else if (activeTab === 'departments') {
        const res = await axios.get('http://localhost:5000/api/departments', apiHeader);
        setDepartments(res.data.data || []);
      } else if (activeTab === 'courses') {
        const res = await axios.get('http://localhost:5000/api/courses', apiHeader);
        setCourses(res.data.data || []);
      } else if (activeTab === 'subjects') {
        const res = await axios.get('http://localhost:5000/api/subjects', apiHeader);
        setSubjects(res.data.data || []);
      } else if (activeTab === 'rooms') {
        const res = await axios.get('http://localhost:5000/api/rooms', apiHeader);
        setRooms(res.data.data || []);
      } else if (activeTab === 'enrollments') {
        const res = await axios.get('http://localhost:5000/api/enrollments', apiHeader);
        setEnrollments(res.data.data || []);
      } else if (activeTab === 'exams') {
        const res = await axios.get('http://localhost:5000/api/exams', apiHeader);
        setExams(res.data.data || []);
      } else if (activeTab === 'timetable') {
        const res = await axios.get('http://localhost:5000/api/timetable', apiHeader);
        setTimetables(res.data.data || []);
      } else if (activeTab === 'fees') {
        const res = await axios.get('http://localhost:5000/api/fees', apiHeader);
        setFees(res.data.data || []);
      } else if (activeTab === 'notices') {
        const res = await axios.get('http://localhost:5000/api/notices', apiHeader);
        setNotices(res.data.data || []);
      } else if (activeTab === 'users') {
        const res = await axios.get('http://localhost:5000/api/users', apiHeader);
        setUsersList(res.data.data || []);
      } else if (activeTab === 'audit') {
        const res = await axios.get('http://localhost:5000/api/audit-logs', apiHeader);
        setAuditLogs(res.data.data || []);
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to load records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // Open Add/Edit Modal
  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    setFormData(item ? { ...item } : {});
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingItem(null);
    setFormData({});
  };

  // Handle Form Submission for CRUD
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    try {
      let endpoint = '';
      if (activeTab === 'departments') endpoint = 'http://localhost:5000/api/departments';
      else if (activeTab === 'courses') endpoint = 'http://localhost:5000/api/courses';
      else if (activeTab === 'subjects') endpoint = 'http://localhost:5000/api/subjects';
      else if (activeTab === 'rooms') endpoint = 'http://localhost:5000/api/rooms';
      else if (activeTab === 'students') endpoint = 'http://localhost:5000/api/students';
      else if (activeTab === 'faculty') endpoint = 'http://localhost:5000/api/faculty';
      else if (activeTab === 'enrollments') endpoint = 'http://localhost:5000/api/enrollments';
      else if (activeTab === 'exams') endpoint = 'http://localhost:5000/api/exams';
      else if (activeTab === 'timetable') endpoint = 'http://localhost:5000/api/timetable';
      else if (activeTab === 'fees') endpoint = 'http://localhost:5000/api/fees';
      else if (activeTab === 'notices') endpoint = 'http://localhost:5000/api/notices';

      if (modalType === 'ADD') {
        await axios.post(endpoint, formData, apiHeader);
        showSuccess(`New record created successfully`);
      } else if (modalType === 'EDIT') {
        await axios.put(`${endpoint}/${editingItem.id}`, formData, apiHeader);
        showSuccess(`Record updated successfully`);
      }
      closeModal();
      fetchData();
    } catch (err) {
      showError(err.response?.data?.message || 'Operation failed');
    }
  };

  // Delete Record
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record? This action cannot be undone.')) return;
    try {
      let endpoint = '';
      if (activeTab === 'departments') endpoint = 'http://localhost:5000/api/departments';
      else if (activeTab === 'courses') endpoint = 'http://localhost:5000/api/courses';
      else if (activeTab === 'subjects') endpoint = 'http://localhost:5000/api/subjects';
      else if (activeTab === 'rooms') endpoint = 'http://localhost:5000/api/rooms';
      else if (activeTab === 'students') endpoint = 'http://localhost:5000/api/students';
      else if (activeTab === 'faculty') endpoint = 'http://localhost:5000/api/faculty';
      else if (activeTab === 'enrollments') endpoint = 'http://localhost:5000/api/enrollments';
      else if (activeTab === 'exams') endpoint = 'http://localhost:5000/api/exams';
      else if (activeTab === 'timetable') endpoint = 'http://localhost:5000/api/timetable';
      else if (activeTab === 'fees') endpoint = 'http://localhost:5000/api/fees';
      else if (activeTab === 'notices') endpoint = 'http://localhost:5000/api/notices';

      await axios.delete(`${endpoint}/${id}`, apiHeader);
      showSuccess('Record deleted successfully');
      fetchData();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to delete record');
    }
  };

  // User Deactivation / Activation
  const handleToggleUserStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await axios.put(`http://localhost:5000/api/users/${userId}/status`, { status: newStatus }, apiHeader);
      showSuccess(`User status changed to ${newStatus}`);
      fetchData();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to change user status');
    }
  };

  const navTabs = [
    { id: 'students', label: 'Students', icon: Users },
    { id: 'faculty', label: 'Faculty', icon: UserCheck },
    { id: 'departments', label: 'Departments', icon: Building2 },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'subjects', label: 'Subjects', icon: Layers },
    { id: 'rooms', label: 'Rooms', icon: DoorOpen },
    { id: 'enrollments', label: 'Enrollments', icon: UserPlus },
    { id: 'exams', label: 'Exams', icon: CalendarCheck },
    { id: 'timetable', label: 'Timetable', icon: Clock },
    { id: 'fees', label: 'Fees', icon: DollarSign },
    { id: 'notices', label: 'Notices', icon: Bell },
    { id: 'users', label: 'User Accounts', icon: ShieldCheck },
    { id: 'audit', label: 'Audit Logs', icon: FileText }
  ];

  return (
    <div className="dashboard-container" style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Admin Management Suite</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Full operational university control, CRUD actions, and audit trail.</p>
        </div>
        <button onClick={fetchData} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <RefreshCw size={16} className={loading ? 'spin-animation' : ''} /> Refresh Data
        </button>
      </div>

      {/* Tabs Navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1rem',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: isActive ? 'var(--primary)' : 'var(--bg-card)',
                color: isActive ? 'white' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Action Controls & Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
        <div className="input-with-icon" style={{ flex: 1, maxWidth: '350px' }}>
          <Search size={16} className="field-icon" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        {['students', 'faculty', 'departments', 'courses', 'subjects', 'rooms', 'enrollments', 'exams', 'timetable', 'fees', 'notices'].includes(activeTab) && (
          <button onClick={() => openModal('ADD')} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} /> Add New {activeTab.slice(0, -1)}
          </button>
        )}
      </div>

      {/* Main Operational Table View */}
      <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '1.5rem', overflowX: 'auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            <RefreshCw size={24} className="spin-animation" style={{ marginBottom: '0.75rem' }} />
            <p>Loading operational records...</p>
          </div>
        ) : (
          <>
            {/* STUDENTS TAB */}
            {activeTab === 'students' && (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.75rem' }}>Roll ID</th>
                    <th style={{ padding: '0.75rem' }}>Student Name</th>
                    <th style={{ padding: '0.75rem' }}>Department</th>
                    <th style={{ padding: '0.75rem' }}>Course</th>
                    <th style={{ padding: '0.75rem' }}>Semester</th>
                    <th style={{ padding: '0.75rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.filter(s => (s.name || s.student_name || '').toLowerCase().includes(search.toLowerCase())).map((st) => (
                    <tr key={st.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 600 }}>{st.student_id}</td>
                      <td style={{ padding: '0.75rem' }}>{st.name || st.student_name}</td>
                      <td style={{ padding: '0.75rem' }}>{st.department_name}</td>
                      <td style={{ padding: '0.75rem' }}>{st.course_name}</td>
                      <td style={{ padding: '0.75rem' }}>Sem {st.semester}</td>
                      <td style={{ padding: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => openModal('EDIT', st)} className="btn btn-secondary" style={{ padding: '0.4rem 0.6rem' }}><Edit size={14} /></button>
                        <button onClick={() => handleDelete(st.id)} className="btn btn-secondary" style={{ padding: '0.4rem 0.6rem', color: '#f87171' }}><Trash2 size={14} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* FACULTY TAB */}
            {activeTab === 'faculty' && (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.75rem' }}>Faculty Code</th>
                    <th style={{ padding: '0.75rem' }}>Name</th>
                    <th style={{ padding: '0.75rem' }}>Designation</th>
                    <th style={{ padding: '0.75rem' }}>Department</th>
                    <th style={{ padding: '0.75rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {faculty.filter(f => (f.name || f.faculty_name || '').toLowerCase().includes(search.toLowerCase())).map((fac) => (
                    <tr key={fac.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 600 }}>{fac.faculty_id}</td>
                      <td style={{ padding: '0.75rem' }}>{fac.name || fac.faculty_name}</td>
                      <td style={{ padding: '0.75rem' }}>{fac.designation}</td>
                      <td style={{ padding: '0.75rem' }}>{fac.department_name}</td>
                      <td style={{ padding: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => openModal('EDIT', fac)} className="btn btn-secondary" style={{ padding: '0.4rem 0.6rem' }}><Edit size={14} /></button>
                        <button onClick={() => handleDelete(fac.id)} className="btn btn-secondary" style={{ padding: '0.4rem 0.6rem', color: '#f87171' }}><Trash2 size={14} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* DEPARTMENTS TAB */}
            {activeTab === 'departments' && (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.75rem' }}>Code</th>
                    <th style={{ padding: '0.75rem' }}>Department Name</th>
                    <th style={{ padding: '0.75rem' }}>HOD Assigned</th>
                    <th style={{ padding: '0.75rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map((dept) => (
                    <tr key={dept.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 600 }}>{dept.code}</td>
                      <td style={{ padding: '0.75rem' }}>{dept.name}</td>
                      <td style={{ padding: '0.75rem' }}>{dept.hod_name || 'Unassigned'}</td>
                      <td style={{ padding: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => openModal('EDIT', dept)} className="btn btn-secondary" style={{ padding: '0.4rem 0.6rem' }}><Edit size={14} /></button>
                        <button onClick={() => handleDelete(dept.id)} className="btn btn-secondary" style={{ padding: '0.4rem 0.6rem', color: '#f87171' }}><Trash2 size={14} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* USER ACCOUNTS TAB */}
            {activeTab === 'users' && (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.75rem' }}>User ID</th>
                    <th style={{ padding: '0.75rem' }}>Name</th>
                    <th style={{ padding: '0.75rem' }}>Email</th>
                    <th style={{ padding: '0.75rem' }}>Role</th>
                    <th style={{ padding: '0.75rem' }}>Status</th>
                    <th style={{ padding: '0.75rem' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((u) => (
                    <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '0.75rem' }}>#{u.id}</td>
                      <td style={{ padding: '0.75rem', fontWeight: 600 }}>{u.name}</td>
                      <td style={{ padding: '0.75rem' }}>{u.email}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <span style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, backgroundColor: 'rgba(79, 70, 229, 0.2)', color: '#a5b4fc' }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <span style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, backgroundColor: u.status === 'ACTIVE' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)', color: u.status === 'ACTIVE' ? '#34d399' : '#f87171' }}>
                          {u.status}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <button
                          onClick={() => handleToggleUserStatus(u.id, u.status)}
                          className="btn btn-secondary"
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                        >
                          {u.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* AUDIT LOGS TAB */}
            {activeTab === 'audit' && (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.75rem' }}>Log ID</th>
                    <th style={{ padding: '0.75rem' }}>User ID</th>
                    <th style={{ padding: '0.75rem' }}>Action</th>
                    <th style={{ padding: '0.75rem' }}>Entity</th>
                    <th style={{ padding: '0.75rem' }}>Description</th>
                    <th style={{ padding: '0.75rem' }}>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => (
                    <tr key={log.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.875rem' }}>
                      <td style={{ padding: '0.75rem' }}>#{log.id}</td>
                      <td style={{ padding: '0.75rem' }}>{log.user_id ? `User #${log.user_id}` : 'System'}</td>
                      <td style={{ padding: '0.75rem', fontWeight: 700, color: '#38bdf8' }}>{log.action}</td>
                      <td style={{ padding: '0.75rem' }}>{log.entity_type}</td>
                      <td style={{ padding: '0.75rem' }}>{log.description}</td>
                      <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{new Date(log.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* GENERAL TABLE FOR OTHER TABS */}
            {['courses', 'subjects', 'rooms', 'enrollments', 'exams', 'timetable', 'fees', 'notices'].includes(activeTab) && (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  Managing <strong>{activeTab.toUpperCase()}</strong> records. Click <strong>+ Add New</strong> above to create or select an item to modify.
                </p>
                <button onClick={() => openModal('ADD')} className="btn btn-primary">
                  <Plus size={16} /> Add {activeTab.slice(0, -1)} Record
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* CRUD MODAL DIALOG */}
      {modalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.75)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', width: '100%', maxWidth: '500px', padding: '2rem', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{modalType === 'ADD' ? 'Add New' : 'Edit'} {activeTab.slice(0, -1).toUpperCase()}</h3>
              <button onClick={closeModal} className="icon-btn-subtle"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmitForm}>
              {activeTab === 'departments' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Department Name</label>
                    <input type="text" required value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="form-input" style={{ paddingLeft: '1rem' }} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Code (e.g. CS)</label>
                    <input type="text" required value={formData.code || ''} onChange={(e) => setFormData({ ...formData, code: e.target.value })} className="form-input" style={{ paddingLeft: '1rem' }} />
                  </div>
                </>
              )}

              {activeTab === 'rooms' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Room Number</label>
                    <input type="text" required value={formData.roomNumber || formData.room_number || ''} onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })} className="form-input" style={{ paddingLeft: '1rem' }} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Building</label>
                    <input type="text" required value={formData.building || ''} onChange={(e) => setFormData({ ...formData, building: e.target.value })} className="form-input" style={{ paddingLeft: '1rem' }} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Capacity</label>
                    <input type="number" required value={formData.capacity || ''} onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} className="form-input" style={{ paddingLeft: '1rem' }} />
                  </div>
                </>
              )}

              {activeTab === 'notices' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Notice Title</label>
                    <input type="text" required value={formData.title || ''} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="form-input" style={{ paddingLeft: '1rem' }} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea required value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="form-input" style={{ paddingLeft: '1rem', minHeight: '80px' }} />
                  </div>
                </>
              )}

              {/* Default Fallback Fields */}
              {!['departments', 'rooms', 'notices'].includes(activeTab) && (
                <div className="form-group">
                  <label className="form-label">Title / Name</label>
                  <input type="text" required value={formData.name || formData.title || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value, title: e.target.value })} className="form-input" style={{ paddingLeft: '1rem' }} />
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '2rem' }}>
                <button type="button" onClick={closeModal} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">{modalType === 'ADD' ? 'Create' : 'Save Changes'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
