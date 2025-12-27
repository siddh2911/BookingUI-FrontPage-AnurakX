import React from 'react';
import { User } from 'lucide-react';
import './PropertyInfo.css';

const PropertyInfo = () => {
    return (
        <div className="property-info">
            <div className="host-info-header">
                <div className="host-text">
                    <h2>Entire villa hosted by Anurak</h2>
                    <p className="listing-specs">8 guests · 4 bedrooms · 4 beds · 4.5 baths</p>
                </div>
                <div className="host-avatar">
                    <img src="https://ui-avatars.com/api/?name=Anurak&background=random&size=128" alt="Host" />
                </div>
            </div>

            <div className="divider"></div>

            <div className="feature-item">
                <div className="feature-icon">
                    <User size={24} />
                </div>
                <div className="feature-text">
                    <h3>Dedicated workspace</h3>
                    <p>A private room with wifi that’s well-suited for working.</p>
                </div>
            </div>

            <div className="feature-item">
                <div className="feature-icon">
                    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", height: "24px", width: "24px", fill: "currentColor" }} aria-hidden="true" role="presentation" focusable="false"><path d="M26 3a4 4 0 0 1 4 4v20a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4h20zm0 2H6a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zM15 19H8v2h7v-2zm10 0h-7v2h7v-2zm-10-6H8v2h7v-2zm10 0h-7v2h7v-2zm-10-6H8v2h7v-2zm10 0h-7v2h7v-2z"></path></svg>
                </div>
                <div className="feature-text">
                    <h3>Self check-in</h3>
                    <p>Check yourself in with the keypad.</p>
                </div>
            </div>
            <div className="feature-item">
                <div className="feature-icon">
                    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", height: "24px", width: "24px", fill: "currentColor" }} aria-hidden="true" role="presentation" focusable="false"><path d="M16 31c-8.28 0-15-6.72-15-15S7.72 1 16 1s15 6.72 15 15-6.72 15-15 15zm0-28C8.82 3 3 8.82 3 16s5.82 13 13 13 13-5.82 13-13S23.18 3 16 3zm9.15 19.16-1.42 1.4L16.02 14.8V6h2v7.98l7.13 8.18z"></path></svg>
                </div>
                <div className="feature-text">
                    <h3>Free cancellation for 48 hours</h3>
                    <p>Get a full refund if you change your mind.</p>
                </div>
            </div>

            <div className="divider"></div>

            <div className="description">
                <p>
                    Experience the ultimate luxury at Karuna Villa, a breathtaking sanctuary nestled in the heart of Bali.
                    Surrounded by lush tropical gardens and overlooking the Indian Ocean, this private retreat offers
                    unparalleled tranquility and style.
                </p>
                <p className="mt-4">
                    The villa features open-air living spaces, a stunning infinity pool, and elegantly designed bedrooms
                    that blend traditional Balinese architecture with modern comfort. Perfect for families, friends, or
                    couples seeking a romantic getaway.
                </p>
                <div className="property-gallery-grid mt-6">
                    <div className="gallery-item">
                        <img src="/images/varanasi-exterior.jpg" alt="Villa Exterior at Night" className="gallery-img" />
                        <span className="img-caption">Elegant Facade</span>
                    </div>
                    <div className="gallery-item">
                        <img src="/images/varanasi-interior.jpg" alt="Living Area with TV" className="gallery-img" />
                        <span className="img-caption">Modern Interiors</span>
                    </div>
                </div>
                <button className="show-more-btn">
                    Show more {'>'}
                </button>
            </div>

            <div className="divider"></div>

        </div>
    );
};

export default PropertyInfo;
