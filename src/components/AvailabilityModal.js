import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import { getAvailability } from '../services/api';
import './AvailabilityModal.css';

const AvailabilityModal = ({ isOpen, onClose, onDateSelect, onSearch }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [checkInDate, setCheckInDate] = useState(null);
    const [checkOutDate, setCheckOutDate] = useState(null);
    const [availabilityData, setAvailabilityData] = useState({});
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');




    const fetchMonthData = useCallback(async (date) => {
        setAvailabilityData({});
        setLoading(true);
        const year = date.getFullYear();
        const month = date.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const requests = [];
        for (let i = 1; i <= daysInMonth; i++) {

            const d = new Date(year, month, i);
            const startStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;


            const nextDay = new Date(year, month, i + 1);
            const endStr = `${nextDay.getFullYear()}-${String(nextDay.getMonth() + 1).padStart(2, '0')}-${String(nextDay.getDate()).padStart(2, '0')}`;

            requests.push(
                getAvailability(startStr, endStr)
                    .then(rooms => {
                        const allRooms = Array.isArray(rooms) ? rooms : [];
                        // Allow rooms without an explicit status to be considered available
                        const available = allRooms.filter(r => r.status === 'AVAILABLE' || r.status === undefined || !r.status);

                        const minPrice = available.length > 0
                            ? Math.min(...available.map(r => typeof r.pricePerNight === 'string' ? parseFloat(r.pricePerNight.replace(/,/g, '')) : (r.pricePerNight || 0)))
                            : 0;

                        let status = 'low';
                        if (allRooms.length === 0) {
                            // Only mark as sold-out if we actually got a successful response but 0 rooms
                            status = 'sold-out';
                        } else if (available.length === 1) {
                            status = 'high';
                        }

                        return { day: i, price: minPrice || 450, status };
                    })
                    .catch(err => {
                        return { day: i, price: 450, status: 'low' }; // Default to low demand on error so calendar isn't entirely crossed out
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
        } finally {
            setLoading(false);
        }
    }, []);


    useEffect(() => {
        if (isOpen) {
            setCheckInDate(null);
            setCheckOutDate(null);
            setErrorMessage('');
        }
    }, [isOpen]);


    useEffect(() => {
        if (isOpen) {
            fetchMonthData(currentMonth);
        }
    }, [isOpen, currentMonth, fetchMonthData]);







    if (!isOpen) return null;


    const handleDateClick = (date) => {
        setErrorMessage('');

        if (!checkInDate || (checkInDate && checkOutDate)) {
            setCheckInDate(date);
            setCheckOutDate(null);
        } else if (date > checkInDate) {
            setCheckOutDate(date);
            if (onDateSelect) onDateSelect(checkInDate, date);
            if (onClose) onClose();
        } else {
            setCheckInDate(date);
            setCheckOutDate(null);
        }
    };



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


        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }


        for (let i = 1; i <= totalDays; i++) {
            const dateObj = new Date(date.getFullYear(), date.getMonth(), i);
            const isPast = dateObj < new Date(new Date().setHours(0, 0, 0, 0));
            const dayData = availabilityData[i];
            const isSelected = isDateSelected(dateObj);


            const effectiveStatus = (status === 'error') ? 'low' : status;



            let demandClass = 'low-demand';
            if (effectiveStatus === 'high') demandClass = 'high-demand';
            else if (effectiveStatus === 'sold-out') demandClass = 'sold-out';

            days.push(
                <div
                    key={i}
                    onClick={() => {
                        if (isPast) return;



                        handleDateClick(dateObj);
                    }}
                    className={`calendar-day ${isPast ? 'past-date' : demandClass} ${isSelected ? 'date-selected' : ''}`}

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
