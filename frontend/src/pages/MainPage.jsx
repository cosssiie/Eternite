import VideoPage from './VideoPage.jsx';
import AboutPage from './AboutPage.jsx';
import FAQsPage from './FAQsPage.jsx';

function MainPage() {
  return (
    <div className="main-page-container">
      <VideoPage />
      <AboutPage />
      <FAQsPage />
    </div>
  );
}

export default MainPage;