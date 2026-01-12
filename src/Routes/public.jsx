import { Routes, Route } from "react-router-dom";
import { DocumentationPage, HomePage, LoginPage, RegisterPage, Sample, TemplatesPage } from "../Pages/Public";
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
                    <Route path="/template" element={<TemplatesPage />} />
                    <Route path="/documentation" element={<DocumentationPage />} />
                </Route>
            </Routes>
        </PublicLayout>
    );
};

export default PublicRoutes;
