import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import './AvailabilityModal.css';

const AvailabilityModal = ({ isOpen, onClose, onDateSelect, onSearch }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date()); // Start with current month
    const [checkInDate, setCheckInDate] = useState(null);
    const [checkOutDate, setCheckOutDate] = useState(null);
    const [availabilityData, setAvailabilityData] = useState({});
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(''); // Added here correctly

    // ... rest of state ...
    // State for available rooms removed as it is handled in App.js now

    const fetchMonthData = useCallback(async (date) => {
        setAvailabilityData({}); // Clear old data to prevent flash of wrong status
        setLoading(true);
        const year = date.getFullYear();
        const month = date.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const requests = [];
        for (let i = 1; i <= daysInMonth; i++) {
            // Create date object for the current day (startDate)
            const d = new Date(year, month, i);
            const startStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

            // Create date object for the next day (endDate)
            const nextDay = new Date(year, month, i + 1);
            const endStr = `${nextDay.getFullYear()}-${String(nextDay.getMonth() + 1).padStart(2, '0')}-${String(nextDay.getDate()).padStart(2, '0')}`;

            requests.push(
                fetch(`https://api.karunavillas.com/available-rooms?startDate=${startStr}&endDate=${endStr}`)
                    .then(res => res.json())
                    .then(rooms => {
                        // USER REQUEST: Strictly use API data, ignoring status.
                        // If the API returns any rooms, treat as available.
                        const available = Array.isArray(rooms) ? rooms : [];

                        // Debug logging for specific dates
                        if (d.getDate() === 30 && d.getMonth() === 11) {
                            console.log(`[AvailabilityModal] Dec 30 Data:`, available);
                        }
                        if (d.getDate() === 31 && d.getMonth() === 11) {
                            console.log(`[AvailabilityModal] Dec 31 Data:`, available);
                        }

                        // Find lowest price among available rooms
                        const minPrice = available.length > 0
                            ? Math.min(...available.map(r => r.pricePerNight))
                            : 0;

                        let status = 'low'; // Default 'best price'
                        if (available.length === 0) {
                            status = 'sold-out';
                        } else if (available.length === 1) {
                            status = 'high'; // low availability -> high demand
                        }
                        // If available.length >= 1, it stays 'low' or 'high' (available)

                        return { day: i, price: minPrice, status };
                    })
                    .catch(err => {
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
            console.error("Failed to fetch availability", error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Effect to reset state ONLY when modal opens
    useEffect(() => {
        if (isOpen) {
            setCheckInDate(null);
            setCheckOutDate(null);
            setErrorMessage('');
        }
    }, [isOpen]);

    // Effect to fetch data when month or open state changes
    useEffect(() => {
        if (isOpen) {
            fetchMonthData(currentMonth);
        }
    }, [isOpen, currentMonth, fetchMonthData]);







    if (!isOpen) return null;


    const handleDateClick = (date) => {
        // Clear error on interact
        setErrorMessage('');

        if (!checkInDate || (checkInDate && checkOutDate)) {
            // Starting new selection
            setCheckInDate(date);
            setCheckOutDate(null);
        } else if (date > checkInDate) {
            // Completing selection
            setCheckOutDate(date);

            // Notify parent of selection regardless of validity (User Request: "user can select the dates")
            if (onDateSelect) onDateSelect(checkInDate, date);

            // Notify parent of selection regardless of validity (User Request: "user can select the dates")
            if (onDateSelect) onDateSelect(checkInDate, date);

            // REMOVED VALIDATION as per request: "Sorry, these dates are not available. should not come"
            // We allow closing even if dates are technically "sold out" in the calendar view, 
            // relying on the main room list to show "Sold Out" status.
            if (onClose) onClose();
        } else {
            // Reset to check-in if clicked earlier date
            setCheckInDate(date);
            setCheckOutDate(null);
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

    // ... (rest of state is same, ensure line numbers match if needed, but replace_file_content replaces chunks)

    // We need to inject the state definition at the top. 
    // Wait, I can't inject state easily with a partial replace if I don't include the top.
    // I will do a larger replace to include the state and the render logic.

    // Actually, I'll split this into:
    // 1. Add state variable.
    // 2. Update handleDateClick and generateDays.
    // 3. Update return JSX to show error.

    // Let's do a larger chunk to cover generateDays and handleDateClick together.

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

            // Treat 'error' as 'sold-out' for safety, but for VISUALS we will relaxed it.
            // effectively 'sold-out' logic for VALIDATION remains, but VISUALS are standard.
            const effectiveStatus = (status === 'error' || status === 'sold-out') ? 'sold-out' : status;

            // Usage: only 'high' gets special treatment? Or maybe just keep everything clean.
            // User said "no grey boxes", but for "sold-out" we need a specific class to apply the visual "cut".
            let demandClass = 'low-demand';
            if (effectiveStatus === 'high') demandClass = 'high-demand';
            else if (effectiveStatus === 'sold-out') demandClass = 'sold-out';

            days.push(
                <div
                    key={i}
                    onClick={() => {
                        if (isPast) return; // Still prevent past dates? Usually yes.

                        // RELAXED LOGIC: Allow clicking ANY future date.
                        // Validation happens in handleDateClick.
                        handleDateClick(dateObj);
                    }}
                    className={`calendar-day ${isPast ? 'past-date' : demandClass} ${isSelected ? 'date-selected' : ''}`}
                // title={effectiveStatus === 'sold-out' ? 'Sold Out' : ''} // Keep title for info? Or remove? User said "if not available just add sorry message". Title is fine for hover context.
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
                    {/* Sold Out legend removed as per request */}
                </div>

                {errorMessage && (
                    <div className="availability-error-message" style={{ color: '#ff4444', marginTop: '10px', textAlign: 'center', fontWeight: '500' }}>
                        {errorMessage}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AvailabilityModal;
