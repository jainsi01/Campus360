import React, { useState } from 'react';
import Sidebar from '../components/common/Sidebar';
import DashboardHeader from '../components/common/DashboardHeader';
import AIChatbot from '../components/common/AIChatbot';

const DashboardLayout = ({ children }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="app-dashboard-shell">
      {/* Permanent Desktop Left Sidebar */}
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      {/* Main Content Area */}
      <div className="dashboard-main-area">
        {/* Top Header Bar */}
        <DashboardHeader onToggleMobileMenu={() => setIsMobileOpen((prev) => !prev)} />

        {/* Dynamic Page Workspace */}
        <main className="header-content-container">
          {children}
        </main>
      </div>

      {/* Floating AI Chatbot Assistant Button */}
      <AIChatbot />
    </div>
  );
};

export default DashboardLayout;
