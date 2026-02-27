function MainPage() {
  return (
    <div className="main-page-container">
      <div className="video-container">
        <video
          className="background-video"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/videos/mainbackgroundvideo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="about-container">
        <h1> </h1>
      </div>
    </div>
  );
}

export default MainPage;