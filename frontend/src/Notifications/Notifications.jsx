import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaBell, FaTimes } from 'react-icons/fa';
import FavoriteService from '../services/FavoriteService';
import DisplayNotifications from './DisplayNotifications';
import AddNotification from './AddNotification';
import UpdateNotification from './UpdateNotification';

function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [showReminderInput, setShowReminderInput] = useState(false);
    const [reminderTime, setReminderTime] = useState(new Date());
    const [reminderText, setReminderText] = useState('');
    const [hasPermission, setHasPermission] = useState(false);
    const [editingNotification, setEditingNotification] = useState(null);
    const [viewMode, setViewMode] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkNotificationPermission();
        loadNotifications();
    }, []);

    const checkNotificationPermission = async () => {
        if (!("Notification" in window)) {
            toast.error("This browser does not support notifications");
            return;
        }

        if (Notification.permission === "granted") {
            setHasPermission(true);
        } else if (Notification.permission !== "denied") {
            const permission = await Notification.requestPermission();
            setHasPermission(permission === "granted");
        }
    };

    const loadNotifications = async () => {
        try {
            setLoading(true);
            const favorites = await FavoriteService.getAllFavorites();
            const notificationsData = favorites
                .filter(fav => fav.reminderDateTime)
                .map(fav => ({
                    id: fav.id,
                    text: `Reminder for: ${fav.recipeName}`,
                    time: fav.reminderDateTime,
                    isActive: new Date(fav.reminderDateTime) > new Date(),
                    createdAt: fav.reminderDateTime
                }));
            
            setNotifications(notificationsData);
            
            notificationsData.forEach(notification => {
                if (new Date(notification.time) > new Date() && notification.isActive) {
                    scheduleNotification(notification);
                }
            });
        } catch (error) {
            console.error('Error loading notifications:', error);
            toast.error('Failed to load notifications');
        } finally {
            setLoading(false);
        }
    };

    const addNotification = async () => {
        if (!reminderText.trim()) {
            toast.error('Please enter a reminder message');
            return;
        }

        if (reminderTime < new Date()) {
            toast.error('Please select a future time');
            return;
        }

        try {
            const newFavorite = await FavoriteService.addFavorite(
                reminderText,
                reminderTime.toISOString()
            );

            const newNotification = {
                id: newFavorite.id,
                text: `Reminder for: ${newFavorite.recipeName}`,
                time: newFavorite.reminderDateTime,
                isActive: true,
                createdAt: new Date().toISOString()
            };

            setNotifications(prev => [...prev, newNotification]);
            scheduleNotification(newNotification);
            
            setReminderText('');
            setShowReminderInput(false);
            toast.success('Reminder set successfully!');
        } catch (error) {
            console.error('Error adding notification:', error);
            toast.error('Failed to add reminder');
        }
    };

    const updateNotification = async (notification) => {
        if (!reminderText.trim() || !reminderTime) {
            toast.error('Please fill in all fields');
            return;
        }

        if (reminderTime < new Date() && notification.isActive) {
            toast.error('Please select a future time');
            return;
        }

        try {
            await FavoriteService.updateFavoriteReminder(
                notification.id,
                reminderTime.toISOString()
            );

            const updatedNotifications = notifications.map(n => {
                if (n.id === notification.id) {
                    return {
                        ...n,
                        text: reminderText,
                        time: reminderTime.toISOString(),
                        updatedAt: new Date().toISOString()
                    };
                }
                return n;
            });

            setNotifications(updatedNotifications);
            
            if (notification.isActive) {
                scheduleNotification({
                    ...notification,
                    time: reminderTime.toISOString(),
                    text: reminderText
                });
            }

            setEditingNotification(null);
            setReminderText('');
            setReminderTime(new Date());
            toast.success('Reminder updated successfully!');
        } catch (error) {
            console.error('Error updating notification:', error);
            toast.error('Failed to update reminder');
        }
    };

    const deleteNotification = async (id) => {
        try {
            await FavoriteService.removeReminder(id);
            const updatedNotifications = notifications.filter(n => n.id !== id);
            setNotifications(updatedNotifications);
            toast.info('Reminder deleted');
        } catch (error) {
            console.error('Error deleting notification:', error);
            toast.error('Failed to delete reminder');
        }
    };

    const toggleNotificationStatus = async (notification) => {
        try {
            if (notification.isActive) {
                await FavoriteService.removeReminder(notification.id);
            } else {
                await FavoriteService.updateFavoriteReminder(
                    notification.id,
                    new Date(notification.time).toISOString()
                );
            }

            const updatedNotifications = notifications.map(n => {
                if (n.id === notification.id) {
                    return { ...n, isActive: !n.isActive };
                }
                return n;
            });

            setNotifications(updatedNotifications);
            
            if (!notification.isActive) {
                scheduleNotification({ ...notification, isActive: true });
                toast.success('Reminder reactivated');
            } else {
                toast.info('Reminder deactivated');
            }
        } catch (error) {
            console.error('Error toggling notification status:', error);
            toast.error('Failed to update reminder status');
        }
    };

    const scheduleNotification = (notification) => {
        const notificationTime = new Date(notification.time).getTime();
        const now = new Date().getTime();
        const delay = notificationTime - now;

        if (delay > 0) {
            setTimeout(() => {
                if (Notification.permission === "granted") {
                    new Notification("Cook-Book Reminder", {
                        body: notification.text,
                        icon: "/favicon.ico"
                    });
                    
                    setNotifications(prev => 
                        prev.map(n => n.id === notification.id ? { ...n, isActive: false } : n)
                    );
                }
            }, delay);
        }
    };

    const startEditing = (notification) => {
        setEditingNotification(notification);
        setReminderText(notification.text.replace('Reminder for: ', ''));
        setReminderTime(new Date(notification.time));
    };

    const cancelEditing = () => {
        setEditingNotification(null);
        setReminderText('');
        setReminderTime(new Date());
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">Reminders</h1>
                        <div className="flex gap-4">
                            <div className="flex rounded-lg overflow-hidden border border-gray-200">
                                <button
                                    onClick={() => setViewMode('all')}
                                    className={`px-4 py-2 ${viewMode === 'all' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'}`}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => setViewMode('active')}
                                    className={`px-4 py-2 ${viewMode === 'active' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'}`}
                                >
                                    Active
                                </button>
                                <button
                                    onClick={() => setViewMode('completed')}
                                    className={`px-4 py-2 ${viewMode === 'completed' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'}`}
                                >
                                    Completed
                                </button>
                            </div>
                            <button
                                onClick={() => setShowReminderInput(!showReminderInput)}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                            >
                                {showReminderInput ? <FaTimes /> : <FaBell />}
                                {showReminderInput ? 'Cancel' : 'Add Reminder'}
                            </button>
                        </div>
                    </div>

                    {!hasPermission && (
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <FaBell className="text-yellow-400" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-yellow-700">
                                        Please enable notifications to receive reminders.
                                        <button
                                            className="ml-2 text-yellow-700 underline"
                                            onClick={checkNotificationPermission}
                                        >
                                            Enable now
                                        </button>
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {showReminderInput && !editingNotification && (
                        <AddNotification
                            reminderText={reminderText}
                            setReminderText={setReminderText}
                            reminderTime={reminderTime}
                            setReminderTime={setReminderTime}
                            addNotification={addNotification}
                        />
                    )}

                    {editingNotification && (
                        <UpdateNotification
                            reminderText={reminderText}
                            setReminderText={setReminderText}
                            reminderTime={reminderTime}
                            setReminderTime={setReminderTime}
                            updateNotification={updateNotification}
                            cancelEditing={cancelEditing}
                            editingNotification={editingNotification}
                        />
                    )}

                    <DisplayNotifications
                        notifications={notifications}
                        viewMode={viewMode}
                        toggleNotificationStatus={toggleNotificationStatus}
                        startEditing={startEditing}
                        deleteNotification={deleteNotification}
                    />
                </div>
            </div>
        </div>
    );
}

export default Notifications; 