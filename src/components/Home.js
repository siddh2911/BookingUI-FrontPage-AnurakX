import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hero from './Hero';
import RoomList from './RoomList';
import Amenities from './Amenities';
import Dashboard from './Dashboard';
import StorySection from './StorySection';
import CustomerExperiences from './CustomerExperiences';

gsap.registerPlugin(ScrollTrigger);

const Home = ({
    onSearch,
    onOpenCalendar,
    checkIn,
    checkOut,
    searchResults,
    isLoading,
    hasSearched
}) => {
    const contentRef = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Animate all direct children sections of the content wrapper
            // Staggering them slightly or just triggering individually
            const sections = gsap.utils.toArray(".page-section");

            sections.forEach(section => {
                gsap.fromTo(section,
                    { y: 50, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 1,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: section,
                            start: "top 85%", // Start animation when top of section hits 85% of viewport height
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            });
        }, contentRef);

        return () => ctx.revert();
    }, []);

    return (
        <>
            <Hero
                onSearch={onSearch}
                onOpenCalendar={onOpenCalendar}
                checkIn={checkIn}
                checkOut={checkOut}
            />

            {/* Wrapper for animated content below Hero */}
            <div ref={contentRef} style={{ overflow: 'hidden' }}>
                <div className="page-section">
                    <StorySection />
                </div>
                <div className="page-section">
                    <RoomList
                        rooms={searchResults}
                        isLoading={isLoading}
                        hasSearched={hasSearched}
                        onSearch={onSearch} // Assuming search logic might be needed passed down?
                    />
                </div>
                <div className="page-section">
                    <Amenities />
                </div>
                <div className="page-section">
                    <CustomerExperiences />
                </div>
                <div className="page-section">
                    <Dashboard />
                </div>
            </div>
        </>
    );
};

export default Home;
