import React, { useState, useEffect } from 'react';
import { useServiceAI } from '../hooks/useServiceAI';
import { formatDistanceToNow } from 'date-fns';

const Notifications = () => {
  const { generateSmartNotifications, loading, error } = useServiceAI();
  const [notifications, setNotifications] = useState([]);
  const [notificationPriority, setNotificationPriority] = useState({});

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        // Get user data from localStorage
        const userActivity = JSON.parse(localStorage.getItem('userActivity') || '{}');
        const notificationHistory = JSON.parse(localStorage.getItem('notificationHistory') || '[]');
        const preferences = JSON.parse(localStorage.getItem('userPreferences') || '{}');

        // Generate smart notifications
        const result = await generateSmartNotifications(
          userActivity,
          notificationHistory,
          preferences
        );

        if (result.success) {
          // Sort notifications by priority
          const sortedNotifications = result.notifications.sort((a, b) => {
            const priorityA = notificationPriority[a.id] || 0;
            const priorityB = notificationPriority[b.id] || 0;
            return priorityB - priorityA;
          });

          setNotifications(sortedNotifications);
        }
      } catch (err) {
        console.error('Error loading notifications:', err);
      }
    };

    loadNotifications();
  }, [generateSmartNotifications]);

  const handleNotificationClick = (notificationId) => {
    // Update notification priority based on user interaction
    setNotificationPriority(prev => ({
      ...prev,
      [notificationId]: (prev[notificationId] || 0) + 1
    }));

    // Mark notification as read
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  if (loading) {
    return <div className="loading">Loading notifications...</div>;
  }

  if (error) {
    return <div className="error">Error loading notifications: {error}</div>;
  }

  return (
    <div className="notifications-container">
      <h2>Smart Notifications</h2>
      <div className="notifications-list">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`notification-item ${notification.read ? 'read' : 'unread'}`}
            onClick={() => handleNotificationClick(notification.id)}
          >
            <div className="notification-content">
              <h3>{notification.title}</h3>
              <p>{notification.message}</p>
              <div className="notification-meta">
                <span className="priority">
                  Priority: {notificationPriority[notification.id] || 0}
                </span>
                <span className="timestamp">
                  {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;