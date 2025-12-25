import React from 'react';
import { Calendar, Users } from 'lucide-react';
import './BookingSearch.css';

const BookingSearch = ({ onSearch, onOpenCalendar, checkIn, checkOut }) => {
    const formatDate = (date) => {
        if (!date) return '';
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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
                    <select>
                        <option>2 Adults</option>
                        <option>3 Adults</option>
                        <option>4 Adults</option>
                    </select>
                </div>
            </div>

            <button className="search-btn" onClick={onSearch}>
                Book Stay
            </button>
        </div>
    );
};

export default BookingSearch;
