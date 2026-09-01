import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  UserPlus,
  FilePlus,
  ClipboardCheck,
  BookPlus,
  Award,
  Calendar,
  BellPlus,
  MessageSquarePlus,
  BarChart,
  Layers
} from 'lucide-react';

const QuickActionCard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const userRole = user?.role || 'FACULTY';

  const roleActions = {
    ADMIN: [
      { label: '+ Add Student', path: '/admin/dashboard', icon: UserPlus },
      { label: '+ Add Faculty', path: '/admin/dashboard', icon: UserPlus },
      { label: '+ Manage Courses', path: '/admin/dashboard', icon: BookPlus },
      { label: '+ View Timetable', path: '/university/timetable', icon: Calendar },
      { label: '+ System Audit', path: '/university/audit', icon: Layers }
    ],
    HOD: [
      { label: '+ Add Faculty', path: '/hod/faculty', icon: UserPlus },
      { label: '+ Manage Subjects', path: '/hod/subjects', icon: BookPlus },
      { label: '+ Department Analytics', path: '/analytics', icon: BarChart },
      { label: '+ Publish Notice', path: '/university/notices', icon: BellPlus },
      { label: '+ View Timetable', path: '/university/timetable', icon: Calendar }
    ],
    FACULTY: [
      { label: '+ Create Assignment', path: '/faculty/dashboard', icon: FilePlus },
      { label: '+ Mark Attendance', path: '/faculty/dashboard', icon: ClipboardCheck },
      { label: '+ Enter Marks', path: '/faculty/dashboard', icon: Award },
      { label: '+ Upload Materials', path: '/faculty/dashboard', icon: BookPlus },
      { label: '+ View Timetable', path: '/university/timetable', icon: Calendar }
    ],
    STUDENT: [
      { label: '+ Submit Assignment', path: '/student/dashboard', icon: FilePlus },
      { label: '+ Check Attendance', path: '/student/dashboard', icon: ClipboardCheck },
      { label: '+ View Timetable', path: '/university/timetable', icon: Calendar },
      { label: '+ Check Marks', path: '/student/dashboard', icon: Award },
      { label: '+ Submit Complaint', path: '/university/complaints', icon: MessageSquarePlus }
    ]
  };

  const actions = roleActions[userRole] || roleActions.FACULTY;

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.15rem' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Quick Actions</h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Role-tailored operations for your portal</p>
        </div>
      </div>

      <div className="quick-actions-container">
        {actions.map((act, idx) => {
          const Icon = act.icon;
          return (
            <button
              key={idx}
              className="action-pill-card"
              onClick={() => navigate(act.path)}
            >
              <Icon size={18} className="action-icon" style={{ color: 'var(--primary)' }} />
              <span>{act.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActionCard;
