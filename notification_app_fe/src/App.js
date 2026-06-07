import { useState, useEffect } from "react";

const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJtZGFuYXNoZUBnaXRhbS5pbiIsImV4cCI6MTc4MDgxNTAzMCwiaWF0IjoxNzgwODE0MTMwLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiZjQ1Zjk5N2UtN2QzZS00MzY3LWJiYWUtMjI1YTk2MmM5MmU0IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoibWFsbGlrYXJqdW4gZCIsInN1YiI6ImJlMThlYmY5LTFjNDQtNDhjYS1hM2RjLTI4NGU0ZWMzODVjNiJ9LCJlbWFpbCI6Im1kYW5hc2hlQGdpdGFtLmluIiwibmFtZSI6Im1hbGxpa2FyanVuIGQiLCJyb2xsTm8iOiIyMDIzMDA3MjUxIiwiYWNjZXNzQ29kZSI6IndnS3RnWiIsImNsaWVudElEIjoiYmUxOGViZjktMWM0NC00OGNhLWEzZGMtMjg0ZTRlYzM4NWM2IiwiY2xpZW50U2VjcmV0IjoiVndiRGhwWkhwblJSRkNZTiJ9.6ZxDDYeaOZ6X8d-gA18o1wcfuOKZBkHzt5qGMT5Y6vQ";

function App() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
  const [viewed, setViewed] = useState([]);

  useEffect(() => {
    fetch("http://4.224.186.213/evaluation-service/notifications", {
      headers: {
        "Authorization": `Bearer ${ACCESS_TOKEN}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setNotifications(data.notifications);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch notifications");
        setLoading(false);
      });
  }, []);

  const markViewed = (id) => {
    if (!viewed.includes(id)) {
      setViewed([...viewed, id]);
    }
  };

  const filtered = filter === "All"
    ? notifications
    : notifications.filter((n) => n.Type === filter);

  if (loading) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  if (error) return <h2 style={{ textAlign: "center", color: "red" }}>{error}</h2>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px", fontFamily: "Arial" }}>
      <h1 style={{ textAlign: "center", color: "#333" }}>Campus Notifications</h1>

      {/* Filter Buttons */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", justifyContent: "center" }}>
        {["All", "Event", "Result", "Placement"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            style={{
              padding: "8px 16px",
              backgroundColor: filter === type ? "#1976d2" : "#e0e0e0",
              color: filter === type ? "white" : "black",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {filtered.map((n) => (
        <div
          key={n.ID}
          onClick={() => markViewed(n.ID)}
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "15px",
            marginBottom: "10px",
            backgroundColor: viewed.includes(n.ID) ? "#f5f5f5" : "#e3f2fd",
            cursor: "pointer",
            borderLeft: viewed.includes(n.ID) ? "4px solid gray" : "4px solid #1976d2"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h3 style={{ margin: "0", color: "#1976d2" }}>{n.Type}</h3>
            <span style={{
              fontSize: "12px",
              padding: "2px 8px",
              borderRadius: "12px",
              backgroundColor: viewed.includes(n.ID) ? "gray" : "green",
              color: "white"
            }}>
              {viewed.includes(n.ID) ? "Viewed" : "New"}
            </span>
          </div>
          <p style={{ margin: "8px 0" }}>{n.Message}</p>
          <p style={{ margin: "0", fontSize: "12px", color: "#999" }}>{n.Timestamp}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
