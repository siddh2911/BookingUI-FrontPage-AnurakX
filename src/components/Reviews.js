import React from 'react';
import { Star } from 'lucide-react';
import './Reviews.css';

const Reviews = () => {
    const reviews = [
        {
            id: 1,
            name: "Sarah",
            date: "December 2025",
            avatar: "https://ui-avatars.com/api/?name=Sarah&background=random",
            text: "This villa is absolutely stunning! The photos don't do it justice. The infinity pool at sunset is magical."
        },
        {
            id: 2,
            name: "Michael",
            date: "November 2025",
            avatar: "https://ui-avatars.com/api/?name=Michael&background=random",
            text: "Anurak was a fantastic host. Very responsive and helpful. The location is peaceful yet close to everything."
        },
        {
            id: 3,
            name: "Jessica",
            date: "October 2025",
            avatar: "https://ui-avatars.com/api/?name=Jessica&background=random",
            text: "The best Airbnb we've ever stayed in. The design is beautiful and the amenities are top notch. Highly recommend!"
        },
        {
            id: 4,
            name: "David",
            date: "September 2025",
            avatar: "https://ui-avatars.com/api/?name=David&background=random",
            text: "Perfect getaway. We loved the open living space and the garden. Will definitely come back."
        }
    ];

    return (
        <div className="reviews-section">
            <div className="reviews-header">
                <Star size={20} fill="var(--text-primary)" />
                <h2>4.92 · 128 reviews</h2>
            </div>

            <div className="reviews-grid">
                {reviews.map(review => (
                    <div key={review.id} className="review-card">
                        <div className="reviewer-info">
                            <img src={review.avatar} alt={review.name} className="reviewer-avatar" />
                            <div className="reviewer-details">
                                <div className="reviewer-name">{review.name}</div>
                                <div className="review-date">{review.date}</div>
                            </div>
                        </div>
                        <div className="review-text">
                            {review.text}
                        </div>
                    </div>
                ))}
            </div>

            <button className="show-all-reviews-btn">Show all 128 reviews</button>
            <div className="divider"></div>
        </div>
    );
};

export default Reviews;
