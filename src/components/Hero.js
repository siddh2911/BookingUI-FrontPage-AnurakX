import React from 'react';
import BookingSearch from './BookingSearch';
import './Hero.css';

const Hero = ({ onSearch, onOpenCalendar, checkIn, checkOut }) => {
    return (
        <section className="hero-container">
            <div className="hero-bg">
                <img src="/images/villa-1.png" alt="Luxury Villa" />
                <div className="hero-overlay"></div>
            </div>

            <div className="hero-content container">
                <span className="hero-eyebrow">Welcome to Karuna Villa</span>
                <h1 className="hero-title">A Sanctuary of<br />Timeless Elegance</h1>
                <p className="hero-subtitle">Experience the pinnacle of Balinese luxury in our luxury rooms and suites.</p>
            </div>

            <div className="hero-search-wrapper container">
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
