import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
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

  const AdminRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user || user.role !== 'admin') {
      return <Navigate to="/" replace />;
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
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/account" element={<AccountPage />} />
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