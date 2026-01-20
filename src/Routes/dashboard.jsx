import { Routes, Route } from "react-router-dom";
import Dashboard from "../Components/Dashboard";
import DashboardLayout from "../Layout/DashboardLayout";
import { BuyCreditsPage, CheckoutPage, EditorPage } from "../Pages/Dashboard";
import PromptsPage from "../Pages/Dashboard/Prompts";
import ProfilePage from "../Pages/Dashboard/Profile";

const DashboardRoutes = () => {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="editor/:slug" element={<EditorPage />} />
        <Route path="credits" element={<BuyCreditsPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route path="prompts" element={<PromptsPage />} />
    </Routes>
  );
};

export default DashboardRoutes;