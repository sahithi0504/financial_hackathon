import React, { useState } from 'react';
import { FiBell } from 'react-icons/fi';
import { motion } from 'framer-motion';
import './Notification.css';

export default function Notification() {
  const [doNotDisturb, setDoNotDisturb] = useState(false);
  const [filter, setFilter] = useState('All');

  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New inspection assigned: QW0001 - Pepsi Asia', date: new Date(), isRead: false },
    { id: 2, text: 'New inspection assigned: AR5567 - Pepsi Europe', date: new Date(), isRead: false },
    { id: 3, text: 'Inspection import created', date: new Date(Date.now() - 3 * 3600 * 1000), isRead: true },
    { id: 4, text: 'Terms of use was updated', date: new Date(Date.now() - 24 * 3600 * 1000), isRead: true },
    { id: 5, text: 'Stock insights for Q2 available', date: new Date(Date.now() - 24 * 3600 * 1000), isRead: false },
    { id: 6, text: 'P&L model flagged an unusual drop', date: new Date(Date.now() - 2 * 86400 * 1000), isRead: false },
    { id: 7, text: 'Invoice update for Client: Acme Corp', date: new Date('2024-03-18'), isRead: true },
    { id: 8, text: 'New feature: Export PDF', date: new Date('2024-03-15'), isRead: true },
  ]);

  const toggleDND = () => setDoNotDisturb(!doNotDisturb);
  const markAllAsRead = () =>
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));

  const getDayLabel = (date) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isSameDay = (d1, d2) =>
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear();

    if (isSameDay(date, today)) return 'Today';
    if (isSameDay(date, yesterday)) return 'Yesterday';

    return date.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const groupedNotifications = () => {
    const grouped = {};
    notifications
      .filter(n => filter === 'All' || !n.isRead)
      .sort((a, b) => b.date - a.date)
      .forEach(n => {
        const label = getDayLabel(n.date);
        if (!grouped[label]) grouped[label] = [];
        grouped[label].push(n);
      });
    return grouped;
  };

  const groups = groupedNotifications();

  return (
    <div className="notification-page">
      <motion.div className="notification-card" whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
        <div className="notification-header">
          <div className="notification-title">
            <FiBell className="bell-icon" />
            <h2>Notifications</h2>
          </div>
          <label className="switch">
            <input type="checkbox" checked={doNotDisturb} onChange={toggleDND} />
            <span className="slider round"></span>
            <span className="dnd-label">Do Not Disturb</span>
          </label>
        </div>

        {/* Tabs */}
        <div className="tabs">
          {['All', 'Unread'].map((t) => (
            <button
              key={t}
              className={`tab-button ${filter === t ? 'active' : ''}`}
              onClick={() => setFilter(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Notification List */}
        <div className="notification-list">
          {Object.entries(groups).map(([day, items]) => (
            <div key={day} className="day-group">
              <h4 className="day-label">{day}</h4>
              <ul>
                {items.map((n) => (
                  <li key={n.id} className={`notification-item ${n.isRead ? 'read' : 'unread'}`}>
                    {!n.isRead && <span className="dot" />}
                    <span className="notif-text">{n.text}</span>
                    <span className="notif-time">
                      {n.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="notification-footer">
          <button onClick={markAllAsRead} className="mark-read-btn">
            Mark All as Read
          </button>
        </div>
      </motion.div>
    </div>
  );
}