import { Routes, Route } from "react-router-dom";
import DashboardPage from "../pages/dashboard/DashboardPage";
import FormBuilderPage from "../pages/formBuilder/FormBuilderPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import FormViewPage from "../pages/formView/FormViewPage";
import ResultsPage from "../pages/results/ResultsPage";
import ProtectedRoute from "./ProtectedRoute";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}/>
      <Route path="/builder/:id" element={<ProtectedRoute><FormBuilderPage /></ProtectedRoute>}/>
      <Route path="/results/:id" element={<ProtectedRoute><ResultsPage /></ProtectedRoute>}/>
      <Route path="/login" element={<LoginPage />}/>
      <Route  path="/register" element={<RegisterPage />}/>
      <Route path="/f/:slug" element={<FormViewPage />}/>
    </Routes>
  );
};

export default AppRouter;