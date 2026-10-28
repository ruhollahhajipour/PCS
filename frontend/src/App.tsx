import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";

import Login from "./pages/Login";
import ComingSoon from "./pages/ComingSoon";
import Workspace from "./pages/Workspace";
import Companies from "./pages/Companies";

const placeholders = [
  "plants",
  "projects",
  "cost-control",
  "warehouse",
  "procurement",
  "documents",
  "reports",
  "administration",
];

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Navigate to="/workspace" replace />} />
              <Route path="/workspace" element={<Workspace />} />
              <Route path="/companies" element={<Companies />} />
              {placeholders.map((p) => (
                <Route key={p} path={`/${p}`} element={<ComingSoon />} />
              ))}
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/workspace" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
