import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../context/NotificationContext';
import { 
  FiCheckCircle, 
  FiStar, 
  FiMapPin, 
  FiAward, 
  FiUser, 
  FiZap, 
  FiChevronDown, 
  FiLogOut, 
  FiMenu,
  FiX,
  FiPhone,
  FiMail,
  FiClock,
  FiSend,
  FiArrowRight,
  FiActivity,
  FiPieChart,
  FiTrendingUp,
  FiCheckSquare,
  FiShield,
  FiGrid,
  FiList,
  FiCheck
} from 'react-icons/fi';

export const HomePage = () => {
  const { user, login, logout } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();

  // Scroll listener for seamless navbar background
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Three-dot navigation dropdown state
  const [navDropdownOpen, setNavDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setNavDropdownOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setNavDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Navigation menu items for dropdown
  const navMenuItems = [
    { label: 'Core Features', href: '#features', icon: <FiCheckCircle size={16} className="text-primary" /> },
    { label: 'Membership Plans', href: '#pricing', icon: <FiAward size={16} className="text-info" /> },
    { label: 'Gym Branches', href: '#gyms', icon: <FiMapPin size={16} className="text-cyan" /> },
    { label: 'Member Reviews', href: '#reviews', icon: <FiStar size={16} className="text-warning" /> },
    { label: 'Contact Details', href: '#contact', icon: <FiPhone size={16} className="text-success" /> }
  ];

  // Demo Login Modal state
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [demoLoading, setDemoLoading] = useState(null);

  // Pricing billing toggle
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'annual'

  // Plan display mode: 'cards' (2-column feature grid in cards) vs 'matrix' (side-by-side comparison grid)
  const [planViewMode, setPlanViewMode] = useState('cards');

  // Gym center city filter
  const [selectedCity, setSelectedCity] = useState('ALL');

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Membership Inquiry',
    message: ''
  });
  const [contactSubmitting, setContactSubmitting] = useState(false);

  // Core Features Brief Data
  const platformFeatures = [
    {
      icon: FiMapPin,
      color: '#38BDF8',
      bg: 'rgba(56, 189, 248, 0.12)',
      border: 'rgba(56, 189, 248, 0.25)',
      title: "Multi-Center Gym Passes",
      desc: "Reserve 90-minute training slots across 25+ verified gym branches with contactless digital QR code passes."
    },
    {
      icon: FiActivity,
      color: '#818CF8',
      bg: 'rgba(129, 140, 248, 0.12)',
      border: 'rgba(129, 140, 248, 0.25)',
      title: "Coach-Crafted Routines",
      desc: "Follow structured workout plans designed by certified personal trainers with exact sets, reps, and rest timers."
    },
    {
      icon: FiPieChart,
      color: '#34D399',
      bg: 'rgba(52, 211, 153, 0.12)',
      border: 'rgba(52, 211, 153, 0.25)',
      title: "Precision Macro Nutrition",
      desc: "Achieve specific goals with tailored daily calorie targets and protein, carbohydrate, and fat meal breakdowns."
    },
    {
      icon: FiTrendingUp,
      color: '#FBBF24',
      bg: 'rgba(251, 191, 36, 0.12)',
      border: 'rgba(251, 191, 36, 0.25)',
      title: "Biometrics & BMI Tracking",
      desc: "Monitor weight changes, body measurements, and BMI trajectory logs with visual analytics."
    },
    {
      icon: FiCheckSquare,
      color: '#F472B6',
      bg: 'rgba(244, 114, 182, 0.12)',
      border: 'rgba(244, 114, 182, 0.25)',
      title: "Daily Habit Checklist",
      desc: "Interactive daily checklist allowing members to mark exercises done and meals logged in real time."
    },
    {
      icon: FiShield,
      color: '#A78BFA',
      bg: 'rgba(167, 139, 250, 0.12)',
      border: 'rgba(167, 139, 250, 0.25)',
      title: "Three Dedicated Portals",
      desc: "Clean, role-tailored dashboards built specifically for Members, Coaches, and Gym Administrators."
    }
  ];

  // Membership Plans Data (Formatted for Grid presentation)
  const membershipPlans = [
    {
      id: 'starter',
      badge: 'SINGLE PASS',
      badgeClass: 'badge-role',
      title: 'Starter Flex Pass',
      subtitle: 'Perfect for travelers, occasional lifters, and single sessions.',
      priceMonthly: 15,
      priceAnnual: 15,
      period: '/ day pass',
      featured: false,
      ctaText: 'Select Day Pass',
      ctaClass: 'btn btn-secondary-glass',
      features: [
        { text: 'Single-Day Access', highlight: true },
        { text: 'Digital QR Entry Pass', highlight: true },
        { text: 'Locker & Luxury Showers', highlight: false },
        { text: 'Workout Routine Logging', highlight: false },
        { text: 'Standard Gym Floor Gear', highlight: false },
        { text: 'Free High-Speed WiFi', highlight: false }
      ]
    },
    {
      id: 'pro',
      badge: 'RECOMMENDED ATHLETE TIER',
      badgeClass: 'badge-active',
      ribbon: '⭐ MOST POPULAR',
      title: 'Pro Performance',
      subtitle: 'Complete coaching, multi-center access, and full macro intelligence.',
      priceMonthly: 49,
      priceAnnual: 39,
      period: '/ month',
      featured: true,
      ctaText: 'Get Started with Pro',
      ctaClass: 'btn btn-primary-gradient shadow-lg',
      features: [
        { text: '25+ Gym Multi-Center', highlight: true },
        { text: 'Trainer Routine Builder', highlight: true },
        { text: 'Precision Macro Plans', highlight: true },
        { text: 'Biometric & BMI Analytics', highlight: true },
        { text: 'Priority Peak-Hour Slots', highlight: false },
        { text: 'Sauna & Steam Amenities', highlight: false }
      ]
    },
    {
      id: 'elite',
      badge: 'GLOBAL VIP',
      badgeClass: 'badge-role',
      title: 'Elite VIP All-Access',
      subtitle: 'Ultimate luxury, unlimited plunge/sauna access, and dedicated 1-on-1 coaching.',
      priceMonthly: 89,
      priceAnnual: 69,
      period: '/ month',
      featured: false,
      ctaText: 'Join Elite VIP',
      ctaClass: 'btn btn-secondary-glass',
      features: [
        { text: 'Global All-Center Access', highlight: true },
        { text: '1-on-1 Personal Coach', highlight: true },
        { text: 'Sauna & Cold Plunge', highlight: true },
        { text: 'Weekly Macro Adjusts', highlight: true },
        { text: '2 Free VIP Guest Passes/mo', highlight: false },
        { text: 'VIP Lounge & Supplements', highlight: false }
      ]
    }
  ];

  // Comparison Matrix Data for Full Grid View
  const comparisonMatrix = [
    { name: 'Gym Locations Access', starter: '1 Single Gym', pro: '25+ Network Centers', elite: 'All Global Centers' },
    { name: 'Digital Contactless QR Pass', starter: true, pro: true, elite: true },
    { name: 'Personal Trainer Routine Builder', starter: false, pro: 'Assigned Coach', elite: 'Dedicated 1-on-1' },
    { name: 'Macronutrient Nutrition Targets', starter: false, pro: true, elite: 'Weekly Customization' },
    { name: 'Biometric & BMI Progress Analytics', starter: 'Basic Logs', pro: 'Interactive Charts', elite: 'Full Analytics + Export' },
    { name: 'Sauna, Steam Room & Plunge', starter: false, pro: 'Sauna & Steam', elite: 'All Suites + Cold Plunge' },
    { name: 'Priority Peak-Hour Slot Booking', starter: false, pro: true, elite: 'Guaranteed Priority' },
    { name: 'Monthly VIP Guest Passes', starter: false, pro: false, elite: '2 Free Passes / mo' },
    { name: 'VIP Lounge & Protein Bar Access', starter: false, pro: false, elite: true }
  ];

  // Gym Center Data
  const gymCenters = [
    {
      id: 1,
      name: "Gymkhana Elite Fitness",
      city: "New York",
      place: "Downtown Manhattan",
      address: "124 5th Avenue, Suite 400",
      rating: 4.9,
      reviews: 240,
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop",
      badge: "Flagship Arena",
      facilities: ["Olympic Racks", "Sauna & Cold Plunge", "Cardio Theater", "Crossfit Turf"],
      priceFrom: "$15/day"
    },
    {
      id: 2,
      name: "Gymkhana Powerhouse",
      city: "Brooklyn",
      place: "Williamsburg",
      address: "78 Bedford Avenue",
      rating: 4.8,
      reviews: 185,
      image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=800&auto=format&fit=crop",
      badge: "Heavy Lifting Hub",
      facilities: ["Power Racks", "Heavy Boxing Ring", "Outdoor Turf", "Protein Bar"],
      priceFrom: "$12/day"
    },
    {
      id: 3,
      name: "Gymkhana Performance Arena",
      city: "Los Angeles",
      place: "Santa Monica Oceanfront",
      address: "1420 Ocean Avenue",
      rating: 4.95,
      reviews: 310,
      image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=800&auto=format&fit=crop",
      badge: "Oceanfront Luxury",
      facilities: ["Rooftop Turf", "Lap Swimming Pool", "Cryo Plunge", "Olympic Lifting"],
      priceFrom: "$20/day"
    },
    {
      id: 4,
      name: "Gymkhana Wellness Sanctuary",
      city: "Queens",
      place: "Long Island City",
      address: "28-10 Jackson Avenue",
      rating: 4.75,
      reviews: 130,
      image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop",
      badge: "Recovery & Flow",
      facilities: ["Hot Yoga Studio", "Spinning Room", "Hydro Massage Beds", "Organic Café"],
      priceFrom: "$14/day"
    }
  ];

  const filteredGyms = selectedCity === 'ALL' 
    ? gymCenters 
    : gymCenters.filter(g => g.city.toLowerCase() === selectedCity.toLowerCase());

  // Reviews Data
  const memberReviews = [
    {
      name: "Marcus Vance",
      role: "Competitive Powerlifter",
      city: "New York, NY",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
      review: "The multi-gym pass is unmatched. I train at the Manhattan Flagship during the week and Brooklyn Powerhouse on weekends. Having my routine checklist right on my phone keeps my training completely locked in."
    },
    {
      name: "Sarah Jenkins",
      role: "Head Strength Coach",
      city: "Brooklyn, NY",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop",
      review: "Gymkhana's platform saves me hours every week. Rolling out master training programs to my roster while customizing individual macros has transformed how my athletes perform."
    },
    {
      name: "David Chen",
      role: "Corporate Executive & Member",
      city: "Los Angeles, CA",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
      review: "Down 18 lbs in 4 months. Watching my weight trajectory drop on the progress tracker and ticking off my daily meals gave me the consistency I had been missing for years."
    }
  ];

  // Demo Login Handler
  const handleQuickDemoLogin = async (email, password, roleLabel) => {
    setDemoLoading(roleLabel);
    try {
      const res = await login(email, password);
      addToast(`Logged in as ${roleLabel}! Welcome, ${res.user.full_name}`, 'success');
      setDemoModalOpen(false);
      if (res.role === 'ADMIN') navigate('/admin');
      else if (res.role === 'TRAINER') navigate('/trainer');
      else navigate('/member');
    } catch (err) {
      addToast(err.response?.data?.message || 'Demo login failed.', 'danger');
    } finally {
      setDemoLoading(null);
    }
  };

  // Contact Form Submission Handler
  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSubmitting(true);
    setTimeout(() => {
      setContactSubmitting(false);
      addToast('Thank you! Your message has been sent. Our team will contact you shortly.', 'success');
      setContactForm({
        name: '',
        email: '',
        phone: '',
        subject: 'Membership Inquiry',
        message: ''
      });
    }, 600);
  };

  return (
    <div className="min-vh-100 text-white position-relative overflow-x-hidden" style={{ background: 'transparent' }}>
      {/* Background Decorative Ambient Glows */}
      <div
        className="position-absolute rounded-circle"
        style={{
          width: '650px',
          height: '650px',
          background: 'radial-gradient(circle, rgba(79, 70, 229, 0.2) 0%, rgba(0, 0, 0, 0) 70%)',
          top: '-150px',
          left: '-150px',
          filter: 'blur(70px)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />
      <div
        className="position-absolute rounded-circle"
        style={{
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.16) 0%, rgba(0, 0, 0, 0) 70%)',
          top: '30%',
          right: '-200px',
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />
      <div
        className="position-absolute rounded-circle"
        style={{
          width: '700px',
          height: '700px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.14) 0%, rgba(0, 0, 0, 0) 70%)',
          bottom: '10%',
          left: '10%',
          filter: 'blur(90px)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* =========================================================================
          FIRST SCREEN VIEWPORT: NAVBAR + MOTIVATIONAL THOUGHT + SCROLL TO EXPLORE
          ========================================================================= */}
      <div className="motivational-hero-viewport">
        {/* Unified Transparent Navbar */}
        <nav
          className={`glass-navbar fixed-top w-100 px-3 px-sm-4 py-2 py-sm-3 d-flex align-items-center justify-content-between transition-all ${
            scrolled ? 'scrolled' : ''
          }`}
          style={{ zIndex: 1040 }}
        >
          {/* Left Brand Emblem & Title */}
          <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none">
            <div className="brand-logo-emblem">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d="M12 2L20.5 6.8V17.2L12 22L3.5 17.2V6.8L12 2Z" 
                  stroke="url(#emblemGradNav)" 
                  strokeWidth="1.75" 
                  strokeLinejoin="round" 
                />
                <path 
                  d="M7 12H17M5.5 10.2V13.8M18.5 10.2V13.8M8.5 9.5V14.5M15.5 9.5V14.5" 
                  stroke="#FFFFFF" 
                  strokeWidth="1.75" 
                  strokeLinecap="round" 
                />
                <circle cx="12" cy="12" r="1.75" fill="#38BDF8" />
                <defs>
                  <linearGradient id="emblemGradNav" x1="3.5" y1="2" x2="20.5" y2="22" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#818CF8" />
                    <stop offset="1" stopColor="#38BDF8" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div>
              <span className="brand-title-classic">GYMKHANA</span>
            </div>
          </Link>

          {/* Right Controls */}
          <div className="d-flex align-items-center gap-2">
            {user ? (
              <div className="d-flex align-items-center gap-2">
                <Link
                  to={user.role === 'ADMIN' ? '/admin' : user.role === 'TRAINER' ? '/trainer' : '/member'}
                  className="btn btn-primary-gradient px-3 py-2 d-inline-flex align-items-center gap-2 fw-semibold"
                  style={{ fontSize: '0.85rem' }}
                >
                  <FiUser size={15} />
                  <span>Go to Portal</span>
                </Link>
                <button
                  onClick={logout}
                  className="btn btn-secondary-glass p-2 d-inline-flex align-items-center justify-content-center text-danger"
                  title="Logout"
                  aria-label="Logout"
                >
                  <FiLogOut size={17} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="btn btn-secondary-glass p-2 d-inline-flex align-items-center justify-content-center rounded-circle"
                style={{ width: '40px', height: '40px' }}
                title="Sign In to Gymkhana"
                aria-label="Sign In"
              >
                <FiUser size={18} />
              </Link>
            )}

            {/* Navigation Hamburger Dropdown */}
            <div className="position-relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setNavDropdownOpen(prev => !prev)}
                className={`btn btn-secondary-glass p-2 d-inline-flex align-items-center justify-content-center ${
                  navDropdownOpen ? 'bg-white bg-opacity-20 text-white' : ''
                }`}
                style={{ width: '40px', height: '40px' }}
                aria-label="Toggle navigation menu"
                aria-expanded={navDropdownOpen}
                title="Explore Gymkhana Menu"
              >
                {navDropdownOpen ? <FiX size={19} /> : <FiMenu size={19} />}
              </button>

              {navDropdownOpen && (
                <div
                  className="landing-nav-dropdown-menu position-absolute end-0 mt-2 p-2 glass-card-static rounded-3 shadow-lg animate-fadeIn"
                  style={{
                    minWidth: '220px',
                    zIndex: 1060,
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    backdropFilter: 'blur(20px)'
                  }}
                >
                  <div className="px-3 py-2 border-bottom border-secondary border-opacity-25 mb-1">
                    <span className="text-muted small fw-semibold text-uppercase tracking-wider" style={{ fontSize: '0.7rem' }}>
                      Gymkhana Sections
                    </span>
                  </div>
                  <div className="d-flex flex-column gap-1">
                    {navMenuItems.map((item, idx) => (
                      <a
                        key={idx}
                        href={item.href}
                        onClick={() => setNavDropdownOpen(false)}
                        className="d-flex align-items-center gap-3 px-3 py-2 rounded-2 text-decoration-none landing-nav-dropdown-link"
                        style={{ fontSize: '0.88rem' }}
                      >
                        {item.icon}
                        <span className="fw-medium text-white">{item.label}</span>
                      </a>
                    ))}
                    <div className="border-top border-secondary border-opacity-25 mt-1 pt-1">
                      <button
                        onClick={() => {
                          setNavDropdownOpen(false);
                          setDemoModalOpen(true);
                        }}
                        className="btn btn-link w-100 text-start d-flex align-items-center gap-3 px-3 py-2 rounded-2 text-decoration-none landing-nav-dropdown-link text-cyan"
                        style={{ fontSize: '0.88rem' }}
                      >
                        <FiZap size={16} />
                        <span className="fw-medium">One-Click Demo Portals</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Centered Motivational Hero Thought */}
        <div className="hero-quote-container text-center animate-fadeIn my-auto">
          <span className="hero-quote-tagline mb-3">
            DISCIPLINE • PROGRESS • TRANSFORMATION
          </span>
          <h1 className="hero-motivational-quote">
            “Your body can stand almost anything. <br />
            <span className="text-gradient-primary">It’s your mind that you have to convince.”</span>
          </h1>
          <p className="hero-motivational-subtext mx-auto mb-0">
            Gymkhana is more than a gym platform — it is your daily arena for discipline, elite coaching, precision nutrition, and unlocking your true potential.
          </p>
        </div>

        {/* Scroll Down to Explore Indicator */}
        <div className="text-center pb-3">
          <a href="#features" className="scroll-indicator-btn" aria-label="Scroll to platform features">
            <span>Scroll to Explore</span>
            <div className="scroll-arrow-circle">
              <FiChevronDown size={18} />
            </div>
          </a>
        </div>
      </div>

      {/* =========================================================================
          1. CORE PLATFORM FEATURES (BRIEF TEXT HIGHLIGHTS)
          ========================================================================= */}
      <section id="features" className="py-5 position-relative z-2 border-top border-secondary border-opacity-25">
        <div className="container py-lg-4">
          <div className="text-center mx-auto mb-5" style={{ maxWidth: '750px' }}>
            <span className="badge badge-active mb-2">PLATFORM CAPABILITIES</span>
            <h2 className="display-6 fw-bold text-white mb-3">
              Everything You Need in One Unified Platform
            </h2>
            <p className="text-muted lead fs-6">
              A streamlined overview of the core features powering athletes, personal coaches, and gym facilities.
            </p>
          </div>

          <div className="row g-3 g-md-4">
            {platformFeatures.map((f, idx) => {
              const Icon = f.icon;
              return (
                <div key={idx} className="col-12 col-md-6 col-lg-4">
                  <div className="glass-card p-4 h-100 d-flex flex-column justify-content-between hover-lift">
                    <div>
                      <div
                        className="rounded-3 d-inline-flex align-items-center justify-content-center mb-3"
                        style={{
                          width: '46px',
                          height: '46px',
                          background: f.bg,
                          border: `1px solid ${f.border}`,
                          color: f.color
                        }}
                      >
                        <Icon size={22} />
                      </div>
                      <h5 className="text-white fw-bold mb-2">{f.title}</h5>
                      <p className="text-muted small mb-0" style={{ lineHeight: 1.6 }}>
                        {f.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. MEMBERSHIP PLANS (GRID PRESENTATION)
          ========================================================================= */}
      <section id="pricing" className="py-5 position-relative z-2 border-top border-secondary border-opacity-25">
        <div className="container py-lg-4">
          <div className="text-center mx-auto mb-5" style={{ maxWidth: '820px' }}>
            <span className="badge badge-active mb-2">TRANSPARENT VALUE</span>
            <h2 className="display-6 fw-bold text-white mb-3">
              Membership Plans Designed for Every Goal
            </h2>
            <p className="text-muted lead fs-6 mb-4">
              Flexible options with zero commitments. Compare tiers in our visual feature grid or detailed matrix below.
            </p>

            {/* Controls Bar: Billing Cycle & View Mode Switches */}
            <div className="d-flex flex-wrap align-items-center justify-content-center gap-3">
              {/* Monthly / Annual Billing Toggle */}
              <div className="d-inline-flex align-items-center gap-2 p-1 glass-card-static rounded-pill">
                <button
                  type="button"
                  onClick={() => setBillingCycle('monthly')}
                  className={`btn btn-sm rounded-pill px-3 py-1 ${billingCycle === 'monthly' ? 'btn-primary-gradient fw-bold' : 'text-muted'}`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle('annual')}
                  className={`btn btn-sm rounded-pill px-3 py-1 d-flex align-items-center gap-1 ${billingCycle === 'annual' ? 'btn-primary-gradient fw-bold' : 'text-muted'}`}
                >
                  <span>Annual</span>
                  <span className="badge bg-success text-white rounded-pill px-2" style={{ fontSize: '0.65rem' }}>Save 20%</span>
                </button>
              </div>

              {/* View Mode Toggle: Cards Grid vs Comparison Matrix */}
              <div className="d-inline-flex align-items-center gap-1 p-1 glass-card-static rounded-pill">
                <button
                  type="button"
                  onClick={() => setPlanViewMode('cards')}
                  className={`btn btn-sm rounded-pill px-3 py-1 d-flex align-items-center gap-2 ${planViewMode === 'cards' ? 'btn-cyan-gradient fw-bold' : 'text-muted'}`}
                >
                  <FiGrid size={14} />
                  <span>Plan Grid</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPlanViewMode('matrix')}
                  className={`btn btn-sm rounded-pill px-3 py-1 d-flex align-items-center gap-2 ${planViewMode === 'matrix' ? 'btn-cyan-gradient fw-bold' : 'text-muted'}`}
                >
                  <FiList size={14} />
                  <span>Comparison Matrix</span>
                </button>
              </div>
            </div>
          </div>

          {/* View 1: Visual Cards Grid with Internal 2-Column Feature Grids */}
          {planViewMode === 'cards' && (
            <div 
              className="plans-cards-grid animate-fadeIn"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '1.5rem',
                alignItems: 'stretch'
              }}
            >
              {membershipPlans.map((plan) => (
                <div 
                  key={plan.id}
                  className={`glass-card p-4 p-xl-5 h-100 d-flex flex-column justify-content-between position-relative hover-lift ${
                    plan.featured ? 'pricing-card-featured border-primary' : ''
                  }`}
                  style={{
                    borderRadius: '24px',
                    borderColor: plan.featured ? 'rgba(79, 70, 229, 0.5)' : undefined
                  }}
                >
                  {plan.ribbon && (
                    <span className="pricing-ribbon">{plan.ribbon}</span>
                  )}

                  <div>
                    <span className={`badge ${plan.badgeClass} mb-3`}>{plan.badge}</span>
                    <h3 className="text-white fw-bold mb-1">{plan.title}</h3>
                    <p className="text-muted small mb-4">{plan.subtitle}</p>

                    <div className="d-flex align-items-baseline gap-1 mb-4">
                      <h2 className={`display-5 fw-extrabold mb-0 ${plan.featured ? 'text-cyan' : 'text-white'}`}>
                        ${billingCycle === 'annual' ? plan.priceAnnual : plan.priceMonthly}
                      </h2>
                      <span className="text-muted">{plan.period}</span>
                    </div>

                    {/* Features Displayed as a Visual 2-Column Grid (Not a bullet list!) */}
                    <div 
                      className="plan-features-grid mb-4"
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '0.65rem'
                      }}
                    >
                      {plan.features.map((feat, fIdx) => (
                        <div
                          key={fIdx}
                          className="p-2 rounded-3 d-flex align-items-start gap-2"
                          style={{
                            background: feat.highlight ? 'rgba(79, 70, 229, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                            border: feat.highlight ? '1px solid rgba(129, 140, 248, 0.25)' : '1px solid rgba(255, 255, 255, 0.06)',
                            minHeight: '48px'
                          }}
                        >
                          <FiCheckCircle 
                            className={feat.highlight ? 'text-cyan flex-shrink-0 mt-1' : 'text-success flex-shrink-0 mt-1'} 
                            size={14} 
                          />
                          <span 
                            className={feat.highlight ? 'text-white fw-semibold small' : 'text-muted small'}
                            style={{ fontSize: '0.78rem', lineHeight: 1.35 }}
                          >
                            {feat.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4">
                    <Link
                      to="/register"
                      className={`${plan.ctaClass} w-100 py-3 fw-bold text-center text-decoration-none d-block`}
                      style={{ borderRadius: '12px' }}
                    >
                      {plan.ctaText}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* View 2: Full Matrix Comparison Grid */}
          {planViewMode === 'matrix' && (
            <div className="glass-card p-3 p-md-4 overflow-x-auto animate-fadeIn" style={{ borderRadius: '24px' }}>
              <table className="table table-dark table-borderless align-middle mb-0" style={{ background: 'transparent' }}>
                <thead>
                  <tr className="border-bottom border-secondary border-opacity-50">
                    <th style={{ minWidth: '220px', width: '34%' }} className="text-white py-3 fw-bold fs-6">
                      Plan Inclusions & Features
                    </th>
                    <th style={{ minWidth: '150px' }} className="text-center py-3 text-white fw-bold">
                      Starter Flex Pass
                      <span className="d-block text-muted small fw-normal mt-1">$15 / day</span>
                    </th>
                    <th style={{ minWidth: '160px' }} className="text-center py-3 text-cyan fw-bold bg-primary bg-opacity-10 rounded-top">
                      ⭐ Pro Performance
                      <span className="d-block text-cyan small fw-normal mt-1">${billingCycle === 'annual' ? '39' : '49'} / mo</span>
                    </th>
                    <th style={{ minWidth: '160px' }} className="text-center py-3 text-white fw-bold">
                      Elite VIP All-Access
                      <span className="d-block text-muted small fw-normal mt-1">${billingCycle === 'annual' ? '69' : '89'} / mo</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonMatrix.map((row, idx) => (
                    <tr key={idx} className="border-bottom border-secondary border-opacity-25">
                      <td className="py-3 text-white fw-medium small">
                        {row.name}
                      </td>
                      <td className="text-center py-3 text-muted small">
                        {typeof row.starter === 'boolean' ? (
                          row.starter ? <FiCheck className="text-success" size={18} /> : <span className="text-secondary opacity-50">—</span>
                        ) : (
                          <span>{row.starter}</span>
                        )}
                      </td>
                      <td className="text-center py-3 bg-primary bg-opacity-10 text-white fw-semibold small">
                        {typeof row.pro === 'boolean' ? (
                          row.pro ? <FiCheck className="text-cyan" size={18} /> : <span className="text-secondary opacity-50">—</span>
                        ) : (
                          <span className="text-cyan">{row.pro}</span>
                        )}
                      </td>
                      <td className="text-center py-3 text-white small">
                        {typeof row.elite === 'boolean' ? (
                          row.elite ? <FiCheck className="text-success" size={18} /> : <span className="text-secondary opacity-50">—</span>
                        ) : (
                          <span className="text-white fw-medium">{row.elite}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td className="py-4"></td>
                    <td className="text-center py-4">
                      <Link to="/register" className="btn btn-secondary-glass btn-sm px-3 py-2 fw-semibold">
                        Select Day Pass
                      </Link>
                    </td>
                    <td className="text-center py-4 bg-primary bg-opacity-10 rounded-bottom">
                      <Link to="/register" className="btn btn-primary-gradient btn-sm px-4 py-2 fw-bold shadow-lg">
                        Choose Pro
                      </Link>
                    </td>
                    <td className="text-center py-4">
                      <Link to="/register" className="btn btn-secondary-glass btn-sm px-3 py-2 fw-semibold">
                        Choose Elite
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          3. GYM BRANCHES
          ========================================================================= */}
      <section id="gyms" className="py-5 position-relative z-2 border-top border-secondary border-opacity-25">
        <div className="container py-lg-4">
          <div className="d-flex flex-column flex-md-row align-items-md-end justify-content-between gap-3 mb-4">
            <div>
              <span className="badge badge-role mb-2">OFFICIAL NETWORK</span>
              <h2 className="display-6 fw-bold text-white mb-1">Explore Gym Branches & Centers</h2>
              <p className="text-muted mb-0">Single passes and multi-gym access available across metropolitan hubs.</p>
            </div>

            {/* City Filter Pills */}
            <div className="d-flex align-items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
              {['ALL', 'New York', 'Brooklyn', 'Los Angeles', 'Queens'].map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`btn btn-sm rounded-pill text-nowrap ${
                    selectedCity === city ? 'btn-cyan-gradient fw-bold' : 'btn-secondary-glass text-muted'
                  }`}
                >
                  {city === 'ALL' ? '📍 All Cities' : city}
                </button>
              ))}
            </div>
          </div>

          <div className="row g-4">
            {filteredGyms.map((gym) => (
              <div key={gym.id} className="col-12 col-md-6 col-lg-3">
                <div className="glass-card h-100 overflow-hidden d-flex flex-column justify-content-between hover-lift">
                  <div>
                    {/* Gym Image */}
                    <div className="position-relative" style={{ height: '170px' }}>
                      <img
                        src={gym.image}
                        alt={gym.name}
                        className="w-100 h-100 object-fit-cover"
                        style={{ filter: 'brightness(0.9)' }}
                      />
                      <div className="position-absolute top-0 start-0 m-2 badge badge-active">
                        {gym.badge}
                      </div>
                      <div className="position-absolute top-0 end-0 m-2 badge bg-dark bg-opacity-80 text-warning d-flex align-items-center gap-1">
                        <FiStar size={12} fill="#EAB308" />
                        <span>{gym.rating}</span>
                      </div>
                    </div>

                    <div className="p-3">
                      <h5 className="text-white fw-bold mb-1 text-truncate">{gym.name}</h5>
                      <p className="text-cyan small fw-semibold mb-1">📍 {gym.place}</p>
                      <small className="text-muted d-block mb-3 text-truncate">{gym.address}</small>

                      <div className="d-flex flex-wrap gap-1 mb-2">
                        {gym.facilities.slice(0, 3).map((f, i) => (
                          <span key={i} className="badge badge-role" style={{ fontSize: '0.68rem' }}>
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 pt-0 d-flex align-items-center justify-content-between border-top border-secondary border-opacity-25 pt-3">
                    <div>
                      <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>Starting from</small>
                      <strong className="text-white">{gym.priceFrom}</strong>
                    </div>
                    <Link
                      to="/register"
                      className="btn btn-primary-gradient btn-sm px-3"
                    >
                      Book Pass
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. MEMBER REVIEWS & TESTIMONIALS
          ========================================================================= */}
      <section id="reviews" className="py-5 position-relative z-2 border-top border-secondary border-opacity-25" style={{ background: 'rgba(15, 23, 42, 0.4)' }}>
        <div className="container py-lg-4">
          <div className="text-center mx-auto mb-5" style={{ maxWidth: '750px' }}>
            <span className="badge badge-active mb-2">COMMUNITY TRUST</span>
            <h2 className="display-6 fw-bold text-white mb-3">
              Loved by 12,000+ Athletes and Coaches
            </h2>
            <p className="text-muted lead fs-6">
              Hear directly from members and trainers achieving peak performance with Gymkhana.
            </p>
          </div>

          <div className="row g-4">
            {memberReviews.map((t, idx) => (
              <div key={idx} className="col-12 col-md-4">
                <div className="glass-card p-4 h-100 d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex align-items-center gap-1 text-warning mb-3">
                      {[...Array(5)].map((_, i) => (
                        <FiStar key={i} size={16} fill="#EAB308" color="#EAB308" />
                      ))}
                    </div>
                    <p className="text-muted small mb-4 fst-italic" style={{ lineHeight: 1.6 }}>
                      "{t.review}"
                    </p>
                  </div>

                  <div className="d-flex align-items-center gap-3 pt-3 border-top border-secondary border-opacity-25">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="testimonial-avatar"
                    />
                    <div>
                      <strong className="text-white d-block">{t.name}</strong>
                      <small className="text-cyan d-block">{t.role}</small>
                      <small className="text-muted" style={{ fontSize: '0.72rem' }}>📍 {t.city}</small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. CONTACT DETAILS & INQUIRY HEADQUARTERS
          ========================================================================= */}
      <section id="contact" className="py-5 position-relative z-2 border-top border-secondary border-opacity-25">
        <div className="container py-lg-4">
          <div className="text-center mx-auto mb-5" style={{ maxWidth: '750px' }}>
            <span className="badge badge-active mb-2">GET IN TOUCH</span>
            <h2 className="display-6 fw-bold text-white mb-3">
              Contact Details & Support Headquarters
            </h2>
            <p className="text-muted lead fs-6">
              Have questions about memberships, gym passes, or personal training? Reach out to our team directly.
            </p>
          </div>

          <div className="row g-4 mb-5">
            {/* Phone */}
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="glass-card p-4 h-100 text-center d-flex flex-column align-items-center justify-content-center">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center mb-3"
                  style={{ width: '52px', height: '52px', background: 'rgba(79, 70, 229, 0.15)', border: '1px solid #4F46E5', color: '#818CF8' }}
                >
                  <FiPhone size={24} />
                </div>
                <h5 className="text-white fw-bold mb-1">Phone Inquiries</h5>
                <p className="text-muted small mb-2">Speak directly with our concierge desk</p>
                <a href="tel:+18004965426" className="text-cyan fw-semibold text-decoration-none d-block">
                  +1 (800) 496-5426
                </a>
                <small className="text-muted" style={{ fontSize: '0.72rem' }}>Direct: +1 (555) 234-5678</small>
              </div>
            </div>

            {/* Email */}
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="glass-card p-4 h-100 text-center d-flex flex-column align-items-center justify-content-center">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center mb-3"
                  style={{ width: '52px', height: '52px', background: 'rgba(6, 182, 212, 0.15)', border: '1px solid #06B6D4', color: '#38BDF8' }}
                >
                  <FiMail size={24} />
                </div>
                <h5 className="text-white fw-bold mb-1">Email Support</h5>
                <p className="text-muted small mb-2">Average response time: &lt; 2 hours</p>
                <a href="mailto:support@gymkhana.com" className="text-cyan fw-semibold text-decoration-none d-block">
                  support@gymkhana.com
                </a>
                <small className="text-muted" style={{ fontSize: '0.72rem' }}>memberships@gymkhana.com</small>
              </div>
            </div>

            {/* Location */}
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="glass-card p-4 h-100 text-center d-flex flex-column align-items-center justify-content-center">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center mb-3"
                  style={{ width: '52px', height: '52px', background: 'rgba(34, 197, 94, 0.15)', border: '1px solid #22C55E', color: '#4ADE80' }}
                >
                  <FiMapPin size={24} />
                </div>
                <h5 className="text-white fw-bold mb-1">Flagship Center</h5>
                <p className="text-muted small mb-1">124 5th Avenue, Suite 400</p>
                <p className="text-white fw-semibold mb-0 small">Downtown Manhattan, NY 10011</p>
                <small className="text-cyan mt-1 d-block" style={{ fontSize: '0.72rem' }}>Near Flatiron District</small>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="glass-card p-4 h-100 text-center d-flex flex-column align-items-center justify-content-center">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center mb-3"
                  style={{ width: '52px', height: '52px', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid #F59E0B', color: '#FBBF24' }}
                >
                  <FiClock size={24} />
                </div>
                <h5 className="text-white fw-bold mb-1">Operating Hours</h5>
                <p className="text-muted small mb-1">All Branch Facilities</p>
                <p className="text-white fw-semibold mb-0 small">05:00 AM – 11:00 PM Daily</p>
                <small className="text-success mt-1 d-block" style={{ fontSize: '0.72rem' }}>● 24/7 Digital App Access</small>
              </div>
            </div>
          </div>

          {/* Quick Message Form */}
          <div className="glass-card p-4 p-md-5 mx-auto position-relative" style={{ maxWidth: '820px', borderRadius: '24px' }}>
            <div className="text-center mb-4">
              <span className="badge badge-role mb-2">QUICK INQUIRY</span>
              <h4 className="text-white fw-bold mb-1">Send a Message to Gymkhana Desk</h4>
              <p className="text-muted small mb-0">Our membership coordinators will reply within 24 hours.</p>
            </div>

            <form onSubmit={handleContactSubmit}>
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label htmlFor="contact-name" className="form-label text-muted small fw-semibold">Your Full Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    placeholder="Alex Morgan"
                    className="form-control glass-input"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label htmlFor="contact-email" className="form-label text-muted small fw-semibold">Email Address</label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="alex@example.com"
                    className="form-control glass-input"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label htmlFor="contact-phone" className="form-label text-muted small fw-semibold">Phone Number (Optional)</label>
                  <input
                    id="contact-phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    className="form-control glass-input"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label htmlFor="contact-subject" className="form-label text-muted small fw-semibold">Inquiry Topic</label>
                  <select
                    id="contact-subject"
                    className="form-select glass-input text-white"
                    style={{ backgroundColor: 'rgba(15, 23, 42, 0.85)' }}
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  >
                    <option value="Membership Inquiry" className="bg-dark text-white">Membership Plans & Pricing</option>
                    <option value="Branch Access" className="bg-dark text-white">Multi-Center Branch Access</option>
                    <option value="Personal Coaching" className="bg-dark text-white">Personal Trainer Assignment</option>
                    <option value="Corporate Passes" className="bg-dark text-white">Corporate Gym Pass Partnerships</option>
                    <option value="Other" className="bg-dark text-white">Other Inquiries</option>
                  </select>
                </div>

                <div className="col-12">
                  <label htmlFor="contact-message" className="form-label text-muted small fw-semibold">Your Message</label>
                  <textarea
                    id="contact-message"
                    required
                    rows="4"
                    placeholder="Tell us about your fitness goals or questions regarding our branches and passes..."
                    className="form-control glass-input"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  />
                </div>

                <div className="col-12 text-center mt-4">
                  <button
                    type="submit"
                    disabled={contactSubmitting}
                    className="btn btn-primary-gradient px-5 py-3 fw-bold d-inline-flex align-items-center gap-2 shadow-lg"
                    style={{ borderRadius: '12px' }}
                  >
                    {contactSubmitting ? (
                      <span>Sending message...</span>
                    ) : (
                      <>
                        <FiSend size={18} />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FOOTER
          ========================================================================= */}
      <footer className="py-5 border-top border-secondary border-opacity-25 position-relative z-2" style={{ background: '#090D16' }}>
        <div className="container">
          <div className="row g-4 mb-5">
            {/* Col 1: Brand */}
            <div className="col-12 col-lg-5">
              <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none mb-3">
                <div className="brand-logo-emblem">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path 
                      d="M12 2L20.5 6.8V17.2L12 22L3.5 17.2V6.8L12 2Z" 
                      stroke="url(#emblemGradFooter)" 
                      strokeWidth="1.75" 
                      strokeLinejoin="round" 
                    />
                    <path 
                      d="M7 12H17M5.5 10.2V13.8M18.5 10.2V13.8M8.5 9.5V14.5M15.5 9.5V14.5" 
                      stroke="#FFFFFF" 
                      strokeWidth="1.75" 
                      strokeLinecap="round" 
                    />
                    <circle cx="12" cy="12" r="1.75" fill="#38BDF8" />
                    <defs>
                      <linearGradient id="emblemGradFooter" x1="3.5" y1="2" x2="20.5" y2="22" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#818CF8" />
                        <stop offset="1" stopColor="#38BDF8" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <span className="brand-title-classic">GYMKHANA</span>
              </Link>
              <p className="text-muted small mb-3" style={{ maxWidth: '340px' }}>
                The next-generation fitness ecosystem connecting elite gym branches, personal coaching, and structured health routines.
              </p>
              <div className="d-flex align-items-center gap-2">
                <span className="badge bg-success bg-opacity-25 text-success small">
                  ● All Gym Systems & Check-ins Active
                </span>
              </div>
            </div>

            {/* Col 2: Navigation */}
            <div className="col-6 col-md-3 col-lg-2">
              <h6 className="text-white fw-bold mb-3 small text-uppercase tracking-wider">Explore</h6>
              <div className="d-flex flex-column gap-2">
                <a href="#features" className="footer-nav-link">Core Features</a>
                <a href="#pricing" className="footer-nav-link">Membership Plans</a>
                <a href="#gyms" className="footer-nav-link">Gym Branches</a>
                <a href="#reviews" className="footer-nav-link">Member Reviews</a>
                <a href="#contact" className="footer-nav-link">Contact Us</a>
              </div>
            </div>

            {/* Col 3: Portals */}
            <div className="col-6 col-md-3 col-lg-2">
              <h6 className="text-white fw-bold mb-3 small text-uppercase tracking-wider">Portals</h6>
              <div className="d-flex flex-column gap-2">
                <Link to="/login" className="footer-nav-link">Member Portal</Link>
                <Link to="/login" className="footer-nav-link">Trainer Hub</Link>
                <Link to="/login" className="footer-nav-link">Admin Console</Link>
                <button 
                  onClick={() => setDemoModalOpen(true)} 
                  className="btn btn-link p-0 text-start footer-nav-link text-cyan"
                >
                  Instant Demo
                </button>
              </div>
            </div>

            {/* Col 4: Top Locations */}
            <div className="col-12 col-md-6 col-lg-3">
              <h6 className="text-white fw-bold mb-3 small text-uppercase tracking-wider">Locations</h6>
              <div className="d-flex flex-column gap-1 text-muted small">
                <span>Manhattan Flagship — 124 5th Ave</span>
                <span>Brooklyn Powerhouse — 78 Bedford Ave</span>
                <span>Santa Monica Arena — 1420 Ocean Ave</span>
                <span>Queens Sanctuary — 28-10 Jackson Ave</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-top border-secondary border-opacity-25 d-flex flex-column flex-md-row align-items-center justify-content-between gap-3 text-muted small">
            <div>
              © {new Date().getFullYear()} Gymkhana Inc. All rights reserved. Designed for elite fitness performance.
            </div>
            <div className="d-flex align-items-center gap-3">
              <Link to="/login" className="text-muted text-decoration-none hover-white">Sign In</Link>
              <span>•</span>
              <Link to="/register" className="text-muted text-decoration-none hover-white">Register</Link>
              <span>•</span>
              <a href="#contact" className="text-muted text-decoration-none hover-white">Support</a>
            </div>
          </div>
        </div>
      </footer>

      {/* =========================================================================
          ONE-CLICK DEMO ACCOUNTS MODAL
          ========================================================================= */}
      {demoModalOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center z-3 p-3 animate-fadeIn"
          style={{ background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(12px)' }}
        >
          <div
            className="glass-card p-4 p-sm-5 w-100 position-relative"
            style={{ maxWidth: '520px', borderRadius: '24px' }}
          >
            <button
              onClick={() => setDemoModalOpen(false)}
              className="btn-close btn-close-white position-absolute top-0 end-0 m-4"
              aria-label="Close modal"
            />

            <div className="text-center mb-4">
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3 shadow"
                style={{
                  width: '56px',
                  height: '56px',
                  background: 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)'
                }}
              >
                <FiZap color="#FFF" size={28} />
              </div>
              <h3 className="text-white fw-bold mb-1">One-Click Demo Access</h3>
              <p className="text-muted small mb-0">Select any user role below to instantly explore live Gymkhana portals.</p>
            </div>

            <div className="d-flex flex-column gap-3">
              {/* Member Demo */}
              <button
                onClick={() => handleQuickDemoLogin('john@gmail.com', 'member123', 'Member')}
                disabled={!!demoLoading}
                className="btn btn-secondary-glass p-3 text-start d-flex align-items-center justify-content-between hover-lift"
              >
                <div className="d-flex align-items-center gap-3">
                  <div className="p-2 rounded-circle bg-primary bg-opacity-25 text-primary">
                    <FiUser size={20} />
                  </div>
                  <div>
                    <span className="text-white fw-bold d-block">Demo Member</span>
                    <small className="text-muted">john@gmail.com • Explore workout checklists & pass bookings</small>
                  </div>
                </div>
                {demoLoading === 'Member' ? (
                  <span className="spinner-border spinner-border-sm text-primary" />
                ) : (
                  <FiArrowRight className="text-muted" size={18} />
                )}
              </button>

              {/* Trainer Demo */}
              <button
                onClick={() => handleQuickDemoLogin('alex.trainer@gymkhana.com', 'trainer123', 'Trainer')}
                disabled={!!demoLoading}
                className="btn btn-secondary-glass p-3 text-start d-flex align-items-center justify-content-between hover-lift"
              >
                <div className="d-flex align-items-center gap-3">
                  <div className="p-2 rounded-circle bg-info bg-opacity-25 text-info">
                    <FiAward size={20} />
                  </div>
                  <div>
                    <span className="text-white fw-bold d-block">Demo Trainer</span>
                    <small className="text-muted">alex.trainer@gymkhana.com • Build routines & duplicate templates</small>
                  </div>
                </div>
                {demoLoading === 'Trainer' ? (
                  <span className="spinner-border spinner-border-sm text-info" />
                ) : (
                  <FiArrowRight className="text-muted" size={18} />
                )}
              </button>

              {/* Admin Demo */}
              <button
                onClick={() => handleQuickDemoLogin('admin@gymkhana.com', 'admin123', 'Admin')}
                disabled={!!demoLoading}
                className="btn btn-secondary-glass p-3 text-start d-flex align-items-center justify-content-between hover-lift"
              >
                <div className="d-flex align-items-center gap-3">
                  <div className="p-2 rounded-circle bg-warning bg-opacity-25 text-warning">
                    <FiZap size={20} />
                  </div>
                  <div>
                    <span className="text-white fw-bold d-block">Demo Admin</span>
                    <small className="text-muted">admin@gymkhana.com • Revenue analytics & member management</small>
                  </div>
                </div>
                {demoLoading === 'Admin' ? (
                  <span className="spinner-border spinner-border-sm text-warning" />
                ) : (
                  <FiArrowRight className="text-muted" size={18} />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
