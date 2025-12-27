import React from 'react';
import './StorySection.css';

const StorySection = () => {
    return (
        <section className="story-section" id="story">
            <div className="story-container">
                <div className="story-header">
                    <span className="chapter-marker">The Experience</span>
                    <h2>Not Just a Stay.<br />A State of Mind.</h2>
                    <div className="header-line"></div>
                </div>

                <div className="story-content-wrapper">
                    <div className="story-visuals">
                        <div className="story-img-card main-img">
                            <img src="/images/varanasi-hero-custom.jpg" alt="Ganga Aarti Lamps" />
                        </div>
                        <div className="story-img-card secondary-img">
                            <img src="/images/varanasi-hero-custom-2.jpg" alt="Varanasi Celebration" />
                        </div>
                    </div>

                    <div className="story-editorial-text">
                        <h3>Escape the Ordinary</h3>
                        <p>
                            Varanasi isn't just a destination; it's an awakening. At Karuna Villa, we've curated a
                            sanctuary that honors this eternal spirit. Whether you're seeking a quiet corner to
                            reflect or a luxurious base to explore the Ghats, our doors open to a world where
                            tradition whispers in every corner and modern comfort holds you close.
                        </p>

                        <div className="story-features">
                            <div className="feature-item">
                                <span className="feature-icon">✨</span>
                                <h4>Curated Luxury</h4>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">🌿</span>
                                <h4>Quietude</h4>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">🤝</span>
                                <h4>Service</h4>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="story-footer">
                    <p><em>"While we don't not offer free stays, we offer a value that is priceless—memories carved in stone and silence."</em></p>
                </div>
            </div>
        </section>
    );
};

export default StorySection;
