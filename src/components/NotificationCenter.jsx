import React, { useState, useEffect } from 'react';
import { Bell, X, MapPin, Volume2, AlertTriangle, Users } from 'lucide-react';
import { realtimeManager } from '../utils/realtimeManager';

const NotificationCenter = ({ onLocationClick }) => {
  const [notifications, setNotifications] = useState([]);
  const [activeUsers, setActiveUsers] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    // Subscribe to real-time updates
    const unsubscribe = realtimeManager.subscribe((update) => {
      switch (update.type) {
        case 'NOTIFICATION':
          setNotifications(update.allNotifications);
          setHasUnread(true);
          // Auto-show notifications panel for important alerts
          if (update.notification.level === 'warning') {
            setShowNotifications(true);
          }
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

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    setHasUnread(false);
  };

  const handleDismissNotification = (notificationId) => {
    realtimeManager.dismissNotification(notificationId);
  };

  const handleClearAll = () => {
    realtimeManager.clearNotifications();
  };

  const handleLocationClick = (notification) => {
    if (onLocationClick) {
      onLocationClick(notification.coordinates, notification);
    }
    setShowNotifications(false);
  };

  const getNotificationIcon = (notification) => {
    switch (notification.type) {
      case 'NOISE_SPIKE':
        return <AlertTriangle className="notification-icon spike" />;
      default:
        return <Volume2 className="notification-icon" />;
    }
  };

  const getNotificationClass = (notification) => {
    return `notification-item ${notification.level}`;
  };

  return (
    <div className="notification-center">
      {/* Active Users Counter */}
      <div className="user-counter">
        <Users className="user-counter-icon" />
        <span className="user-count">{activeUsers}</span>
        <span className="user-label">active users</span>
      </div>

      {/* Notification Bell */}
      <div className="notification-bell-container">
        <button 
          className={`notification-bell ${hasUnread ? 'has-unread' : ''}`}
          onClick={handleNotificationClick}
        >
          <Bell className="bell-icon" />
          {notifications.length > 0 && (
            <span className="notification-badge">{notifications.length}</span>
          )}
        </button>

        {/* Notification Panel */}
        {showNotifications && (
          <div className="notification-panel">
            <div className="notification-header">
              <h3>Real-time Alerts</h3>
              <div className="notification-actions">
                {notifications.length > 0 && (
                  <button onClick={handleClearAll} className="clear-all-btn">
                    Clear All
                  </button>
                )}
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="close-panel-btn"
                >
                  <X className="close-icon" />
                </button>
              </div>
            </div>

            <div className="notification-list">
              {notifications.length === 0 ? (
                <div className="no-notifications">
                  <Bell className="empty-bell" />
                  <p>No recent alerts</p>
                  <span>Real-time monitoring active</span>
                </div>
              ) : (
                notifications.map(notification => (
                  <div 
                    key={notification.id}
                    className={getNotificationClass(notification)}
                  >
                    <div className="notification-content">
                      <div className="notification-main">
                        {getNotificationIcon(notification)}
                        <div className="notification-text">
                          <h4 className="notification-title">{notification.title}</h4>
                          <p className="notification-message">{notification.message}</p>
                          <div className="notification-meta">
                            <span className="notification-time">
                              {new Date(notification.timestamp).toLocaleTimeString()}
                            </span>
                            {notification.location && (
                              <button 
                                onClick={() => handleLocationClick(notification)}
                                className="location-link"
                              >
                                <MapPin className="location-icon" />
                                View on Map
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDismissNotification(notification.id)}
                        className="dismiss-btn"
                      >
                        <X className="dismiss-icon" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;
