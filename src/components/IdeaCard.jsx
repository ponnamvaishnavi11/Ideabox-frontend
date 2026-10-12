import { Link } from "react-router-dom";

export default function IdeaCard({ idea }) {
  return (
    <div className="card">
      <div style={{ marginBottom: 8 }}>
        <span className="badge">{idea.type}</span>
        <span className={`badge ${idea.status}`}>{idea.status.replace("_", " ")}</span>
      </div>
      <h3 style={{ marginBottom: 6 }}>{idea.title}</h3>
      <p className="muted" style={{ marginBottom: 8 }}>
        {idea.description.length > 110
          ? idea.description.slice(0, 110) + "..."
          : idea.description}
      </p>
      {idea.skillsNeeded && (
        <p style={{ fontSize: "0.9rem" }}>
          <b>Skills:</b> {idea.skillsNeeded}
        </p>
      )}
      {idea.tags && (
        <p style={{ fontSize: "0.9rem" }}>
          <b>Tags:</b> {idea.tags}
        </p>
      )}
      <p className="muted" style={{ margin: "8px 0" }}>
        By {idea.owner?.name}
      </p>
      <Link className="link" to={`/ideas/${idea.id}`}>View details →</Link>
    </div>
  );
}