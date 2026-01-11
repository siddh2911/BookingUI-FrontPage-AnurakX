import React, { useState } from 'react';
import { X, Gift } from 'lucide-react';
import './PromoNotification.css';

const PromoNotification = () => {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="promo-notification">
            <div className="promo-content">
                <Gift size={16} className="promo-icon" />
                <span className="promo-text">
                    Special Offer: Use code <span className="promo-code">JAN10</span> for 10% off (Min. 5 nights)!
                </span>
            </div>
            <button
                className="close-promo"
                onClick={() => setIsVisible(false)}
                aria-label="Close notification"
            >
                <X size={16} />
            </button>
        </div>
    );
};

export default PromoNotification;
