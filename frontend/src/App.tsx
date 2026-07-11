function App() {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "Segoe UI",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "260px",
          background: "#0F172A",
          color: "white",
          padding: "20px",
        }}
      >
        <h2>PCS</h2>

        <hr />

        <p>🏠 Dashboard</p>

        <p>📁 Projects</p>

        <p>💰 Cost Control</p>

        <p>📦 Warehouse</p>

        <p>🛒 Procurement</p>

        <p>💵 Finance</p>

        <p>📊 Reports</p>

        <p>📄 Documents</p>
      </div>

      {/* Main */}
      <div
        style={{
          flex: 1,
          background: "#F8FAFC",
          padding: "40px",
        }}
      >
        <h1>Project Control Suite</h1>

        <h3>Enterprise Management System</h3>

        <br />

        <h2>Dashboard</h2>

        <p>Welcome Ruhollah Hajipour</p>

        <p>Version 0.1 Alpha</p>
      </div>
    </div>
  );
}

export default App;