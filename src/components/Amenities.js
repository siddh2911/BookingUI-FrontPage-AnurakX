import React from 'react';
import { Wifi, MapPin, Coffee, Activity, Utensils, LifeBuoy } from 'lucide-react';
import './Amenities.css';

const amenities = [
    { icon: <LifeBuoy size={24} />, title: "Infinity Pool", desc: "Overlooking the ocean" },
    { icon: <Utensils size={24} />, title: "Fine Dining", desc: "Local & International cuisine" },
    { icon: <Activity size={24} />, title: "Wellness Spa", desc: "Rejuvenate your senses" },
    { icon: <Wifi size={24} />, title: "High-Speed Wifi", desc: "Stay connected everywhere" },
    { icon: <Coffee size={24} />, title: "In-Room Breakfast", desc: "Served daily at your leisure" },
    { icon: <MapPin size={24} />, title: "Prime Location", desc: "Minutes from the beach" },
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
