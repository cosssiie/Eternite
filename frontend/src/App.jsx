import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import MainPage from "./pages/MainPage";
import SignIn from "./pages/SignInPage";
import SignUp from "./pages/SignUpPage";
import VerticalMarquee from "./components/VerticalMarquee";

function App() {
  return (
    <Router>
      <div className="app-layout">
        <VerticalMarquee text='Join The Eternite' speed={1}/>
        <Header />
        <main className="page-content">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;