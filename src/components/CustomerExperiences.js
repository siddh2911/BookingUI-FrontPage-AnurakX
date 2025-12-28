import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star, MapPin, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import './CustomerExperiences.css';
import realReviews from '../data/reviews.json';

gsap.registerPlugin(ScrollTrigger);



const experiences = realReviews.length > 0 ? realReviews : [
    {
        id: 1,
        name: "Elena & Marco",
        location: "Italy",
        image: "https://images.unsplash.com/photo-1542596594-649edbc13630?q=80&w=1000&auto=format&fit=crop",
        quote: "We found a piece of paradise here. The morning view of the Ghats is something we will carry in our hearts forever.",
        rating: 5,
        type: "Honeymoon Stay"
    },
    {
        id: 2,
        name: "Rohan Mehta",
        location: "Mumbai, India",
        image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=1000&auto=format&fit=crop",
        quote: "The silence at Karuna Villa is its loudest feature. A perfect contrast to the chaos of the city.",
        rating: 5,
        type: "Solo Retreat"
    },
    {
        id: 3,
        name: "The Sarah Jenkins Family",
        location: "London, UK",
        image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1000&auto=format&fit=crop",
        quote: "Our kids loved the garden, and we loved the hospitality. It felt less like a hotel and more like home.",
        rating: 5,
        type: "Family Vacation"
    }
];

// Helper to get HD image (Raw Original)
const getHDImage = (url) => {
    if (!url) return '';
    // Strip query params to get the raw original image
    return url.split('?')[0];
};

const CustomerExperiences = () => {
    const sectionRef = useRef(null);
    const sliderRef = useRef(null);
    const nudgeTween = useRef(null);

    // 1. Clean Data: Replace "Airbnb" location with "India"
    const cleanedExperiences = experiences.map(exp => ({
        ...exp,
        location: (exp.location === 'Airbnb' || exp.location === 'airbnb') ? 'India' : exp.location
    }));

    // 2. Sort: Priority (Pooja > Phungshokngam) then Images
    const sortedExperiences = [...cleanedExperiences].sort((a, b) => {
        const nameA = (a.name || '').toLowerCase();
        const nameB = (b.name || '').toLowerCase();

        // Level 1: Pooja
        if (nameA.includes('pooja')) return -1;
        if (nameB.includes('pooja')) return 1;

        // Level 2: Phungshokngam
        if (nameA.includes('phungshokngam')) return -1;
        if (nameB.includes('phungshokngam')) return 1;

        // Level 3: Has Image
        const hasImgA = a.image && a.image.length > 0;
        const hasImgB = b.image && b.image.length > 0;
        if (hasImgA && !hasImgB) return -1;
        if (!hasImgA && hasImgB) return 1;

        return 0;
    });

    useLayoutEffect(() => {
        const mm = gsap.matchMedia();
        const ctx = gsap.context(() => {
            // Header Animation (Works everywhere)
            gsap.from(".exp-header-content", {
                y: 50,
                opacity: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".exp-header",
                    start: "top 80%",
                }
            });

            // Slider Entry Animation (Works everywhere)
            gsap.from(".experience-card", {
                x: 100,
                duration: 1,
                stagger: 0.1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".experiences-slider",
                    start: "top 85%"
                }
            });

            // Premium "Kinetic Nudge" Loop (STRICTLY MOBILE ONLY)
            // matchMedia ensures this context runs ONLY when condition is met
            mm.add("(max-width: 768px)", () => {
                // Wait for entry to finish roughly (1s + stagger) before starting nudge
                // or just use delay
                nudgeTween.current = gsap.to(".experience-card", {
                    x: -80, // Deep nudge
                    duration: 1.6,
                    ease: "power2.inOut",
                    yoyo: true, // Return to center
                    repeat: -1, // Infinite loop
                    repeatDelay: 1.5,
                    delay: 1.5, // Wait for entry animation
                    scrollTrigger: {
                        trigger: ".experiences-slider",
                        start: "top 85%",
                        toggleActions: "play pause resume pause"
                    }
                });
            });
        }, sectionRef);

        return () => ctx.revert(); // Reverts matchMedia too inside context
    }, []);

    const scroll = (direction) => {
        if (sliderRef.current) {
            const scrollAmount = 350 + 32; // Card width + gap
            sliderRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section className="customer-experiences-section" id="experiences" ref={sectionRef}>
            <div className="exp-container">
                <div className="exp-header">
                    <div className="exp-header-content">
                        <span className="exp-subtitle">Moments captured</span>
                        <h2>Guest Stories</h2>
                        <div className="exp-divider"></div>
                        <p>Real stories from those who have walked our halls and lived the experience.</p>
                    </div>
                </div>

                <div className="slider-wrapper">
                    <button
                        className="nav-btn prev-btn"
                        onClick={() => scroll('left')}
                        aria-label="Previous review"
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <div
                        className="experiences-slider"
                        ref={sliderRef}
                    >
                        {sortedExperiences.map((exp) => (
                            <div
                                key={exp.id}
                                className="experience-card"
                            >
                                {/* ... card content ... */}
                                <div className="card-image-wrapper">
                                    {exp.image ? (
                                        <img
                                            src={getHDImage(exp.image)}
                                            alt={exp.name}
                                            className="card-image"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="card-image-placeholder" style={{
                                            width: '100%',
                                            height: '100%',
                                            backgroundColor: '#f5f5f5',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '2rem',
                                            color: '#d4a373',
                                            fontFamily: '"Playfair Display", serif'
                                        }}>
                                            {exp.name.charAt(0)}
                                        </div>
                                    )}
                                    <div className="card-overlay">
                                        <div className="chip">{exp.type || 'Guest Review'}</div>
                                    </div>
                                </div>
                                <div className="card-content">
                                    <Quote size={24} className="quote-icon" />
                                    <p className="card-quote">"{exp.quote}"</p>
                                    <div className="card-footer">
                                        <div className="card-author">
                                            <h4>{exp.name}</h4>
                                            <span className="location">
                                                <MapPin size={12} style={{ marginRight: '4px' }} />
                                                {exp.location}
                                            </span>
                                        </div>
                                        <div className="card-rating">
                                            {[...Array(exp.rating)].map((_, i) => (
                                                <Star key={i} size={14} fill="currentColor" className="star-icon" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        className="nav-btn next-btn"
                        onClick={() => scroll('right')}
                        aria-label="Next review"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default CustomerExperiences;
