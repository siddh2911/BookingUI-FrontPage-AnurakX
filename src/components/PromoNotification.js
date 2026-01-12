import React, { useState } from 'react';
import { X, Gift } from 'lucide-react';
import './PromoNotification.css';

const PromoNotification = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 600);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="promo-notification">
            <div className="promo-content">
                <Gift size={isMobile ? 14 : 16} className="promo-icon" />
                <span className="promo-text">
                    {isMobile ? (
                        <>Get 10% Off (5+ Nights) • Code: <span className="promo-code">JAN10</span></>
                    ) : (
                        <>Special Offer: Use code <span className="promo-code">JAN10</span> for 10% off (Min. 5 nights)!</>
                    )}
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
