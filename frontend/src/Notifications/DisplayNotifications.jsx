import React from 'react';
import { FaBell, FaBellSlash, FaEdit, FaTrash, FaCalendarAlt, FaClock } from 'react-icons/fa';

function DisplayNotifications({ 
    notifications, 
    viewMode, 
    toggleNotificationStatus, 
    startEditing, 
    deleteNotification 
}) {
    const filteredNotifications = notifications.filter(notification => {
        if (viewMode === 'active') return notification.isActive;
        if (viewMode === 'completed') return !notification.isActive;
        return true;
    });

    return (
        <div className="space-y-4">
            {filteredNotifications.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No reminders found</p>
            ) : (
                filteredNotifications.map(notification => (
                    <div
                        key={notification.id}
                        className={`flex justify-between items-center p-4 rounded-lg border ${
                            notification.isActive ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50'
                        }`}
                    >
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <p className="font-medium text-gray-800">{notification.text}</p>
                                {notification.updatedAt && (
                                    <span className="text-xs text-gray-500">(edited)</span>
                                )}
                            </div>
                            <div className="flex items-center gap-4 mt-1">
                                <div className="flex items-center text-sm text-gray-500">
                                    <FaCalendarAlt className="mr-1" />
                                    {new Date(notification.time).toLocaleDateString()}
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                    <FaClock className="mr-1" />
                                    {new Date(notification.time).toLocaleTimeString()}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => toggleNotificationStatus(notification)}
                                className={`p-2 rounded-full ${
                                    notification.isActive 
                                        ? 'text-blue-500 hover:bg-blue-100' 
                                        : 'text-gray-400 hover:bg-gray-100'
                                }`}
                                title={notification.isActive ? 'Deactivate' : 'Reactivate'}
                            >
                                {notification.isActive ? <FaBell /> : <FaBellSlash />}
                            </button>
                            <button
                                onClick={() => startEditing(notification)}
                                className="p-2 text-green-500 hover:bg-green-100 rounded-full"
                                title="Edit"
                            >
                                <FaEdit />
                            </button>
                            <button
                                onClick={() => deleteNotification(notification.id)}
                                className="p-2 text-red-500 hover:bg-red-100 rounded-full"
                                title="Delete"
                            >
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default DisplayNotifications; 