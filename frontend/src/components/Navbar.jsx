import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUserCircle, FaBell, FaTimes, FaCheck } from 'react-icons/fa';
import { NotificationContext } from './NotificationContext';

const ReminderPopup = ({ notification, onDismiss }) => {
  if (!notification) return null;
  return (
    <div className="reminder-popup">
      <h2>⏰ Reminder</h2>
      <p className="reminder-message">It's time for your challenge reminder!</p>
      <div className="reminder-time">
        {new Date(notification.remindAt).toLocaleString([], {
          weekday: 'short', 
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </div>
      <button onClick={onDismiss} className="dismiss-btn">
        Dismiss
      </button>
    </div>
  );
};

const NotificationBell = () => {
  const { 
    notifications, 
    deleteReminder, 
    toggleReadStatus,
    currentReminder,
    dismissReminder
  } = useContext(NotificationContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleDelete = async (reminderId, e) => {
    e.stopPropagation();
    try {
      await deleteReminder(reminderId);
    } catch (error) {
      console.error("Failed to delete reminder:", error);
    }
  };

  const handleToggleRead = (reminderId, e) => {
    e.stopPropagation();
    toggleReadStatus(reminderId);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="notification-bell-container" ref={dropdownRef}>
      <button 
        className="bell-btn"
        onClick={() => setShowDropdown(!showDropdown)}
        aria-label="Notifications"
      >
        <FaBell />
        {notifications.filter(r => !r.read).length > 0 && (
          <span className="badge">
            {notifications.filter(r => !r.read).length}
          </span>
        )}
      </button>
      
      {showDropdown && (
        <div className="dropdown">
          <div className="dropdown-header">
            <h3>Upcoming Reminders ({notifications.length})</h3>
          </div>
          <div className="reminders-list">
            {notifications.length === 0 ? (
              <div className="empty-state">No upcoming reminders</div>
            ) : (
              notifications.map(reminder => (
                <div 
                  key={reminder.id} 
                  className={`reminder-item ${reminder.read ? 'read' : ''}`}
                  onClick={(e) => handleToggleRead(reminder.id, e)}
                >
                  <div className="reminder-content">
                    <div className="reminder-time">
                      {new Date(reminder.remindAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    <div className="reminder-date">
                      {new Date(reminder.remindAt).toLocaleDateString([], {
                        weekday: 'short', 
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="challenge-id">Challenge #{reminder.challengeId}</div>
                  </div>
                  <div className="reminder-controls">
                    <button 
                      className="status-btn"
                      aria-label={reminder.read ? 'Mark unread' : 'Mark read'}
                    >
                      {reminder.read ? <FaCheck /> : <div className="unread-dot" />}
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={(e) => handleDelete(reminder.id, e)}
                      aria-label="Delete reminder"
                    >
                      <FaTimes className="delete-icon" />
                    </button>
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

const Navbar = () => {
  const { currentReminder, dismissReminder } = useContext(NotificationContext);

  return (
    <>
      <nav className="navbar">
        <div className="nav-left">
          <Link to="/" className="brand">
            <img 
              src="/logo.png" 
              alt="Logo" 
              className="logo"
              onError={(e) => e.target.style.display = 'none'}
            />
            Cooking Challenges
          </Link>
        </div>
        
        <div className="nav-right">
          <Link to="/" className="nav-link">
            <FaHome /> Home
          </Link>
          <Link to="/my" className="nav-link">
            My Reminders
          </Link>
          
          <NotificationBell />
          
          <div className="profile-btn">
            <FaUserCircle className="profile-icon" />
            <span>Profile</span>
          </div>
        </div>
      </nav>

      {currentReminder && (
        <ReminderPopup 
          notification={currentReminder}
          onDismiss={dismissReminder}
        />
      )}

      <style jsx>{`
        .navbar {
          background: white;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          padding: 12px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .brand {
          font-size: 1.5rem;
          color: #ff6b6b;
          text-decoration: none;
          font-weight: bold;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .logo {
          height: 36px;
          width: auto;
        }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .nav-link {
          color: #555;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: color 0.3s;
        }

        .nav-link:hover {
          color: #3a86ff;
        }

        .notification-bell-container {
          position: relative;
        }

        .bell-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1.5rem;
          color: #444;
          padding: 8px;
          position: relative;
          transition: transform 0.2s;
        }

        .bell-btn:hover {
          transform: scale(1.1);
        }

        .badge {
          position: absolute;
          top: 0;
          right: 0;
          background: #ff4d4f;
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }

        .dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          width: 320px;
          background: white;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          border-radius: 12px;
          z-index: 1000;
          transform-origin: top right;
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .dropdown-header {
          padding: 16px;
          border-bottom: 1px solid #eee;
        }

        .dropdown-header h3 {
          margin: 0;
          font-size: 16px;
          color: #333;
        }

        .reminders-list {
          max-height: 400px;
          overflow-y: auto;
        }

        .reminder-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          border-bottom: 1px solid #f5f5f5;
          transition: background 0.3s;
        }

        .reminder-item:hover {
          background: #f8f9fa;
        }

        .reminder-content {
          flex: 1;
        }

        .reminder-time {
          font-weight: 600;
          color: #333;
          font-size: 14px;
        }

        .reminder-date {
          font-size: 12px;
          color: #666;
          margin-top: 4px;
        }

        .challenge-id {
          font-size: 12px;
          color: #3a86ff;
          margin-top: 2px;
        }

        .reminder-controls {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .delete-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          color: #999;
          transition: color 0.3s;
        }

        .delete-btn:hover .delete-icon {
          color: #ff4d4f;
        }

        .empty-state {
          padding: 16px;
          text-align: center;
          color: #888;
          font-size: 14px;
        }

        .reminder-popup {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          padding: 32px;
          border-radius: 16px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.2);
          z-index: 2000;
          max-width: 400px;
          width: 90%;
          text-align: center;
        }

        .reminder-popup h2 {
          margin: 0 0 16px;
          color: #ff6b6b;
        }

        .reminder-message {
          margin: 0 0 24px;
          color: #444;
          font-size: 16px;
        }

        .reminder-time {
          color: #3a86ff;
          font-weight: 600;
          margin-bottom: 24px;
          font-size: 18px;
        }

        .dismiss-btn {
          background: #3a86ff;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          transition: background 0.3s;
        }

        .dismiss-btn:hover {
          background: #2b6cd4;
        }

        .status-btn {
          background: none;
          border: none;
          padding: 4px;
          display: flex;
          align-items: center;
        }

        .unread-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #3a86ff;
        }

        .read {
          opacity: 0.6;
          background: #f8f9fa;
        }

        .profile-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #555;
          cursor: pointer;
        }

        .profile-icon {
          font-size: 24px;
        }
      `}</style>
    </>
  );
};

export default Navbar;
