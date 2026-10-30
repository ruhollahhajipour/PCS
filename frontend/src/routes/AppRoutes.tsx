import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";

import { useWorkspace } from "../context/WorkspaceContext";

import Login from "../pages/Login";
import PreviewMode from "../pages/PreviewMode";
import ChangePassword from "../pages/ChangePassword";

// =====================
// Dashboard
// =====================
import Dashboard from "../features/dashboard/pages/Dashboard";

// =====================
// Companies
// =====================
import Companies from "../features/companies/pages/Companies";
import CompanyDetails from "../features/companies/pages/CompanyDetails";

// =====================
// Plants
// =====================
import Plants from "../features/plants/pages/Plants";

// =====================
// Projects
// =====================
import Projects from "../features/projects/pages/Projects";
import ProjectDetails from "../features/projects/pages/ProjectDetails";
import ProjectWbs from "../features/projects/pages/ProjectWbs";

// =====================
// PMS
// =====================
import ProjectSchedule from "../features/pms/pages/ProjectSchedule";

// =====================
// Project Setup
// =====================
import ProjectSetup from "../features/setup/pages/ProjectSetup";

// =====================
// Cost Control
// =====================
import CostControl from "../features/cost-control/pages/CostControl";

// =====================
// Warehouse
// =====================
import {
  WarehousePage,
  WarehouseDashboard,
  StockPage,
  ReorderPage,
} from "../features/warehouse";

// =====================
// Procurement
// =====================
import { Procurement } from "../features/procurement";
import ProcurementDashboard from
  "../features/procurement/pages/ProcurementDashboard";

// =====================
// Materials
// =====================
import Materials from "../features/materials/pages/Materials";

// =====================
// Vendors
// =====================
import Vendors from "../features/vendors/pages/Vendors";

// =====================
// Documents
// =====================
import Documents from "../features/documents/pages/Documents";

// =====================
// Reports
// =====================
import Reports from "../features/reports/pages/Reports";

// =====================
// Settings
// =====================
import Settings from "../features/settings/pages/Settings";

// =====================
// Administration
// =====================
import Administration from
  "../features/administration/pages/Administration";

import Users from
  "../features/administration/pages/Users";

import RolesPermissions from
  "../features/administration/pages/RolesPermissions";


/* =========================================================
   PMS ENTRY ROUTE

   Sidebar uses /pms as the entry point for
   Schedule & Planning.

   The actual PMS schedule requires a project ID,
   so we resolve the currently selected workspace
   project and redirect to its schedule.
========================================================= */

function PmsEntryRoute() {
  const { workspace } = useWorkspace();

  const projectId =
    workspace.project.id;

  if (!projectId) {
    return (
      <Navigate
        to="/projects"
        replace
      />
    );
  }

  return (
    <Navigate
      to={`/projects/${projectId}/schedule`}
      replace
    />
  );
}


export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =====================================================
            LOGIN
        ===================================================== */}

        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

        <Route
          path="/login"
          element={<Login />}
        />

        {/* Public, isolated, read-only product preview. */}
        <Route
          path="/preview"
          element={<PreviewMode />}
        />

        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          }
        />


        {/* =====================================================
            PROTECTED APPLICATION
        ===================================================== */}

        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >

          {/* ===================================================
              DEFAULT
          =================================================== */}

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />


          {/* ===================================================
              COMPANIES
          =================================================== */}

          <Route
            path="/companies"
            element={<Companies />}
          />

          <Route
            path="/companies/:id"
            element={<CompanyDetails />}
          />


          {/* ===================================================
              PLANTS
          =================================================== */}

          <Route
            path="/plants"
            element={<Plants />}
          />


          {/* ===================================================
              PMS
          =================================================== */}

          <Route
            path="/pms"
            element={<PmsEntryRoute />}
          />


          {/* ===================================================
              PROJECTS
          =================================================== */}

          <Route
            path="/projects"
            element={<Projects />}
          />

          {/* IMPORTANT:
              Static route must come before /projects/:id
          */}

          <Route
            path="/projects/wbs"
            element={<ProjectWbs />}
          />

          <Route
            path="/projects/:id"
            element={<ProjectDetails />}
          />

          <Route
            path="/projects/:id/schedule"
            element={<ProjectSchedule />}
          />


          {/* ===================================================
              PROJECT SETUP
          =================================================== */}

          <Route
            path="/setup"
            element={<ProjectSetup />}
          />


          {/* ===================================================
              COST CONTROL
          =================================================== */}

          <Route
            path="/cost-control"
            element={<CostControl />}
          />


          {/* ===================================================
              WAREHOUSE
          =================================================== */}

          <Route
            path="/warehouse"
            element={<WarehousePage />}
          />

          <Route
            path="/warehouse/dashboard"
            element={<WarehouseDashboard />}
          />

          <Route
            path="/warehouse/stock"
            element={<StockPage />}
          />

          <Route
            path="/warehouse/reorder"
            element={<ReorderPage />}
          />


          {/* ===================================================
              PROCUREMENT
          =================================================== */}

          <Route
            path="/procurement"
            element={<Procurement />}
          />

          <Route
            path="/procurement/dashboard"
            element={<ProcurementDashboard />}
          />


          {/* ===================================================
              MATERIALS
          =================================================== */}

          <Route
            path="/materials"
            element={<Materials />}
          />


          {/* ===================================================
              VENDORS
          =================================================== */}

          <Route
            path="/vendors"
            element={<Vendors />}
          />


          {/* ===================================================
              SETTINGS
          =================================================== */}

          <Route
            path="/settings"
            element={<Settings />}
          />


          {/* ===================================================
              ADMINISTRATION
          =================================================== */}

          <Route
            path="/administration"
            element={<Administration />}
          />

          <Route
            path="/administration/users"
            element={<Users />}
          />

          <Route
            path="/administration/roles"
            element={<RolesPermissions />}
          />


          {/* ===================================================
              DOCUMENTS
          =================================================== */}

          <Route
            path="/documents"
            element={<Documents />}
          />


          {/* ===================================================
              REPORTS
          =================================================== */}

          <Route
            path="/reports"
            element={<Reports />}
          />

        </Route>


        {/* =====================================================
            404
        ===================================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}