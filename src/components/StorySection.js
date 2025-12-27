import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './StorySection.css';

gsap.registerPlugin(ScrollTrigger);

const StorySection = () => {
    const sectionRef = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                    end: "bottom 60%", // Define an end point for scrub
                    scrub: 1, // Smooth scrubbing effect
                    toggleActions: "play none none reverse"
                }
            });

            tl.from(".chapter-marker", { y: 20, opacity: 0, duration: 0.8 })
                .from("h2", { y: 30, opacity: 0, duration: 0.8 }, "-=0.6")
                .from(".header-line", { width: 0, duration: 1, ease: "power2.out" }, "-=0.4")
                .from(".story-img-card", {
                    y: 50,
                    opacity: 0,
                    duration: 1,
                    stagger: 0.2,
                    ease: "power3.out"
                }, "-=0.5")
                .from(".story-editorial-text", { x: 30, opacity: 0, duration: 1 }, "-=0.8");

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section className="story-section" id="story" ref={sectionRef}>
            <div className="story-container">
                <div className="story-header">
                    <span className="chapter-marker">The Experience</span>
                    <h2>Not Just a Stay.<br />A State of Mind.</h2>
                    <div className="header-line"></div>
                </div>

                <div className="story-content-wrapper">
                    <div className="story-visuals">
                        <div className="story-img-card main-img">
                            <img src="/images/varanasi-hero-custom.jpg" alt="Ganga Aarti Lamps" />
                        </div>
                        <div className="story-img-card secondary-img">
                            <img src="/images/varanasi-hero-custom-2.jpg" alt="Varanasi Celebration" />
                        </div>
                    </div>

                    <div className="story-editorial-text">
                        <h3>Escape the Ordinary</h3>
                        <p>
                            Varanasi isn't just a destination; it's an awakening. At Karuna Villa, we've curated a
                            sanctuary that honors this eternal spirit. Whether you're seeking a quiet corner to
                            reflect or a luxurious base to explore the Ghats, our doors open to a world where
                            tradition whispers in every corner and modern comfort holds you close.
                        </p>

                        <div className="story-features">
                            <div className="feature-item">
                                <span className="feature-icon">✨</span>
                                <h4>Curated Luxury</h4>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">🌿</span>
                                <h4>Quietude</h4>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">🤝</span>
                                <h4>Service</h4>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="story-footer">
                    <p><em>"While we don't not offer free stays, we offer a value that is priceless—memories carved in stone and silence."</em></p>
                </div>
            </div>
        </section>
    );
};

export default StorySection;
