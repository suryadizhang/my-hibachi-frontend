import React, { useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8000/api/booking";
const ADMIN_API_KEY = "REPLACE_WITH_YOUR_SECRET"; // Never expose in production frontend!

function AdminPanel() {
  const [mode, setMode] = useState("weekly");
  const [date, setDate] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  const fetchWeekly = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/weekly?start_date=${date}`, {
        headers: { "X-API-KEY": ADMIN_API_KEY }
      });
      setBookings(res.data);
      setError("");
    } catch (e) {
      setError("Unauthorized or error fetching data.");
      setBookings([]);
    }
  };

  const fetchMonthly = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/monthly?year=${year}&month=${month}`, {
        headers: { "X-API-KEY": ADMIN_API_KEY }
      });
      setBookings(res.data);
      setError("");
    } catch (e) {
      setError("Unauthorized or error fetching data.");
      setBookings([]);
    }
  };

  return (
    <div>
      <h2>Admin Booking Panel</h2>
      <div>
        <button onClick={() => setMode("weekly")}>Weekly</button>
        <button onClick={() => setMode("monthly")}>Monthly</button>
      </div>
      {mode === "weekly" && (
        <div>
          <label>Week Start (Monday): </label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} />
          <button onClick={fetchWeekly}>Fetch Weekly Bookings</button>
        </div>
      )}
      {mode === "monthly" && (
        <div>
          <label>Year: </label>
          <input type="number" value={year} onChange={e => setYear(e.target.value)} />
          <label>Month: </label>
          <input type="number" value={month} onChange={e => setMonth(e.target.value)} min="1" max="12" />
          <button onClick={fetchMonthly}>Fetch Monthly Bookings</button>
        </div>
      )}
      {error && <div style={{ color: "red" }}>{error}</div>}
      <table>
        <thead>
          <tr>
            <th>Date</th><th>Time</th><th>Name</th><th>Phone</th><th>Address</th><th>Contact Preference</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(b => (
            <tr key={b.id + b.date}>
              <td>{b.date}</td>
              <td>{b.time_slot}</td>
              <td>{b.name}</td>
              <td>{b.phone}</td>
              <td>{b.address}</td>
              <td>{b.contact_preference}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPanel;