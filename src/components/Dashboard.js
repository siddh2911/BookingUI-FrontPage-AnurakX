import React, { useState, useEffect, useRef } from 'react';
import { Star, Calendar, Heart, Award, TrendingUp } from 'lucide-react';
import './Dashboard.css';

const CountUp = ({ end, duration = 2000, decimals = 0, prefix = '', suffix = '', start = false }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!start) return;

        let startTime = null;
        let animationFrame;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);

            // Easing function (easeOutExpo)
            const ease = percentage === 1 ? 1 : 1 - Math.pow(2, -10 * percentage);

            const currentCount = ease * end;
            setCount(currentCount);

            if (percentage < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => {
            if (animationFrame) cancelAnimationFrame(animationFrame);
        };
    }, [end, duration, start]);

    return (
        <span>
            {prefix}
            {Number(count.toFixed(decimals)).toLocaleString()}
            {suffix}
        </span>
    );
};

const Dashboard = () => {
    // Mock data state
    const [stats] = useState({
        rating: 4.92,
        reviews: 128,
        bookings: 154,
        happyGuests: 385,
        awards: 12
    });

    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect(); // Only trigger once
                }
            },
            { threshold: 0.2 } // Trigger when 20% visible
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);



    return (
        <div className="dashboard-container" ref={sectionRef}>


            <div className="stats-grid">

                {/* Rating Card */}
                <div className="stat-card glass-panel">
                    <div className="stat-icon-wrapper yellow">
                        <Star size={24} />
                    </div>
                    <div className="stat-content">
                        <h3>Average Rating</h3>
                        <div className="stat-value">
                            <CountUp end={stats.rating} decimals={2} duration={2500} start={isVisible} />
                        </div>
                        <div className="stat-subtext">Based on {stats.reviews} reviews</div>
                    </div>
                </div>

                {/* Bookings Card */}
                <div className="stat-card glass-panel">
                    <div className="stat-icon-wrapper purple">
                        <Calendar size={24} />
                    </div>
                    <div className="stat-content">
                        <h3>Total Bookings</h3>
                        <div className="stat-value">
                            <CountUp end={stats.bookings} duration={2000} start={isVisible} />
                        </div>
                        <div className="stat-trend positive">
                            <TrendingUp size={16} />
                            <span>+5 new today</span>
                        </div>
                    </div>
                </div>



                {/* Happy Guests Card */}
                <div className="stat-card glass-panel">
                    <div className="stat-icon-wrapper red">
                        <Heart size={24} />
                    </div>
                    <div className="stat-content">
                        <h3>Happy Guests</h3>
                        <div className="stat-value">
                            <CountUp end={stats.happyGuests} duration={2200} start={isVisible} />
                        </div>
                        <div className="stat-trend positive">
                            <TrendingUp size={16} />
                            <span>100% Satisfaction</span>
                        </div>
                    </div>
                </div>

                {/* Awards Won Card */}
                <div className="stat-card glass-panel">
                    <div className="stat-icon-wrapper gold">
                        <Award size={24} />
                    </div>
                    <div className="stat-content">
                        <h3>Awards Won</h3>
                        <div className="stat-value">
                            <CountUp end={stats.awards} duration={3000} start={isVisible} />
                        </div>
                        <div className="stat-trend positive">
                            <TrendingUp size={16} />
                            <span>Excellence</span>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Dashboard;
