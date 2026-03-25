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
                            Curated by you, admired by the world.
                            A minimalist frame for the artifacts that refuse to fade      Curated by you, admired by the world.
                            A minimalist frame for the artifacts that refuse to fade...

                        </p>
                        <p>
                            Curated by you, admired by the world.
                            A minimalist frame for the artifacts that refuse to fade      Curated by you, admired by the world.
                            A minimalist frame for the artifacts that refuse to fade...

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