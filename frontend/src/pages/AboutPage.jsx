import React, { useState, useEffect, useRef } from 'react';
import TitleHeader from '../components/TitleHeader.jsx';

function AboutPage() {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.3 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div className="about-page-container">
            <TitleHeader title="About" />

            <div className="about-container">
                <div className="grid-col-1"></div>

                <div
                    className={`about-content ${isVisible ? 'visible' : ''}`}
                    ref={sectionRef}
                >
                    <div className="about-cell-text" id="text"></div>
                    <div className="about-cell-text" id="text">
                        <p>
                            Éternité is more than a gallery; it is a curated sanctuary for those who seek beauty beyond the reach of time. We believe that true art isn’t just observed — it is preserved and carried forward.
                            We stand for uncompromising authenticity, minimalist elegance, and the profound connection between the creator and the observer.
                        </p>
                        <p>
                            We are eager to bridge the gap between contemporary vision and lasting legacy, providing a digital haven where inspiration never fades.
                        </p>
                    </div>

                </div>
            </div>
            <style>{`
            .title-container {
                border-top: 0.5px solid var(--main-black-color);
            `}
            </style>
        </div>
    );
}

export default AboutPage;