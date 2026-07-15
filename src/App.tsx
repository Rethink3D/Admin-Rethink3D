import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ModalProvider } from "./contexts/ModalContext";
import { PageTitleProvider } from "./contexts/PageTitleContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import MainLayout from "./components/layout/MainLayout";
import Modal from "./components/shared/Modal";
import Toast from "./components/shared/Toast";
import { ToastProvider } from "./contexts/ToastContext";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Makers from "./pages/Maker/Makers";
import MakerDetail from "./pages/Maker/MakerDetail";
import Products from "./pages/Products/Products";
import Orders from "./pages/Orders/Orders";
import OrderDetail from "./pages/Orders/OrderDetail";
import ProductDetail from "./pages/Products/ProductDetail";
import Actions from "./pages/Actions/Actions";
import SendEmail from "./pages/Actions/SendEmail/SendEmail";
import Feedbacks from "./pages/Actions/Feedbacks/Feedbacks";
import Categories from "./pages/Actions/Categories/Categories";
import PlatformRules from "./pages/Actions/Rules/PlatformRules";
import SendPush from "./pages/Actions/SendPush/SendPush";
import Devolutions from "./pages/Actions/Devolutions/Devolutions";
import DevolutionAnalysis from "./pages/Actions/Devolutions/DevolutionAnalysis";
import Reports from "./pages/Actions/Reports/Reports";
import MakerPayments from "./pages/Actions/Payments/MakerPayments";
import CustomRequests from "./pages/CustomRequests/CustomRequests";
import CustomRequestDetail from "./pages/CustomRequests/CustomRequestDetail";
import Loading from "./components/shared/Loading";
import "./styles/global.css";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading fullScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <Loading fullScreen />;

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <ThemeProvider>
            <PageTitleProvider>
              <ModalProvider>
                <Routes>
                  <Route
                    path="/login"
                    element={
                      <PublicRoute>
                        <Login />
                      </PublicRoute>
                    }
                  />

                  <Route
                    element={
                      <ProtectedRoute>
                        <MainLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route
                      path="/custom-requests"
                      element={<CustomRequests />}
                    />
                    <Route
                      path="/custom-requests/:id"
                      element={<CustomRequestDetail />}
                    />
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/makers" element={<Makers />} />
                    <Route path="/makers/:id" element={<MakerDetail />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/orders/:id" element={<OrderDetail />} />
                    <Route path="/products/:id" element={<ProductDetail />} />
                    <Route path="/actions" element={<Actions />} />
                    <Route path="/actions/email" element={<SendEmail />} />
                    <Route path="/actions/push" element={<SendPush />} />
                    <Route
                      path="/actions/categories"
                      element={<Categories />}
                    />
                    <Route path="/actions/rules" element={<PlatformRules />} />
                    <Route path="/actions/feedbacks" element={<Feedbacks />} />
                    <Route
                      path="/actions/devolutions"
                      element={<Devolutions />}
                    />
                    <Route
                      path="/actions/devolutions/:id"
                      element={<DevolutionAnalysis />}
                    />
                    <Route
                      path="/actions/reports"
                      element={<Reports />}
                    />
                    <Route
                      path="/actions/payments"
                      element={<MakerPayments />}
                    />
                  </Route>

                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>

                <Modal />
                <Toast />
              </ModalProvider>
            </PageTitleProvider>
          </ThemeProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
