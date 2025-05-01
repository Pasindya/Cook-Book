import React from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

function UpdateNotification({ 
    reminderText, 
    setReminderText, 
    reminderTime, 
    setReminderTime, 
    updateNotification,
    cancelEditing,
    editingNotification 
}) {
    return (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg">
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Update Reminder Message
                </label>
                <input
                    type="text"
                    value={reminderText}
                    onChange={(e) => setReminderText(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your reminder message"
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Update Reminder Time
                </label>
                <DateTimePicker
                    onChange={setReminderTime}
                    value={reminderTime}
                    className="w-full"
                    minDate={new Date()}
                />
            </div>
            <div className="flex gap-2">
                <button
                    onClick={() => updateNotification(editingNotification)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                >
                    <FaCheck />
                    Update Reminder
                </button>
                <button
                    onClick={cancelEditing}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                >
                    <FaTimes />
                    Cancel
                </button>
            </div>
        </div>
    );
}

export default UpdateNotification; 