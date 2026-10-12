import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "", skills: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/signup", form);
      login(res.data);
      navigate("/");
    } catch (err) {
      const data = err.response?.data;
      setError(data?.message || data?.error || "Signup failed. Check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card form-card">
      <h2>Create account</h2>
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input name="name" value={form.name} onChange={handleChange} required />
        <label>Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} required />
        <label>Password</label>
        <input name="password" type="password" value={form.password} onChange={handleChange} required />
        <label>Your skills (comma separated)</label>
        <input name="skills" placeholder="React, Java, Python" value={form.skills} onChange={handleChange} />
        {error && <div className="error">{error}</div>}
        <button className="btn" disabled={loading}>{loading ? "Please wait..." : "Sign up"}</button>
      </form>
      <p className="muted" style={{ marginTop: 16 }}>
        Already have an account? <Link className="link" to="/login">Login</Link>
      </p>
    </div>
  );
}