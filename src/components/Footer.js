import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="standard-footer" id="contact">
            <div className="container footer-content-grid">
                {/* Brand */}
                <div className="footer-col">
                    <h3 className="footer-logo">KARUNA VILLA</h3>
                    <p>Jalan Pantai Batu Mejan,<br />Canggu, Bali 80361</p>
                    <p>+62 361 123 4567</p>
                    <p>stay@karunavilla.com</p>
                </div>

                {/* Links */}
                <div className="footer-col">
                    <h4>Explore</h4>
                    <ul>
                        <li><a href="#rooms">Rooms</a></li>
                        <li><a href="#dining">Dining</a></li>
                        <li><a href="#experiences">Wellness</a></li>
                        <li><a href="#gallery">Gallery</a></li>
                    </ul>
                </div>

                {/* Legal */}
                <div className="footer-col">
                    <h4>Information</h4>
                    <ul>
                        <li><a href="#about">About Us</a></li>
                        <li><a href="#careers">Careers</a></li>
                        <li><a href="#privacy">Privacy Policy</a></li>
                        <li><a href="#terms">Terms of Service</a></li>
                        <li><a href="https://booking-ui-anurak-x.vercel.app" target="_blank" rel="noopener noreferrer">Admin Login</a></li>
                    </ul>
                </div>

                {/* Newsletter */}
                <div className="footer-col">
                    <h4>Newsletter</h4>
                    <p>Subscribe for exclusive offers.</p>
                    <div className="newsletter-form">
                        <input type="email" placeholder="Your email address" />
                        <button>Subscribe</button>
                    </div>
                </div>
            </div>

            <div className="footer-bottom container">
                <p>&copy; {new Date().getFullYear()} Karuna Villa. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
