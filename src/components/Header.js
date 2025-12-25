import React, { useState, useEffect } from 'react';
import './Header.css';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`standard-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container header-content">
        <div className="logo">
          KARUNA VILLA
        </div>

        <nav className="desktop-nav">

          <a href="#dining">Dining</a>
          <a href="#experiences">Experiences</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="header-actions">
          <button className="btn-primary">Book Now</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
