import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";


import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";


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
// Projects
// =====================
import Projects from "../features/projects/pages/Projects";
import ProjectDetails from "../features/projects/pages/ProjectDetails";


// =====================
// PMS
// =====================
import ProjectSchedule from "../features/pms/pages/ProjectSchedule";


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
import {
  Procurement,
} from "../features/procurement";

import ProcurementDashboard
from "../features/procurement/pages/ProcurementDashboard";


// =====================
// Documents
// =====================
import Documents from "../features/documents/pages/Documents";


// =====================
// Materials
// =====================
import Materials from "../features/materials/pages/Materials";


// =====================
// Vendors
// =====================
import Vendors from "../features/vendors/pages/Vendors";


// =====================
// Reports
// =====================
import Reports from "../features/reports/pages/Reports";


// =====================
// Project Setup
// =====================
import ProjectSetup from "../features/setup/pages/ProjectSetup";



export default function AppRoutes() {

  return (

    <BrowserRouter>

      <Routes>


        <Route

          path="/"

          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }

        >


          <Route

            index

            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }

          />



          {/* Dashboard */}

          <Route

            path="dashboard"

            element={<Dashboard />}

          />



          {/* Companies */}

          <Route

            path="companies"

            element={<Companies />}

          />


          <Route

            path="companies/:id"

            element={<CompanyDetails />}

          />



          {/* Projects */}

          <Route

            path="projects"

            element={<Projects />}

          />


          <Route

            path="projects/:id"

            element={<ProjectDetails />}

          />


          <Route

            path="projects/:id/schedule"

            element={<ProjectSchedule />}

          />



          {/* Project Setup */}

          <Route

            path="setup"

            element={<ProjectSetup />}

          />



          {/* Cost Control */}

          <Route

            path="cost-control"

            element={<CostControl />}

          />



          {/* Warehouse */}

          <Route

            path="warehouse"

            element={<WarehousePage />}

          />


          <Route

            path="warehouse/dashboard"

            element={<WarehouseDashboard />}

          />


          <Route

            path="warehouse/stock"

            element={<StockPage />}

          />


          <Route

            path="warehouse/reorder"

            element={<ReorderPage />}

          />



          {/* Procurement */}

          <Route

            path="procurement"

            element={<Procurement />}

          />


          <Route

            path="procurement/dashboard"

            element={<ProcurementDashboard />}

          />



          {/* Materials */}

          <Route

            path="materials"

            element={<Materials />}

          />



          {/* Vendors */}

          <Route

            path="vendors"

            element={<Vendors />}

          />



          {/* Documents */}

          <Route

            path="documents"

            element={<Documents />}

          />



          {/* Reports */}

          <Route

            path="reports"

            element={<Reports />}

          />


        </Route>



        {/* 404 */}

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