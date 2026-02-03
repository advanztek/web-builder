import { Routes, Route } from "react-router-dom";
import Dashboard from "../Components/Dashboard";
import DashboardLayout from "../Layout/DashboardLayout";
import { BuyCreditsPage, CheckoutPage, CouponPage, EditorPage, CreditPackagesPage, TransactionHistoryPage, CreditValueManagement } from "../Pages/Dashboard";
import PromptsPage from "../Pages/Dashboard/Prompts";
import ProfilePage from "../Pages/Dashboard/Profile";
import CouponForm from "../Pages/Dashboard/Coupon/CouponForm";
import ProtectedRoute from "../Utils/ProtectedRoutes";
import { CreatePackage } from "../Pages/Dashboard/CreditPackages/CreateCreditPackages";
import { EditPackage } from "../Pages/Dashboard/CreditPackages/EditCreditPackages";
import { ViewPackage } from "../Pages/Dashboard/CreditPackages/ViewCreditPackages";

const DashboardRoutes = () => {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="credits" element={<BuyCreditsPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="transactions" element={<TransactionHistoryPage />} />

        <Route
          path="coupons"
          element={
            <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
              <CouponPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="coupons/create"
          element={
            <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
              <CouponForm mode="create" />
            </ProtectedRoute>
          }
        />
        <Route
          path="coupons/edit/:id"
          element={
            <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
              <CouponForm mode="edit" />
            </ProtectedRoute>
          }
        />
        <Route
          path="coupons/view/:id"
          element={
            <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
              <CouponForm mode="view" />
            </ProtectedRoute>
          }
        />
        <Route
          path="credit-packages"
          element={
            <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
              <CreditPackagesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="credit-packages/create"
          element={
            <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
              <CreatePackage />
            </ProtectedRoute>
          }
        />
        <Route
          path="credit-packages/edit/:id"
          element={
            <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
              <EditPackage />
            </ProtectedRoute>
          }
        />
        <Route
          path="credit-packages/view/:id"
          element={
            <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
              <ViewPackage />
            </ProtectedRoute>
          }
        />
        <Route
          path="credit-value"
          element={
            <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
              <CreditValueManagement />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="editor/:slug" element={<EditorPage />} />
      <Route path="prompts" element={<PromptsPage />} />
    </Routes>
  );
};

export default DashboardRoutes;