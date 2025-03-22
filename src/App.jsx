// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard'; 
import GoalTracker from './pages/GoalTracker';
import './index.css';

function App() {
  // Lift the collapsed state up here
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(prev => !prev);
  };

  return (
    <Router>
      <div className={`app-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Pass isCollapsed state and toggle handler to Sidebar */}
        <Sidebar isCollapsed={isSidebarCollapsed} onToggle={handleSidebarToggle} />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/goals-tracker" element={<GoalTracker />} />
            {/* Additional routes can be added later */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
