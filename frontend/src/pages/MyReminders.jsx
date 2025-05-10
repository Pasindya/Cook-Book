import React, { useState, useEffect } from "react";
import { useNotifications } from "../components/NotificationContext";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

export default function MyReminders({ userId = 1 }) {
  const [reminders, setReminders] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");
  const [loading, setLoading] = useState(true);
  const { deleteReminder } = useNotifications();

  useEffect(() => {
    fetchReminders();
    // eslint-disable-next-line
  }, [userId]);

  const fetchReminders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/api/reminders/user/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch reminders");
      const data = await res.json();
      setReminders(data);
    } catch (err) {
      console.error("Error fetching reminders:", err);
      setReminders([]);
    }
    setLoading(false);
  };

  // Chart data: group reminders by date
  const chartData = React.useMemo(() => {
    const dateMap = {};
    reminders.forEach(rem => {
      const date = new Date(rem.remindAt).toISOString().slice(0, 10);
      dateMap[date] = (dateMap[date] || 0) + 1;
    });
    // Sorted by date
    return Object.entries(dateMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({
        date: new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        count
      }));
  }, [reminders]);

  // Total reminders
  const totalReminders = reminders.length;

  const handleEdit = async (reminderId) => {
    const remindAt = `${editDate}T${editTime}:00`;
    try {
      const response = await fetch(`http://localhost:8080/api/reminders/${reminderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...reminders.find(r => r.id === reminderId),
          remindAt: new Date(remindAt).toISOString()
        })
      });

      if (!response.ok) throw new Error("Failed to update reminder");

      const updatedReminder = await response.json();
      setReminders(prev =>
        prev.map(r => r.id === reminderId ? updatedReminder : r)
      );
      setEditingId(null);
    } catch (err) {
      console.error("Error updating reminder:", err);
    }
  };

  const handleDelete = async (reminderId) => {
    try {
      await fetch(`http://localhost:8080/api/reminders/${reminderId}`, {
        method: "DELETE"
      });
      setReminders(prev => prev.filter(r => r.id !== reminderId));
    } catch (err) {
      console.error("Error deleting reminder:", err);
    }
  };

  const startEdit = (reminder) => {
    const dt = new Date(reminder.remindAt);
    setEditDate(dt.toISOString().split('T')[0]);
    setEditTime(dt.toTimeString().slice(0, 5));
    setEditingId(reminder.id);
  };

  return (
    <div style={{
      maxWidth: 900,
      margin: "40px auto",
      padding: "0 20px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <h2 style={{
        textAlign: "center",
        marginBottom: 24,
        color: "#3a86ff",
        fontWeight: 700
      }}>
        Reminders Dashboard
      </h2>

      {/* Dashboard Cards */}
      <div style={{
        display: "flex",
        gap: 32,
        justifyContent: "center",
        marginBottom: 32,
        flexWrap: "wrap"
      }}>
        <div style={{
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 2px 12px rgba(58,134,255,0.08)",
          padding: 32,
          minWidth: 220,
          textAlign: "center"
        }}>
          <div style={{ fontSize: 32, color: "#3a86ff", fontWeight: 800 }}>
            {totalReminders}
          </div>
          <div style={{ color: "#555", marginTop: 8, fontWeight: 500 }}>
            Total Reminders
          </div>
        </div>
      </div>

      {/* Line Chart */}
      <div style={{
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 2px 12px rgba(58,134,255,0.08)",
        padding: 32,
        marginBottom: 40
      }}>
        <h3 style={{ color: "#3a86ff", marginBottom: 16, fontWeight: 600 }}>Reminders Per Day</h3>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke="#3a86ff" />
              <YAxis allowDecimals={false} stroke="#3a86ff" />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#3a86ff" strokeWidth={3} dot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ color: "#888", textAlign: "center" }}>No data to display.</div>
        )}
      </div>

      {/* Reminders List */}
      <h3 style={{
        textAlign: "center",
        marginBottom: 16,
        color: "#3a86ff",
        fontWeight: 600
      }}>All Reminders</h3>
      {loading ? (
        <div style={{ textAlign: "center", color: "#888" }}>
          Loading reminders...
        </div>
      ) : reminders.length === 0 ? (
        <div style={{ textAlign: "center", color: "#888" }}>
          No reminders set.
        </div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {reminders.map(rem => (
            <li
              key={rem.id}
              style={{
                background: "#f8f9fa",
                borderRadius: 10,
                marginBottom: 18,
                padding: 18,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "0 2px 8px rgba(58,134,255,0.04)"
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: "#333" }}>
                  {rem.challengeId ? `Challenge ${rem.challengeId}` : "General Reminder"}
                </div>
                <div style={{ color: "#555", marginTop: 6 }}>
                  {editingId === rem.id ? (
                    <div style={{ display: "flex", gap: 8 }}>
                      <input
                        type="date"
                        value={editDate}
                        onChange={e => setEditDate(e.target.value)}
                        style={{ padding: 6 }}
                      />
                      <input
                        type="time"
                        value={editTime}
                        onChange={e => setEditTime(e.target.value)}
                        style={{ padding: 6 }}
                      />
                    </div>
                  ) : (
                    <b>
                      {new Date(rem.remindAt).toLocaleString([], {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </b>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                {editingId === rem.id ? (
                  <>
                    <button
                      onClick={() => handleEdit(rem.id)}
                      style={{
                        background: "#3a86ff",
                        color: "#fff",
                        border: "none",
                        borderRadius: 6,
                        padding: "6px 14px",
                        cursor: "pointer"
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      style={{
                        background: "#e9ecef",
                        color: "#333",
                        border: "none",
                        borderRadius: 6,
                        padding: "6px 14px",
                        cursor: "pointer"
                      }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEdit(rem)}
                      style={{
                        background: "#ffb703",
                        color: "#fff",
                        border: "none",
                        borderRadius: 6,
                        padding: "6px 14px",
                        cursor: "pointer"
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(rem.id)}
                      style={{
                        background: "#ff4d4f",
                        color: "#fff",
                        border: "none",
                        borderRadius: 6,
                        padding: "6px 14px",
                        cursor: "pointer"
                      }}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
