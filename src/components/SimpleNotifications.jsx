import React, { useState, useEffect } from 'react';
import { Bell, Users, AlertTriangle, Volume2 } from 'lucide-react';
import { realtimeManager } from '../utils/realtimeManager';

const SimpleNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [activeUsers, setActiveUsers] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    // Subscribe to real-time updates
    const unsubscribe = realtimeManager.subscribe((update) => {
      switch (update.type) {
        case 'NOTIFICATION':
          setNotifications(update.allNotifications);
          break;
        case 'NOTIFICATION_DISMISSED':
        case 'NOTIFICATIONS_CLEARED':
          setNotifications(update.allNotifications);
          break;
        case 'USER_COUNT_UPDATE':
          setActiveUsers(update.activeUsers);
          break;
        default:
          break;
      }
    });

    // Initialize data
    setNotifications(realtimeManager.getNotifications());
    setActiveUsers(realtimeManager.getActiveUsers());

    return unsubscribe;
  }, []);

  return (
    <div className="simple-notifications">
      {/* Active Users Counter */}
      <div className="user-counter">
        <Users className="user-counter-icon" />
        <span className="user-count">{activeUsers}</span>
        <span className="user-label">active</span>
      </div>

      {/* Notification Bell */}
      <div className="notification-bell-container">
        <button 
          className={`notification-bell ${notifications.length > 0 ? 'has-unread' : ''}`}
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <Bell className="bell-icon" />
          {notifications.length > 0 && (
            <span className="notification-badge">{notifications.length}</span>
          )}
        </button>

        {/* Simple Notification Panel */}
        {showNotifications && notifications.length > 0 && (
          <div className="simple-notification-panel">
            <h4>Recent Alerts</h4>
            {notifications.slice(0, 3).map(notification => (
              <div key={notification.id} className="simple-notification-item">
                <AlertTriangle className="alert-icon" />
                <div>
                  <p>{notification.title}</p>
                  <small>{new Date(notification.timestamp).toLocaleTimeString()}</small>
                </div>
              </div>
            ))}
            {notifications.length > 3 && (
              <p className="more-notifications">+{notifications.length - 3} more alerts</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleNotifications;
