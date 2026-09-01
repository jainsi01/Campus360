import React from 'react';
import { Megaphone, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AnnouncementCard = ({ notices }) => {
  const navigate = useNavigate();

  const defaultNotices = [
    {
      id: 1,
      title: 'Mid-semester examinations begin on 15 September.',
      description: 'Detailed timetable slots and room assignments are published on the exam portal.',
      date: '01 Sep 2026'
    },
    {
      id: 2,
      title: 'Faculty & HOD Monthly Review Meeting',
      description: 'Scheduled for Friday at 3:00 PM in Seminar Hall B.',
      date: '31 Aug 2026'
    }
  ];

  const list = notices && notices.length > 0 ? notices : defaultNotices;

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.15rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Megaphone size={18} style={{ color: 'var(--primary)' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Campus Announcements</h3>
        </div>
        <button
          onClick={() => navigate('/university/notices')}
          style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
        >
          View All <ChevronRight size={14} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {list.slice(0, 2).map((notice) => (
          <div
            key={notice.id}
            style={{
              padding: '0.85rem 1rem',
              borderRadius: '14px',
              background: 'var(--bg-hover)',
              border: '1px solid var(--border-color)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--text-primary)' }}>📢 {notice.title}</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{notice.date || 'Recent'}</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
              {notice.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementCard;
