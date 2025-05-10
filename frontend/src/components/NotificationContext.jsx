import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children, userId = 1 }) => {
  const [notifications, setNotifications] = useState([]);
  const [currentReminder, setCurrentReminder] = useState(null);
  const timeoutIds = useRef([]);

  // Fetch reminders from backend
  const fetchReminders = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/reminders/user/${userId}`);
      const data = await res.json();
      const now = new Date();

      // Only future reminders
      const futureReminders = data
        .filter(r => new Date(r.remindAt) > now)
        .sort((a, b) => new Date(a.remindAt) - new Date(b.remindAt))
        .map(r => ({ ...r, read: r.read || false }));

      setNotifications(futureReminders);
      scheduleReminderPopups(futureReminders);
    } catch (error) {
      console.error("Error fetching reminders:", error);
    }
  }, [userId]);

  // Schedule popups at exact reminder times
  const scheduleReminderPopups = (reminders) => {
    timeoutIds.current.forEach(id => clearTimeout(id));
    timeoutIds.current = [];

    reminders.forEach(reminder => {
      const triggerTime = new Date(reminder.remindAt).getTime();
      const now = Date.now();
      const delay = triggerTime - now;

      if (delay > 0) {
        const timeoutId = setTimeout(() => {
          setCurrentReminder(reminder);
        }, delay);
        timeoutIds.current.push(timeoutId);
      }
    });
  };

  // Delete a reminder
  const deleteReminder = async (reminderId) => {
    try {
      await fetch(`http://localhost:8080/api/reminders/${reminderId}`, {
        method: 'DELETE'
      });
      setNotifications(prev => prev.filter(r => r.id !== reminderId));
    } catch (error) {
      console.error("Error deleting reminder:", error);
      throw error;
    }
  };

  // Toggle read/unread status
  const toggleReadStatus = (reminderId) => {
    setNotifications(prev => prev.map(r => 
      r.id === reminderId ? { ...r, read: !r.read } : r
    ));
  };

  // Add a new notification (for immediate UI update)
  const addNotification = (reminder) => {
    setNotifications(prev => [...prev, { ...reminder, read: false }]);
    scheduleReminderPopups([...notifications, { ...reminder, read: false }]);
  };

  // Dismiss the current popup
  const dismissReminder = () => setCurrentReminder(null);

  useEffect(() => {
    fetchReminders();
    const interval = setInterval(fetchReminders, 30000);
    return () => {
      clearInterval(interval);
      timeoutIds.current.forEach(id => clearTimeout(id));
    };
  }, [fetchReminders]);

  return (
    <NotificationContext.Provider value={{ 
      notifications,
      currentReminder,
      deleteReminder,
      toggleReadStatus,
      addNotification,
      fetchNotifications: fetchReminders,
      dismissReminder
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook for convenience
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
