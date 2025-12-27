import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'; // Fix imports
import { Users, Maximize, ArrowRight, X, Home, Instagram } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './RoomList.css';

gsap.registerPlugin(ScrollTrigger);

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

const RoomList = ({ rooms: propRooms = [], isLoading = false, hasSearched = false, onSearch }) => {
    const [activeRoomIndex, setActiveRoomIndex] = useState(null);
    let displayRooms = propRooms;
    const sectionRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (activeRoomIndex !== null && !event.target.closest('.booking-actions-wrapper')) {
                setActiveRoomIndex(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [activeRoomIndex]);

    useLayoutEffect(() => {
        if (!isLoading && displayRooms && displayRooms.length > 0) {
            const mm = gsap.matchMedia();

            mm.add({
                isDesktop: "(min-width: 769px)",
                isMobile: "(max-width: 768px)",
            }, (context) => {
                const { isDesktop } = context.conditions;
                const cards = gsap.utils.toArray(".room-card");

                cards.forEach((card, i) => {
                    gsap.fromTo(card,
                        {
                            y: 100,
                            opacity: 0,
                            scale: 0.9
                        },
                        {
                            scrollTrigger: {
                                trigger: card,
                                start: "top 90%", // Slightly earlier on all screens
                                toggleActions: "play none none reverse"
                            },
                            y: 0,
                            opacity: 1,
                            scale: 1,
                            duration: 0.8,
                            // On desktop, stagger by index. On mobile, constant short delay since they appear one by one.
                            delay: isDesktop ? i * 0.1 : 0.1,
                            ease: "power3.out"
                        }
                    );
                });
            }, sectionRef);

            return () => mm.revert();
        }
    }, [isLoading, displayRooms]);

    // Helper to get image based on room type or index
    const getImage = (room, index) => {
        const name = room.roomName || room.name || room.type;
        if (name === "Karuna Villa Elite") {
            return "/images/elite/elite-card.jpg";
        }
        if (name === "Karuna Zenith") {
            return "/images/zenith-card.jpg";
        }
        if (room.image) return room.image;
        const placeholders = [
            "/images/villa-1.png",
            "/images/villa-2.png",
            "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80"
        ];
        return placeholders[index % placeholders.length];
    };

    const isKarunaSpecial = (room) => {
        const name = room.roomName || room.name || room.type;
        return name === "Karuna Zenith" || name === "Karuna Villa Elite" || name === "Tranquil Retreat";
    };

    const getAirbnbLink = (room) => {
        const name = room.roomName || room.name || room.type;
        if (name === "Karuna Villa Elite") {
            return "https://www.airbnb.co.in/rooms/1110080531767633017?source_impression_id=p3_1766831350_P3ejFo3RH-IYNKTf";
        }
        if (name === "Tranquil Retreat") return "#"; // Disabled
        return "https://www.airbnb.co.in/rooms/1356963405791829086?photo_id=2418950488&source_impression_id=p3_1766802418_P3VeQ7SZhMqSQqO2&previous_page_section_name=1000"; // Zenith
    };

    const isAirbnbDisabled = (room) => {
        const name = room.roomName || room.name || room.type;
        return name === "Tranquil Retreat";
    };

    // Hide rooms until searched
    if (!hasSearched) return null;

    return (
        <section className="room-list-section" id="rooms" ref={sectionRef}>
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
                    ) : (
                        displayRooms && displayRooms.map((room, index) => {
                            const isAvailable = room.isAvailable !== false; // Default to true if undefined (initial load)

                            return (
                                <div key={room.id || index} className={`room-card ${!isAvailable && hasSearched ? 'unavailable' : ''}`}>
                                    <div className="room-image">
                                        <img src={getImage(room, index)} alt={room.roomName || room.type} style={!isAvailable && hasSearched ? { filter: 'grayscale(100%)' } : {}} />
                                        {!isAvailable && hasSearched && (
                                            <div className="availability-overlay">
                                                <span>Sold Out</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="room-details">
                                        <h3>{room.roomName || room.type}</h3>
                                        <div className="room-meta">
                                            <span><Maximize size={14} /> {room.size || "45 sqm"}</span>
                                            <span><Users size={14} /> {room.capacity || room.guests || "2 Adults"}</span>
                                        </div>
                                        <div className="room-footer">
                                            <div className="room-footer-content">
                                                <div className="room-price">
                                                    <span className="amount">₹{room.pricePerNight}</span>
                                                    <span className="period"> / night</span>
                                                </div>
                                                {isKarunaSpecial(room) ? (
                                                    <div className="booking-actions-wrapper">
                                                        {activeRoomIndex !== index ? (
                                                            <button
                                                                className={`btn-details ${!isAvailable && hasSearched ? 'disabled' : ''}`}
                                                                disabled={!isAvailable && hasSearched}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    if (!isAvailable && hasSearched) return;

                                                                    if (!hasSearched) {
                                                                        onSearch();
                                                                    } else {
                                                                        setActiveRoomIndex(index);
                                                                    }
                                                                }}
                                                            >
                                                                {hasSearched ? (isAvailable ? "Book Now" : "Sold Out") : "Check Availability"} <ArrowRight size={14} />
                                                            </button>
                                                        ) : (
                                                            <div className="zenith-options-container" onClick={(e) => e.stopPropagation()}>
                                                                <button
                                                                    className="close-options"
                                                                    onClick={() => setActiveRoomIndex(null)}
                                                                    title="Close"
                                                                >
                                                                    <X size={14} />
                                                                </button>
                                                                <a
                                                                    href={getAirbnbLink(room)}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className={`option-btn airbnb ${isAirbnbDisabled(room) ? 'disabled' : ''}`}
                                                                    onClick={(e) => {
                                                                        if (isAirbnbDisabled(room)) e.preventDefault();
                                                                    }}
                                                                >
                                                                    <Home size={14} className="opt-icon" /> {isAirbnbDisabled(room) ? "Recently Sold Out" : "Book on Airbnb"}
                                                                </a>
                                                                <a
                                                                    href="https://www.instagram.com/villakaruna/"
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="option-btn instagram"
                                                                >
                                                                    <Instagram size={14} className="opt-icon" /> Offline Booking
                                                                </a>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <button
                                                        className={`btn-details ${!isAvailable && hasSearched ? 'disabled' : ''}`}
                                                        disabled={!isAvailable && hasSearched}
                                                        onClick={(e) => {
                                                            if (!isAvailable && hasSearched) {
                                                                e.preventDefault();
                                                                return;
                                                            }
                                                            onSearch();
                                                        }}
                                                    >
                                                        {hasSearched ? (isAvailable ? "Book Now" : "Sold Out") : "Check Availability"} <ArrowRight size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>
        </section>
    );
};

export default RoomList;
