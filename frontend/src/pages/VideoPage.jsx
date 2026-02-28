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
                Your browser does not support the video tag.
            </video>
        </div>
    );
}

export default VideoPage;