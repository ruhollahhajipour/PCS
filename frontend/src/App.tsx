import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Workspace from "./pages/Workspace";
import Companies from "./pages/Companies";
import Warehouse from "./pages/Warehouse";
import ICAPS from "./pages/ICAPS";

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/workspace" replace />} />

          <Route path="/workspace" element={<Workspace />} />

          <Route path="/companies" element={<Companies />} />

          <Route path="/warehouse" element={<Warehouse />} />

          <Route path="/icaps" element={<ICAPS />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;