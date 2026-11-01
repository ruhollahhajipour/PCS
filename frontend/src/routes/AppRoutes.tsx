import {
  lazy,
  Suspense,
  type ComponentType,
  type LazyExoticComponent,
} from "react";

import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";

import { useWorkspace } from "../context/WorkspaceContext";

// Keep the application shell eager; load feature pages only when their route is visited.
const Login = lazy(() => import("../pages/Login"));
const ChangePassword = lazy(() => import("../pages/ChangePassword"));
const Dashboard = lazy(() => import("../features/dashboard/pages/Dashboard"));
const Companies = lazy(() => import("../features/companies/pages/Companies"));
const CompanyDetails = lazy(() => import("../features/companies/pages/CompanyDetails"));
const Plants = lazy(() => import("../features/plants/pages/Plants"));
const Projects = lazy(() => import("../features/projects/pages/Projects"));
const ProjectDetails = lazy(() => import("../features/projects/pages/ProjectDetails"));
const ProjectWbs = lazy(() => import("../features/projects/pages/ProjectWbs"));
const ProjectSchedule = lazy(() => import("../features/pms/pages/ProjectSchedule"));
const ProjectSetup = lazy(() => import("../features/setup/pages/ProjectSetup"));
const CostControl = lazy(() => import("../features/cost-control/pages/CostControl"));
const WarehousePage = lazy(() =>
  import("../features/warehouse").then(module => ({ default: module.WarehousePage }))
);
const WarehouseDashboard = lazy(() =>
  import("../features/warehouse").then(module => ({ default: module.WarehouseDashboard }))
);
const StockPage = lazy(() =>
  import("../features/warehouse").then(module => ({ default: module.StockPage }))
);
const ReorderPage = lazy(() =>
  import("../features/warehouse").then(module => ({ default: module.ReorderPage }))
);
const Procurement = lazy(() =>
  import("../features/procurement").then(module => ({ default: module.Procurement }))
);
const ProcurementDashboard = lazy(() =>
  import("../features/procurement/pages/ProcurementDashboard")
);
const Materials = lazy(() => import("../features/materials/pages/Materials"));
const Vendors = lazy(() => import("../features/vendors/pages/Vendors"));
const Documents = lazy(() => import("../features/documents/pages/Documents"));
const Reports = lazy(() => import("../features/reports/pages/Reports"));
const Settings = lazy(() => import("../features/settings/pages/Settings"));
const Administration = lazy(() =>
  import("../features/administration/pages/Administration")
);
const Users = lazy(() => import("../features/administration/pages/Users"));
const RolesPermissions = lazy(() =>
  import("../features/administration/pages/RolesPermissions")
);

type LazyRouteComponent = LazyExoticComponent<ComponentType>;

function LazyPage({ component: Page }: { component: LazyRouteComponent }) {
  return (
    <Suspense
      fallback={
        <div
          role="status"
          aria-live="polite"
          style={{
            minHeight: "35vh",
            display: "grid",
            placeItems: "center",
            color: "#64748B",
          }}
        >
          در حال بارگذاری صفحه…
        </div>
      }
    >
      <Page />
    </Suspense>
  );
}


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
          element={<LazyPage component={Login} />}
        />

        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <LazyPage component={ChangePassword} />
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
            element={<LazyPage component={Dashboard} />}
          />


          {/* ===================================================
              COMPANIES
          =================================================== */}

          <Route
            path="/companies"
            element={<LazyPage component={Companies} />}
          />

          <Route
            path="/companies/:id"
            element={<LazyPage component={CompanyDetails} />}
          />


          {/* ===================================================
              PLANTS
          =================================================== */}

          <Route
            path="/plants"
            element={<LazyPage component={Plants} />}
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
            element={<LazyPage component={Projects} />}
          />

          {/* IMPORTANT:
              Static route must come before /projects/:id
          */}

          <Route
            path="/projects/wbs"
            element={<LazyPage component={ProjectWbs} />}
          />

          <Route
            path="/projects/:id"
            element={<LazyPage component={ProjectDetails} />}
          />

          <Route
            path="/projects/:id/schedule"
            element={<LazyPage component={ProjectSchedule} />}
          />


          {/* ===================================================
              PROJECT SETUP
          =================================================== */}

          <Route
            path="/setup"
            element={<LazyPage component={ProjectSetup} />}
          />


          {/* ===================================================
              COST CONTROL
          =================================================== */}

          <Route
            path="/cost-control"
            element={<LazyPage component={CostControl} />}
          />


          {/* ===================================================
              WAREHOUSE
          =================================================== */}

          <Route
            path="/warehouse"
            element={<LazyPage component={WarehousePage} />}
          />

          <Route
            path="/warehouse/dashboard"
            element={<LazyPage component={WarehouseDashboard} />}
          />

          <Route
            path="/warehouse/stock"
            element={<LazyPage component={StockPage} />}
          />

          <Route
            path="/warehouse/reorder"
            element={<LazyPage component={ReorderPage} />}
          />


          {/* ===================================================
              PROCUREMENT
          =================================================== */}

          <Route
            path="/procurement"
            element={<LazyPage component={Procurement} />}
          />

          <Route
            path="/procurement/dashboard"
            element={<LazyPage component={ProcurementDashboard} />}
          />


          {/* ===================================================
              MATERIALS
          =================================================== */}

          <Route
            path="/materials"
            element={<LazyPage component={Materials} />}
          />


          {/* ===================================================
              VENDORS
          =================================================== */}

          <Route
            path="/vendors"
            element={<LazyPage component={Vendors} />}
          />


          {/* ===================================================
              SETTINGS
          =================================================== */}

          <Route
            path="/settings"
            element={<LazyPage component={Settings} />}
          />


          {/* ===================================================
              ADMINISTRATION
          =================================================== */}

          <Route
            path="/administration"
            element={<LazyPage component={Administration} />}
          />

          <Route
            path="/administration/users"
            element={<LazyPage component={Users} />}
          />

          <Route
            path="/administration/roles"
            element={<LazyPage component={RolesPermissions} />}
          />


          {/* ===================================================
              DOCUMENTS
          =================================================== */}

          <Route
            path="/documents"
            element={<LazyPage component={Documents} />}
          />


          {/* ===================================================
              REPORTS
          =================================================== */}

          <Route
            path="/reports"
            element={<LazyPage component={Reports} />}
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