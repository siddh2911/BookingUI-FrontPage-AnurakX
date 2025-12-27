import React, { useRef, useLayoutEffect } from 'react';
import { MapPin, Coffee, Home, Users, Shield, Bell } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Amenities.css';

gsap.registerPlugin(ScrollTrigger);

const amenities = [
    { icon: <Home size={24} />, title: "Your Private Space", desc: "The privacy and comfort of a full apartment." },
    { icon: <Coffee size={24} />, title: "Home Comforts", desc: "Fully furnished suites with modern essentials." },
    { icon: <MapPin size={24} />, title: "Peaceful Location", desc: "Quiet setting minutes from Ghats & temples." },
    { icon: <Users size={24} />, title: "For Every Traveler", desc: "Ideal for families, workations, and spiritual retreats." },
    { icon: <Shield size={24} />, title: "Safe & Welcoming", desc: "A secure, hygienic, and friendly environment." },
    { icon: <Bell size={24} />, title: "Assisted Service", desc: "Personalized host assistance for all your needs." }
];

const Amenities = () => {
    return (
        <section className="amenities-section" id="experiences">
            <div className="container">
                <div className="section-header">
                    <span className="section-subtitle">Services & Facilities</span>
                    <h2 className="section-title">Designed for Comfort</h2>
                </div>

                <div className="amenities-grid">
                    {amenities.map((item, index) => (
                        <div key={index} className="amenity-card">
                            <div className="amenity-icon">{item.icon}</div>
                            <h4>{item.title}</h4>
                            <p>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Amenities;
