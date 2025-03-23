import React from 'react';
import './notification.css';
// If you have an actual bell icon image or an icon library, import/use that.
// Below is an example using a react-icon. You can remove or replace as needed.
import { FiBell } from 'react-icons/fi';

const Notification = () => {
  // Sample data
  const notifications = [
    {
      id: 1,
      text: 'New inspection assigned: QW0001 - Pepsi Asia',
      time: 'Now',
      isRead: false,
    },
    {
      id: 2,
      text: 'New inspection assigned: AR5567 - Pepsi Europe',
      time: '1h ago',
      isRead: false,
    },
    {
      id: 3,
      text: 'Inspection import has been successfully created',
      time: '4h ago',
      isRead: true,
    },
    {
      id: 4,
      text: 'Terms of use was updated tempus',
      time: '05 May 2019',
      isRead: true,
    },
  ];

  return (
    <div className="notification-container">
      {/* Top row: Notification header on the left, bell + DND on the right */}
      <div className="notification-header-row">
        <h2 className="notification-header">Notification</h2>
        <div className="notification-controls">
          <FiBell className="bell-icon" />
          <span className="do-not-disturb">Do not disturb</span>
        </div>
      </div>

      {/* Notification table */}
      <table className="notification-table">
        <tbody>
          {notifications.map((notif) => (
            <tr key={notif.id} className={notif.isRead ? 'read' : 'unread'}>
              {/* Single column for text (with dot if unread) */}
              <td className="notification-text-cell">
                {!notif.isRead && <span className="dot"></span>}
                {notif.text}
              </td>
              {/* Time column on the right */}
              <td className="notification-time-cell">
                {notif.time}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Optional footer action (if your screenshot has "Mark all as read") */}
      <div className="notification-footer">
        <span className="mark-all-read">Mark all as read</span>
      </div>
    </div>
  );
};

export default Notification;
