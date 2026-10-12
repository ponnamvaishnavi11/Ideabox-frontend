import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="card" style={{ maxWidth: 480, margin: "0 auto" }}>
      <h2 style={{ color: "#1a237e", marginBottom: 12 }}>My Profile</h2>
      <p><b>Name:</b> {user.name}</p>
      <p><b>Email:</b> {user.email}</p>
      <p><b>Skills:</b> {user.skills || "Not added"}</p>
    </div>
  );
}