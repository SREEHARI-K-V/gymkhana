import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../context/NotificationContext';
import { 
  FiActivity, 
  FiCheckCircle, 
  FiStar, 
  FiMapPin, 
  FiArrowRight, 
  FiShield, 
  FiAward, 
  FiUser, 
  FiZap, 
  FiLayers, 
  FiTrendingUp, 
  FiHeart, 
  FiCheck, 
  FiChevronDown, 
  FiChevronUp, 
  FiLogOut, 
  FiLayout, 
  FiHelpCircle,
  FiMenu,
  FiX
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

  // Navigation menu items for three-dot menu
  const navMenuItems = [
    { label: 'Features', href: '#features', icon: <FiLayers size={16} className="text-primary" /> },
    { label: 'App Experience', href: '#mockup-preview', icon: <FiActivity size={16} className="text-cyan" /> },
    { label: 'Gym Centers', href: '#gyms', icon: <FiMapPin size={16} className="text-success" /> },
    { label: 'BMI & Macro Tool', href: '#calculator', icon: <FiTrendingUp size={16} className="text-warning" /> },
    { label: 'Pricing Plans', href: '#pricing', icon: <FiAward size={16} className="text-info" /> },
    { label: 'Role Portals', href: '#portals', icon: <FiShield size={16} className="text-primary" /> },
    { label: 'FAQ', href: '#faq', icon: <FiHelpCircle size={16} className="text-cyan" /> }
  ];

  // Demo Login Modal state
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [demoLoading, setDemoLoading] = useState(null);

  // Hero Mockup interactive tab
  const [mockupTab, setMockupTab] = useState('WORKOUT');
  const [checkedExercises, setCheckedExercises] = useState({
    0: true,
    1: true,
    2: false,
    3: false
  });

  // Gym center city filter
  const [selectedCity, setSelectedCity] = useState('ALL');

  // Pricing billing toggle
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'annual'

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(0);

  // Interactive Fitness / BMI & Macro Calculator State
  const [calcData, setCalcData] = useState({
    gender: 'MALE',
    age: 26,
    unit: 'METRIC', // 'METRIC' (cm/kg) or 'IMPERIAL' (in/lbs)
    heightCm: 178,
    weightKg: 75,
    heightFt: 5,
    heightIn: 10,
    weightLbs: 165,
    activityLevel: 'MODERATE', // 'SEDENTARY', 'LIGHT', 'MODERATE', 'VERY_ACTIVE', 'EXTRA_ACTIVE'
    fitnessGoal: 'FAT_LOSS' // 'FAT_LOSS', 'LEAN_BULK', 'MAINTAIN'
  });

  // Calculate BMI and Nutrition breakdown in real-time
  const calculationResult = useMemo(() => {
    let weightInKg = calcData.unit === 'METRIC' 
      ? Number(calcData.weightKg) || 70 
      : (Number(calcData.weightLbs) || 154) * 0.453592;

    let heightInM = calcData.unit === 'METRIC'
      ? (Number(calcData.heightCm) || 175) / 100
      : ((Number(calcData.heightFt) || 5) * 12 + (Number(calcData.heightIn) || 9)) * 0.0254;

    const age = Number(calcData.age) || 25;

    // BMI calculation
    const bmi = (heightInM > 0) ? (weightInKg / (heightInM * heightInM)).toFixed(1) : '22.0';
    let bmiCategory = 'Normal Weight';
    let bmiColor = '#22C55E';
    let bmiProgress = 50;

    const bmiNum = parseFloat(bmi);
    if (bmiNum < 18.5) {
      bmiCategory = 'Underweight';
      bmiColor = '#38BDF8';
      bmiProgress = 20;
    } else if (bmiNum <= 24.9) {
      bmiCategory = 'Optimal / Healthy';
      bmiColor = '#22C55E';
      bmiProgress = 50;
    } else if (bmiNum <= 29.9) {
      bmiCategory = 'Overweight';
      bmiColor = '#F59E0B';
      bmiProgress = 75;
    } else {
      bmiCategory = 'High BMI (Obese)';
      bmiColor = '#EF4444';
      bmiProgress = 95;
    }

    // Basal Metabolic Rate (Mifflin-St Jeor)
    const heightInCm = heightInM * 100;
    let bmr = (10 * weightInKg) + (6.25 * heightInCm) - (5 * age);
    bmr = (calcData.gender === 'MALE') ? bmr + 5 : bmr - 161;

    // Activity Multiplier
    const activityMultipliers = {
      SEDENTARY: 1.2,
      LIGHT: 1.375,
      MODERATE: 1.55,
      VERY_ACTIVE: 1.725,
      EXTRA_ACTIVE: 1.9
    };
    const tdee = Math.round(bmr * (activityMultipliers[calcData.activityLevel] || 1.55));

    // Goal adjustments
    let targetCalories = tdee;
    let proteinPerKg = 2.0; // High protein standard
    if (calcData.fitnessGoal === 'FAT_LOSS') {
      targetCalories = Math.round(tdee - 450); // Deficit
      proteinPerKg = 2.2;
    } else if (calcData.fitnessGoal === 'LEAN_BULK') {
      targetCalories = Math.round(tdee + 350); // Surplus
      proteinPerKg = 2.0;
    } else {
      targetCalories = tdee;
      proteinPerKg = 1.8;
    }

    const proteinGrams = Math.round(weightInKg * proteinPerKg);
    const fatGrams = Math.round((targetCalories * 0.25) / 9);
    const remainingCals = targetCalories - (proteinGrams * 4) - (fatGrams * 9);
    const carbGrams = Math.max(50, Math.round(remainingCals / 4));

    return {
      bmi,
      bmiCategory,
      bmiColor,
      bmiProgress,
      bmr: Math.round(bmr),
      tdee,
      targetCalories,
      proteinGrams,
      carbGrams,
      fatGrams
    };
  }, [calcData]);

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

  const toggleExercise = (idx) => {
    setCheckedExercises(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Gym Center Data for Showcase
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

  // FAQ Items
  const faqList = [
    {
      q: "Can I use multiple Gymkhana centers with one membership?",
      a: "Yes! Our Pro and Elite VIP membership tiers provide seamless cross-facility access. You can book morning lifting slots in Manhattan, yoga sessions in Queens, or weekend outdoor turf sessions at our Santa Monica arena with a single QR pass."
    },
    {
      q: "How do personal trainers assign and modify workout and diet plans?",
      a: "Certified personal trainers access their dedicated Trainer Portal. They can build tailored weekly splits, set exact sets/reps and rest timers, design macronutrient-balanced meal schedules, or duplicate master workout templates directly to your account in seconds."
    },
    {
      q: "How does the Digital Gym Pass and Slot Booking system work?",
      a: "Members can explore real-time gym capacities and reserve 90-minute training slots in advance. Upon booking, an official Gymkhana digital pass with a unique verification code and QR identifier is generated for contactless check-in."
    },
    {
      q: "Can I track my body composition and strength progress over time?",
      a: "Absolutely. Gymkhana features an integrated analytics suite powered by interactive Chart.js graphs. You can log body weight, chest, waist, and arm measurements, view automatic BMI trajectory changes, and export complete CSV progress summaries."
    },
    {
      q: "What role types does Gymkhana support?",
      a: "Gymkhana includes 3 purpose-built interfaces: Member (Daily checklist, pass bookings, workout/diet viewer, metrics), Trainer (Roster isolation, routine & meal builder, template duplicator), and Admin (Revenue KPI metrics, active subscriber manager, CSV exports, plan pricing manager)."
    },
    {
      q: "Can I cancel or pause my subscription plan at any time?",
      a: "Yes, all subscription plans are flexible. You can manage your membership status directly from the Subscription page without hidden cancellation penalties or lock-in contracts."
    }
  ];

  return (
    <div className="min-vh-100 text-white position-relative overflow-x-hidden" style={{ background: 'transparent' }}>
      {/* Background Decorative Neon Glow Spheres */}
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
          FIRST SCREEN VIEWPORT: NAVBAR + MOTIVATIONAL THOUGHT ONLY
          ========================================================================= */}
      <div className="motivational-hero-viewport">
        {/* Unified Transparent Navbar */}
        <nav className={`home-navbar-seamless px-3 px-lg-5 py-3 position-relative z-3 ${scrolled ? 'scrolled' : ''}`}>
          <div className="container-fluid d-flex align-items-center justify-content-between p-0">
            {/* Brand Logo & Classic Title */}
            <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none">
              <div className="brand-logo-emblem">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
              <span className="brand-title-classic">GYMKHANA</span>
            </Link>

            {/* Right Controls: Sign In (Person Icon) & Navigation Menu (Three Dashes) */}
            <div className="d-flex align-items-center gap-1 gap-sm-2">
              {user ? (
                <div className="d-flex align-items-center gap-1 gap-sm-2">
                  <div className="d-none d-md-flex align-items-center gap-2 px-3 py-1 rounded-pill border border-white border-opacity-10" style={{ background: 'rgba(255, 255, 255, 0.04)' }}>
                    <FiUser size={14} className="text-cyan" />
                    <span className="text-white small fw-semibold" style={{ fontSize: '0.82rem' }}>
                      {user.full_name?.split(' ')[0]} ({user.role})
                    </span>
                  </div>
                  <Link
                    to={user.role === 'ADMIN' ? '/admin' : user.role === 'TRAINER' ? '/trainer' : '/member'}
                    className="home-nav-icon-btn"
                    title={`Enter ${user.role} Dashboard`}
                    aria-label="Dashboard"
                  >
                    <FiLayout size={19} />
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      addToast('You have logged out.', 'info');
                    }}
                    className="home-nav-icon-btn"
                    title="Sign Out"
                    aria-label="Sign Out"
                  >
                    <FiLogOut size={19} />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="home-nav-icon-btn"
                  title="Sign In / Account"
                  aria-label="Sign In"
                >
                  <FiUser size={20} />
                </Link>
              )}

              {/* Three-Dash (Menu) Options Button (Positioned Next Right to Sign In) */}
              <div className="position-relative" ref={dropdownRef}>
                <button
                  onClick={() => setNavDropdownOpen(!navDropdownOpen)}
                  className={`home-nav-icon-btn ${navDropdownOpen ? 'active' : ''}`}
                  aria-label="Toggle navigation menu"
                  title="Navigation Menu"
                >
                  {navDropdownOpen ? <FiX size={21} /> : <FiMenu size={21} />}
                </button>

                {/* Three-Dot Dropdown Menu Popup */}
                {navDropdownOpen && (
                  <div 
                    className="position-absolute end-0 mt-2 glass-card p-2 shadow-lg border border-secondary border-opacity-30 animate-fadeIn"
                    style={{ 
                      minWidth: '230px', 
                      borderRadius: '16px',
                      zIndex: 1050,
                      background: 'rgba(15, 23, 42, 0.95)',
                      backdropFilter: 'blur(24px)'
                    }}
                  >
                    <div className="px-3 py-2 border-bottom border-secondary border-opacity-25 mb-1">
                      <span className="text-muted small fw-semibold text-uppercase tracking-wider" style={{ fontSize: '0.7rem' }}>
                        Gymkhana Navigation
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
                    </div>
                  </div>
                )}
              </div>
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
        <div className="text-center pb-2">
          <a href="#explore-platform" className="scroll-indicator-btn">
            <span>Scroll to Explore</span>
            <div className="scroll-arrow-circle">
              <FiChevronDown size={18} />
            </div>
          </a>
        </div>
      </div>

      {/* =========================================================================
          PLATFORM SHOWCASE (REVEALED WHEN SCROLLING DOWN)
          ========================================================================= */}
      <section id="explore-platform" className="position-relative pt-5 pb-5 overflow-hidden">
        <div className="container position-relative z-2">
          {/* Main Hero Header */}
          <div className="text-center mx-auto mb-4 mb-lg-5" style={{ maxWidth: '940px' }}>
            {/* Pill Badge */}
            <div className="mb-3 d-inline-block">
              <span className="hero-pill-badge">
                <FiZap className="text-warning" size={16} />
                <span>Next-Generation Gym Management & Fitness SaaS Platform</span>
                <span className="badge bg-primary rounded-pill px-2 py-0 ms-1 text-white" style={{ fontSize: '0.7rem' }}>
                  v2.5 LIVE
                </span>
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="display-4 fw-extrabold text-white tracking-tight mb-3" style={{ lineHeight: 1.15 }}>
              ELEVATE YOUR FITNESS. <br />
              <span className="text-gradient-cyan">EMPOWER YOUR GYM.</span>
            </h1>

            {/* Hero Subtitle */}
            <p className="lead text-muted mx-auto mb-4" style={{ maxWidth: '780px', fontSize: '1.15rem' }}>
              Gymkhana is the all-in-one ecosystem uniting gym members, elite personal trainers, and gym owners. 
              Book multi-center passes, execute dynamic weekly workout splits, track precision macronutrient targets, and monitor real-time biometric progression.
            </p>

            {/* Hero Action Buttons */}
            <div className="d-flex flex-wrap align-items-center justify-content-center gap-3 mb-4">
              <Link
                to="/register"
                className="btn btn-primary-gradient btn-lg px-4 py-3 d-inline-flex align-items-center gap-2 fw-bold shadow-lg"
                style={{ fontSize: '1.05rem', borderRadius: '14px' }}
              >
                <span>Start Free Membership</span>
                <FiArrowRight size={18} />
              </Link>
              <a
                href="#gyms"
                className="btn btn-secondary-glass btn-lg px-4 py-3 d-inline-flex align-items-center gap-2 fw-semibold"
                style={{ fontSize: '1.05rem', borderRadius: '14px' }}
              >
                <FiMapPin size={18} className="text-cyan" />
                <span>Explore Gym Centers</span>
              </a>
              <button
                onClick={() => setDemoModalOpen(true)}
                className="btn btn-secondary-glass btn-lg px-4 py-3 d-inline-flex align-items-center gap-2 text-warning fw-semibold border-warning border-opacity-25"
                style={{ fontSize: '1.05rem', borderRadius: '14px' }}
              >
                <FiZap size={18} />
                <span>Try Demo Portals</span>
              </button>
            </div>

            {/* Micro Social Proof Row */}
            <div className="d-flex flex-wrap align-items-center justify-content-center gap-3 gap-md-4 text-muted small pt-2">
              <span className="d-flex align-items-center gap-1">
                <FiCheckCircle className="text-success" size={16} /> 25+ Verified Gym Centers
              </span>
              <span className="d-flex align-items-center gap-1">
                <FiStar className="text-warning" size={16} fill="#EAB308" /> 4.9/5 Rating (12,500+ Athletes)
              </span>
              <span className="d-flex align-items-center gap-1">
                <FiShield className="text-cyan" size={16} /> JWT Role-Isolated Security
              </span>
            </div>
          </div>

          {/* =========================================================================
              HERO INTERACTIVE APP SHOWCASE / MOCKUP
              ========================================================================= */}
          <div id="mockup-preview" className="position-relative mx-auto mt-4 pt-2" style={{ maxWidth: '1080px' }}>
            {/* Top Floating Badge */}
            <div 
              className="floating-hero-card p-3 d-none d-lg-flex align-items-center gap-3"
              style={{ top: '-25px', left: '-30px', maxWidth: '280px' }}
            >
              <div 
                className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" 
                style={{ width: '44px', height: '44px', background: 'rgba(34, 197, 94, 0.2)', border: '1px solid #22C55E' }}
              >
                <FiTrendingUp color="#22C55E" size={22} />
              </div>
              <div>
                <span className="text-white fw-bold d-block small">Weekly Goal Hit</span>
                <span className="text-muted" style={{ fontSize: '0.78rem' }}>🔥 15,420+ Workouts Completed</span>
              </div>
            </div>

            {/* Bottom Floating Badge */}
            <div 
              className="floating-hero-card-bottom p-3 d-none d-lg-flex align-items-center gap-3"
              style={{ bottom: '-20px', right: '-25px', maxWidth: '300px' }}
            >
              <div 
                className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" 
                style={{ width: '44px', height: '44px', background: 'rgba(6, 182, 212, 0.2)', border: '1px solid #06B6D4' }}
              >
                <FiAward color="#06B6D4" size={22} />
              </div>
              <div>
                <span className="text-white fw-bold d-block small">Assigned Coach</span>
                <span className="text-muted" style={{ fontSize: '0.78rem' }}>Coach Alex Vance • Certified Specialist</span>
              </div>
            </div>

            {/* Main Mockup Container Card */}
            <div className="hero-mockup-container p-3 p-md-4 p-lg-5">
              {/* Mockup Header Toolbar */}
              <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 pb-3 mb-4 border-bottom border-secondary border-opacity-25">
                <div className="d-flex align-items-center gap-2">
                  <span className="rounded-circle bg-danger d-inline-block" style={{ width: '12px', height: '12px' }} />
                  <span className="rounded-circle bg-warning d-inline-block" style={{ width: '12px', height: '12px' }} />
                  <span className="rounded-circle bg-success d-inline-block" style={{ width: '12px', height: '12px' }} />
                  <span className="text-muted ms-2 small fw-semibold">Gymkhana Live Member Portal Simulator</span>
                </div>

                {/* Tab Switcher */}
                <div className="btn-group p-1 glass-card-static rounded-3 overflow-x-auto hide-scrollbar" role="group">
                  <button
                    type="button"
                    onClick={() => setMockupTab('WORKOUT')}
                    className={`btn btn-sm px-3 py-1 rounded-2 text-nowrap ${mockupTab === 'WORKOUT' ? 'btn-primary-gradient fw-bold' : 'text-muted'}`}
                  >
                    🏋️ Daily Workout
                  </button>
                  <button
                    type="button"
                    onClick={() => setMockupTab('DIET')}
                    className={`btn btn-sm px-3 py-1 rounded-2 text-nowrap ${mockupTab === 'DIET' ? 'btn-primary-gradient fw-bold' : 'text-muted'}`}
                  >
                    🥗 Diet & Macros
                  </button>
                  <button
                    type="button"
                    onClick={() => setMockupTab('PASS')}
                    className={`btn btn-sm px-3 py-1 rounded-2 text-nowrap ${mockupTab === 'PASS' ? 'btn-primary-gradient fw-bold' : 'text-muted'}`}
                  >
                    📍 Digital Gym Pass
                  </button>
                  <button
                    type="button"
                    onClick={() => setMockupTab('PROGRESS')}
                    className={`btn btn-sm px-3 py-1 rounded-2 text-nowrap ${mockupTab === 'PROGRESS' ? 'btn-primary-gradient fw-bold' : 'text-muted'}`}
                  >
                    📈 Analytics & BMI
                  </button>
                </div>
              </div>

              {/* Dynamic Interactive Tab Content */}
              {mockupTab === 'WORKOUT' && (
                <div className="animate-fadeIn">
                  <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2 mb-3">
                    <div>
                      <span className="badge badge-active mb-1">THURSDAY • CHEST & TRICEPS POWER</span>
                      <h4 className="text-white fw-bold mb-0">Hypertrophy Upper Body Routine</h4>
                      <small className="text-muted">Assigned by Coach Alex Vance • Target: 5 Sets per compound lift</small>
                    </div>
                    <div className="glass-card-static px-3 py-2 rounded-3 text-md-end">
                      <span className="text-muted small d-block">Routine Completion</span>
                      <strong className="text-cyan fs-6">
                        {Object.values(checkedExercises).filter(Boolean).length} / 4 Exercises Done
                      </strong>
                    </div>
                  </div>

                  {/* Exercise Interactive Checklist Items */}
                  <div className="d-flex flex-column gap-2 mt-3">
                    {[
                      { name: 'Barbell Flat Bench Press', target: 'Chest / Triceps', sets: '4 Sets', reps: '8 - 10 Reps', rest: '90s Rest' },
                      { name: 'Incline Dumbbell Press', target: 'Upper Chest', sets: '3 Sets', reps: '10 - 12 Reps', rest: '75s Rest' },
                      { name: 'Cable Chest Flyes (Pec Dec)', target: 'Inner Chest', sets: '3 Sets', reps: '15 Reps', rest: '60s Rest' },
                      { name: 'Overhead Tricep Rope Extension', target: 'Triceps Long Head', sets: '4 Sets', reps: '12 - 15 Reps', rest: '60s Rest' }
                    ].map((ex, idx) => (
                      <div
                        key={idx}
                        onClick={() => toggleExercise(idx)}
                        className={`p-3 rounded-3 border d-flex align-items-center justify-content-between cursor-pointer transition-all ${
                          checkedExercises[idx]
                            ? 'bg-success bg-opacity-10 border-success border-opacity-40'
                            : 'glass-card border-secondary border-opacity-25'
                        }`}
                      >
                        <div className="d-flex align-items-center gap-3">
                          <div
                            className={`rounded-circle d-flex align-items-center justify-content-center ${
                              checkedExercises[idx] ? 'bg-success text-white' : 'border border-secondary'
                            }`}
                            style={{ width: '26px', height: '26px' }}
                          >
                            {checkedExercises[idx] && <FiCheck size={16} />}
                          </div>
                          <div>
                            <span className={`fw-bold d-block ${checkedExercises[idx] ? 'text-white text-decoration-line-through opacity-75' : 'text-white'}`}>
                              {ex.name}
                            </span>
                            <small className="text-muted">Target: {ex.target}</small>
                          </div>
                        </div>

                        <div className="d-flex align-items-center gap-2">
                          <span className="badge bg-dark text-cyan small">{ex.sets}</span>
                          <span className="badge bg-dark text-white small">{ex.reps}</span>
                          <span className="badge bg-dark text-warning small d-none d-sm-inline">{ex.rest}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {mockupTab === 'DIET' && (
                <div className="animate-fadeIn">
                  <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2 mb-3">
                    <div>
                      <span className="badge badge-active mb-1">HIGH PROTEIN PERFORMANCE PLAN</span>
                      <h4 className="text-white fw-bold mb-0">Daily Macronutrient Targets</h4>
                      <small className="text-muted">Target Goal: 2,450 kcal / day • Clean Muscle Gain Protocol</small>
                    </div>
                    <div className="glass-card-static px-3 py-2 rounded-3 text-md-end">
                      <span className="text-muted small d-block">Calories Consumed</span>
                      <strong className="text-success fs-5">2,280 / 2,450 kcal</strong>
                    </div>
                  </div>

                  {/* Macro Progress Bars */}
                  <div className="row g-3 my-2">
                    <div className="col-12 col-md-4">
                      <div className="glass-card-static p-3 rounded-3 border border-primary border-opacity-25">
                        <div className="d-flex justify-content-between small fw-bold mb-1">
                          <span className="text-primary">🥩 Protein Target</span>
                          <span className="text-white">185g / 190g (97%)</span>
                        </div>
                        <div className="progress" style={{ height: '8px', background: 'rgba(255,255,255,0.1)' }}>
                          <div className="progress-bar bg-primary" style={{ width: '97%' }} />
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-md-4">
                      <div className="glass-card-static p-3 rounded-3 border border-cyan border-opacity-25">
                        <div className="d-flex justify-content-between small fw-bold mb-1">
                          <span className="text-cyan">🍚 Carbohydrates</span>
                          <span className="text-white">225g / 250g (90%)</span>
                        </div>
                        <div className="progress" style={{ height: '8px', background: 'rgba(255,255,255,0.1)' }}>
                          <div className="progress-bar bg-info" style={{ width: '90%' }} />
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-md-4">
                      <div className="glass-card-static p-3 rounded-3 border border-warning border-opacity-25">
                        <div className="d-flex justify-content-between small fw-bold mb-1">
                          <span className="text-warning">🥑 Healthy Fats</span>
                          <span className="text-white">58g / 65g (89%)</span>
                        </div>
                        <div className="progress" style={{ height: '8px', background: 'rgba(255,255,255,0.1)' }}>
                          <div className="progress-bar bg-warning" style={{ width: '89%' }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Meal Breakdown List */}
                  <div className="row g-2 mt-2">
                    {[
                      { meal: 'Breakfast (08:00 AM)', name: 'Rolled Oats with Whey, Blueberries & Chia Seeds', cals: '580 kcal', p: '42g Pro' },
                      { meal: 'Lunch (01:00 PM)', name: 'Grilled Chicken Breast, Quinoa, Broccoli & Avocado', cals: '720 kcal', p: '58g Pro' },
                      { meal: 'Post-Workout (05:30 PM)', name: 'Isolate Shake with Banana & Peanut Butter', cals: '420 kcal', p: '38g Pro' },
                      { meal: 'Dinner (08:30 PM)', name: 'Pan-Seared Salmon Fillet with Sweet Potato & Asparagus', cals: '560 kcal', p: '47g Pro' }
                    ].map((m, idx) => (
                      <div key={idx} className="col-12 col-md-6">
                        <div className="p-3 glass-card rounded-3 border border-secondary border-opacity-25 d-flex justify-content-between align-items-center">
                          <div>
                            <span className="text-cyan small fw-semibold d-block">{m.meal}</span>
                            <span className="text-white small fw-bold text-truncate d-inline-block" style={{ maxWidth: '240px' }}>{m.name}</span>
                          </div>
                          <div className="text-end flex-shrink-0">
                            <span className="badge bg-dark text-white d-block mb-1">{m.cals}</span>
                            <span className="badge bg-primary bg-opacity-25 text-cyan">{m.p}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {mockupTab === 'PASS' && (
                <div className="animate-fadeIn">
                  <div className="row g-4 align-items-center">
                    <div className="col-12 col-md-6">
                      <span className="badge badge-active mb-2">VERIFIED ACTIVE MEMBERSHIP</span>
                      <h4 className="text-white fw-bold mb-2">Digital All-Access Pass</h4>
                      <p className="text-muted small mb-3">
                        Instant contactless QR check-in at 25+ Gymkhana fitness facilities. Multi-city access with peak hour priority slot booking.
                      </p>

                      <div className="d-flex flex-column gap-2 text-muted small">
                        <div className="d-flex justify-content-between p-2 glass-card-static rounded-2">
                          <span>Active Center:</span>
                          <strong className="text-white">Gymkhana Elite - Downtown NYC</strong>
                        </div>
                        <div className="d-flex justify-content-between p-2 glass-card-static rounded-2">
                          <span>Reserved Slot:</span>
                          <strong className="text-cyan">06:00 AM - 07:30 AM (Tomorrow)</strong>
                        </div>
                        <div className="d-flex justify-content-between p-2 glass-card-static rounded-2">
                          <span>Subscription Status:</span>
                          <span className="badge badge-active">ACTIVE • 24 DAYS REMAINING</span>
                        </div>
                      </div>
                    </div>

                    <div className="col-12 col-md-6">
                      <div 
                        className="glass-card p-4 rounded-4 border border-cyan border-opacity-40 text-center position-relative overflow-hidden"
                        style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)' }}
                      >
                        <span className="badge bg-primary text-white mb-2 px-3 py-1">GYMKHANA VIP ATHLETE</span>
                        <h5 className="text-white fw-bold mb-1">John Doe</h5>
                        <p className="text-cyan small mb-3">Pass ID: GK-NYC-9482</p>

                        {/* Simulated QR Code Graphic */}
                        <div 
                          className="d-inline-flex flex-column align-items-center justify-content-center p-3 rounded-3 bg-white mx-auto shadow-lg mb-3"
                          style={{ width: '130px', height: '130px' }}
                        >
                          <div className="d-flex gap-1 mb-1">
                            <div style={{ width: '22px', height: '22px', background: '#0F172A' }} />
                            <div style={{ width: '22px', height: '22px', background: '#4F46E5' }} />
                            <div style={{ width: '22px', height: '22px', background: '#0F172A' }} />
                          </div>
                          <div className="d-flex gap-1 mb-1">
                            <div style={{ width: '22px', height: '22px', background: '#06B6D4' }} />
                            <div style={{ width: '22px', height: '22px', background: '#0F172A' }} />
                            <div style={{ width: '22px', height: '22px', background: '#4F46E5' }} />
                          </div>
                          <div className="d-flex gap-1">
                            <div style={{ width: '22px', height: '22px', background: '#0F172A' }} />
                            <div style={{ width: '22px', height: '22px', background: '#06B6D4' }} />
                            <div style={{ width: '22px', height: '22px', background: '#0F172A' }} />
                          </div>
                        </div>

                        <span className="badge bg-success bg-opacity-25 text-success small d-block">
                          ✓ Scan at Entrance Turnstile
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {mockupTab === 'PROGRESS' && (
                <div className="animate-fadeIn">
                  <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2 mb-3">
                    <div>
                      <span className="badge badge-active mb-1">BIOMETRIC TRACKING ENGINE</span>
                      <h4 className="text-white fw-bold mb-0">Body Composition & Strength Analytics</h4>
                      <small className="text-muted">12-Week Transformation Trajectory • Down -4.2 kg Fat / Up +2.5 kg Lean Mass</small>
                    </div>
                    <div className="glass-card-static px-3 py-2 rounded-3 text-md-end">
                      <span className="text-muted small d-block">Current BMI</span>
                      <strong className="text-success fs-5">22.4 (Healthy Range)</strong>
                    </div>
                  </div>

                  {/* Simulated Metric Analytics Chart SVG */}
                  <div className="glass-card-static p-4 rounded-3 border border-secondary border-opacity-25 my-3 position-relative">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="d-flex align-items-center gap-3">
                        <span className="d-flex align-items-center gap-1 small text-white">
                          <span className="rounded-circle bg-primary d-inline-block" style={{ width: '10px', height: '10px' }} />
                          Body Weight (kg)
                        </span>
                        <span className="d-flex align-items-center gap-1 small text-muted">
                          <span className="rounded-circle bg-info d-inline-block" style={{ width: '10px', height: '10px' }} />
                          Bench 1RM (kg)
                        </span>
                      </div>
                      <span className="badge bg-dark text-cyan small">Past 6 Months</span>
                    </div>

                    {/* Chart Visualization (SVG Vector Graph) */}
                    <div style={{ height: '160px', width: '100%' }}>
                      <svg viewBox="0 0 500 140" className="w-100 h-100" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="gradientWeight" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        {/* Grid lines */}
                        <line x1="0" y1="30" x2="500" y2="30" stroke="rgba(255,255,255,0.06)" strokeDasharray="4" />
                        <line x1="0" y1="70" x2="500" y2="70" stroke="rgba(255,255,255,0.06)" strokeDasharray="4" />
                        <line x1="0" y1="110" x2="500" y2="110" stroke="rgba(255,255,255,0.06)" strokeDasharray="4" />
                        
                        {/* Area fill */}
                        <path d="M 0,110 Q 100,95 200,80 T 350,55 T 500,40 L 500,140 L 0,140 Z" fill="url(#gradientWeight)" />
                        
                        {/* Smooth Line Curves */}
                        <path d="M 0,110 Q 100,95 200,80 T 350,55 T 500,40" fill="none" stroke="#4F46E5" strokeWidth="3.5" />
                        <path d="M 0,120 Q 100,105 200,90 T 350,75 T 500,60" fill="none" stroke="#06B6D4" strokeWidth="2.5" strokeDasharray="5,5" />
                        
                        {/* Coordinate points */}
                        <circle cx="0" cy="110" r="4" fill="#818CF8" />
                        <circle cx="125" cy="90" r="4" fill="#818CF8" />
                        <circle cx="250" cy="72" r="4" fill="#818CF8" />
                        <circle cx="375" cy="50" r="4" fill="#818CF8" />
                        <circle cx="500" cy="40" r="5" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="2" />
                      </svg>
                    </div>

                    <div className="d-flex justify-content-between text-muted small mt-2">
                      <span>Month 1 (82 kg)</span>
                      <span>Month 2 (80.5 kg)</span>
                      <span>Month 3 (78.8 kg)</span>
                      <span>Month 4 (77.4 kg)</span>
                      <span className="text-cyan fw-bold">Month 5 (75.8 kg) ✓</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          STATS COUNTER BANNER
          ========================================================================= */}
      <section className="py-5 position-relative z-2 border-top border-bottom border-secondary border-opacity-25" style={{ background: 'rgba(15, 23, 42, 0.4)' }}>
        <div className="container">
          <div className="row g-4 text-center">
            <div className="col-6 col-lg-3">
              <div className="p-3">
                <h2 className="display-5 fw-extrabold text-white mb-1 tracking-tight">25+</h2>
                <p className="text-cyan fw-semibold mb-0 small text-uppercase tracking-wider">Premium Gym Hubs</p>
                <small className="text-muted">NYC, LA, Brooklyn & Queens</small>
              </div>
            </div>
            <div className="col-6 col-lg-3">
              <div className="p-3">
                <h2 className="display-5 fw-extrabold text-white mb-1 tracking-tight">12.5K+</h2>
                <p className="text-cyan fw-semibold mb-0 small text-uppercase tracking-wider">Active Athletes</p>
                <small className="text-muted">Daily Workout Check-ins</small>
              </div>
            </div>
            <div className="col-6 col-lg-3">
              <div className="p-3">
                <h2 className="display-5 fw-extrabold text-white mb-1 tracking-tight">98.4%</h2>
                <p className="text-cyan fw-semibold mb-0 small text-uppercase tracking-wider">Plan Adherence</p>
                <small className="text-muted">Trainer-Verified Milestones</small>
              </div>
            </div>
            <div className="col-6 col-lg-3">
              <div className="p-3">
                <h2 className="display-5 fw-extrabold text-white mb-1 tracking-tight">4.95 ⭐</h2>
                <p className="text-cyan fw-semibold mb-0 small text-uppercase tracking-wider">Member Satisfaction</p>
                <small className="text-muted">Based on 3,500+ Reviews</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CORE FEATURES PILLARS
          ========================================================================= */}
      <section id="features" className="py-5 position-relative z-2">
        <div className="container py-lg-4">
          <div className="text-center mx-auto mb-5" style={{ maxWidth: '750px' }}>
            <span className="badge badge-role mb-2">POWERFUL ARCHITECTURE</span>
            <h2 className="display-6 fw-bold text-white mb-3">
              Everything Needed for Modern Fitness Management
            </h2>
            <p className="text-muted lead fs-6">
              Gymkhana delivers enterprise capabilities in a sleek, glassmorphic dark interface optimized for speed, clarity, and daily motivation.
            </p>
          </div>

          <div className="row g-4">
            {/* Feature 1 */}
            <div className="col-12 col-md-6 col-lg-4">
              <div className="glass-card feature-box-glow p-4 h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="feature-icon-circle bg-primary bg-opacity-25 text-primary mb-3">
                    <FiMapPin size={24} />
                  </div>
                  <h4 className="text-white fw-bold mb-2">Multi-Center Gym Passes</h4>
                  <p className="text-muted small mb-0">
                    Reserve workout slots in advance with live capacity meters. Generate digital entry QR passes for instant turnstile check-ins across 25+ partner centers.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-top border-secondary border-opacity-25 d-flex align-items-center text-cyan small fw-semibold">
                  <span>Explore Network</span>
                  <FiArrowRight size={14} className="ms-1" />
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="col-12 col-md-6 col-lg-4">
              <div className="glass-card feature-box-glow p-4 h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="feature-icon-circle bg-cyan bg-opacity-25 text-cyan mb-3">
                    <FiLayers size={24} />
                  </div>
                  <h4 className="text-white fw-bold mb-2">Dynamic Workout Builder</h4>
                  <p className="text-muted small mb-0">
                    Design customized weekly splits with target muscle groups, sets, reps, and rest intervals. Trainers can duplicate master templates to clients in 1 click.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-top border-secondary border-opacity-25 d-flex align-items-center text-cyan small fw-semibold">
                  <span>Interactive Checklists</span>
                  <FiArrowRight size={14} className="ms-1" />
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="col-12 col-md-6 col-lg-4">
              <div className="glass-card feature-box-glow p-4 h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="feature-icon-circle bg-warning bg-opacity-25 text-warning mb-3">
                    <FiHeart size={24} />
                  </div>
                  <h4 className="text-white fw-bold mb-2">Precision Macro & Diet Engine</h4>
                  <p className="text-muted small mb-0">
                    Automated calorie and macronutrient tracking (Protein, Carbs, Fats). Schedule specific meal timings to align with athletic goals and fasting windows.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-top border-secondary border-opacity-25 d-flex align-items-center text-cyan small fw-semibold">
                  <span>Macro Compliance</span>
                  <FiArrowRight size={14} className="ms-1" />
                </div>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="col-12 col-md-6 col-lg-4">
              <div className="glass-card feature-box-glow p-4 h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="feature-icon-circle bg-success bg-opacity-25 text-success mb-3">
                    <FiTrendingUp size={24} />
                  </div>
                  <h4 className="text-white fw-bold mb-2">Chart.js Biometric Tracking</h4>
                  <p className="text-muted small mb-0">
                    Log body weight, chest, waist, and arms metrics. Visualize progress curves over time with interactive Chart.js line charts and automated BMI categorization.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-top border-secondary border-opacity-25 d-flex align-items-center text-cyan small fw-semibold">
                  <span>Visual Trajectory</span>
                  <FiArrowRight size={14} className="ms-1" />
                </div>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="col-12 col-md-6 col-lg-4">
              <div className="glass-card feature-box-glow p-4 h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="feature-icon-circle bg-info bg-opacity-25 text-info mb-3">
                    <FiAward size={24} />
                  </div>
                  <h4 className="text-white fw-bold mb-2">Trainer Portal & Isolation</h4>
                  <p className="text-muted small mb-0">
                    Database-level isolation ensures personal trainers manage only their assigned member roster, write progress notes, and adjust plans on demand.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-top border-secondary border-opacity-25 d-flex align-items-center text-cyan small fw-semibold">
                  <span>Coach Operations</span>
                  <FiArrowRight size={14} className="ms-1" />
                </div>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="col-12 col-md-6 col-lg-4">
              <div className="glass-card feature-box-glow p-4 h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="feature-icon-circle bg-danger bg-opacity-25 text-danger mb-3">
                    <FiShield size={24} />
                  </div>
                  <h4 className="text-white fw-bold mb-2">Admin Hub & CSV Reports</h4>
                  <p className="text-muted small mb-0">
                    Track total revenue, member subscription expiration lifecycles, and trainer load balances. Export comprehensive CSV reports with a single click.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-top border-secondary border-opacity-25 d-flex align-items-center text-cyan small fw-semibold">
                  <span>Enterprise SaaS</span>
                  <FiArrowRight size={14} className="ms-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          INTERACTIVE FITNESS CALCULATOR (BMI & MACRO TDEE TOOL)
          ========================================================================= */}
      <section id="calculator" className="py-5 position-relative z-2">
        <div className="container py-lg-4">
          <div className="text-center mx-auto mb-5" style={{ maxWidth: '800px' }}>
            <span className="badge badge-active mb-2">INTERACTIVE HEALTH TOOL</span>
            <h2 className="display-6 fw-bold text-white mb-3">
              Calculate Your BMI, TDEE & Macro Goals
            </h2>
            <p className="text-muted lead fs-6">
              Use our clinical algorithm to discover your optimal calorie intake, macronutrient grams, and ideal Gymkhana workout program right now.
            </p>
          </div>

          <div className="calculator-card p-4 p-lg-5 mx-auto" style={{ maxWidth: '980px' }}>
            <div className="row g-4 g-lg-5 align-items-center">
              {/* Input Form Column */}
              <div className="col-12 col-lg-6">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="text-white fw-bold mb-0">Your Biometrics</h5>
                  
                  {/* Unit Switcher */}
                  <div className="btn-group btn-group-sm p-1 glass-card-static rounded-pill">
                    <button
                      type="button"
                      onClick={() => setCalcData(prev => ({ ...prev, unit: 'METRIC' }))}
                      className={`btn btn-sm rounded-pill px-3 ${calcData.unit === 'METRIC' ? 'btn-primary-gradient fw-bold' : 'text-muted'}`}
                    >
                      Metric (kg/cm)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCalcData(prev => ({ ...prev, unit: 'IMPERIAL' }))}
                      className={`btn btn-sm rounded-pill px-3 ${calcData.unit === 'IMPERIAL' ? 'btn-primary-gradient fw-bold' : 'text-muted'}`}
                    >
                      US (lbs/ft)
                    </button>
                  </div>
                </div>

                <div className="d-flex flex-column gap-3">
                  {/* Gender & Age */}
                  <div className="row g-2">
                    <div className="col-6">
                      <label className="form-label-custom">Gender</label>
                      <select
                        className="form-select glass-input"
                        value={calcData.gender}
                        onChange={(e) => setCalcData(prev => ({ ...prev, gender: e.target.value }))}
                      >
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label-custom">Age (Years)</label>
                      <input
                        type="number"
                        min="14"
                        max="90"
                        className="form-control glass-input"
                        value={calcData.age}
                        onChange={(e) => setCalcData(prev => ({ ...prev, age: e.target.value }))}
                      />
                    </div>
                  </div>

                  {/* Height & Weight */}
                  {calcData.unit === 'METRIC' ? (
                    <div className="row g-2">
                      <div className="col-6">
                        <label className="form-label-custom">Height (cm)</label>
                        <input
                          type="number"
                          min="100"
                          max="250"
                          className="form-control glass-input"
                          value={calcData.heightCm}
                          onChange={(e) => setCalcData(prev => ({ ...prev, heightCm: e.target.value }))}
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label-custom">Weight (kg)</label>
                        <input
                          type="number"
                          min="30"
                          max="250"
                          className="form-control glass-input"
                          value={calcData.weightKg}
                          onChange={(e) => setCalcData(prev => ({ ...prev, weightKg: e.target.value }))}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="row g-2">
                      <div className="col-3">
                        <label className="form-label-custom">Feet</label>
                        <input
                          type="number"
                          min="3"
                          max="7"
                          className="form-control glass-input"
                          value={calcData.heightFt}
                          onChange={(e) => setCalcData(prev => ({ ...prev, heightFt: e.target.value }))}
                        />
                      </div>
                      <div className="col-3">
                        <label className="form-label-custom">Inches</label>
                        <input
                          type="number"
                          min="0"
                          max="11"
                          className="form-control glass-input"
                          value={calcData.heightIn}
                          onChange={(e) => setCalcData(prev => ({ ...prev, heightIn: e.target.value }))}
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label-custom">Weight (lbs)</label>
                        <input
                          type="number"
                          min="70"
                          max="500"
                          className="form-control glass-input"
                          value={calcData.weightLbs}
                          onChange={(e) => setCalcData(prev => ({ ...prev, weightLbs: e.target.value }))}
                        />
                      </div>
                    </div>
                  )}

                  {/* Activity Level */}
                  <div>
                    <label className="form-label-custom">Weekly Activity Level</label>
                    <select
                      className="form-select glass-input"
                      value={calcData.activityLevel}
                      onChange={(e) => setCalcData(prev => ({ ...prev, activityLevel: e.target.value }))}
                    >
                      <option value="SEDENTARY">Sedentary (Desk job, minimal exercise)</option>
                      <option value="LIGHT">Light Exercise (1-2 gym sessions/week)</option>
                      <option value="MODERATE">Moderate Exercise (3-4 gym sessions/week)</option>
                      <option value="VERY_ACTIVE">Very Active (5-6 intense gym sessions/week)</option>
                      <option value="EXTRA_ACTIVE">Athlete / Heavy Training (2x daily)</option>
                    </select>
                  </div>

                  {/* Primary Fitness Goal */}
                  <div>
                    <label className="form-label-custom">Primary Fitness Goal</label>
                    <div className="row g-2">
                      <div className="col-4">
                        <button
                          type="button"
                          onClick={() => setCalcData(prev => ({ ...prev, fitnessGoal: 'FAT_LOSS' }))}
                          className={`btn btn-sm w-100 py-2 rounded-3 text-nowrap ${
                            calcData.fitnessGoal === 'FAT_LOSS' ? 'btn-primary-gradient fw-bold' : 'btn-secondary-glass text-muted'
                          }`}
                        >
                          🔥 Fat Loss
                        </button>
                      </div>
                      <div className="col-4">
                        <button
                          type="button"
                          onClick={() => setCalcData(prev => ({ ...prev, fitnessGoal: 'MAINTAIN' }))}
                          className={`btn btn-sm w-100 py-2 rounded-3 text-nowrap ${
                            calcData.fitnessGoal === 'MAINTAIN' ? 'btn-primary-gradient fw-bold' : 'btn-secondary-glass text-muted'
                          }`}
                        >
                          ⚖️ Maintain
                        </button>
                      </div>
                      <div className="col-4">
                        <button
                          type="button"
                          onClick={() => setCalcData(prev => ({ ...prev, fitnessGoal: 'LEAN_BULK' }))}
                          className={`btn btn-sm w-100 py-2 rounded-3 text-nowrap ${
                            calcData.fitnessGoal === 'LEAN_BULK' ? 'btn-primary-gradient fw-bold' : 'btn-secondary-glass text-muted'
                          }`}
                        >
                          💪 Build Muscle
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Output Results Column */}
              <div className="col-12 col-lg-6">
                <div className="calculator-result-box p-4 p-sm-5">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <span className="badge badge-active">PERSONALIZED TARGETS</span>
                    <span className="text-muted small">Live Calculation</span>
                  </div>

                  {/* BMI Summary Box */}
                  <div className="mb-4 text-center">
                    <span className="text-muted small d-block">Calculated Body Mass Index (BMI)</span>
                    <div className="d-flex align-items-center justify-content-center gap-2 my-1">
                      <h2 className="display-4 fw-extrabold text-white mb-0">{calculationResult.bmi}</h2>
                      <span className="badge fs-6 py-1 px-3" style={{ background: `${calculationResult.bmiColor}22`, color: calculationResult.bmiColor, border: `1px solid ${calculationResult.bmiColor}` }}>
                        {calculationResult.bmiCategory}
                      </span>
                    </div>

                    {/* Visual Meter Bar */}
                    <div className="progress mt-2" style={{ height: '8px', background: 'rgba(255,255,255,0.1)' }}>
                      <div
                        className="progress-bar"
                        style={{
                          width: `${calculationResult.bmiProgress}%`,
                          backgroundColor: calculationResult.bmiColor,
                          transition: 'width 0.4s ease'
                        }}
                      />
                    </div>
                  </div>

                  {/* Calories & Macros Cards */}
                  <div className="glass-card-static p-3 rounded-3 mb-3 border border-secondary border-opacity-25">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-muted small">Recommended Daily Energy:</span>
                      <strong className="text-cyan fs-5">{calculationResult.targetCalories} kcal / day</strong>
                    </div>
                    <div className="row g-2 text-center pt-2 border-top border-secondary border-opacity-25">
                      <div className="col-4">
                        <span className="text-muted d-block" style={{ fontSize: '0.75rem' }}>Protein</span>
                        <strong className="text-primary fs-6">{calculationResult.proteinGrams}g</strong>
                      </div>
                      <div className="col-4">
                        <span className="text-muted d-block" style={{ fontSize: '0.75rem' }}>Carbs</span>
                        <strong className="text-info fs-6">{calculationResult.carbGrams}g</strong>
                      </div>
                      <div className="col-4">
                        <span className="text-muted d-block" style={{ fontSize: '0.75rem' }}>Fats</span>
                        <strong className="text-warning fs-6">{calculationResult.fatGrams}g</strong>
                      </div>
                    </div>
                  </div>

                  {/* Apply Goal CTA */}
                  <Link
                    to="/register"
                    className="btn btn-primary-gradient w-100 py-3 d-flex align-items-center justify-content-center gap-2 fw-bold"
                  >
                    <span>Apply Plan to My Account</span>
                    <FiArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          GYM CENTERS NETWORK SHOWCASE
          ========================================================================= */}
      <section id="gyms" className="py-5 position-relative z-2">
        <div className="container py-lg-4">
          <div className="d-flex flex-column flex-md-row align-items-md-end justify-content-between gap-3 mb-4">
            <div>
              <span className="badge badge-role mb-2">OFFICIAL GYMKHANA NETWORK</span>
              <h2 className="display-6 fw-bold text-white mb-1">Explore High-End Training Centers</h2>
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
          MEMBERSHIP PRICING & TIERS
          ========================================================================= */}
      <section id="pricing" className="py-5 position-relative z-2 border-top border-secondary border-opacity-25">
        <div className="container py-lg-4">
          <div className="text-center mx-auto mb-5" style={{ maxWidth: '750px' }}>
            <span className="badge badge-active mb-2">TRANSPARENT VALUE</span>
            <h2 className="display-6 fw-bold text-white mb-3">
              Membership Plans Designed for Every Goal
            </h2>
            <p className="text-muted lead fs-6 mb-4">
              Flexible options with no lock-in commitments. Upgrade, downgrade, or pause anytime.
            </p>

            {/* Monthly / Annual Toggle */}
            <div className="d-inline-flex align-items-center gap-3 p-2 glass-card-static rounded-pill">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`btn btn-sm rounded-pill px-3 py-1 ${billingCycle === 'monthly' ? 'btn-primary-gradient fw-bold' : 'text-muted'}`}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('annual')}
                className={`btn btn-sm rounded-pill px-3 py-1 d-flex align-items-center gap-1 ${billingCycle === 'annual' ? 'btn-primary-gradient fw-bold' : 'text-muted'}`}
              >
                <span>Annual Billing</span>
                <span className="badge bg-success text-white rounded-pill px-2" style={{ fontSize: '0.65rem' }}>Save 20%</span>
              </button>
            </div>
          </div>

          <div className="row g-4 align-items-stretch">
            {/* Starter Plan */}
            <div className="col-12 col-lg-4">
              <div className="glass-card p-4 p-lg-5 h-100 d-flex flex-column justify-content-between">
                <div>
                  <span className="badge badge-role mb-3">SINGLE ACCESS</span>
                  <h3 className="text-white fw-bold mb-1">Starter Flex Pass</h3>
                  <p className="text-muted small mb-4">Perfect for travelers, occasional lifters, and weekend sessions.</p>

                  <div className="d-flex align-items-baseline gap-1 mb-4">
                    <h2 className="display-5 fw-extrabold text-white mb-0">$15</h2>
                    <span className="text-muted">/ day pass</span>
                  </div>

                  <ul className="list-unstyled d-flex flex-column gap-3 text-muted small mb-0">
                    <li className="d-flex align-items-center gap-2">
                      <FiCheckCircle className="text-success" size={16} />
                      <span className="text-white">Full single-day gym floor access</span>
                    </li>
                    <li className="d-flex align-items-center gap-2">
                      <FiCheckCircle className="text-success" size={16} />
                      <span className="text-white">Digital QR entry pass</span>
                    </li>
                    <li className="d-flex align-items-center gap-2">
                      <FiCheckCircle className="text-success" size={16} />
                      <span>Locker & luxury shower amenities</span>
                    </li>
                    <li className="d-flex align-items-center gap-2">
                      <FiCheckCircle className="text-success" size={16} />
                      <span>Basic workout checklist logging</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-5">
                  <Link
                    to="/register"
                    className="btn btn-secondary-glass w-100 py-3 fw-bold"
                  >
                    Select Day Pass
                  </Link>
                </div>
              </div>
            </div>

            {/* Pro Plan (Featured) */}
            <div className="col-12 col-lg-4">
              <div className="glass-card pricing-card-featured p-4 p-lg-5 h-100 d-flex flex-column justify-content-between position-relative">
                <span className="pricing-ribbon">⭐ MOST POPULAR</span>
                <div>
                  <span className="badge badge-active mb-3">RECOMMENDED ATHLETE TIER</span>
                  <h3 className="text-white fw-bold mb-1">Pro Performance</h3>
                  <p className="text-muted small mb-4">Complete coaching, multi-center access, and full macro intelligence.</p>

                  <div className="d-flex align-items-baseline gap-1 mb-4">
                    <h2 className="display-5 fw-extrabold text-cyan mb-0">
                      ${billingCycle === 'annual' ? '39' : '49'}
                    </h2>
                    <span className="text-muted">/ month</span>
                  </div>

                  <ul className="list-unstyled d-flex flex-column gap-3 text-muted small mb-0">
                    <li className="d-flex align-items-center gap-2">
                      <FiCheckCircle className="text-success" size={16} />
                      <strong className="text-white">Multi-Center Access across 25+ Gyms</strong>
                    </li>
                    <li className="d-flex align-items-center gap-2">
                      <FiCheckCircle className="text-success" size={16} />
                      <strong className="text-white">Personal Trainer Matching & Routine Builder</strong>
                    </li>
                    <li className="d-flex align-items-center gap-2">
                      <FiCheckCircle className="text-success" size={16} />
                      <span className="text-white">Macronutrient Target Tracker & Meal Guides</span>
                    </li>
                    <li className="d-flex align-items-center gap-2">
                      <FiCheckCircle className="text-success" size={16} />
                      <span className="text-white">Chart.js Biometric Progress & BMI Trends</span>
                    </li>
                    <li className="d-flex align-items-center gap-2">
                      <FiCheckCircle className="text-success" size={16} />
                      <span>Priority peak-hour slot reservations</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-5">
                  <Link
                    to="/register"
                    className="btn btn-primary-gradient w-100 py-3 fw-bold shadow-lg"
                  >
                    Get Started with Pro
                  </Link>
                </div>
              </div>
            </div>

            {/* Elite Plan */}
            <div className="col-12 col-lg-4">
              <div className="glass-card p-4 p-lg-5 h-100 d-flex flex-column justify-content-between">
                <div>
                  <span className="badge badge-role mb-3">GLOBAL VIP</span>
                  <h3 className="text-white fw-bold mb-1">Elite VIP All-Access</h3>
                  <p className="text-muted small mb-4">Ultimate luxury, unlimited plunge/sauna access, and dedicated 1-on-1 coaching.</p>

                  <div className="d-flex align-items-baseline gap-1 mb-4">
                    <h2 className="display-5 fw-extrabold text-white mb-0">
                      ${billingCycle === 'annual' ? '69' : '89'}
                    </h2>
                    <span className="text-muted">/ month</span>
                  </div>

                  <ul className="list-unstyled d-flex flex-column gap-3 text-muted small mb-0">
                    <li className="d-flex align-items-center gap-2">
                      <FiCheckCircle className="text-success" size={16} />
                      <span className="text-white">Unlimited Global All-Center Gym Access</span>
                    </li>
                    <li className="d-flex align-items-center gap-2">
                      <FiCheckCircle className="text-success" size={16} />
                      <span className="text-white">Dedicated 1-on-1 Personal Trainer Coaching</span>
                    </li>
                    <li className="d-flex align-items-center gap-2">
                      <FiCheckCircle className="text-success" size={16} />
                      <span className="text-white">Sauna, Steam Room & Cold Plunge Suites</span>
                    </li>
                    <li className="d-flex align-items-center gap-2">
                      <FiCheckCircle className="text-success" size={16} />
                      <span className="text-white">Weekly Nutrition & Macro Customization</span>
                    </li>
                    <li className="d-flex align-items-center gap-2">
                      <FiCheckCircle className="text-success" size={16} />
                      <span className="text-white">VIP Guest Passes (2 per month)</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-5">
                  <Link
                    to="/register"
                    className="btn btn-secondary-glass w-100 py-3 fw-bold"
                  >
                    Join Elite VIP
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          ROLE PORTALS SHOWCASE (WHO IS GYMKHANA FOR?)
          ========================================================================= */}
      <section id="portals" className="py-5 position-relative z-2">
        <div className="container py-lg-4">
          <div className="text-center mx-auto mb-5" style={{ maxWidth: '750px' }}>
            <span className="badge badge-role mb-2">ROLE-BASED ECOSYSTEM</span>
            <h2 className="display-6 fw-bold text-white mb-3">
              Purpose-Built Portals for Everyone
            </h2>
            <p className="text-muted lead fs-6">
              Gymkhana delivers customized role interfaces tailored to the distinct workflows of members, trainers, and administrators.
            </p>
          </div>

          <div className="row g-4">
            {/* Member Portal Card */}
            <div className="col-12 col-lg-4">
              <div className="step-card h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <span className="step-number-badge">1</span>
                    <span className="badge badge-active">MEMBER HUB</span>
                  </div>
                  <h4 className="text-white fw-bold mb-2">For Members & Athletes</h4>
                  <p className="text-muted small mb-3">
                    Execute daily exercise checklists, track meal calories, manage multi-gym slot bookings, and monitor BMI changes over time.
                  </p>
                  <ul className="list-unstyled text-muted small d-flex flex-column gap-2 mb-0">
                    <li>✓ Interactive daily workout & diet checklists</li>
                    <li>✓ Digital entry pass generator & slot scheduler</li>
                    <li>✓ Real-time subscription countdown timer</li>
                  </ul>
                </div>
                <div className="mt-4 pt-3 border-top border-secondary border-opacity-25">
                  <button
                    onClick={() => handleQuickDemoLogin('john@gmail.com', 'member123', 'Member')}
                    className="btn btn-secondary-glass btn-sm w-100 d-flex align-items-center justify-content-center gap-2"
                  >
                    <FiUser size={15} />
                    <span>Launch Member Demo</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Trainer Portal Card */}
            <div className="col-12 col-lg-4">
              <div className="step-card h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <span className="step-number-badge">2</span>
                    <span className="badge badge-role">TRAINER PORTAL</span>
                  </div>
                  <h4 className="text-white fw-bold mb-2">For Personal Trainers</h4>
                  <p className="text-muted small mb-3">
                    Build muscle-specific routines, specify macro splits, duplicate master templates, and review assigned client body metrics.
                  </p>
                  <ul className="list-unstyled text-muted small d-flex flex-column gap-2 mb-0">
                    <li>✓ Database-level client roster isolation</li>
                    <li>✓ Master workout & diet template duplicator</li>
                    <li>✓ Client check-in notes & measurement logger</li>
                  </ul>
                </div>
                <div className="mt-4 pt-3 border-top border-secondary border-opacity-25">
                  <button
                    onClick={() => handleQuickDemoLogin('alex.trainer@gymkhana.com', 'trainer123', 'Trainer')}
                    className="btn btn-secondary-glass btn-sm w-100 d-flex align-items-center justify-content-center gap-2 text-cyan"
                  >
                    <FiAward size={15} />
                    <span>Launch Trainer Demo</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Admin Portal Card */}
            <div className="col-12 col-lg-4">
              <div className="step-card h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <span className="step-number-badge">3</span>
                    <span className="badge badge-expiring">ADMIN HQ</span>
                  </div>
                  <h4 className="text-white fw-bold mb-2">For Gym Owners & Admins</h4>
                  <p className="text-muted small mb-3">
                    Comprehensive overview of gross revenue, active subscriber volume, trainer load balancing, and 1-click CSV data reporting.
                  </p>
                  <ul className="list-unstyled text-muted small d-flex flex-column gap-2 mb-0">
                    <li>✓ Executive revenue charts & subscription metrics</li>
                    <li>✓ Member search, trainer assignment & tier creator</li>
                    <li>✓ Exportable `gymkhana_members_report.csv`</li>
                  </ul>
                </div>
                <div className="mt-4 pt-3 border-top border-secondary border-opacity-25">
                  <button
                    onClick={() => handleQuickDemoLogin('admin@gymkhana.com', 'admin123', 'Admin')}
                    className="btn btn-secondary-glass btn-sm w-100 d-flex align-items-center justify-content-center gap-2 text-warning"
                  >
                    <FiShield size={15} />
                    <span>Launch Admin Demo</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          ATHLETE & TRAINER TESTIMONIALS
          ========================================================================= */}
      <section className="py-5 position-relative z-2 border-top border-secondary border-opacity-25" style={{ background: 'rgba(15, 23, 42, 0.4)' }}>
        <div className="container py-lg-4">
          <div className="text-center mx-auto mb-5" style={{ maxWidth: '750px' }}>
            <span className="badge badge-active mb-2">COMMUNITY TRUST</span>
            <h2 className="display-6 fw-bold text-white mb-3">
              Loved by 12,000+ Athletes and Coaches
            </h2>
            <p className="text-muted lead fs-6">
              Hear directly from members and trainers transforming their daily health with Gymkhana.
            </p>
          </div>

          <div className="row g-4">
            {[
              {
                name: "Marcus Vance",
                role: "Competitive Powerlifter",
                city: "New York, NY",
                avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
                review: "The multi-gym pass is unmatched. I train at the Manhattan Flagship during the week and Brooklyn Powerhouse on weekends. Having my routine checklist right on my phone keeps my rest times locked in."
              },
              {
                name: "Sarah Jenkins",
                role: "Head Strength Coach",
                city: "Brooklyn, NY",
                avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop",
                review: "Gymkhana's Trainer Portal saves me hours every week. The template duplicator allows me to roll out master hypertrophy programs to 20 clients simultaneously while customizing individual macros."
              },
              {
                name: "David Chen",
                role: "Corporate Executive & Member",
                city: "Los Angeles, CA",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
                review: "Down 18 lbs in 4 months. Watching my weight trajectory drop on the Chart.js visual progress tracker and ticking off my daily meals gave me the consistency I was missing for years."
              }
            ].map((t, idx) => (
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
          FREQUENTLY ASKED QUESTIONS (FAQ) ACCORDION
          ========================================================================= */}
      <section id="faq" className="py-5 position-relative z-2">
        <div className="container py-lg-4" style={{ maxWidth: '850px' }}>
          <div className="text-center mx-auto mb-5">
            <span className="badge badge-role mb-2">GOT QUESTIONS?</span>
            <h2 className="display-6 fw-bold text-white mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-muted lead fs-6">
              Everything you need to know about Gymkhana passes, coach matching, and platform features.
            </p>
          </div>

          <div className="d-flex flex-column gap-3">
            {faqList.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className={`faq-accordion-item ${isOpen ? 'expanded' : ''}`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    className="faq-header-btn"
                  >
                    <span className="d-flex align-items-center gap-2">
                      <FiHelpCircle className="text-cyan flex-shrink-0" size={18} />
                      <span>{faq.q}</span>
                    </span>
                    {isOpen ? <FiChevronUp size={20} className="text-cyan" /> : <FiChevronDown size={20} className="text-muted" />}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-muted small border-top border-secondary border-opacity-25 animate-fadeIn">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          BOTTOM CTA BANNER
          ========================================================================= */}
      <section className="py-5 position-relative z-2">
        <div className="container">
          <div
            className="glass-card p-4 p-sm-5 text-center position-relative overflow-hidden border border-cyan border-opacity-40"
            style={{
              background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.4) 0%, rgba(6, 182, 212, 0.25) 100%)',
              borderRadius: '28px'
            }}
          >
            <div className="position-relative z-2 mx-auto" style={{ maxWidth: '720px' }}>
              <span className="badge badge-active mb-3 px-3 py-1">UNLEASH YOUR POTENTIAL</span>
              <h2 className="display-5 fw-extrabold text-white mb-3">
                Ready to Experience the Future of Fitness?
              </h2>
              <p className="lead text-muted mb-4 fs-6">
                Join thousands of athletes, trainers, and gym operators achieving peak performance with Gymkhana today.
              </p>

              <div className="d-flex flex-wrap align-items-center justify-content-center gap-3">
                <Link
                  to="/register"
                  className="btn btn-primary-gradient btn-lg px-5 py-3 fw-bold shadow-lg"
                  style={{ borderRadius: '14px' }}
                >
                  Create Free Account
                </Link>
                <button
                  onClick={() => setDemoModalOpen(true)}
                  className="btn btn-secondary-glass btn-lg px-4 py-3 fw-semibold text-white"
                  style={{ borderRadius: '14px' }}
                >
                  Explore Demo Portals
                </button>
              </div>
            </div>
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
            <div className="col-12 col-lg-4">
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
              <p className="text-muted small mb-3" style={{ maxWidth: '320px' }}>
                The next-generation SaaS ecosystem for gym memberships, personal trainer coaching, macronutrient compliance, and biometric health analytics.
              </p>
              <div className="d-flex align-items-center gap-2">
                <span className="badge bg-success bg-opacity-25 text-success small">
                  ● All Gym Systems Online (99.99% Uptime)
                </span>
              </div>
            </div>

            {/* Col 2: Navigation */}
            <div className="col-6 col-md-3 col-lg-2">
              <h6 className="text-white fw-bold mb-3 small text-uppercase tracking-wider">Platform</h6>
              <div className="d-flex flex-column gap-2">
                <a href="#features" className="footer-nav-link">Features</a>
                <a href="#mockup-preview" className="footer-nav-link">App Showcase</a>
                <a href="#gyms" className="footer-nav-link">Gym Centers</a>
                <a href="#pricing" className="footer-nav-link">Membership Plans</a>
                <a href="#calculator" className="footer-nav-link">BMI & Macro Tool</a>
              </div>
            </div>

            {/* Col 3: Portals */}
            <div className="col-6 col-md-3 col-lg-2">
              <h6 className="text-white fw-bold mb-3 small text-uppercase tracking-wider">Portals</h6>
              <div className="d-flex flex-column gap-2">
                <Link to="/login" className="footer-nav-link">Member Hub</Link>
                <Link to="/login" className="footer-nav-link">Trainer Portal</Link>
                <Link to="/login" className="footer-nav-link">Admin Operations</Link>
                <button 
                  onClick={() => setDemoModalOpen(true)} 
                  className="btn btn-link p-0 text-start footer-nav-link text-cyan"
                >
                  Instant Demo
                </button>
              </div>
            </div>

            {/* Col 4: Top Locations */}
            <div className="col-6 col-md-3 col-lg-2">
              <h6 className="text-white fw-bold mb-3 small text-uppercase tracking-wider">Locations</h6>
              <div className="d-flex flex-column gap-2 text-muted small">
                <span>Manhattan, NY</span>
                <span>Williamsburg, BK</span>
                <span>Santa Monica, LA</span>
                <span>Queens Plaza, NY</span>
              </div>
            </div>

            {/* Col 5: Security */}
            <div className="col-6 col-md-3 col-lg-2">
              <h6 className="text-white fw-bold mb-3 small text-uppercase tracking-wider">Security</h6>
              <div className="d-flex flex-column gap-2 text-muted small">
                <span>JWT Token Auth</span>
                <span>Bcrypt Encryption</span>
                <span>Role Isolation</span>
                <span>CSV Data Export</span>
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
                    <strong className="text-white d-block">Log in as Member (John Doe)</strong>
                    <small className="text-muted">Daily checklist, pass booking, workout & progress graphs</small>
                  </div>
                </div>
                {demoLoading === 'Member' ? (
                  <span className="spinner-border spinner-border-sm text-primary" />
                ) : (
                  <FiArrowRight size={18} className="text-cyan" />
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
                    <strong className="text-white d-block">Log in as Trainer (Coach Alex)</strong>
                    <small className="text-muted">Client roster, routine builder, diet plans & master templates</small>
                  </div>
                </div>
                {demoLoading === 'Trainer' ? (
                  <span className="spinner-border spinner-border-sm text-info" />
                ) : (
                  <FiArrowRight size={18} className="text-cyan" />
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
                    <FiShield size={20} />
                  </div>
                  <div>
                    <strong className="text-white d-block">Log in as Admin (System HQ)</strong>
                    <small className="text-muted">Revenue KPI analytics, member manager, CSV reports & plans</small>
                  </div>
                </div>
                {demoLoading === 'Admin' ? (
                  <span className="spinner-border spinner-border-sm text-warning" />
                ) : (
                  <FiArrowRight size={18} className="text-cyan" />
                )}
              </button>
            </div>

            <div className="text-center mt-4 pt-2">
              <span className="text-muted small">Or have custom credentials? </span>
              <Link to="/login" onClick={() => setDemoModalOpen(false)} className="text-cyan fw-bold small text-decoration-none">
                Go to Standard Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
