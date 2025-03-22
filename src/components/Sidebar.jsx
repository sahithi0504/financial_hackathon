// src/components/Sidebar.jsx
import React, { useState } from 'react';
import './sidebar.css';
import { 
  FaBars, FaSearch, FaHome, FaChartLine, FaExclamationTriangle, 
  FaBullseye, FaUpload, FaCog, FaSignOutAlt, FaMoon 
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Sidebar({ isCollapsed, onToggle }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { title: 'Dashboard', icon: <FaHome />, link: '/' },
    { title: 'Model Insights', icon: <FaChartLine />, link: '/model-insights' },
    { title: 'Risk Summary', icon: <FaExclamationTriangle />, link: '/risk-summary' },
    { title: 'Goals Tracker', icon: <FaBullseye />, link: '/goals-tracker' },
    { title: 'Upload Data', icon: <FaUpload />, link: '/upload-data' },
    { title: 'Settings', icon: <FaCog />, link: '/settings' }
  ];

  const [activeNav, setActiveNav] = useState(navItems[0].title);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // Filter navigation items based on search query (case-insensitive)
  const filteredNavItems = navItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isDarkMode ? 'dark' : ''}`}>
      {/* Logo and Collapse Button */}
      <div className="logo-section">
        <div className="logo">
          <span className="logo-icon">FS</span>
          {!isCollapsed && <span className="logo-name">FiscalFocus</span>}
        </div>
        {/* Use the onToggle passed from App */}
        <FaBars className="toggle-icon" onClick={onToggle} />
      </div>

      {/* Spacer */}
      <div className="top-spacer"></div>

      {/* Search Box */}
      <div className="search-box">
        <FaSearch className="search-icon" />
        {!isCollapsed && (
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        )}
      </div>

      {/* Navigation Links */}
      <ul className="nav-links">
        {filteredNavItems.map((item, index) => (
          <li key={index} className={activeNav === item.title ? 'active' : ''}>
            <Link to={item.link} onClick={() => setActiveNav(item.title)}>
              <span className="icon">{item.icon}</span>
              {!isCollapsed && <span className="link-name">{item.title}</span>}
            </Link>
          </li>
        ))}
      </ul>

      {/* Separator Line above Dark/Light Mode */}
      <hr className="separator" />

      {/* Dark/Light Mode Section */}
      <div className="mode" onClick={toggleDarkMode}>
        {!isCollapsed && (
          <div className="left-section">
            <FaMoon className="icon" />
            <span className="mode-text">
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </span>
          </div>
        )}
        <div className="toggle-switch">
          <span className="switch" />
        </div>
      </div>

      {/* Logout Button */}
      <div className="logout-section">
        <Link to="/logout" className="logout-button">
          <FaSignOutAlt className="icon" />
          {!isCollapsed && <span className="link-name">Logout</span>}
        </Link>
      </div>
    </div>
  );
}

export default Sidebar;
