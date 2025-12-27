import React, { useState } from 'react';
import { Calendar, Users } from 'lucide-react';
import './BookingSearch.css';

const BookingSearch = ({ onSearch, onOpenCalendar, checkIn, checkOut }) => {
    const [coupon, setCoupon] = useState('');
    const [couponMessage, setCouponMessage] = useState('');

    const formatDate = (date) => {
        if (!date) return '';
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const handleCouponChange = (e) => {
        setCoupon(e.target.value);
        setCouponMessage(''); // Clear message on typing
    };

    const handleSearchClick = () => {
        const code = coupon.trim().toUpperCase();
        if (code) {
            if (code === 'LUCKY 10') {
                setCouponMessage('This code was valid for the first 10 users');
            } else {
                setCouponMessage('Invalid Coupon Code');
            }
        }

        // Proceed with search action
        onSearch();
    };

    return (
        <div className="booking-search-bar">
            <div className="search-field">
                {/* ... existing fields ... */}
                <label>Check-in</label>
                <div className="input-with-icon" onClick={onOpenCalendar} style={{ cursor: 'pointer' }}>
                    <Calendar size={18} className="field-icon" />
                    <input
                        type="text"
                        placeholder="Add dates"
                        value={formatDate(checkIn)}
                        readOnly
                    />
                </div>
            </div>

            <div className="divider-vertical"></div>

            <div className="search-field">
                <label>Check-out</label>
                <div className="input-with-icon" onClick={onOpenCalendar} style={{ cursor: 'pointer' }}>
                    <Calendar size={18} className="field-icon" />
                    <input
                        type="text"
                        placeholder="Add dates"
                        value={formatDate(checkOut)}
                        readOnly
                    />
                </div>
            </div>

            <div className="divider-vertical"></div>

            <div className="search-field">
                <label>Guests</label>
                <div className="input-with-icon">
                    <Users size={18} className="field-icon" />
                    <select>
                        <option>2 Adults</option>
                        <option>3 Adults</option>
                        <option>4 Adults</option>
                    </select>
                </div>
            </div>

            <div className="divider-vertical"></div>

            <div className="search-field coupon-field">
                <label>Promo Code</label>
                <div className="input-with-icon">
                    <input
                        type="text"
                        placeholder="Add code"
                        value={coupon}
                        onChange={handleCouponChange}
                        className={couponMessage ? 'error-input' : ''}
                    />
                </div>
                {couponMessage && <span className="coupon-error">{couponMessage}</span>}
            </div>

            <button className="search-btn" onClick={handleSearchClick}>
                Book Stay
            </button>
        </div>
    );
};

export default BookingSearch;
