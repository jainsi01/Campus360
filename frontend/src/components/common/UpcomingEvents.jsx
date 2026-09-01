import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';

const UpcomingEvents = ({ events }) => {
  const defaultEvents = [
    {
      id: 1,
      time: 'Today 10:00 AM',
      title: 'Data Structures Lecture',
      location: 'Hall A • Room 302',
      type: 'Lecture'
    },
    {
      id: 2,
      time: 'Tomorrow 02:00 PM',
      title: 'Faculty & HOD Board Meeting',
      location: 'Conference Room 1',
      type: 'Meeting'
    },
    {
      id: 3,
      time: '03 Sep 09:30 AM',
      title: 'Mid-Semester Examinations',
      location: 'Main Examination Center',
      type: 'Exam'
    }
  ];

  const list = events && events.length > 0 ? events : defaultEvents;

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={18} style={{ color: 'var(--primary)' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Upcoming Events</h3>
        </div>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Next 7 Days</span>
      </div>

      <div className="timeline-list">
        {list.map((ev) => (
          <div key={ev.id} className="timeline-item">
            <span className="timeline-time-badge">{ev.time}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{ev.title}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                <MapPin size={13} /> {ev.location}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingEvents;
