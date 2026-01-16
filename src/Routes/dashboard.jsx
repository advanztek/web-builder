import { Routes, Route } from "react-router-dom";
import Dashboard from "../Components/Dashboard";
import DashboardLayout from "../Layout/DashboardLayout";
import { EditorPage } from "../Pages/Dashboard";

const DashboardRoutes = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<Dashboard />} />

        <Route path="editor/:id" element={<EditorPage />} />
      </Routes>
    </DashboardLayout>
  );
};

export default DashboardRoutes;
