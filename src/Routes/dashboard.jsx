import { Routes, Route } from "react-router-dom";
import Dashboard from "../Components/Dashboard";
import DashboardLayout from "../Layout/DashboardLayout";
import { EditorPage } from "../Pages/Dashboard";
import PromptsPage from "../Pages/Dashboard/Prompts";

const DashboardRoutes = () => {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="editor/:slug" element={<EditorPage />} />
      </Route>

      <Route path="prompts/:slug" element={<PromptsPage />} />
    </Routes>
  );
};

export default DashboardRoutes;