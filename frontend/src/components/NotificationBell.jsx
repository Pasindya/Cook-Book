import React, { useState, useEffect, useRef } from 'react';
import { FaBell, FaClock, FaCheck } from 'react-icons/fa';

const NotificationBell = ({ userId = 1 }) => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);
  
  // Fetch all reminders for the user
  const fetchReminders = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/reminders/user/${userId}`);
      const data = await res.json();
      
      // Process reminders to create notification items
      const notificationItems = data.map(reminder => ({
        id: reminder.id,
        challengeId: reminder.challengeId,
        message: `Reminder at ${new Date(reminder.remindAt).toLocaleString()}`,
        time: new Date(reminder.remindAt),
        read: false,
        type: 'reminder'
      }));
      
      setNotifications(notificationItems);
      setUnreadCount(notificationItems.filter(n => !n.read).length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Initial fetch of reminders
  useEffect(() => {
    fetchReminders();
    
    // Setup interval to check for reminders every minute
    const intervalId = setInterval(() => {
      fetchReminders();
    }, 60000);
    
    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [userId]);
  
  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  // Mark notification as read
  const markAsRead = async (notificationId) => {
    // For a real implementation, you would update the read status in your backend
    setNotifications(notifications.map(n => 
      n.id === notificationId ? {...n, read: true} : n
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };
  
  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({...n, read: true})));
    setUnreadCount(0);
  };
  
  // Format time to show how long ago
  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffDay > 0) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
    if (diffHour > 0) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
    if (diffMin > 0) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    return 'Just now';
  };
  
  return (
    <div className="notification-bell-container" style={{ position: 'relative' }}>
      <button 
        onClick={() => setShowDropdown(!showDropdown)}
        style={{
          background: 'none',
          border: 'none',
          position: 'relative',
          cursor: 'pointer',
          fontSize: '1.5rem',
          color: '#444',
          padding: '8px'
        }}
      >
        <FaBell />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '0',
            right: '0',
            background: '#ff4d4f',
            color: 'white',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold'
          }}>
            {unreadCount}
          </span>
        )}
      </button>
      
      {showDropdown && (
        <div 
          ref={dropdownRef}
          style={{
            position: 'absolute',
            top: '100%',
            right: '0',
            width: '320px',
            maxHeight: '400px',
            overflow: 'auto',
            background: 'white',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            borderRadius: '8px',
            zIndex: 1000
          }}
        >
          <div style={{
            padding: '12px 16px',
            borderBottom: '1px solid #eee',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#3a86ff',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Mark all as read
              </button>
            )}
          </div>
          
          <div>
            {notifications.length === 0 ? (
              <div style={{ padding: '16px', textAlign: 'center', color: '#888' }}>
                No notifications
              </div>
            ) : (
              notifications.map(notification => (
                <div 
                  key={notification.id}
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid #f0f0f0',
                    backgroundColor: notification.read ? 'white' : '#f6f8ff',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s'
                  }}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: '#edf2ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#3a86ff'
                    }}>
                      <FaClock />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: notification.read ? 'normal' : 'bold' }}>
                        {notification.message}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: '#888',
                        marginTop: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                        <span>{formatTimeAgo(notification.time)}</span>
                        {notification.read && <FaCheck color="#4CAF50" size={12} />}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
