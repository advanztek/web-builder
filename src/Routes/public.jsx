import { Routes, Route } from "react-router-dom";
import { DocumentationPage, ForgotPasswordPage, ResetPasswordPage, HomePage, LoginPage, RegisterPage, Sample, TemplatesPage, VerifyEmailPage } from "../Pages/Public";
import PublicLayout from "../Layout/PublicLayout";

const PublicRoutes = () => {
    return (
        <PublicLayout>
            <Routes>
                <Route path="/">
                    <Route index element={<HomePage />} />
                    <Route path="/sample" element={<Sample />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                    <Route path="/verify-email" element={<VerifyEmailPage />} />
                    <Route path="/template" element={<TemplatesPage />} />
                    <Route path="/documentation" element={<DocumentationPage />} />
                </Route>
            </Routes>
        </PublicLayout>
    );
};

export default PublicRoutes;
