import React, { useState } from 'react';
import './BookingOverlay.css';
import BookingWidget from './BookingWidget';

// Reuse the logic of BookingWidget but style it as a minimal form inside the overlay
const BookingOverlay = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className="booking-trigger-container">
                <button className="booking-trigger-btn" onClick={() => setIsOpen(true)}>
                    Request Access
                </button>
            </div>

            <div className={`booking-overlay ${isOpen ? 'open' : ''}`}>
                <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>

                <div className="overlay-content">
                    <h2>Secure Your Sanctuary</h2>
                    <p>Enter your details to initiate a reservation inquiry.</p>

                    {/* Placeholder for the complex form re-using standard inputs if needed, 
                        but simplified for this aesthetic */}
                    <form className="minimal-form">
                        <div className="input-group">
                            <input type="text" placeholder="Name" />
                            <input type="email" placeholder="Email" />
                        </div>
                        <div className="input-group">
                            <input type="text" placeholder="Dates (e.g. Oct 12 - Oct 15)" />
                        </div>
                        <button type="button" className="submit-request-btn">
                            Send Request
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default BookingOverlay;
