import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Workspace from "./pages/Workspace/Workspace";
import Dashboard from "./pages/Dashboard";

import Companies from "./pages/Companies/Companies";
import Plants from "./pages/Plants/Plants";
import Projects from "./pages/Projects/Projects";
import CostControl from "./pages/CostControl/CostControl";
import Warehouse from "./pages/Warehouse/Warehouse";
import Procurement from "./pages/Procurement/Procurement";
import Documents from "./pages/Documents/Documents";
import Reports from "./pages/Reports/Reports";

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/workspace" replace />}
          />

          <Route
            path="/workspace"
            element={<Workspace />}
          />

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/companies"
            element={<Companies />}
          />

          <Route
            path="/plants"
            element={<Plants />}
          />

          <Route
            path="/projects"
            element={<Projects />}
          />

          <Route
            path="/cost-control"
            element={<CostControl />}
          />

          <Route
            path="/warehouse"
            element={<Warehouse />}
          />

          <Route
            path="/procurement"
            element={<Procurement />}
          />

          <Route
            path="/documents"
            element={<Documents />}
          />

          <Route
            path="/reports"
            element={<Reports />}
          />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;