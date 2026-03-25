import React, { useState } from 'react';
import { Calendar, Users } from 'lucide-react';
import './BookingSearch.css';

const BookingSearch = ({ onSearch, onOpenCalendar, checkIn, checkOut, guestCount, setGuestCount }) => {
    const [coupon, setCoupon] = useState('');
    const [couponMessage, setCouponMessage] = useState('');

    const formatDate = (date) => {
        if (!date) return '';
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const handleCouponChange = (e) => {
        setCoupon(e.target.value);
        setCouponMessage('');
    };

    const handleSearchClick = () => {
        const code = coupon.trim().toUpperCase();
        if (code) {
            if (code === 'SUMMER10') {
                if (!checkIn || !checkOut) {
                    setCouponMessage('Please select dates first');
                } else {
                    setCouponMessage('Code applied successfully!');
                    onSearch(10);
                }
            } else if (code === 'LUCKY 10') {
                setCouponMessage('This code was valid for the first 10 users');
                onSearch(0);
            } else {
                setCouponMessage('Invalid Coupon Code');
                onSearch(0);
            }
        } else {
            onSearch(0);
        }
    };

    return (
        <div className="booking-search-bar">
            <div className="search-field">

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
                    <select
                        value={`${guestCount} Adults`}
                        onChange={(e) => setGuestCount(parseInt(e.target.value))}
                    >
                        {[...Array(4)].map((_, i) => (
                            <option key={i + 1} value={`${i + 1} Adults`}>{i + 1} Adults</option>
                        ))}
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
                {couponMessage && (
                    <span className={couponMessage.includes('successfully') ? 'coupon-success' : 'coupon-error'}>
                        {couponMessage}
                    </span>
                )}
            </div>

            <button className="search-btn" onClick={handleSearchClick}>
                Book Stay
            </button>
        </div>
    );
};

export default BookingSearch;
