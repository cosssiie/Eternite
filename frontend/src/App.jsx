import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect } from "react";
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

function App() {
  const location = useLocation();
  const isMainPage = location.pathname === "/";

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);

      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 0);
      }
    }
  }, [location]);

  useEffect(() => {
    const [navigation] = window.performance.getEntriesByType('navigation');
    if (navigation && navigation.type === 'reload') {
      if (window.location.hash) {
        window.history.replaceState(null, "", window.location.pathname);
        window.scrollTo(0, 0);
      }
    }
  }, []);

  useEffect(() => {
    const checkUserPersistence = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await api.get('/users/me');
        } catch (err) {
          localStorage.clear();
          window.location.href = '/signin';
        }
      }
    };
    checkUserPersistence();
  }, []);

  const AdminRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user || user.role !== 'admin') {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return <Navigate to="/signup" replace />;
    }
    return children;
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