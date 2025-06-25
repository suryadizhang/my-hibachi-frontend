import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:8000/api/booking";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      const form = new FormData();
      form.append("username", username);
      form.append("password", password);
      const res = await axios.post(`${API_BASE}/token`, form, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      localStorage.setItem("adminToken", res.data.access_token);
      navigate("/admin");
    } catch (err) {
      setErrorMsg("Invalid credentials or server error.");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto" }}>
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label><br />
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} required />
        </div>
        <div style={{ marginTop: 12 }}>
          <label>Password:</label><br />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button style={{ marginTop: 16 }} type="submit">Log In</button>
        {errorMsg && <div style={{ color: "red", marginTop: 8 }}>{errorMsg}</div>}
      </form>
    </div>
  );
}

export default AdminLogin;