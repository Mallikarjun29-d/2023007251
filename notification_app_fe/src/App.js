import { useState, useEffect } from "react";

const CLIENT_ID = "be18ebf9-1c44-48ca-a3dc-284e4ec385c6";
const CLIENT_SECRET = "VwbDhpZHpnRRFCYN";

async function getToken() {
  const res = await fetch("http://4.224.186.213/evaluation-service/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "mdanashe@gitam.in",
      name: "mallikarjun d",
      rollNo: "2023007251",
      accessCode: "wgKtgZ",
      clientID: CLIENT_ID,
      clientSecret: CLIENT_SECRET
    })
  });
  const data = await res.json();
  return data.access_token;
}

async function sendLog(token, level, message) {
  try {
    await fetch("http://4.224.186.213/evaluation-service/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({
        stack: "frontend",
        level: level,
        package: "handler",
        message: message
      })
    });
  } catch (err) {
    console.error("Log failed:", err);
  }
}

function App() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [viewed, setViewed] = useState([]);
  const [page, setPage] = useState(1);
  const [token, setToken] = useState("");
  const itemsPerPage = 5;

  useEffect(() => {
    getToken().then(t => {
      setToken(t);
      sendLog(t, "info", "App started loading");
      fetch("http://4.224.186.213/evaluation-service/notifications", {
        headers: { "Authorization": "Bearer " + t }
      })
        .then(res => res.json())
        .then(data => {
          setNotifications(data.notifications);
          setLoading(false);
          sendLog(t, "info", "Notifications loaded successfully");
        })
        .catch(() => {
          setLoading(false);
          sendLog(t, "error", "Failed to load notifications");
        });
    });
  }, []);

  function handleClick(id) {
    if (!viewed.includes(id)) {
      setViewed([...viewed, id]);
      sendLog(token, "info", "User viewed notification " + id);
    }
  }

  function handleFilter(type) {
    setFilter(type);
    setPage(1);
    sendLog(token, "info", "User filtered by " + type);
  }

  const filtered = filter === "All"
    ? notifications
    : notifications.filter(n => n.Type === filter);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentItems = filtered.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading notifications...</h2>;
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px", fontFamily: "Arial" }}>
      <h1 style={{ textAlign: "center", color: "#1976d2" }}>Campus Notifications</h1>

      <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "20px", flexWrap: "wrap" }}>
        {["All", "Event", "Result", "Placement"].map(type => (
          <button
            key={type}
            onClick={() => handleFilter(type)}
            style={{
              padding: "8px 20px",
              backgroundColor: filter === type ? "#1976d2" : "#e0e0e0",
              color: filter === type ? "white" : "black",
              border: "none",
              borderRadius: "20px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            {type}
          </button>
        ))}
      </div>

      {currentItems.map(n => (
        <div
          key={n.ID}
          onClick={() => handleClick(n.ID)}
          style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "15px",
            marginBottom: "12px",
            backgroundColor: viewed.includes(n.ID) ? "#f5f5f5" : "#e3f2fd",
            borderLeft: viewed.includes(n.ID) ? "5px solid gray" : "5px solid #1976d2",
            cursor: "pointer"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0, color: "#1976d2" }}>{n.Type}</h3>
            <span style={{
              backgroundColor: viewed.includes(n.ID) ? "gray" : "green",
              color: "white",
              padding: "3px 10px",
              borderRadius: "12px",
              fontSize: "12px"
            }}>
              {viewed.includes(n.ID) ? "Viewed" : "New"}
            </span>
          </div>
          <p style={{ margin: "10px 0 5px" }}>{n.Message}</p>
          <p style={{ margin: 0, fontSize: "12px", color: "#999" }}>{n.Timestamp}</p>
        </div>
      ))}

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "15px", marginTop: "20px" }}>
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          style={{
            padding: "8px 20px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            cursor: page === 1 ? "not-allowed" : "pointer",
            backgroundColor: page === 1 ? "#f0f0f0" : "white"
          }}
        >
          Previous
        </button>
        <span style={{ fontWeight: "bold" }}>Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          style={{
            padding: "8px 20px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            cursor: page === totalPages ? "not-allowed" : "pointer",
            backgroundColor: page === totalPages ? "#f0f0f0" : "white"
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default App;