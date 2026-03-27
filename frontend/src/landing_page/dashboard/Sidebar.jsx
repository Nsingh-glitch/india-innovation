export default function Sidebar({ open, setOpen, active, setActive }) {
  const menu = [
    { id: "overview", label: "📊 Overview" },
    { id: "alerts", label: "🚨 Alerts" },
    { id: "scripts", label: "🤖 Scripts" },
  ];

  return (
    <div className={`sidebar ${open ? "open" : ""}`}>
      
      <h2 className="logo">LokPulse</h2>

      {menu.map((item) => (
        <div
          key={item.id}
          className={`menu-item ${active === item.id ? "active" : ""}`}
          onClick={() => {
            setActive(item.id);
            setOpen(false);
          }}
        >
          {item.label}
        </div>
      ))}

    </div>
  );
}