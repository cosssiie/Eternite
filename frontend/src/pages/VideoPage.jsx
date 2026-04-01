function VideoPage() {
    return (
        <div className="video-container">
            <video
                className="background-video"
                autoPlay
                loop
                muted
                playsInline
            >
                <source src="/videos/mainbackgroundvideo.mp4" type="video/mp4" />
            </video>
            <section className="main-page-section">
                <div className="side-label side-label--left">
                    <span>/ ÉTERNITÉ /</span>
                </div>
                <div className="main-page-text">
                    <p className="main-page-subtitle" id="nav">/ FOR THE CREATIVITY /</p>

                    <p className="main-page-title">
                        EXPLORE THE WORLD<br />
                        <em className="main-page-title--italic">full of </em>
                        BEAUTY AND INSPIRATION
                    </p>

                    <p className="main-page-bottom" id="nav">//</p>
                </div>
                <div className="side-label side-label--right">
                    <span>/ ÉTERNITÉ /</span>
                </div>
            </section>
        </div>
    );
}

export default VideoPage;