// src/components/Sidebar.jsx
import React, { useState } from 'react';
import './sidebar.css';
import { 
  FaSearch, FaHome, FaChartLine, FaBell, 
  FaBullseye, FaUpload, FaCog, FaSignOutAlt, FaMoon, FaSun
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Sidebar({ isCollapsed, onToggle }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { title: 'Dashboard', icon: <FaHome />, link: '/dashboard'},
    { title: 'Model Insights', icon: <FaChartLine />, link: '/model-insights' },
    { title: 'Goals Tracker', icon: <FaBullseye />, link: '/goals-tracker' },
    { title: 'Upload Data', icon: <FaUpload />, link: '/upload-data' },
    { title: 'Notification', icon: <FaBell />, link: '/notification' },
    { title: 'Settings', icon: <FaCog />, link: '/settings' }
  ];

  const [activeNav, setActiveNav] = useState(navItems[0].title);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const filteredNavItems = navItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isDarkMode ? 'dark' : ''}`}>
      <div className="logo-section">
        <div className="logo">
          {!isCollapsed && <span className="logo-name">FiscalFocus</span>}
        </div>
        <span className="toggle-icon" onClick={onToggle}>
          {isCollapsed ? '>' : '<'}
        </span>
      </div>

      <div className="top-spacer"></div>

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

      <ul className="nav-links">
        {filteredNavItems.map((item, index) => (
          <li 
            key={index} 
            className={activeNav === item.title ? 'active' : ''}
          >
            <Link to={item.link} onClick={() => setActiveNav(item.title)}>
              <span className="icon">{item.icon}</span>
              {!isCollapsed && <span className="link-name">{item.title}</span>}
            </Link>
          </li>
        ))}
      </ul>

      <hr className="separator" />

      <div className="mode" onClick={toggleDarkMode}>
        <div className="left-section">
          {isDarkMode ? <FaSun className="icon" /> : <FaMoon className="icon" />}
          {!isCollapsed && (
            <span className="mode-text">
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </span>
          )}
        </div>
        <div className={`toggle-switch ${isDarkMode ? 'active' : ''}`}>
          <span className="switch" />
        </div>
      </div>

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