import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ShoppingBag, Star, Clock, Info, X, Plus, Minus, CheckCircle, Utensils } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './FoodOrder.css';

gsap.registerPlugin(ScrollTrigger);

const MENU_CATEGORIES = [
    // ... (rest of categories)
    { id: 'all', label: 'All' },
    { id: 'banaras', label: 'Banaras Specials' },
    { id: 'mains', label: 'Main Course' },
    { id: 'breakfast', label: 'Breakfast' },
    { id: 'beverages', label: 'Beverages' }
];

const MENU_ITEMS = [
    {
        id: 1,
        name: "Banarasi Thali",
        description: "A royal platter featuring seasonal vegetables, dal, rice, chapati, pickle, salad, and a sweet treat.",
        price: 450,
        category: "banaras",
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
        isPopular: true
    },
    {
        id: 2,
        name: "Ganga Aarti Chai",
        description: "Our signature spiced tea brewed with saffron, cardamom, and a hint of rose petals.",
        price: 120,
        category: "beverages",
        image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80",
        isPopular: true
    },
    {
        id: 3,
        name: "Stuffed Paratha Platter",
        description: "Two generously stuffed parathas (Aloo/Paneer) served with fresh curd and homemade butter.",
        price: 280,
        category: "breakfast",
        image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80",
        isPopular: false
    },
    {
        id: 4,
        name: "Paneer Malai Kofta",
        description: "Soft cottage cheese dumplings simmered in a rich, creamy cashew and tomato gravy.",
        price: 380,
        category: "mains",
        image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80",
        isPopular: true
    },
    {
        id: 5,
        name: "Lassi 'Karuna Style'",
        description: "Thick, creamy yogurt drink topped with rabri, dry fruits, and earthen clay pot aroma.",
        price: 150,
        category: "beverages",
        image: "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=800&q=80",
        isPopular: false
    },
    {
        id: 6,
        name: "Kachori Sabzi Breakfast",
        description: "Crispy kachoris served with spicy potato curry and jalebi - the classic Banarasi morning.",
        price: 220,
        category: "banaras",
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
        isPopular: true
    },
    {
        id: 7,
        name: "Dal Makhani",
        description: "Black lentils slow-cooked overnight with cream, butter, and mild spices. A North Indian favorite.",
        price: 320,
        category: "mains",
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
        isPopular: false
    },
    {
        id: 8,
        name: "Fresh Fruit Platter",
        description: "A selection of seasonal tropical fruits sourced locally, served chilled with a hint of mint.",
        price: 240,
        category: "breakfast",
        image: "https://images.unsplash.com/photo-1519996529931-28324d5a630e?auto=format&fit=crop&w=800&q=80",
        isPopular: false
    },
    {
        id: 9,
        name: "Butter Chicken",
        description: "Tender pieces of grilled chicken in a velvety, buttery tomato gravy. Classic comfort food.",
        price: 420,
        category: "mains",
        image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80",
        isPopular: true
    },
    {
        id: 10,
        name: "Cold Coffee with Ice Cream",
        description: "Rich blended coffee served with a scoop of vanilla ice cream and chocolate drizzle.",
        price: 180,
        category: "beverages",
        image: "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=800&q=80",
        isPopular: false
    }
];

const FoodOrder = () => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [orderStep, setOrderStep] = useState('browsing'); // browsing, checking-out, success
    const [roomNumber, setRoomNumber] = useState('');
    const [specialRequests, setSpecialRequests] = useState('');

    const pageRef = useRef(null);
    const gridRef = useRef(null);

    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    const filteredItems = useMemo(() => {
        return MENU_ITEMS.filter(item => {
            const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, searchQuery]);

    // 1. Unified Cinematic Entry (Hero + Navigation)
    useEffect(() => {
        const ctx = gsap.context(() => {
            const entryTl = gsap.timeline();

            // Initial state set to avoid FOUC
            gsap.set([".hero-content > *", ".cat-tab"], { autoAlpha: 0, y: 30 });
            gsap.set(".food-hero-bg", { scale: 1.1, opacity: 0 });

            entryTl
                .to(".food-hero-bg", {
                    scale: 1,
                    opacity: 1,
                    duration: 2,
                    ease: "power2.out"
                })
                .to(".hero-content > *", {
                    autoAlpha: 1,
                    y: 0,
                    duration: 1.2,
                    stagger: 0.2,
                    ease: "power3.out"
                }, "-=1.2")
                .to(".cat-tab", {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.08,
                    ease: "back.out(1.4)"
                }, "-=0.6");

        }, pageRef);
        return () => ctx.revert();
    }, []);

    // 2. Dynamic Grid Reveals (ScrollTrigger + Batch)
    useEffect(() => {
        const ctx = gsap.context(() => {
            const cards = gsap.utils.toArray(".menu-card-premium");

            // Set initial state via GSAP
            gsap.set(cards, { autoAlpha: 0, y: 30 });

            ScrollTrigger.batch(cards, {
                start: "top 95%",
                onEnter: batch => gsap.to(batch, {
                    autoAlpha: 1,
                    y: 0,
                    stagger: { each: 0.1, grid: [1, 3] },
                    overwrite: true,
                    duration: 0.8,
                    ease: "power2.out",
                    clearProps: "transform"
                }),
                onLeaveBack: batch => gsap.to(batch, { autoAlpha: 0, y: 30, overwrite: true })
            });

            ScrollTrigger.refresh();
        }, pageRef);
        return () => ctx.revert();
    }, [filteredItems]);

    // Total Amount Counting & Badge Pop Animation
    useEffect(() => {
        if (totalAmount > 0) {
            const tl = gsap.timeline();
            tl.to(".cart-total-badge", {
                duration: 0.3,
                scale: 1.15,
                ease: "power2.out",
                yoyo: true,
                repeat: 1
            });

            gsap.fromTo(".cart-count",
                { scale: 1 },
                { scale: 1.3, duration: 0.3, ease: "back.out(2)", yoyo: true, repeat: 1 }
            );
        }
    }, [totalAmount]);

    // Floating Cart Entrance Animation
    useEffect(() => {
        if (totalItems > 0) {
            gsap.fromTo(".floating-cart-btn",
                { y: 30, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: 1, ease: "power4.out" }
            );
        }
    }, [totalItems > 0]);

    // Cart Drawer Content Reveal
    useEffect(() => {
        if (isCartOpen && cart.length > 0) {
            const tl = gsap.timeline({ delay: 0.2 });
            tl.fromTo([".cart-item", ".cart-summary", ".checkout-form > *"],
                { autoAlpha: 0, y: 20 },
                {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.6,
                    stagger: 0.05,
                    ease: "power2.out",
                    clearProps: "all"
                }
            );
        }
    }, [isCartOpen, cart.length > 0]);

    const addToCart = (item) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { ...item, quantity: 1 }];
        });

        // Sophisticated feedback on cart button
        gsap.fromTo(".floating-cart-btn",
            { scale: 1 },
            { scale: 1.08, duration: 0.4, ease: "elastic.out(1.2, 0.4)" }
        );
    };

    const updateQuantity = (id, delta) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(0, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };


    const handlePlaceOrder = (e) => {
        e.preventDefault();
        setOrderStep('success');
        setCart([]);
        setRoomNumber('');
        setSpecialRequests('');
        setIsCartOpen(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Celebratory Success Timeline
        setTimeout(() => {
            const tl = gsap.timeline();
            tl.fromTo(".success-card",
                { scale: 0.9, opacity: 0, y: 30 },
                { scale: 1, opacity: 1, y: 0, duration: 0.8, ease: "back.out(1.7)" }
            )
                .from(".success-icon", { scale: 0, rotate: -45, duration: 0.6, ease: "back.out(2)" }, "-=0.3")
                .from(".success-card h2, .success-card p", { y: 20, opacity: 0, stagger: 0.2, duration: 0.6 }, "-=0.3")
                .from(".order-estimate", { x: -20, opacity: 0, duration: 0.5 }, "-=0.2")
                .from(".success-card .btn-primary", { y: 20, opacity: 0, duration: 0.5 }, "-=0.1");
        }, 100);
    };

    if (orderStep === 'success') {
        return (
            <div className="order-success-overlay">
                <div className="success-card">
                    <div className="success-icon slide-up">
                        <CheckCircle size={80} color="#10B981" />
                    </div>
                    <h2 className="fade-in">Order Placed Successfully!</h2>
                    <p className="fade-in">Your delicious meal is being prepared and will be delivered to your villa shortly.</p>
                    <div className="order-estimate fade-in">
                        <Clock size={16} /> <span>Estimated time: 25-35 minutes</span>
                    </div>
                    <button className="btn-primary fade-in" onClick={() => setOrderStep('browsing')}>
                        Continue Browsing
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="food-order-page" ref={pageRef}>
            {/* Cart Drawer */}
            <div className={`cart-drawer-backdrop ${isCartOpen ? 'open' : ''}`} onClick={() => setIsCartOpen(false)} />
            <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
                <div className="drawer-header">
                    <div className="header-title-group">
                        <span className="drawer-eyebrow">Dining Selection</span>
                        <h2>Your Order</h2>
                    </div>
                    <button className="btn-close" onClick={() => setIsCartOpen(false)}><X /></button>
                </div>

                <div className="drawer-content">
                    {cart.length === 0 ? (
                        <div className="empty-cart">
                            <Utensils size={48} />
                            <p>Your cart is empty</p>
                            <button className="btn-text" onClick={() => setIsCartOpen(false)}>Start Adding Items</button>
                        </div>
                    ) : (
                        <>
                            <div className="cart-items-list">
                                {cart.map(item => (
                                    <div key={item.id} className="cart-item">
                                        <div className="item-details">
                                            <h4>{item.name}</h4>
                                            <p>₹{item.price}</p>
                                        </div>
                                        <div className="quantity-controls">
                                            <button onClick={() => updateQuantity(item.id, -1)}><Minus size={14} /></button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, 1)}><Plus size={14} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="cart-summary">
                                <div className="summary-row">
                                    <span>Subtotal</span>
                                    <span>₹{totalAmount}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Delivery Fee</span>
                                    <span className="free">FREE</span>
                                </div>
                                <div className="summary-total">
                                    <span>Total</span>
                                    <span>₹{totalAmount}</span>
                                </div>

                                <div className="checkout-form">
                                    <div className="form-group-premium">
                                        <label>Villa / Room Number</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. KV-101"
                                            value={roomNumber}
                                            onChange={(e) => setRoomNumber(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group-premium">
                                        <label>Special Requests</label>
                                        <textarea
                                            placeholder="Add instructions (e.g., less spicy)"
                                            value={specialRequests}
                                            onChange={(e) => setSpecialRequests(e.target.value)}
                                            rows="2"
                                        />
                                    </div>
                                    <button
                                        className="btn-place-order"
                                        onClick={handlePlaceOrder}
                                        disabled={!roomNumber || cart.length === 0}
                                    >
                                        Place Order
                                    </button>
                                    <div className="drawer-dining-info">
                                        <Info size={14} />
                                        <p>Dining available: 9:00 AM — 8:30 PM. For dietary requests, please contact concierge.</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="food-hero-section">
                <div className="food-hero-bg"></div>
                <div className="food-hero-overlay"></div>
                <div className="hero-content container">
                    <span className="hero-eyebrow">The Dining Experience</span>
                    <h1 className="hero-title">Culinary Sanctuary</h1>
                    <p className="hero-subtitle">Savor the authentic tastes of Varanasi, crafted with love and tradition.</p>
                </div>
            </div>

            <div className="container food-container">
                <div className="search-and-filter">
                    <div className="search-bar-premium glass-panel">
                        <ShoppingBag className="search-icon" size={20} />
                        <input
                            type="text"
                            placeholder="Search dishes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && <X className="clear-search" onClick={() => setSearchQuery('')} size={16} />}
                    </div>
                </div>

                <div className="category-tabs">
                    {MENU_CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            className={`cat-tab ${activeCategory === cat.id ? 'active' : ''}`}
                            onClick={() => setActiveCategory(cat.id)}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                <div className="menu-grid-premium" ref={gridRef}>
                    {filteredItems.map(item => (
                        <div key={item.id} className="menu-card-premium">
                            <div className="card-image-wrapper">
                                <img src={item.image} alt={item.name} />
                                {item.isPopular && <span className="badge-popular"><Star size={12} fill="currentColor" /> Bestseller</span>}
                            </div>
                            <div className="card-content">
                                <div className="card-header">
                                    <h3>{item.name}</h3>
                                    <span className="price">₹{item.price}</span>
                                </div>
                                <p className="description">{item.description}</p>
                                <div className="card-footer">
                                    <div className="prep-time">
                                        <Clock size={14} /> <span>20-30 min</span>
                                    </div>
                                    {cart.find(i => i.id === item.id) ? (
                                        <div className="quantity-controls card-qty">
                                            <button onClick={() => updateQuantity(item.id, -1)}><Minus size={14} /></button>
                                            <span>{cart.find(i => i.id === item.id).quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, 1)}><Plus size={14} /></button>
                                        </div>
                                    ) : (
                                        <button className="btn-add" onClick={() => addToCart(item)}>Add</button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="dining-info">
                    <Info size={18} />
                    <p>Dining services are available from 9:00 AM to 8:30 PM. For special dietary requests, please contact our concierge.</p>
                </div>
            </div>

            {/* Floating Cart Button */}
            {totalItems > 0 && (
                <button className="floating-cart-btn" onClick={() => setIsCartOpen(true)}>
                    <div className="cart-icon-wrapper">
                        <ShoppingBag size={20} />
                        <span className="cart-count">{totalItems}</span>
                    </div>
                    <div className="cart-btn-label">
                        <span>View Cart</span>
                        <span className="cart-total-badge">₹{totalAmount}</span>
                    </div>
                </button>
            )}
        </div>
    );
};

export default FoodOrder;
