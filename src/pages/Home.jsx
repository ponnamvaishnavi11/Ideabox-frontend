import { useEffect, useState } from "react";
import api from "../api/axios";
import IdeaCard from "../components/IdeaCard";

export default function Home() {
  const [ideas, setIdeas] = useState([]);
  const [filters, setFilters] = useState({
    keyword: "",
    type: "",
    status: "",
    skill: "",
    tag: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadIdeas = async (currentFilters) => {
    setLoading(true);
    setError("");
    try {
      // send only the filters that have a value
      const params = {};
      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value) params[key] = value;
      });
      const res = await api.get("/ideas", { params });
      setIdeas(res.data);
    } catch (err) {
      setError("Could not load ideas. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIdeas(filters);
    // eslint-disable-next-line
  }, []);

  const handleChange = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleSearch = (e) => {
    e.preventDefault();
    loadIdeas(filters);
  };

  const handleClear = () => {
    const empty = { keyword: "", type: "", status: "", skill: "", tag: "" };
    setFilters(empty);
    loadIdeas(empty);
  };

  return (
    <div>
      <h2 style={{ marginBottom: 14, color: "#1a237e" }}>Browse Ideas</h2>

      <form className="card filters" onSubmit={handleSearch}>
        <input
          name="keyword"
          placeholder="Search title or description"
          value={filters.keyword}
          onChange={handleChange}
        />
        <select name="type" value={filters.type} onChange={handleChange}>
          <option value="">All types</option>
          <option value="HACKATHON">Hackathon</option>
          <option value="ACADEMIC">Academic</option>
          <option value="PERSONAL">Personal</option>
        </select>
        <select name="status" value={filters.status} onChange={handleChange}>
          <option value="">All status</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In progress</option>
          <option value="COMPLETED">Completed</option>
        </select>
        <input
          name="skill"
          placeholder="Skill (e.g. React)"
          value={filters.skill}
          onChange={handleChange}
        />
        <input
          name="tag"
          placeholder="Tag (e.g. web)"
          value={filters.tag}
          onChange={handleChange}
        />
        <button className="btn" style={{ marginTop: 0 }}>Search</button>
        <button
          type="button"
          className="btn btn-red"
          style={{ marginTop: 0 }}
          onClick={handleClear}
        >
          Clear
        </button>
      </form>

      {error && <div className="error">{error}</div>}
      {loading && <p className="muted">Loading ideas...</p>}
      {!loading && !error && ideas.length === 0 && (
        <p className="muted">No ideas found.</p>
      )}

      <div className="grid">
        {ideas.map((idea) => (
          <IdeaCard key={idea.id} idea={idea} />
        ))}
      </div>
    </div>
  );
}