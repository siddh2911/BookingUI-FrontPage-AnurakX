import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Users, Maximize, ArrowRight, X, Home, Instagram, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
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
        size: "2000 sqm",
        guests: "2 Adults"
    },
    {
        id: 2,
        roomName: "Garden Family Room",
        pricePerNight: "680",
        image: "/images/villa-1.png",
        size: "2000 sqm",
        guests: "4 Adults"
    },
    {
        id: 3,
        roomName: "Karuna Villa Elite",
        pricePerNight: "15,000",
        image: "/images/elite/elite-card.jpg",
        size: "2000 sqm",
        guests: "8 Adults"
    },
    {
        id: 4,
        roomName: "Karuna Zenith",
        pricePerNight: "18,000",
        image: "/images/zenith-card.jpg",
        size: "2000 sqm",
        guests: "10 Adults"
    },
    {
        id: 5,
        roomName: "Little Haven",
        pricePerNight: "35,000",
        image: "/images/villa-2.png",
        size: "3000 sqm",
        guests: "14 Adults"
    }
];

const RoomList = ({ rooms: propRooms = [], isLoading = false, hasSearched = false, onSearch, onOpenCalendar, checkIn, checkOut, discount = 0 }) => {
    const [activeRoomIndex, setActiveRoomIndex] = useState(null);
    const [pendingRoomIndex, setPendingRoomIndex] = useState(null);
    const sliderRef = useRef(null);
    const sectionRef = useRef(null);

    const scroll = (direction) => {
        if (sliderRef.current) {
            const scrollAmount = 360 + 40;
            sliderRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        if (checkIn && checkOut && pendingRoomIndex !== null) {
            setActiveRoomIndex(pendingRoomIndex);
            setPendingRoomIndex(null);
        }
    }, [checkIn, checkOut, pendingRoomIndex]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (activeRoomIndex !== null && !event.target.closest('.booking-actions-wrapper')) {
                setActiveRoomIndex(null);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [activeRoomIndex]);

    useLayoutEffect(() => {
        if (!isLoading && sectionRef.current) {
            const context = gsap.context(() => {
                const cards = sectionRef.current.querySelectorAll('.room-card');

                if (cards.length > 0) {
                    gsap.fromTo(cards,
                        {
                            y: 50,
                            opacity: 0
                        },
                        {
                            y: 0,
                            opacity: 1,
                            duration: 0.8,
                            stagger: 0.1,
                            ease: "power3.out",
                            scrollTrigger: {
                                trigger: sectionRef.current,
                                start: "top 80%",
                                toggleActions: "play none none reverse"
                            }
                        }
                    );

                    if (window.innerWidth <= 768 && sliderRef.current) {
                        gsap.to(sliderRef.current, {
                            x: -30,
                            duration: 0.6,
                            ease: "power2.inOut",
                            yoyo: true,
                            repeat: 1,
                            delay: 1.2,
                            scrollTrigger: {
                                trigger: sectionRef.current,
                                start: "top 80%",
                                once: true
                            }
                        });
                    }
                }
            }, sectionRef);

            return () => context.revert();
        }
    }, [isLoading, propRooms]);

    const getImage = (room, index) => {
        const name = room.roomName || room.name || room.type;

        if (name === "Karuna Villa Elite") {
            return "https://a0.muscache.com/im/pictures/hosting/Hosting-1110080531767633017/original/c8f80d69-d3ad-42db-ab90-bd46d4303be8.jpeg?im_w=720";
        }
        if (name === "Tranquil Retreat") {
            return "https://a0.muscache.com/im/pictures/hosting/Hosting-1591261284053736774/original/79980286-7af0-4eed-a587-10fb6da65f12.jpeg?im_w=720";
        }
        if (name === "Little Haven") {
            return "https://a0.muscache.com/im/pictures/hosting/Hosting-1591261284053736774/original/8dbacadd-5127-4c73-84cc-ae753dbfb3bd.jpeg?im_w=720";
        }
        if (name === "Karuna Zenith") {
            return "https://a0.muscache.com/im/pictures/hosting/Hosting-1356963405791829086/original/30fba1a5-ab35-4934-b131-07f4617bf494.jpeg?im_w=720";
        }

        if (room.image && !room.image.includes('placeholder')) return room.image;
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
        if (name === "Tranquil Retreat") return "https://www.airbnb.co.in/rooms/1591261284053736774";
        return "https://www.airbnb.co.in/rooms/1356963405791829086?photo_id=2418950488&source_impression_id=p3_1766802418_P3VeQ7SZhMqSQqO2&previous_page_section_name=1000";
    };

    const isAirbnbDisabled = (room) => {
        return false;
    };

    let processedRooms = propRooms;
    if (!hasSearched && (!processedRooms || processedRooms.length === 0)) {
        processedRooms = rooms.map(room => {
            if (room.id === 1) return { ...room, roomName: "Tranquil Retreat" };
            return room;
        });
    }

    return (
        <section className="room-list-section" id="rooms" ref={sectionRef}>
            <div className="container room-list-container">
                <div className="section-header">
                    <span className="section-subtitle">Accommodations</span>
                    <h2 className="section-title">Available Rooms</h2>
                    <p className="section-desc">Experience the pinnacle of luxury during your stay.</p>
                </div>

                <div className="slider-wrapper">
                    <button
                        className="nav-btn prev-btn"
                        onClick={() => scroll('left')}
                        aria-label="Previous room"
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <div className="rooms-grid" ref={sliderRef}>
                        {isLoading ? (
                            <div className="loading-state" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem' }}>
                                Fetching live rates & availability...
                            </div>
                        ) : (
                            processedRooms && processedRooms.length > 0 ? (
                                processedRooms.map((room, index) => {
                                    return (
                                        <div
                                            className={`room-card ${!room.isAvailable && hasSearched ? 'sold-out' : ''}`}
                                            key={room.id || index}
                                        >
                                            <div className="room-image">
                                                <img
                                                    src={getImage(room, index)}
                                                    alt={room.roomName || room.type}
                                                    onError={(e) => {
                                                        e.target.src = "/images/villa-1.png";
                                                        e.target.onerror = null;
                                                    }}
                                                />
                                                <div className="overlay" />
                                                {!room.isAvailable && hasSearched && (
                                                    <div className="sold-out-overlay">
                                                        <span>Sold Out</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="room-details">
                                                <h3>{room.roomName || room.type}</h3>

                                                <div className="room-location">
                                                    <MapPin size={14} className="location-icon" />
                                                    <span>Varanasi</span>
                                                </div>

                                                <div className="room-meta">
                                                    <span title="Room Size">
                                                        <Maximize size={16} />
                                                        {room.size || "2000 sqm"}
                                                    </span>
                                                    <span title="Guest Capacity">
                                                        <Users size={16} />
                                                        {room.capacity || room.guests || "2 Adults"}
                                                    </span>
                                                </div>

                                                <div className="room-footer-content">
                                                    <div className="price-tag">
                                                        <span className="currency">₹</span>
                                                        <span className="amount">
                                                            {discount > 0 ? (
                                                                <>
                                                                    <span style={{ textDecoration: 'line-through', opacity: 0.5, fontSize: '0.8em', marginRight: '8px' }}>
                                                                        {room.pricePerNight}
                                                                    </span>
                                                                    {Math.round(parseFloat(String(room.pricePerNight).replace(/,/g, '')) * (1 - discount / 100)).toLocaleString()}
                                                                </>
                                                            ) : (
                                                                room.pricePerNight
                                                            )}
                                                        </span>
                                                        <span className="period">/ night</span>
                                                    </div>

                                                    <div className="booking-actions-wrapper">
                                                        {activeRoomIndex === index ? (
                                                            <div className="booking-options-wrapper" onClick={(e) => e.stopPropagation()}>
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
                                                                        <Instagram size={14} className="opt-icon" /> Book Offline
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                className={`btn-details ${(!room.isAvailable && hasSearched) || isAirbnbDisabled(room) ? 'disabled' : ''}`}
                                                                disabled={(!room.isAvailable && hasSearched) || isAirbnbDisabled(room)}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    if (!room.isAvailable && hasSearched) {
                                                                        e.preventDefault();
                                                                        return;
                                                                    }

                                                                    if (checkIn && checkOut) {
                                                                        setActiveRoomIndex(index);
                                                                    } else {
                                                                        setPendingRoomIndex(index);
                                                                        if (onOpenCalendar) onOpenCalendar();
                                                                    }
                                                                }}
                                                            >
                                                                {!room.isAvailable && hasSearched ? "Sold Out" : ((checkIn && checkOut) ? "Book Stay" : "Check Availability")} <ArrowRight size={16} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            ) : (
                                <div className="no-rooms-message">
                                    <h3>No Rooms Available</h3>
                                    <p>We couldn't find any rooms matching your criteria. Please try adjusting your filters.</p>
                                </div>
                            )
                        )}
                    </div>

                    <button
                        className="nav-btn next-btn"
                        onClick={() => scroll('right')}
                        aria-label="Next room"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default RoomList;
