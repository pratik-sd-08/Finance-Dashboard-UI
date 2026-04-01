export default function Sidebar({ page, setPage, role, setRole, darkMode, setDarkMode }) {
  const navItems = [
    { id: "dashboard", label: "Overview", icon: "▦" },
    { id: "transactions", label: "Transactions", icon: "↕" },
    { id: "insights", label: "Insights", icon: "◎" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1>fin<span>track</span></h1>
        <p>personal finance</p>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-btn ${page === item.id ? "active" : ""}`}
            onClick={() => setPage(item.id)}
          >
            <span className="icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="role-select-wrap">
          <label>Active Role</label>
          <select
            className="role-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="viewer">👁 Viewer</option>
            <option value="admin">🔑 Admin</option>
          </select>
        </div>

        <div className="dark-toggle">
          <span>{darkMode ? "🌙 Dark" : "☀ Light"}</span>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode((d) => !d)}
            />
            <span className="toggle-track" />
          </label>
        </div>
      </div>
    </aside>
  );
}
