import React from 'react';

const StatCard = ({ title, value, trend, trendType = 'positive', icon: Icon, accentColor = '#2563eb' }) => {
  return (
    <div className="glass-card stat-kpi-card">
      <div className="stat-kpi-top">
        <div className="stat-icon-badge" style={{ background: `${accentColor}15`, color: accentColor }}>
          {Icon && <Icon size={22} />}
        </div>
        {trend && (
          <span className={`stat-trend-badge ${trendType}`}>
            {trend}
          </span>
        )}
      </div>

      <div>
        <div className="stat-kpi-label">{title}</div>
        <div className="stat-kpi-val" style={{ marginTop: '0.2rem' }}>{value}</div>
      </div>
    </div>
  );
};

export default StatCard;
