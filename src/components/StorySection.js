import React, { useEffect, useRef } from 'react';
import './StorySection.css';

const StorySection = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal');
                }
            });
        }, { threshold: 0.1 });

        const elements = sectionRef.current.querySelectorAll('.story-block');
        elements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <section className="story-section" ref={sectionRef} id="story">
            {/* Block 1: Left Text */}
            <div className="story-block text-left">
                <span className="chapter-marker">01 — The Origin</span>
                <h2>Sculpted by<br />Nature</h2>
                <p>
                    Karuna Villa wasn't built; it was unearthed.
                    A dialogue between volcanic stone and tropical silence.
                </p>
            </div>

            {/* Block 2: Right Image */}
            <div className="story-block image-right">
                <img src="/images/villa-2.png" alt="Interior Detail" />
                <span className="caption">The Living Void</span>
            </div>

            {/* Block 3: Center Statement */}
            <div className="story-block text-center-large">
                <h3>
                    "Scales fall from your eyes.<br />
                    Time dissolves into the jungle mist."
                </h3>
            </div>

            {/* Block 4: Amenities as Art */}
            <div className="story-block amenities-art">
                <div className="art-item">
                    <span>Pool</span>
                    <div className="line"></div>
                    <span>Infinity</span>
                </div>
                <div className="art-item">
                    <span>Service</span>
                    <div className="line"></div>
                    <span>Invisible</span>
                </div>
                <div className="art-item">
                    <span>cuisine</span>
                    <div className="line"></div>
                    <span>Curated</span>
                </div>
            </div>

        </section>
    );
};

export default StorySection;
