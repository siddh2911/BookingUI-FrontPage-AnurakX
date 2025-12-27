import React, { useState } from 'react';
import BookingSearch from './BookingSearch';
import './Hero.css';

const Hero = ({ onSearch, onOpenCalendar, checkIn, checkOut }) => {
    const videoPlaylist = [
        "/videos/IMG_7808.mp4"
    ];
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

    const handleVideoEnd = () => {
        if (videoPlaylist.length > 1) {
            setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videoPlaylist.length);
        }
    };

    return (
        <section className="hero-container">
            <div className="hero-bg">
                <video
                    key={`${currentVideoIndex}-${videoPlaylist.length}`} // Force re-render if playlist changes
                    autoPlay
                    loop={videoPlaylist.length === 1} // Native loop if only one video
                    muted
                    playsInline
                    className="hero-video"
                    style={{
                        objectPosition: currentVideoIndex === 0 ? 'center 55%' : 'center center'
                    }}
                    onEnded={handleVideoEnd}
                >
                    <source src={videoPlaylist[currentVideoIndex]} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <div className="hero-overlay"></div>
            </div>

            <div className="hero-content container">
                <span className="hero-eyebrow">Welcome to Karuna Villa</span>
                <h1 className="hero-title">A Sanctuary of<br />Timeless Elegance</h1>
                <p className="hero-subtitle">Experience the pinnacle of luxury in Varanasi in our luxury rooms and suites.</p>
            </div>

            <div className="hero-search-wrapper container" id="booking-search">
                <BookingSearch
                    onSearch={onSearch}
                    onOpenCalendar={onOpenCalendar}
                    checkIn={checkIn}
                    checkOut={checkOut}
                />
            </div>
        </section>
    );
};

export default Hero;
