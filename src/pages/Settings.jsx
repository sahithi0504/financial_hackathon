import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaBell,
  FaThLarge,
  FaLock,
  FaRobot,
  FaUser,
  FaLanguage,
  FaClock,
  FaCamera
} from 'react-icons/fa';
import './Settings.css';

export default function Settings() {
  const [name, setName] = useState('Jane Doe');
  const [language, setLanguage] = useState('English');
  const [timezone, setTimezone] = useState('GMT');

  const handleNameChange = (e) => setName(e.target.value);
  const handleLanguageChange = (e) => setLanguage(e.target.value);
  const handleTimezoneChange = (e) => setTimezone(e.target.value);

  return (
    <div className="settings-container">
      <h2 className="settings-title">Settings</h2>

      <section className="settings-section profile-section">
        <div className="profile-info">
          <div className="profile-circle"></div>
          <div className="form-group">
            <label><FaUser /> Name</label>
            <input value={name} onChange={handleNameChange} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label><FaLanguage /> Language</label>
            <select value={language} onChange={handleLanguageChange}>
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>
          <div className="form-group">
            <label><FaClock /> Timezone</label>
            <select value={timezone} onChange={handleTimezoneChange}>
              <option>GMT</option>
              <option>EST</option>
              <option>PST</option>
              <option>CET</option>
            </select>
          </div>
        </div>
      </section>

      <div className="settings-grid">
        <motion.div className="settings-card" whileHover={{ scale: 1.03 }}>
          <h3><FaBell /> Notifications</h3>
          <p>Manage email and system alerts.</p>
          <label><input type="checkbox" /> Enable email alerts</label>
          <label><input type="checkbox" /> Weekly summary reports</label>
        </motion.div>

        <motion.div className="settings-card" whileHover={{ scale: 1.03 }}>
          <h3><FaThLarge /> Dashboard Layout</h3>
          <p>Customize how your dashboard looks.</p>
          <label><input type="radio" name="layout" /> Grid View</label>
          <label><input type="radio" name="layout" /> List View</label>
        </motion.div>

        <motion.div className="settings-card" whileHover={{ scale: 1.03 }}>
          <h3><FaLock /> Security</h3>
          <p>Update password or enable 2FA.</p>
          <button className="settings-button">Change Password</button>
          <button className="settings-button">Enable 2FA</button>
        </motion.div>

        <motion.div className="settings-card" whileHover={{ scale: 1.03 }}>
          <h3><FaRobot /> AI Model Insights</h3>
          <p>Adjust how insights are generated.</p>
          <label><input type="checkbox" /> Enable predictive suggestions</label>
          <label><input type="checkbox" /> Show historical trends</label>
        </motion.div>
      </div>
    </div>
  );
}