import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ModelInsights from './pages/ModelInsights';
import GoalTracker from './pages/GoalTracker';
import UploadData from './pages/UploadData';
import Settings from './pages/Settings';
import Notification from './pages/Notification';
import Home from './home';
import ProtectedRoute from './ProtectedRoute';
import './index.css';

function AppLayout({ children }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(prev => !prev);
  };

  return (
    <div className={`app-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={handleSidebarToggle} />
      <div className="main-content">
        {children}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* All Protected Routes Below */}
        <Route path="/dashboard/*" element={
          <ProtectedRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        } />

        <Route path="/model-insights/*" element={
          <ProtectedRoute>
            <AppLayout>
              <ModelInsights />
            </AppLayout>
          </ProtectedRoute>
        } />

        <Route path="/goals-tracker/*" element={
          <ProtectedRoute>
            <AppLayout>
              <GoalTracker />
            </AppLayout>
          </ProtectedRoute>
        } />

        <Route path="/notification/*" element={
          <ProtectedRoute>
            <AppLayout>
              <Notification />
            </AppLayout>
          </ProtectedRoute>
        } />

        <Route path="/upload-data/*" element={
          <ProtectedRoute>
            <AppLayout>
              <UploadData />
            </AppLayout>
          </ProtectedRoute>
        } />

        <Route path="/settings/*" element={
          <ProtectedRoute>
            <AppLayout>
              <Settings />
            </AppLayout>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;