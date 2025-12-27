import React from 'react';
import { Users, Maximize, ArrowRight } from 'lucide-react';
import './RoomList.css';

const rooms = [
    {
        id: 1,
        roomName: "Oceanfront Pool Suite",
        pricePerNight: "450",
        image: "/images/villa-2.png",
        size: "60 sqm",
        guests: "2 Adults"
    },
    {
        id: 2,
        roomName: "Garden Family Room",
        pricePerNight: "680",
        image: "/images/villa-1.png",
        size: "80 sqm",
        guests: "4 Adults"
    },
    {
        id: 3,
        roomName: "Karuna Villa Elite",
        pricePerNight: "15,000",
        image: "/images/elite/elite-card.jpg",
        size: "3500 sqft",
        guests: "8 Adults"
    },
    {
        id: 4,
        roomName: "Karuna Zenith",
        pricePerNight: "18,000",
        image: "/images/zenith-card.jpg",
        size: "4000 sqft",
        guests: "10 Adults"
    }
];

const RoomList = ({ rooms: propRooms = [], isLoading = false, hasSearched = false }) => {
    let displayRooms = propRooms;

    // Fallback to static list if not searched and no API data
    if (!hasSearched && (!displayRooms || displayRooms.length === 0)) {
        displayRooms = rooms;
    }

    // if (!displayRooms || displayRooms.length === 0) return null; // Removed to show 'No Rooms' message

    // Helper to get image based on room type or index
    const getImage = (room, index) => {
        if (room.roomName === "Karuna Villa Elite" || room.name === "Karuna Villa Elite" || room.type === "Karuna Villa Elite") {
            return "/images/elite/elite-card.jpg";
        }
        if (room.roomName === "Karuna Zenith" || room.name === "Karuna Zenith") {
            return "/images/zenith-card.jpg";
        }
        if (room.image) return room.image;
        // Fallback/Placeholder logic
        const placeholders = [
            "/images/villa-1.png",
            "/images/villa-2.png",
            "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80" // Random room image
        ];
        return placeholders[index % placeholders.length];
    };

    return (
        <section className="room-list-section" id="rooms">
            <div className="container">
                <div className="section-header">
                    <span className="section-subtitle">Accommodations</span>
                    <h2 className="section-title">Available Rooms</h2>
                    <p className="section-desc">Experience the pinnacle of luxury during your stay.</p>
                </div>

                <div className="rooms-grid">
                    {isLoading ? (
                        <div className="loading-state" style={{
                            gridColumn: '1 / -1',
                            padding: '4rem',
                            textAlign: 'center',
                            color: '#666',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: '300px'
                        }}>
                            <div className="spinner" style={{
                                width: '40px',
                                height: '40px',
                                border: '3px solid rgba(0,0,0,0.1)',
                                borderRadius: '50%',
                                borderTopColor: '#333',
                                animation: 'spin 1s ease-in-out infinite'
                            }}></div>
                            <style>{`
                                @keyframes spin {
                                    to { transform: rotate(360deg); }
                                }
                            `}</style>
                        </div>
                    ) : displayRooms && displayRooms.length > 0 ? (
                        displayRooms.map((room, index) => (
                            <div key={room.id || index} className="room-card">
                                <div className="room-image">
                                    <img src={getImage(room, index)} alt={room.type} />
                                </div>
                                <div className="room-details">
                                    <h3>{room.roomName || room.type}</h3>
                                    <div className="room-meta">
                                        <span><Maximize size={14} /> {room.size || "45 sqm"}</span>
                                        <span><Users size={14} /> {room.capacity || "2 Adults"}</span>
                                    </div>
                                    <div className="room-footer">
                                        <div className="room-footer-content">
                                            <div className="room-price">
                                                <span className="amount">₹{room.pricePerNight}</span>
                                                <span className="period"> / night</span>
                                            </div>
                                            {(room.roomName === "Karuna Zenith" || room.name === "Karuna Zenith") ? (
                                                <div className="booking-actions">
                                                    <a
                                                        href="https://www.airbnb.co.in/rooms/1356963405791829086?photo_id=2418950488&source_impression_id=p3_1766802418_P3VeQ7SZhMqSQqO2&previous_page_section_name=1000"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn-details"
                                                    >
                                                        Book Now <ArrowRight size={14} />
                                                    </a>
                                                    <span className="offline-booking">
                                                        or <a href="https://www.instagram.com/villakaruna/" target="_blank" rel="noopener noreferrer">dm us on instagram</a> for offline booking
                                                    </span>
                                                </div>
                                            ) : (
                                                <button className="btn-details">
                                                    Book Now <ArrowRight size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-rooms-message">
                            <div className="no-rooms-icon">
                                <Maximize size={48} strokeWidth={1} />
                            </div>
                            <h3>All Villas Booked</h3>
                            <p>We apologize, but all our villas are fully booked for these specific dates. Please try selecting different dates or contact our concierge.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default RoomList;
