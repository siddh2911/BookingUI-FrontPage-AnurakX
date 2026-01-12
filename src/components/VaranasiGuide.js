import React from 'react';
import { Clock } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './VaranasiGuide.css';

gsap.registerPlugin(ScrollTrigger);

const places = [
    {
        id: 1,
        title: "Kashi Vishwanath Temple",
        description: "The heart of Varanasi and one of the twelve Jyotirlingas. Ancient scriptures say Kashi stands eternally upon Lord Shiva's trident. The new Corridor now offers seamless access to this spiritual epicenter.",
        time: "4:00 AM - 11:00 PM",
        image: "/images/varanasi/kashi_new.webp"
    },
    {
        id: 2,
        title: "Dashashwamedh Ghat (Ganga Aarti)",
        description: "Kashi's most spectacular and oldest ghat. Its name signifies the 'Ghat of ten sacrificial horses', marking it as a site of immense ancient significance and the stage for the daily Ganga Aarti.",
        time: "Evening Aarti: 6:45 PM",
        image: "/images/varanasi/dashashwamedh_new.jpg"
    },
    {
        id: 3,
        title: "Sarnath",
        description: "A place located 10 kilometres north-east of Varanasi near the confluence of the Ganges and the Varuna rivers in Uttar Pradesh, India. The deer park in Sarnath is where Gautama Buddha first taught the Dharma.",
        time: "Sunrise - Sunset",
        image: "/images/varanasi/sarnath_final.jpg"
    },
    {
        id: 4,
        title: "Assi Ghat",
        description: "The southernmost ghat in Varanasi. To most visitors to Varanasi, it is known for being a place where long-term foreign students, researchers, and tourists live.",
        time: "Always Open",
        image: "/images/varanasi/assighat_new.jpg"
    }
];

const VaranasiGuide = () => {
    const sectionRef = React.useRef(null);

    React.useEffect(() => {
        const ctx = gsap.context(() => {
            // Header Animation - Smooth fade up
            gsap.from(".guide-header", {
                y: 40,
                opacity: 0,
                duration: 1.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".guide-header",
                    start: "top 85%",
                    toggleActions: "play none none none"
                }
            });

            // Cards Animation - Staggered elegant entry
            gsap.from(".place-card", {
                y: 15, // Tighter lift to avoid gap issues
                opacity: 0,
                duration: 1.2,
                stagger: 0.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".places-grid",
                    start: "top 85%",
                    toggleActions: "play none none none"
                },
                clearProps: "transform" // Critical: Remove inline transform to allow CSS hover effects and perfect alignment
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section className="varanasi-guide" id="varanasi-guide" ref={sectionRef}>
            <div className="guide-container">
                <div className="guide-header">
                    <span className="guide-subtitle">Discover the City</span>
                    <h2 className="guide-title">The Soul of Varanasi</h2>
                    <p className="guide-desc">
                        Immerse yourself in the spiritual capital of India. Explore ancient temples,
                        witness the divine Ganga Aarti, and walk through the timeless alleys of Kashi.
                    </p>
                </div>

                <div className="places-grid">
                    {places.map((place) => (
                        <div key={place.id} className="place-card">
                            <div className="place-image-wrapper">
                                <img src={place.image} alt={place.title} loading="lazy" />
                            </div>
                            <div className="place-content">
                                <h3 className="place-title">{place.title}</h3>
                                <p className="place-desc">{place.description}</p>
                                <div className="place-meta">
                                    <div className="meta-item">
                                        <Clock size={16} />
                                        <span>{place.time}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default VaranasiGuide;
