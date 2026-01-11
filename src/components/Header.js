import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';
import PromoNotification from './PromoNotification';

const Header = ({ onBookNow }) => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleHashLink = (e, hash) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');

      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(hash);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogoClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDiningClick = (e) => {
    e.preventDefault();
    navigate('/food');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="header-wrapper">
      <PromoNotification />
      <header
        className={`standard-header ${scrolled || location.pathname !== '/' ? 'scrolled' : ''}`}
        style={{ position: 'relative', top: 'auto' }}
      >
        <div className="container header-content">
          <Link
            to="/"
            className="logo"
            style={{ textDecoration: 'none', color: 'inherit' }}
            onClick={handleLogoClick}
          >
            KARUNA VILLA
          </Link>

          <nav className="desktop-nav">
            <Link
              to="/food"
              className={location.pathname === '/food' ? 'active' : ''}
              onClick={handleDiningClick}
            >
              Dining
            </Link>
            <a href="#experiences" onClick={(e) => handleHashLink(e, 'experiences')}>Experiences</a>
            <a href="#contact" onClick={(e) => handleHashLink(e, 'contact')}>Contact</a>
          </nav>

          <div className="header-actions">
            <button className="btn-primary" onClick={onBookNow}>Book Now</button>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
