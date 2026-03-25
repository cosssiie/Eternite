import React, { useEffect } from 'react';
import VideoPage from './VideoPage.jsx';
import AboutPage from './AboutPage.jsx';
import FAQsPage from './FAQsPage.jsx';

function MainPage() {
  useEffect(() => {
    const sections = document.querySelectorAll('.main-section');
    
    const observerOptions = {
      root: null,
      threshold: 0.6,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          window.history.replaceState(null, null, `#${id}`);
        }
      });
    }, observerOptions);

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="main-page-container">
      <div id="video" className="main-section">
        <VideoPage />
      </div>
      <div id="about" className="main-section">
        <AboutPage />
      </div>
      <div id="faqs" className="main-section">
        <FAQsPage />
      </div>
    </div>
  );
}

export default MainPage;