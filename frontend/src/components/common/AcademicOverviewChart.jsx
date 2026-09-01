import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

const AcademicOverviewChart = ({ data }) => {
  const defaultChartData = [
    { name: 'Computer Science', Attendance: 92, Performance: 88 },
    { name: 'Information Tech', Attendance: 89, Performance: 84 },
    { name: 'Electronics', Attendance: 85, Performance: 79 },
    { name: 'Mechanical Engg', Attendance: 91, Performance: 82 },
    { name: 'Civil Engg', Attendance: 88, Performance: 85 }
  ];

  const chartData = data && data.length > 0 ? data : defaultChartData;

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Academic Overview</h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Department attendance & student performance trends</p>
        </div>
        <span style={{ fontSize: '0.78rem', fontWeight: 700, padding: '0.3rem 0.65rem', borderRadius: '9999px', background: 'var(--primary-light)', color: 'var(--primary)' }}>
          Live Semester
        </span>
      </div>

      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
            <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
            <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                background: 'var(--bg-card-solid)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                boxShadow: 'var(--shadow)',
                color: 'var(--text-primary)'
              }}
            />
            <Bar dataKey="Attendance" fill="#2563eb" radius={[6, 6, 0, 0]} maxBarSize={32} />
            <Bar dataKey="Performance" fill="#06b6d4" radius={[6, 6, 0, 0]} maxBarSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AcademicOverviewChart;
