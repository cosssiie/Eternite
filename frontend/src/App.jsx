import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MainPage from "./pages/MainPage";
import SignIn from "./pages/SignInPage";
import SignUp from "./pages/SignUpPage";
import VerticalMarquee from "./components/VerticalMarquee";

function App() {
  const location = useLocation();
  const isMainPage = location.pathname === "/";

  return (
    <div className="app-container">

      <VerticalMarquee text='Join the Eternite' speed={1} />
      <div className="app-layout">
        <Header />
        <main className={`page-content ${isMainPage ? "no-margin" : ""}`}>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default App;