import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MainPage from "./pages/MainPage";
import GalleryPage from "./pages/GalleryPage";
import SignIn from "./pages/SignInPage";
import SignUp from "./pages/SignUpPage";
import VerticalMarquee from "./components/VerticalMarquee";
import ScrollManager from "./components/ScrollToTop";
import AccountPage from "./pages/AccoutPage";
import AdminPanelPage from "./pages/AdminPanelPage";
import VerifyEmail from "./components/VerifyEmail";
import PublicationPage from "./pages/PublicationPage";

function App() {
  const { user, isAuth, loading } = useAuth();
  const location = useLocation();
  const isMainPage = location.pathname === "/";

  const AdminRoute = ({ children }) => {
    return user?.role === 'admin' ? children : <Navigate to="/" replace />;
  };

  const ProtectedRoute = ({ children }) => {
    return isAuth ? children : <Navigate to="/signup" replace />;
  };

  return (
    <>
      <ScrollManager />
      <div className="app-container">
        <VerticalMarquee text='Join the Eternite' speed={1} />
        <div className="app-layout">
          <Header />
          <main className={`page-content ${isMainPage ? "no-margin" : ""}`}>
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/verify/:token" element={<VerifyEmail />} />
              <Route path="*" element={<Navigate to="/" />} />

              <Route
                path="/gallery"
                element={
                  <ProtectedRoute>
                    <GalleryPage />
                  </ProtectedRoute>
                } />
              <Route
                path="/publication/:id"
                element={
                  <ProtectedRoute>
                    <PublicationPage />
                  </ProtectedRoute>
                } />
              <Route
                path="/account"
                element={
                  <ProtectedRoute>
                    <AccountPage />
                  </ProtectedRoute>
                } />
              <Route
                path="/admin-panel"
                element={
                  <AdminRoute>
                    <AdminPanelPage />
                  </AdminRoute>
                }
              />
            </Routes>
          </main>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default App;