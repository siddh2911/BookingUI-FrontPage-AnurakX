import React, { useState } from 'react';
import { ChevronDown, Star } from 'lucide-react';
import './BookingWidget.css';

const BookingWidget = () => {
    const [price, setPrice] = useState(350);
    const [nights, setNights] = useState(5);
    const [guests, setGuests] = useState(1);

    const cleaningFee = 45;
    const serviceFee = Math.round((price * nights) * 0.14);
    const total = (price * nights) + cleaningFee + serviceFee;

    return (
        <div className="booking-widget-container">
            <div className="booking-card">
                <div className="card-header">
                    <div>
                        <span className="price">₹{price}</span> <span className="night-label">night</span>
                    </div>
                    <div className="reviews-summary">
                        <Star size={14} fill="var(--text-primary)" />
                        <span className="rating">4.92</span>
                        <span className="review-count"> · 128 reviews</span>
                    </div>
                </div>

                <div className="booking-inputs">
                    <div className="date-inputs">
                        <div className="date-input check-in">
                            <label>CHECK-IN</label>
                            <div className="date-value">12/28/2025</div>
                        </div>
                        <div className="date-input check-out">
                            <label>CHECK-OUT</label>
                            <div className="date-value">1/2/2026</div>
                        </div>
                    </div>
                    <div className="guest-input">
                        <div className="guest-label-container">
                            <label>GUESTS</label>
                            <div className="guest-value">{guests} guest{guests > 1 ? 's' : ''}</div>
                        </div>
                        <ChevronDown size={16} />
                    </div>
                </div>

                <button className="reserve-btn">Reserve</button>

                <div className="no-charge-msg">You won't be charged yet</div>

                <div className="price-breakdown">
                    <div className="price-row">
                        <span className="item-label">₹{price} x {nights} nights</span>
                        <span className="item-value">₹{price * nights}</span>
                    </div>
                    <div className="price-row">
                        <span className="item-label">Cleaning fee</span>
                        <span className="item-value">₹{cleaningFee}</span>
                    </div>
                    <div className="price-row">
                        <span className="item-label">Service fee</span>
                        <span className="item-value">₹{serviceFee}</span>
                    </div>
                </div>

                <div className="total-row">
                    <span>Total before taxes</span>
                    <span>₹{total}</span>
                </div>
            </div>
        </div>
    );
};

export default BookingWidget;
