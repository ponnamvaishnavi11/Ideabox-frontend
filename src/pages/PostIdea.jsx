import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function PostIdea() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    tags: "",
    skillsNeeded: "",
    type: "ACADEMIC",
  });
  const [roughText, setRoughText] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessage, setAiMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImprove = async () => {
    setError("");
    setAiMessage("");
    if (!roughText.trim()) {
      setError("Type your rough idea in the AI box first");
      return;
    }
    setAiLoading(true);
    try {
      const res = await api.post("/ai/improve-idea", { roughText });
      setForm({
        ...form,
        title: res.data.title,
        description: res.data.description,
        tags: res.data.tags,
        skillsNeeded: res.data.skillsNeeded,
      });
      setAiMessage("AI filled the form below. Check it and edit anything you like.");
    } catch (err) {
      setError(err.response?.data?.message || "AI could not help right now. Fill the form by hand.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/ideas", form);
      navigate(`/ideas/${res.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not post the idea");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 620, margin: "0 auto" }}>
      <div className="card" style={{ background: "#e8eaf6" }}>
        <h3 style={{ color: "#1a237e", marginBottom: 6 }}>✨ AI Idea Assistant</h3>
        <p className="muted">
          Write your rough idea in one or two lines. AI will write the title, description,
          tags and skills for you.
        </p>
        <textarea
          style={{ minHeight: 70, marginTop: 8 }}
          placeholder="e.g. an app for students to find study partners"
          value={roughText}
          onChange={(e) => setRoughText(e.target.value)}
        />
        <button type="button" className="btn" onClick={handleImprove} disabled={aiLoading}>
          {aiLoading ? "AI is thinking..." : "Improve with AI"}
        </button>
        {aiMessage && <div className="success">{aiMessage}</div>}
      </div>

      <div className="card">
        <h2 style={{ color: "#1a237e", marginBottom: 8 }}>Post an Idea</h2>
        <form onSubmit={handleSubmit}>
          <label>Title</label>
          <input name="title" value={form.title} onChange={handleChange} required />

          <label>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} required />

          <label>Skills needed (comma separated)</label>
          <input
            name="skillsNeeded"
            placeholder="React, Java, UI design"
            value={form.skillsNeeded}
            onChange={handleChange}
          />

          <label>Tags (comma separated)</label>
          <input
            name="tags"
            placeholder="education, web"
            value={form.tags}
            onChange={handleChange}
          />

          <label>Type</label>
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="HACKATHON">Hackathon</option>
            <option value="ACADEMIC">Academic</option>
            <option value="PERSONAL">Personal</option>
          </select>

          {error && <div className="error">{error}</div>}
          <button className="btn" disabled={loading}>
            {loading ? "Posting..." : "Post Idea"}
          </button>
        </form>
      </div>
    </div>
  );
}