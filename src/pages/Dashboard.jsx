import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function Dashboard() {
  const [myIdeas, setMyIdeas] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const ideasRes = await api.get("/ideas/my");
        setMyIdeas(ideasRes.data);
        const reqRes = await api.get("/requests/my");
        setMyRequests(reqRes.data);
      } catch (err) {
        setError("Could not load your dashboard");
      }
    };
    load();
  }, []);

  return (
    <div>
      <h2 style={{ color: "#1a237e", marginBottom: 14 }}>Dashboard</h2>
      {error && <div className="error">{error}</div>}

      <div className="card">
        <h3 style={{ marginBottom: 8 }}>My ideas</h3>
        {myIdeas.length === 0 && (
          <p className="muted">
            You haven't posted any ideas yet. <Link className="link" to="/post">Post one</Link>
          </p>
        )}
        {myIdeas.map((idea) => (
          <div key={idea.id} style={{ padding: "10px 0", borderBottom: "1px solid #eee" }}>
            <Link className="link" to={`/ideas/${idea.id}`}>{idea.title}</Link>{" "}
            <span className="badge">{idea.type}</span>
            <span className={`badge ${idea.status}`}>{idea.status.replace("_", " ")}</span>
            <p className="muted">Open the idea to see and manage join requests.</p>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 style={{ marginBottom: 8 }}>Ideas I asked to join</h3>
        {myRequests.length === 0 && <p className="muted">You haven't sent any join requests yet.</p>}
        {myRequests.map((r) => (
          <div key={r.id} style={{ padding: "10px 0", borderBottom: "1px solid #eee" }}>
            <Link className="link" to={`/ideas/${r.idea.id}`}>{r.idea.title}</Link>{" "}
            <span className={`badge ${r.status}`}>{r.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}