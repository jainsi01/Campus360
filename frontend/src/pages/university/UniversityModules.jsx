import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/ToastProvider';
import ConfirmModal from '../../components/common/ConfirmModal';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner, { TableSkeleton } from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import Pagination from '../../components/common/Pagination';
import SearchBar, { FilterDropdown } from '../../components/common/SearchBar';
import api from '../../services/api';
import {
  Clock,
  Calendar,
  BadgeDollarSign,
  Bell,
  AlertCircle,
  MessageSquareText,
  ShieldAlert,
  Search,
  Plus,
  Trash2,
  CheckCircle2,
  Filter,
  AlertTriangle,
  RefreshCw,
  FileText,
  Send,
  Building2,
  BookOpen,
  Users,
  Eye,
  Check
} from 'lucide-react';

const tabs = [
  { key: 'timetable', label: 'Timetable Scheduler', icon: Clock },
  { key: 'exams', label: 'Exams & Schedule', icon: Calendar },
  { key: 'fees', label: 'Fee Record Tracker', icon: BadgeDollarSign },
  { key: 'notices', label: 'Notices & Bulletin', icon: Bell },
  { key: 'notifications', label: 'Notifications Center', icon: AlertCircle },
  { key: 'complaints', label: 'Complaints Portal', icon: MessageSquareText },
  { key: 'audit', label: 'System Audit Logs', icon: ShieldAlert }
];

const UniversityModules = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const getTabFromPath = (pathname) => {
    if (pathname.includes('/university/exams')) return 'exams';
    if (pathname.includes('/university/fees')) return 'fees';
    if (pathname.includes('/university/notices')) return 'notices';
    if (pathname.includes('/university/notifications')) return 'notifications';
    if (pathname.includes('/university/complaints')) return 'complaints';
    if (pathname.includes('/university/audit')) return 'audit';
    return 'timetable';
  };

  const toast = useToast();
  const [activeTab, setActiveTab] = useState(getTabFromPath(location.pathname));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Confirm Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    type: 'danger',
    onConfirm: null,
    loading: false
  });

  // Dropdown reference data
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [students, setStudents] = useState([]);

  // Data states
  const [timetable, setTimetable] = useState([]);
  const [exams, setExams] = useState([]);
  const [examSchedule, setExamSchedule] = useState([]);
  const [fees, setFees] = useState([]);
  const [notices, setNotices] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  // Filters & Form States
  const [searchQuery, setSearchQuery] = useState('');
  
  // Reset pagination on tab or search query change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  // Timetable Form
  const [showTimetableModal, setShowTimetableModal] = useState(false);
  const [timetableForm, setTimetableForm] = useState({
    courseId: '',
    semester: '1',
    subjectId: '',
    facultyId: '',
    roomId: '',
    dayOfWeek: 'MONDAY',
    startTime: '09:00',
    endTime: '10:00'
  });
  const [conflictAlert, setConflictAlert] = useState(null);

  // Exam Form
  const [showExamModal, setShowExamModal] = useState(false);
  const [examForm, setExamForm] = useState({
    name: '',
    examType: 'MIDTERM',
    academicYear: '2025-2026',
    semester: '1',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  // Fee Form & Payment
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [feeForm, setFeeForm] = useState({
    studentId: '',
    academicYear: '2025-2026',
    semester: '1',
    totalAmount: '50000',
    paidAmount: '0',
    dueDate: new Date().toISOString().split('T')[0]
  });
  const [feeStatusFilter, setFeeStatusFilter] = useState('');
  const [selectedFee, setSelectedFee] = useState(null);
  const [paymentAmountInput, setPaymentAmountInput] = useState('');

  // Notice Form
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [noticeForm, setNoticeForm] = useState({
    title: '',
    description: '',
    targetRole: 'ALL',
    targetDepartment: '',
    publishDate: new Date().toISOString().split('T')[0],
    expiryDate: ''
  });

  // Complaint Response Modal
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [complaintStatusInput, setComplaintStatusInput] = useState('IN_PROGRESS');
  const [complaintResponseInput, setComplaintResponseInput] = useState('');

  const handleTabChange = (key) => {
    setActiveTab(key);
    navigate(`/university/${key}`);
  };

  useEffect(() => {
    setActiveTab(getTabFromPath(location.pathname));
  }, [location.pathname]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const results = await Promise.allSettled([
        api.get('/courses'),
        api.get('/subjects'),
        api.get('/faculty'),
        api.get('/rooms'),
        api.get('/students'),
        api.get('/timetable'),
        api.get('/exams'),
        api.get('/exams/schedule'),
        api.get('/fees'),
        api.get('/notices'),
        api.get('/notifications'),
        api.get('/complaints'),
        api.get('/audit-logs')
      ]);

      const getData = (idx) => (results[idx].status === 'fulfilled' ? results[idx].value.data?.data || [] : []);

      setCourses(getData(0));
      setSubjects(getData(1));
      setFaculty(getData(2));
      setRooms(getData(3));
      setStudents(getData(4));
      setTimetable(getData(5));
      setExams(getData(6));
      setExamSchedule(getData(7));
      setFees(getData(8));
      setNotices(getData(9));
      setNotifications(getData(10));
      setComplaints(getData(11));
      setAuditLogs(getData(12));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load university module data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Timetable Handlers
  const handleCheckConflict = async () => {
    setConflictAlert(null);
    try {
      const res = await api.post('/timetable/check-conflict', timetableForm);
      const conf = res.data?.data;
      if (conf?.hasConflict) {
        let msg = 'Conflict detected: ';
        if (conf.roomConflict) msg += 'Room is occupied. ';
        if (conf.facultyConflict) msg += 'Faculty is assigned elsewhere. ';
        if (conf.cohortConflict) msg += 'Course cohort already has a class. ';
        setConflictAlert(msg);
      } else {
        setConflictAlert('CLEAR: No conflicts found for this slot!');
      }
    } catch (err) {
      setConflictAlert(err.response?.data?.message || 'Conflict check failed');
    }
  };

  const handleCreateTimetableSlot = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    try {
      await api.post('/timetable', timetableForm);
      toast.success('Timetable slot scheduled successfully!');
      setShowTimetableModal(false);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create timetable slot.');
    }
  };

  const handleDeleteTimetableSlot = (id) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Scheduled Class Slot',
      message: 'Are you sure you want to remove this timetable slot from the schedule?',
      confirmText: 'Delete Slot',
      type: 'danger',
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, loading: true }));
        try {
          await api.delete(`/timetable/${id}`);
          toast.success('Timetable slot deleted successfully!');
          loadData();
        } catch (err) {
          toast.error('Failed to delete timetable slot.');
        } finally {
          setConfirmModal((prev) => ({ ...prev, isOpen: false, loading: false }));
        }
      }
    });
  };

  // Exam Handlers
  const handleCreateExam = async (e) => {
    e.preventDefault();
    try {
      await api.post('/exams', examForm);
      toast.success('Exam created successfully!');
      setShowExamModal(false);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create exam.');
    }
  };

  // Fee Handlers
  const handleCreateFee = async (e) => {
    e.preventDefault();
    try {
      await api.post('/fees', feeForm);
      toast.success('Fee record created successfully!');
      setShowFeeModal(false);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create fee record.');
    }
  };

  const handleUpdatePayment = async (e) => {
    e.preventDefault();
    if (!selectedFee) return;
    try {
      await api.put(`/fees/${selectedFee.id}/payment`, { paidAmount: paymentAmountInput });
      toast.success('Fee payment recorded successfully!');
      setSelectedFee(null);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to record fee payment.');
    }
  };

  // Notice Handler
  const handleCreateNotice = async (e) => {
    e.preventDefault();
    try {
      await api.post('/notices', noticeForm);
      toast.success('Notice published successfully!');
      setShowNoticeModal(false);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to publish notice.');
    }
  };

  // Complaint Handler
  const handleUpdateComplaintStatus = async (e) => {
    e.preventDefault();
    if (!selectedComplaint) return;
    try {
      await api.put(`/complaints/${selectedComplaint.id}/status`, {
        status: complaintStatusInput,
        response: complaintResponseInput
      });
      toast.success('Complaint status updated successfully!');
      setSelectedComplaint(null);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update complaint status.');
    }
  };

  // Filtered lists
  const filteredFees = useMemo(() => {
    return fees.filter(f => {
      const matchesStatus = !feeStatusFilter || f.status === feeStatusFilter;
      const matchesSearch = !searchQuery ||
        f.student_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.roll_number?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [fees, feeStatusFilter, searchQuery]);

  const filteredNotices = useMemo(() => {
    return notices.filter(n => 
      !searchQuery ||
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [notices, searchQuery]);

  const filteredComplaints = useMemo(() => {
    return complaints.filter(c =>
      !searchQuery ||
      c.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.student_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [complaints, searchQuery]);

  const filteredAuditLogs = useMemo(() => {
    return auditLogs.filter(a =>
      !searchQuery ||
      a.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.user_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [auditLogs, searchQuery]);

  return (
    <div className="landing-page" style={{ padding: '2rem 1.5rem', maxWidth: '1280px', margin: '0 auto' }}>
      {/* Header */}
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
            <Building2 size={15} /> Campus360 Core Suite (Phase 9)
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
            University Management Modules
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: '0.4rem 0 0 0', fontSize: '0.95rem' }}>
            Conflict-free timetables, exam scheduler, fee records, noticeboards, complaints, and audit trail logs.
          </p>
        </div>

        <button onClick={loadData} className="btn btn-secondary" style={{ gap: '0.5rem', background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.15)' }}>
          <RefreshCw size={16} className={loading ? 'spin-animation' : ''} /> Refresh All Modules
        </button>
      </div>

      {/* Tabs */}
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
                padding: '0.75rem 1.2rem',
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

      {/* Error & Success Messages */}
      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.4)', color: '#fca5a5', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <AlertTriangle size={20} />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.4)', color: '#34d399', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <CheckCircle2 size={20} />
          <span>{successMsg}</span>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-secondary)' }}>
          <RefreshCw size={32} className="spin-animation" style={{ marginBottom: '1rem', color: 'var(--primary)' }} />
          <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>Loading Phase 9 University Modules...</p>
        </div>
      ) : (
        <div>
          {/* TAB 1: TIMETABLE */}
          {activeTab === 'timetable' && (
            <div className="feature-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.3rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={22} color="var(--primary)" /> Conflict-Free Timetable Scheduler
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>
                    Total {timetable.length} scheduled class slots across courses and rooms.
                  </p>
                </div>
                <button onClick={() => setShowTimetableModal(true)} className="btn btn-primary" style={{ gap: '0.5rem' }}>
                  <Plus size={16} /> Schedule Class Slot
                </button>
              </div>

              {timetable.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', padding: '1.5rem 0' }}>No timetable slots scheduled.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                        <th style={{ padding: '0.8rem 1rem' }}>Day</th>
                        <th style={{ padding: '0.8rem 1rem' }}>Time Slot</th>
                        <th style={{ padding: '0.8rem 1rem' }}>Subject & Code</th>
                        <th style={{ padding: '0.8rem 1rem' }}>Course & Sem</th>
                        <th style={{ padding: '0.8rem 1rem' }}>Faculty</th>
                        <th style={{ padding: '0.8rem 1rem' }}>Room</th>
                        <th style={{ padding: '0.8rem 1rem' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {timetable.map(slot => (
                        <tr key={slot.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td style={{ padding: '0.9rem 1rem', fontWeight: 700, color: '#818cf8' }}>{slot.day_of_week}</td>
                          <td style={{ padding: '0.9rem 1rem', fontWeight: 600 }}>{slot.start_time} - {slot.end_time}</td>
                          <td style={{ padding: '0.9rem 1rem' }}>
                            <div style={{ fontWeight: 600 }}>{slot.subject_name}</div>
                            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{slot.subject_code}</div>
                          </td>
                          <td style={{ padding: '0.9rem 1rem', color: 'var(--text-secondary)' }}>
                            {slot.course_code} (Sem {slot.semester})
                          </td>
                          <td style={{ padding: '0.9rem 1rem' }}>{slot.faculty_name}</td>
                          <td style={{ padding: '0.9rem 1rem' }}>
                            <span style={{ background: 'rgba(99,102,241,0.12)', color: '#818cf8', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600 }}>
                              {slot.room_number} ({slot.building})
                            </span>
                          </td>
                          <td style={{ padding: '0.9rem 1rem' }}>
                            <button onClick={() => handleDeleteTimetableSlot(slot.id)} style={{ border: 'none', background: 'rgba(239,68,68,0.15)', color: '#f87171', padding: '0.4rem 0.6rem', borderRadius: '6px', cursor: 'pointer' }}>
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: EXAMS */}
          {activeTab === 'exams' && (
            <div className="feature-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.3rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={22} color="var(--primary)" /> Examinations & Slot Allocation
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>
                    Total {exams.length} active exam terms recorded.
                  </p>
                </div>
                <button onClick={() => setShowExamModal(true)} className="btn btn-primary" style={{ gap: '0.5rem' }}>
                  <Plus size={16} /> Create Exam Term
                </button>
              </div>

              <div style={{ overflowX: 'auto', marginBottom: '2rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                      <th style={{ padding: '0.8rem 1rem' }}>Exam Name</th>
                      <th style={{ padding: '0.8rem 1rem' }}>Type</th>
                      <th style={{ padding: '0.8rem 1rem' }}>Academic Year & Sem</th>
                      <th style={{ padding: '0.8rem 1rem' }}>Dates</th>
                      <th style={{ padding: '0.8rem 1rem' }}>Scheduled Slots</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exams.map(e => (
                      <tr key={e.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '0.9rem 1rem', fontWeight: 700 }}>{e.name}</td>
                        <td style={{ padding: '0.9rem 1rem' }}>
                          <span style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600 }}>
                            {e.exam_type}
                          </span>
                        </td>
                        <td style={{ padding: '0.9rem 1rem', color: 'var(--text-secondary)' }}>{e.academic_year} (Sem {e.semester})</td>
                        <td style={{ padding: '0.9rem 1rem', color: 'var(--text-secondary)' }}>
                          {new Date(e.start_date).toLocaleDateString()} - {new Date(e.end_date).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '0.9rem 1rem', fontWeight: 600 }}>{e.scheduled_slots_count || 0} Slots</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: FEES */}
          {activeTab === 'fees' && (
            <div className="feature-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.3rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <BadgeDollarSign size={22} color="var(--primary)" /> Student Fee Record Tracker
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>
                    Showing {filteredFees.length} fee records.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <div style={{ position: 'relative', width: '220px' }}>
                    <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                    <input
                      type="text"
                      placeholder="Search fee records..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ width: '100%', padding: '0.5rem 0.5rem 0.5rem 2.2rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
                    />
                  </div>

                  <select
                    value={feeStatusFilter}
                    onChange={(e) => setFeeStatusFilter(e.target.value)}
                    style={{ padding: '0.55rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
                  >
                    <option value="">All Statuses</option>
                    <option value="PAID">Paid</option>
                    <option value="PARTIAL">Partial</option>
                    <option value="UNPAID">Unpaid</option>
                  </select>

                  <button onClick={() => setShowFeeModal(true)} className="btn btn-primary" style={{ gap: '0.5rem' }}>
                    <Plus size={16} /> Generate Fee Record
                  </button>
                </div>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                      <th style={{ padding: '0.8rem 1rem' }}>Roll No</th>
                      <th style={{ padding: '0.8rem 1rem' }}>Student Name</th>
                      <th style={{ padding: '0.8rem 1rem' }}>Total Fee</th>
                      <th style={{ padding: '0.8rem 1rem' }}>Paid Amount</th>
                      <th style={{ padding: '0.8rem 1rem' }}>Due Amount</th>
                      <th style={{ padding: '0.8rem 1rem' }}>Due Date</th>
                      <th style={{ padding: '0.8rem 1rem' }}>Status</th>
                      <th style={{ padding: '0.8rem 1rem' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFees.map(f => (
                      <tr key={f.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '0.9rem 1rem', fontWeight: 600, color: '#818cf8' }}>{f.roll_number}</td>
                        <td style={{ padding: '0.9rem 1rem', fontWeight: 600 }}>{f.student_name}</td>
                        <td style={{ padding: '0.9rem 1rem', fontWeight: 600 }}>₹{Number(f.total_amount).toLocaleString()}</td>
                        <td style={{ padding: '0.9rem 1rem', color: '#34d399', fontWeight: 600 }}>₹{Number(f.paid_amount).toLocaleString()}</td>
                        <td style={{ padding: '0.9rem 1rem', color: '#f87171', fontWeight: 600 }}>₹{Number(f.due_amount).toLocaleString()}</td>
                        <td style={{ padding: '0.9rem 1rem', color: 'var(--text-secondary)' }}>{new Date(f.due_date).toLocaleDateString()}</td>
                        <td style={{ padding: '0.9rem 1rem' }}>
                          <span style={{
                            padding: '0.25rem 0.6rem',
                            borderRadius: '6px',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            background: f.status === 'PAID' ? 'rgba(16,185,129,0.15)' : f.status === 'PARTIAL' ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
                            color: f.status === 'PAID' ? '#34d399' : f.status === 'PARTIAL' ? '#fbbf24' : '#f87171'
                          }}>
                            {f.status}
                          </span>
                        </td>
                        <td style={{ padding: '0.9rem 1rem' }}>
                          <button
                            onClick={() => { setSelectedFee(f); setPaymentAmountInput(f.paid_amount); }}
                            className="btn btn-secondary"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.82rem' }}
                          >
                            Update Payment
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: NOTICES */}
          {activeTab === 'notices' && (
            <div className="feature-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.3rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Bell size={22} color="var(--primary)" /> Official University Noticeboard
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>
                    Total {filteredNotices.length} active announcements.
                  </p>
                </div>
                <button onClick={() => setShowNoticeModal(true)} className="btn btn-primary" style={{ gap: '0.5rem' }}>
                  <Plus size={16} /> Publish Notice
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredNotices.map(n => (
                  <div key={n.id} style={{ background: 'var(--bg-input)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <h3 style={{ margin: 0, fontSize: '1.15rem' }}>{n.title}</h3>
                      <span style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600 }}>
                        Target: {n.target_role}
                      </span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: '0 0 0.75rem 0' }}>{n.description}</p>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', gap: '1rem' }}>
                      <span>Publisher: {n.publisher_name} ({n.publisher_role})</span>
                      <span>Published: {new Date(n.publish_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="feature-card">
              <h2 style={{ fontSize: '1.3rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={22} color="var(--primary)" /> System Notifications Center
              </h2>
              {notifications.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>No notifications found.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {notifications.map(ntf => (
                    <div key={ntf.id} style={{ background: ntf.is_read ? 'var(--bg-input)' : 'rgba(99,102,241,0.08)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '1rem' }}>{ntf.title}</h4>
                        <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{ntf.message}</p>
                      </div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{new Date(ntf.created_at).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: COMPLAINTS */}
          {activeTab === 'complaints' && (
            <div className="feature-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.3rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MessageSquareText size={22} color="var(--primary)" /> Student Complaints & Grievance Portal
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>
                    Total {filteredComplaints.length} student complaints.
                  </p>
                </div>

                <div style={{ position: 'relative', width: '250px' }}>
                  <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                  <input
                    type="text"
                    placeholder="Search complaints..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem 0.5rem 0.5rem 2.2rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
                  />
                </div>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                      <th style={{ padding: '0.8rem 1rem' }}>ID</th>
                      <th style={{ padding: '0.8rem 1rem' }}>Student</th>
                      <th style={{ padding: '0.8rem 1rem' }}>Subject</th>
                      <th style={{ padding: '0.8rem 1rem' }}>Description</th>
                      <th style={{ padding: '0.8rem 1rem' }}>Status</th>
                      <th style={{ padding: '0.8rem 1rem' }}>Admin Response</th>
                      <th style={{ padding: '0.8rem 1rem' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredComplaints.map(c => (
                      <tr key={c.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '0.9rem 1rem', fontWeight: 600, color: '#818cf8' }}>#{c.id}</td>
                        <td style={{ padding: '0.9rem 1rem' }}>
                          <div style={{ fontWeight: 600 }}>{c.student_name}</div>
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{c.roll_number}</div>
                        </td>
                        <td style={{ padding: '0.9rem 1rem', fontWeight: 600 }}>{c.subject}</td>
                        <td style={{ padding: '0.9rem 1rem', color: 'var(--text-secondary)', maxWidth: '250px' }}>{c.description}</td>
                        <td style={{ padding: '0.9rem 1rem' }}>
                          <span style={{
                            padding: '0.25rem 0.6rem',
                            borderRadius: '6px',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            background: c.status === 'RESOLVED' ? 'rgba(16,185,129,0.15)' : c.status === 'IN_PROGRESS' ? 'rgba(99,102,241,0.15)' : 'rgba(239,68,68,0.15)',
                            color: c.status === 'RESOLVED' ? '#34d399' : c.status === 'IN_PROGRESS' ? '#818cf8' : '#f87171'
                          }}>
                            {c.status}
                          </span>
                        </td>
                        <td style={{ padding: '0.9rem 1rem', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                          {c.response || <em style={{ color: '#94a3b8' }}>Pending Response</em>}
                        </td>
                        <td style={{ padding: '0.9rem 1rem' }}>
                          <button
                            onClick={() => { setSelectedComplaint(c); setComplaintStatusInput(c.status); setComplaintResponseInput(c.response || ''); }}
                            className="btn btn-secondary"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.82rem' }}
                          >
                            Resolve / Respond
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: AUDIT LOGS */}
          {activeTab === 'audit' && (
            <div className="feature-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.3rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ShieldAlert size={22} color="var(--primary)" /> Real-Time System Audit Logs
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>
                    Tracking operations across users, courses, grades, fees, and system activities.
                  </p>
                </div>

                <div style={{ position: 'relative', width: '250px' }}>
                  <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                  <input
                    type="text"
                    placeholder="Search logs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem 0.5rem 0.5rem 2.2rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
                  />
                </div>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                      <th style={{ padding: '0.8rem 1rem' }}>Timestamp</th>
                      <th style={{ padding: '0.8rem 1rem' }}>User</th>
                      <th style={{ padding: '0.8rem 1rem' }}>Action</th>
                      <th style={{ padding: '0.8rem 1rem' }}>Entity</th>
                      <th style={{ padding: '0.8rem 1rem' }}>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAuditLogs.map(log => (
                      <tr key={log.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '0.8rem 1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          {new Date(log.created_at).toLocaleString()}
                        </td>
                        <td style={{ padding: '0.8rem 1rem' }}>
                          <div style={{ fontWeight: 600 }}>{log.user_name || 'System'}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{log.user_role}</div>
                        </td>
                        <td style={{ padding: '0.8rem 1rem' }}>
                          <span style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
                            {log.action}
                          </span>
                        </td>
                        <td style={{ padding: '0.8rem 1rem', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                          {log.entity_type} #{log.entity_id || 'N/A'}
                        </td>
                        <td style={{ padding: '0.8rem 1rem', color: 'var(--text-primary)' }}>{log.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODALS */}

      {/* 1. Timetable Modal */}
      {showTimetableModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '2rem', maxWidth: '550px', width: '100%' }}>
            <h3 style={{ margin: '0 0 1.25rem 0' }}>Schedule Timetable Slot</h3>
            <form onSubmit={handleCreateTimetableSlot} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Course</label>
                <select
                  required
                  value={timetableForm.courseId}
                  onChange={(e) => setTimetableForm({ ...timetableForm, courseId: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
                >
                  <option value="">Select Course</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Subject</label>
                  <select
                    required
                    value={timetableForm.subjectId}
                    onChange={(e) => setTimetableForm({ ...timetableForm, subjectId: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
                  >
                    <option value="">Select Subject</option>
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Faculty Member</label>
                  <select
                    required
                    value={timetableForm.facultyId}
                    onChange={(e) => setTimetableForm({ ...timetableForm, facultyId: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
                  >
                    <option value="">Select Faculty</option>
                    {faculty.map(f => (
                      <option key={f.id} value={f.id}>{f.name} ({f.faculty_id})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Classroom / Room</label>
                  <select
                    required
                    value={timetableForm.roomId}
                    onChange={(e) => setTimetableForm({ ...timetableForm, roomId: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
                  >
                    <option value="">Select Room</option>
                    {rooms.map(r => (
                      <option key={r.id} value={r.id}>{r.room_number} ({r.building})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Day of Week</label>
                  <select
                    value={timetableForm.dayOfWeek}
                    onChange={(e) => setTimetableForm({ ...timetableForm, dayOfWeek: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
                  >
                    {['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Start Time</label>
                  <input
                    type="text"
                    required
                    placeholder="09:00"
                    value={timetableForm.startTime}
                    onChange={(e) => setTimetableForm({ ...timetableForm, startTime: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>End Time</label>
                  <input
                    type="text"
                    required
                    placeholder="10:00"
                    value={timetableForm.endTime}
                    onChange={(e) => setTimetableForm({ ...timetableForm, endTime: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
                  />
                </div>
              </div>

              {conflictAlert && (
                <div style={{
                  padding: '0.75rem',
                  borderRadius: '8px',
                  fontSize: '0.88rem',
                  background: conflictAlert.startsWith('CLEAR') ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                  color: conflictAlert.startsWith('CLEAR') ? '#34d399' : '#f87171'
                }}>
                  {conflictAlert}
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" onClick={handleCheckConflict} className="btn btn-secondary">
                  Check Conflict
                </button>
                <button type="button" onClick={() => setShowTimetableModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Exam Modal */}
      {showExamModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '2rem', maxWidth: '500px', width: '100%' }}>
            <h3 style={{ margin: '0 0 1.25rem 0' }}>Create Examination Term</h3>
            <form onSubmit={handleCreateExam} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Exam Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Midterm Examinations Spring 2026"
                  value={examForm.name}
                  onChange={(e) => setExamForm({ ...examForm, name: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Exam Type</label>
                  <select
                    value={examForm.examType}
                    onChange={(e) => setExamForm({ ...examForm, examType: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
                  >
                    <option value="INTERNAL">Internal</option>
                    <option value="MIDTERM">Midterm</option>
                    <option value="PRACTICAL">Practical</option>
                    <option value="FINAL">Final</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Academic Year</label>
                  <input
                    type="text"
                    required
                    value={examForm.academicYear}
                    onChange={(e) => setExamForm({ ...examForm, academicYear: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Start Date</label>
                  <input
                    type="date"
                    required
                    value={examForm.startDate}
                    onChange={(e) => setExamForm({ ...examForm, startDate: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>End Date</label>
                  <input
                    type="date"
                    required
                    value={examForm.endDate}
                    onChange={(e) => setExamForm({ ...examForm, endDate: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowExamModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Exam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Fee Modal */}
      {showFeeModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '2rem', maxWidth: '500px', width: '100%' }}>
            <h3 style={{ margin: '0 0 1.25rem 0' }}>Generate Student Fee Record</h3>
            <form onSubmit={handleCreateFee} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Student</label>
                <select
                  required
                  value={feeForm.studentId}
                  onChange={(e) => setFeeForm({ ...feeForm, studentId: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
                >
                  <option value="">Select Student</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.student_id})</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Fee (₹)</label>
                  <input
                    type="number"
                    required
                    value={feeForm.totalAmount}
                    onChange={(e) => setFeeForm({ ...feeForm, totalAmount: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Initial Paid Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={feeForm.paidAmount}
                    onChange={(e) => setFeeForm({ ...feeForm, paidAmount: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Due Date</label>
                <input
                  type="date"
                  required
                  value={feeForm.dueDate}
                  onChange={(e) => setFeeForm({ ...feeForm, dueDate: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowFeeModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Generate Fee Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Payment Update Modal */}
      {selectedFee && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '2rem', maxWidth: '450px', width: '100%' }}>
            <h3 style={{ margin: '0 0 1rem 0' }}>Record Fee Payment</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Student: <strong>{selectedFee.student_name}</strong> ({selectedFee.roll_number}) • Total: ₹{selectedFee.total_amount}
            </p>
            <form onSubmit={handleUpdatePayment} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Updated Total Paid Amount (₹)</label>
                <input
                  type="number"
                  required
                  value={paymentAmountInput}
                  onChange={(e) => setPaymentAmountInput(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" onClick={() => setSelectedFee(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update Payment Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Notice Modal */}
      {showNoticeModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '2rem', maxWidth: '500px', width: '100%' }}>
            <h3 style={{ margin: '0 0 1.25rem 0' }}>Publish Official Notice</h3>
            <form onSubmit={handleCreateNotice} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Title</label>
                <input
                  type="text"
                  required
                  placeholder="Notice Title..."
                  value={noticeForm.title}
                  onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Description</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Detailed announcement content..."
                  value={noticeForm.description}
                  onChange={(e) => setNoticeForm({ ...noticeForm, description: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Target Audience</label>
                  <select
                    value={noticeForm.targetRole}
                    onChange={(e) => setNoticeForm({ ...noticeForm, targetRole: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
                  >
                    <option value="ALL">All Users</option>
                    <option value="HOD">HODs Only</option>
                    <option value="FACULTY">Faculty Only</option>
                    <option value="STUDENT">Students Only</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Publish Date</label>
                  <input
                    type="date"
                    required
                    value={noticeForm.publishDate}
                    onChange={(e) => setNoticeForm({ ...noticeForm, publishDate: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowNoticeModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Complaint Resolution Modal */}
      {selectedComplaint && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '2rem', maxWidth: '500px', width: '100%' }}>
            <h3 style={{ margin: '0 0 1rem 0' }}>Resolve Student Complaint</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Student: <strong>{selectedComplaint.student_name}</strong> • Subject: {selectedComplaint.subject}
            </p>
            <form onSubmit={handleUpdateComplaintStatus} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Complaint Status</label>
                <select
                  value={complaintStatusInput}
                  onChange={(e) => setComplaintStatusInput(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
                >
                  <option value="OPEN">Open</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Administrative Response</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Enter response or resolution notes for the student..."
                  value={complaintResponseInput}
                  onChange={(e) => setComplaintResponseInput(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" onClick={() => setSelectedComplaint(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Resolution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        type={confirmModal.type}
        loading={confirmModal.loading}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};

export default UniversityModules;
