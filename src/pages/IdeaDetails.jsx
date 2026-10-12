import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function IdeaDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [idea, setIdea] = useState(null);
  const [team, setTeam] = useState([]);
  const [requests, setRequests] = useState([]);
  const [myRequest, setMyRequest] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const isOwner = idea && user && idea.owner.id === user.id;

  const loadAll = async () => {
    try {
      const ideaRes = await api.get(`/ideas/${id}`);
      setIdea(ideaRes.data);

      const teamRes = await api.get(`/ideas/${id}/team`);
      setTeam(teamRes.data);

      if (ideaRes.data.owner.id === user.id) {
        const reqRes = await api.get(`/ideas/${id}/requests`);
        setRequests(reqRes.data);
      } else {
        const mine = await api.get("/requests/my");
        setMyRequest(mine.data.find((r) => r.idea.id === ideaRes.data.id) || null);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Could not load this idea");
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line
  }, [id]);

  const handleJoin = async () => {
    setMessage("");
    setError("");
    try {
      await api.post(`/ideas/${id}/join`);
      setMessage("Join request sent!");
      loadAll();
    } catch (err) {
      setError(err.response?.data?.message || "Could not send request");
    }
  };

  const handleDecision = async (requestId, action) => {
    setError("");
    try {
      await api.put(`/requests/${requestId}/${action}`);
      loadAll();
    } catch (err) {
      setError(err.response?.data?.message || "Action failed");
    }
  };

  const handleStatusChange = async (newStatus) => {
    setError("");
    try {
      await api.put(`/ideas/${id}`, {
        title: idea.title,
        description: idea.description,
        tags: idea.tags,
        skillsNeeded: idea.skillsNeeded,
        type: idea.type,
        status: newStatus,
      });
      loadAll();
    } catch (err) {
      setError(err.response?.data?.message || "Could not change status");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this idea?")) return;
    try {
      await api.delete(`/ideas/${id}`);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete");
    }
  };

  if (error && !idea) return <div className="error">{error}</div>;
  if (!idea) return <p className="muted">Loading...</p>;

  return (
    <div>
      <div className="card">
        <div style={{ marginBottom: 8 }}>
          <span className="badge">{idea.type}</span>
          <span className={`badge ${idea.status}`}>{idea.status.replace("_", " ")}</span>
        </div>
        <h2 style={{ color: "#1a237e", marginBottom: 8 }}>{idea.title}</h2>
        <p style={{ marginBottom: 12, whiteSpace: "pre-wrap" }}>{idea.description}</p>
        {idea.skillsNeeded && <p><b>Skills needed:</b> {idea.skillsNeeded}</p>}
        {idea.tags && <p><b>Tags:</b> {idea.tags}</p>}
        <p className="muted" style={{ marginTop: 10 }}>
          Posted by {idea.owner.name} ({idea.owner.skills || "no skills listed"})
        </p>

        {error && <div className="error">{error}</div>}
        {message && <div className="success">{message}</div>}

        {/* Join button for non-owners */}
        {!isOwner && !myRequest && idea.status !== "COMPLETED" && (
          <button className="btn" onClick={handleJoin}>Request to Join</button>
        )}
        {!isOwner && myRequest && (
          <p style={{ marginTop: 14 }}>
            Your request: <span className={`badge ${myRequest.status}`}>{myRequest.status}</span>
          </p>
        )}

        {/* Owner controls */}
        {isOwner && (
          <div style={{ marginTop: 16 }}>
            <label>Change status</label>
            <select
              value={idea.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              style={{ maxWidth: 220 }}
            >
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
            <button className="btn btn-red" onClick={handleDelete}>Delete idea</button>
          </div>
        )}
      </div>

      {/* Team */}
      <div className="card">
        <h3 style={{ marginBottom: 8 }}>Team members</h3>
        {team.length === 0 && <p className="muted">No one has joined yet.</p>}
        {team.map((member) => (
          <p key={member.id}>
            👤 {member.name} <span className="muted">({member.skills || "no skills listed"})</span>
          </p>
        ))}
      </div>

      {/* Requests, owner only */}
      {isOwner && (
        <div className="card">
          <h3 style={{ marginBottom: 8 }}>Join requests</h3>
          {requests.length === 0 && <p className="muted">No requests yet.</p>}
          {requests.map((r) => (
            <div key={r.id} style={{ padding: "10px 0", borderBottom: "1px solid #eee" }}>
              <p>
                <b>{r.requester.name}</b>{" "}
                <span className="muted">({r.requester.skills || "no skills listed"})</span>{" "}
                <span className={`badge ${r.status}`}>{r.status}</span>
              </p>
              {r.status === "PENDING" && (
                <div style={{ marginTop: 8 }}>
                  <button className="btn btn-green btn-small" onClick={() => handleDecision(r.id, "accept")}>Accept</button>
                  <button className="btn btn-red btn-small" onClick={() => handleDecision(r.id, "reject")}>Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}