import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import './AvailabilityModal.css';

const AvailabilityModal = ({ isOpen, onClose, onDateSelect, onSearch }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date()); // Start with current month
    const [checkInDate, setCheckInDate] = useState(null);
    const [checkOutDate, setCheckOutDate] = useState(null);
    const [availabilityData, setAvailabilityData] = useState({});
    const [loading, setLoading] = useState(false);

    // ... rest of state ...
    // State for available rooms removed as it is handled in App.js now

    const fetchMonthData = useCallback(async (date) => {
        setLoading(true);
        const year = date.getFullYear();
        const month = date.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const requests = [];
        for (let i = 1; i <= daysInMonth; i++) {
            // Create date object in local time to ensure correct YYYY-MM-DD generation
            const d = new Date(year, month, i);
            // Format as YYYY-MM-DD using local time parts to avoid timezone shifts
            const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

            requests.push(
                fetch(`/available-rooms?startDate=${dateStr}&endDate=${dateStr}`)
                    .then(res => res.json())
                    .then(rooms => {
                        const available = rooms.filter(r => r.status === 'AVAILABLE');
                        // Find lowest price among available rooms, or fallback to lowest overall if sold out
                        const minPrice = available.length > 0
                            ? Math.min(...available.map(r => r.pricePerNight))
                            : (rooms.length > 0 ? Math.min(...rooms.map(r => r.pricePerNight)) : 0);

                        let status = 'low'; // Default 'best price'
                        if (available.length === 0) status = 'sold-out';
                        else if (available.length === 1) status = 'high'; // low availability -> high demand

                        return { day: i, price: minPrice, status };
                    })
                    .catch(err => {
                        console.error("Failed to fetch for", dateStr, err);
                        return { day: i, price: 0, status: 'error' };
                    })
            );
        }

        try {
            const results = await Promise.all(requests);
            const dataMap = {};
            results.forEach(r => {
                dataMap[r.day] = r;
            });
            setAvailabilityData(dataMap);
        } catch (error) {
            console.error("Error fetching month data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            fetchMonthData(currentMonth);
        }
    }, [isOpen, currentMonth, fetchMonthData]);







    if (!isOpen) return null;


    const handleDateClick = (date) => {
        // Prevent clicking disabled/past dates if needed, but for now allow all

        if (!checkInDate || (checkInDate && checkOutDate)) {
            setCheckInDate(date);
            setCheckOutDate(null);
            // setAvailableRooms([]); // Removed
        } else if (date > checkInDate) {
            setCheckOutDate(date);
            if (onDateSelect) onDateSelect(checkInDate, date);
            if (onClose) onClose(); // Auto-close on range selection
        } else {
            setCheckInDate(date);
            setCheckOutDate(null);
            // setAvailableRooms([]); // Removed
        }
    };

    // ... rest of helper functions ...

    const isDateSelected = (date) => {
        if (!checkInDate) return false;
        if (checkOutDate) {
            return date >= checkInDate && date <= checkOutDate;
        }
        return date.getTime() === checkInDate.getTime();
    };

    const daysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const generateDays = (date) => {
        const days = [];
        const totalDays = daysInMonth(date);
        const startDay = firstDayOfMonth(date);

        // Empty slots
        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }

        // Days
        for (let i = 1; i <= totalDays; i++) {
            const dateObj = new Date(date.getFullYear(), date.getMonth(), i);
            const isPast = dateObj < new Date(new Date().setHours(0, 0, 0, 0));
            const dayData = availabilityData[i];
            const isSelected = isDateSelected(dateObj);

            // Loading state placeholder or actual data
            const status = dayData ? dayData.status : 'loading';
            const demandClass = status === 'high' ? 'high-demand' : (status === 'sold-out' ? 'sold-out' : 'low-demand');

            days.push(
                <div
                    key={i}
                    onClick={() => !isPast && status !== 'sold-out' && handleDateClick(dateObj)}
                    className={`calendar-day ${isPast ? 'past-date' : demandClass} ${isSelected ? 'date-selected' : ''}`}
                    title={status === 'sold-out' ? 'Sold Out' : ''}
                >
                    <span className="day-number">{i}</span>
                </div>
            );
        }
        return days;
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };



    return (
        <div className="modal-overlay">
            <div className="availability-modal">
                <button className="close-btn" onClick={onClose}><X size={24} /></button>

                <div className="modal-header">
                    <h2>Availability Forecast</h2>
                    <p>Prices vary based on demand and seasonality.</p>
                </div>

                <div className="calendar-controls">
                    <button onClick={prevMonth} disabled={loading}><ChevronLeft /></button>
                    <h3>{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
                    <button onClick={nextMonth} disabled={loading}><ChevronRight /></button>
                </div>

                <div className="calendar-grid">
                    <div className="day-header">Sun</div>
                    <div className="day-header">Mon</div>
                    <div className="day-header">Tue</div>
                    <div className="day-header">Wed</div>
                    <div className="day-header">Thu</div>
                    <div className="day-header">Fri</div>
                    <div className="day-header">Sat</div>
                    {loading && !Object.keys(availabilityData).length ? (
                        <div className="calendar-loading">
                            <Loader className="animate-spin" /> Loading availability...
                        </div>
                    ) : generateDays(currentMonth)}
                </div>

                <div className="forecast-legend">
                    <div className="legend-item">
                        <span className="dot low"></span> Best Price
                    </div>
                    <div className="legend-item">
                        <span className="dot high"></span> High Demand
                    </div>
                    <div className="legend-item">
                        <span className="dot sold-out" style={{ backgroundColor: '#444' }}></span> Sold Out
                    </div>
                </div>

                {/* Available Rooms Section - Button Only */}

            </div>
        </div>
    );
};

export default AvailabilityModal;
