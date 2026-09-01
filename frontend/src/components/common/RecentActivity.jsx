import React from 'react';
import { Activity, CheckCircle2, UserCheck, FileText, Award, Bell } from 'lucide-react';

const RecentActivity = ({ logs }) => {
  const defaultLogs = [
    { id: 1, action: 'New assignment created', detail: 'CS301 Algorithm Analysis Assignment 2', time: '10 mins ago', icon: FileText, color: '#2563eb' },
    { id: 2, action: 'Student attendance updated', detail: 'Semester 5 Computer Engineering', time: '35 mins ago', icon: UserCheck, color: '#10b981' },
    { id: 3, action: 'Exam results published', detail: 'Mid-term Data Mining Examination', time: '2 hours ago', icon: Award, color: '#6366f1' },
    { id: 4, action: 'Campus circular issued', detail: 'Schedule for Annual Sports Meet 2026', time: '4 hours ago', icon: Bell, color: '#06b6d4' }
  ];

  const activityList = logs && logs.length > 0 ? logs.map(l => ({
    id: l.id,
    action: l.action || 'System Activity',
    detail: l.details || l.description || 'Action performed',
    time: l.timestamp ? new Date(l.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
    icon: CheckCircle2,
    color: '#2563eb'
  })) : defaultLogs;

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={18} style={{ color: 'var(--primary)' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Recent Activity</h3>
        </div>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Realtime Feed</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
        {activityList.slice(0, 4).map((act) => {
          const Icon = act.icon || CheckCircle2;
          return (
            <div key={act.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: `${act.color}15`, color: act.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={16} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)' }}>{act.action}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{act.detail}</div>
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{act.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivity;
