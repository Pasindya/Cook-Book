import React from 'react';
import { FaCheck } from 'react-icons/fa';
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

function AddNotification({ 
    reminderText, 
    setReminderText, 
    reminderTime, 
    setReminderTime, 
    addNotification 
}) {
    return (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg">
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reminder Message
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
                    Reminder Time
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
                    onClick={addNotification}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                >
                    <FaCheck />
                    Set Reminder
                </button>
            </div>
        </div>
    );
}

export default AddNotification; 