import React from 'react';
import './GallerySection.css';

const GallerySection = () => {
    return (
        <section className="gallery-section">
            <div className="gallery-container">
                <div className="gallery-header">
                    <h2>The Villa</h2>
                    <p>Designed for comfort, styled for peace.</p>
                </div>
                <div className="gallery-layout">
                    <div className="gallery-card large">
                        <img src="/images/varanasi-exterior.jpg" alt="Villa Exterior at Night" />
                        <div className="gallery-overlay">
                            <span>The Facade</span>
                        </div>
                    </div>
                    <div className="gallery-card large">
                        <img src="/images/varanasi-interior.jpg" alt="Living Area with TV" />
                        <div className="gallery-overlay">
                            <span>Living Spaces</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default GallerySection;
