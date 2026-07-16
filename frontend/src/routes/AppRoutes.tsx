import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";

import Dashboard from "../features/dashboard/pages/Dashboard";
import Companies from "../features/companies/pages";
import Plants from "../features/plants/pages/Plants";
import Projects from "../features/projects/pages/Projects";
import Procurement from "../features/procurement/pages/Procurement";
import Warehouse from "../features/warehouse/pages/Warehouse";
import CostControl from "../features/cost-control/pages/CostControl";
import Documents from "../features/documents/pages/Documents";
import Reports from "../features/reports/pages/Reports";

import Login from "../pages/Login";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />

        <Route path="dashboard" element={<Dashboard />} />

        <Route path="companies" element={<Companies />} />
        <Route path="plants" element={<Plants />} />
        <Route path="projects" element={<Projects />} />
        <Route path="procurement" element={<Procurement />} />
        <Route path="warehouse" element={<Warehouse />} />
        <Route path="cost-control" element={<CostControl />} />
        <Route path="documents" element={<Documents />} />
        <Route path="reports" element={<Reports />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}