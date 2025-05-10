import React, { useState, useEffect } from 'react';
import { useNotifications } from '../components/NotificationContext';

export default function ReminderModal({
    open,
    onClose,
    onSet,
    onEdit,
    onDelete,
    reminders,
    challengeId,
    userId
}) {
    const [remindAt, setRemindAt] = useState('');
    const [editingId, setEditingId] = useState(null);
    const { addNotification, fetchNotifications } = useNotifications();

    useEffect(() => {
        setRemindAt('');
        setEditingId(null);
    }, [open]);

    if (!open) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            if (editingId) {
                const updatedReminder = await onEdit(editingId, { remindAt });
                fetchNotifications(); // Refresh notifications
            } else {
                // Create a new reminder
                const newReminder = await onSet({ userId, challengeId, remindAt });
                
                // Add the new reminder to notifications
                if (newReminder && newReminder.id) {
                    addNotification(newReminder);
                }
            }
            
            setRemindAt('');
            setEditingId(null);
        } catch (error) {
            console.error("Error saving reminder:", error);
        }
    };

    const handleEdit = (reminder) => {
        setRemindAt(reminder.remindAt?.slice(0, 16));
        setEditingId(reminder.id);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
                <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
                    onClick={onClose}
                >
                    &times;
                </button>
                <h2 className="text-xl font-semibold mb-4">
                    {editingId ? 'Edit Reminder' : 'Set Reminder'}
                </h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <label className="font-medium">
                        Remind At
                        <input
                            type="datetime-local"
                            className="block w-full border border-gray-300 rounded px-2 py-1 mt-1"
                            value={remindAt}
                            onChange={e => setRemindAt(e.target.value)}
                            required
                        />
                    </label>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                        {editingId ? 'Update Reminder' : 'Set Reminder'}
                    </button>
                </form>
                <div className="mt-6">
                    <h3 className="font-semibold mb-2">Your Reminders</h3>
                    {reminders.length === 0 ? (
                        <div className="text-gray-500">No reminders set for this challenge.</div>
                    ) : (
                        <ul className="space-y-2">
                            {reminders.map(reminder => (
                                <li
                                    key={reminder.id}
                                    className="flex items-center justify-between bg-gray-100 p-2 rounded"
                                >
                                    <span>
                                        {new Date(reminder.remindAt).toLocaleString()}
                                    </span>
                                    <div className="flex gap-2">
                                        <button
                                            className="text-blue-600 hover:underline"
                                            onClick={() => handleEdit(reminder)}
                                            type="button"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="text-red-600 hover:underline"
                                            onClick={() => {
                                                onDelete(reminder.id);
                                                fetchNotifications(); // Refresh notifications after delete
                                            }}
                                            type="button"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}
