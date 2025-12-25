import React from 'react';
import { Users, Maximize, ArrowRight } from 'lucide-react';
import './RoomList.css';

const rooms = [
    {
        id: 1,
        name: "Oceanfront Pool Suite",
        price: "₹450",
        image: "/images/villa-2.png",
        size: "60 sqm",
        guests: "2 Adults"
    },
    {
        id: 2,
        name: "Garden Family Room",
        price: "₹680",
        image: "/images/villa-1.png",
        size: "80 sqm",
        guests: "4 Adults"
    },
    {
        id: 3,
        name: "Royal Cliff Suite",
        price: "₹900",
        image: "/images/villa-2.png",
        size: "100 sqm",
        guests: "2 Adults"
    }
];

const RoomList = ({ rooms: propRooms = [] }) => {
    const displayRooms = propRooms.length > 0 ? propRooms : rooms;

    if (!displayRooms || displayRooms.length === 0) return null;

    // Helper to get image based on room type or index
    const getImage = (room, index) => {
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
                    {displayRooms.map((room, index) => (
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
                                    <div className="room-price">
                                        <span className="amount">₹{room.pricePerNight}</span>
                                        <span className="period"> / night</span>
                                    </div>
                                    <button className="btn-details">
                                        Book Now <ArrowRight size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RoomList;
