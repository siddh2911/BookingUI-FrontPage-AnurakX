import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Star, Calendar, Heart, Award, TrendingUp } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Dashboard.css';

gsap.registerPlugin(ScrollTrigger);

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
        reviews: 44,
        bookings: 154,
        happyGuests: 385,
        awards: 2
    });

    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    useLayoutEffect(() => {
        const mm = gsap.matchMedia();

        mm.add({
            isDesktop: "(min-width: 769px)",
            isMobile: "(max-width: 768px)",
        }, (context) => {
            const { isDesktop } = context.conditions;

            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: "top 85%",
                onEnter: () => setIsVisible(true),
                once: true
            });

            gsap.fromTo(".stat-card",
                {
                    y: 60,
                    autoAlpha: 0, // autoAlpha handles opacity + visibility
                    scale: 0.95
                },
                {
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 85%", // Trigger on section for the group
                        toggleActions: "play none none reverse"
                    },
                    y: 0,
                    autoAlpha: 1,
                    scale: 1,
                    duration: 0.8,
                    // If grid triggers as one unit, stagger is fine. 
                    // But on mobile, if they stack, we might want faster stagger.
                    stagger: 0.15,
                    ease: "back.out(1.2)",
                    clearProps: "transform"
                }
            );
        }, sectionRef);

        return () => mm.revert();
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
