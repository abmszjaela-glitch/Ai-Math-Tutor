import { Link } from 'react-router-dom';
import { API_URL } from '../config/api';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import headerImage from '../assets/img/header1.png';
import logo from '../assets/img/logo/NUMORA.png';
import {
  FaEnvelope as Mail,
  FaPhone as Phone,
  FaChevronDown as ChevronDown,
  FaBars as Menu,
  FaCalculator as Calculator,
  FaSquareRootAlt as Sigma,
  FaChartLine as ChartSpline,
  FaShapes as Shapes,
  FaArrowRight as ArrowRight,
} from 'react-icons/fa';

const easeOut = [0.25, 0.1, 0.25, 1];

const Header = ({ onMenuClick }) => {
  const [subjectsOpen, setSubjectsOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.97 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.25, ease: easeOut } },
    exit: { opacity: 0, y: -10, scale: 0.97, transition: { duration: 0.18, ease: easeOut } },
  };
const [user, setUser] = useState(null);
const [isLoadingUser, setIsLoadingUser] = useState(true);
const [isLoggingOut, setIsLoggingOut] = useState(false);
const [authError, setAuthError] = useState('');

useEffect(() => {
  const getCurrentUser = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Get current user error:', error);
      setUser(null);
    } finally {
      setIsLoadingUser(false);
    }
  };

  getCurrentUser();
}, []);

const handleLogout = async () => {
  if (isLoggingOut) return;
  setIsLoggingOut(true);
  setAuthError('');
  try {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Unable to log out. Please try again.');
    setUser(null);
    window.location.href = '/';
  } catch (error) {
    setAuthError(error.message || 'Unable to log out. Please try again.');
  } finally {
    setIsLoggingOut(false);
  }
};


  return (
    <header className="header-section">

      {/* Mobile responsive CSS - scoped to this component's markup */}
      <style>{`
        .header-section .nav-auth-action {
          border: 0;
          background: transparent;
          color: inherit;
          font: inherit;
          font-weight: 700;
          padding: 8px 0;
          white-space: nowrap;
          cursor: pointer;
        }
        .header-section .nav-auth-action:disabled { opacity: 0.6; cursor: wait; }
        .header-section .nav-auth-error { color: #b42318; font-size: 12px; max-width: 180px; }

        /* ---------- Tablet / below xl (max-width: 1199px) ---------- */
        @media (max-width: 1199px) {
          .header-top-section {
            display: none;
          }

          .header-1 .mega-menu-wrapper {
            padding: 10px 15px;
          }

          .header-1 .header-main {
            flex-wrap: nowrap;
          }

          .header-1 .header-left {
            gap: 12px;
          }

          .header-1 .header-left .category-wrapper {
            display: none;
          }

          .header-1 .header-left .header-logo img {
            max-width: 130px;
            height: auto;
          }

          /* full nav menu hidden on mobile, hamburger takes over */
          .header-1 .mean__menu-wrapper .main-menu {
            display: none;
          }

          .header-1 .header-right .theme-btn {
            font-size: 14px;
            padding: 0 18px;
            height: 44px;
            line-height: 44px;
          }

          .header-1 .header-right {
            gap: 12px;
          }

          .header__hamburger {
            display: flex !important;
            align-items: center;
          }
        }

        /* ---------- Small tablet / large phone (max-width: 767px) ---------- */
        @media (max-width: 767px) {
          .header-1 .header-left .header-logo img {
            max-width: 110px;
          }

          .header-1 .header-right .theme-btn span,
          .header-1 .header-right .theme-btn {
            font-size: 13px;
            padding: 0 14px;
            height: 40px;
            line-height: 40px;
          }
        }

        /* ---------- Mobile (max-width: 575px) ---------- */
        @media (max-width: 575px) {
          .header-1 .mega-menu-wrapper {
            padding: 8px 12px;
          }

          .header-1 .header-left .header-logo img {
            max-width: 95px;
          }

          /* hide the text-heavy Start Learning button on very small
             screens, keep just the hamburger + sign-in icon area */
          .header-1 .header-right .theme-btn {
            padding: 0 10px;
            font-size: 12px;
          }
          .header-1 .header-right .theme-btn svg {
            display: none;
          }

          .header-1 .header-right {
            gap: 8px;
          }
        }

        /* ---------- Extra small phones (max-width: 380px) ---------- */
        @media (max-width: 380px) {
          .header-1 .header-left .header-logo img {
            max-width: 80px;
          }

          .header-1 .header-right .theme-btn {
            padding: 0 8px;
            font-size: 11px;
            height: 36px;
            line-height: 36px;
          }
        }
      `}</style>

      {/* Header Top */}
      <div className="header-top-section">
        <div className="header-shape">
          <img src={headerImage} alt="Header" />
        </div>

        <div className="container">
          <div className="header-top-wrapper">
            <p>
              Numora is an AI-powered math tutor that meets every learner
              where they are {' '}
              <a href="/about">Learn More</a>
            </p>

            <ul className="header-contact-list">
              <li>
                <Mail size={16} />
                <a href="mailto:support@numora.ai">support@numora.ai</a>
              </li>
              <li>
                <Phone size={16} />
                <a href="tel:+71081742">+71 (47) 939 4888</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main Header / Navbar - THIS is the part that animates on scroll */}
      <motion.div
        id="header-sticky"
        className={`header-1 ${isSticky ? 'sticky-active' : ''}`}
        animate={{
          backgroundColor: isSticky ? '#ffffff' : 'rgba(255,255,255,0)',
          boxShadow: isSticky
            ? '0 10px 35px rgba(0,0,0,0.12)'
            : '0 0 0 rgba(0,0,0,0)',
          y: isSticky ? 0 : 0,
          paddingTop: isSticky ? 12 : 20,
          paddingBottom: isSticky ? 12 : 20,
        }}
        initial={false}
        transition={{ duration: 0.4, ease: easeOut }}
        style={{
          position: isSticky ? 'fixed' : 'relative',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 999,
        }}
      >
        <div className="container">
          <div className="mega-menu-wrapper">
            <div className="header-main">

              {/* Logo + Subjects */}
              <div className="header-left">
                <motion.a
                  href="/"
                  className="header-logo"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3, ease: easeOut }}
                >
                  <img src={logo} alt="Logo" />
                </motion.a>

                <div
                  className="category-wrapper"
                  onMouseEnter={() => setSubjectsOpen(true)}
                  onMouseLeave={() => setSubjectsOpen(false)}
                >
                  <button className="category-btn">
                    <span className="icon">
                      <Calculator size={18} />
                    </span>
                    Subjects
                    <motion.span
                      className="arrow"
                      animate={{ rotate: subjectsOpen ? 180 : 0 }}
                      transition={{ duration: 0.25, ease: easeOut }}
                    >
                      <ChevronDown size={14} />
                    </motion.span>
                  </button>

                  <AnimatePresence>
                    {subjectsOpen && (
                      <motion.div
                        className="category-dropdown"
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <ul>
                          <li><a href="/subjects/algebra"><Sigma size={16} /> Algebra</a></li>
                          <li><a href="/subjects/geometry"><Shapes size={16} /> Geometry</a></li>
                          <li><a href="/subjects/calculus"><ChartSpline size={16} /> Calculus & Statistics</a></li>
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Navigation */}
              <div className="mean__menu-wrapper">
                <div className="main-menu">
                  <nav id="mobile-menu">
                    <ul>
                      <li><a href="/">Home</a></li>

                      <li className="has-dropdown">
                        <a href="#">Practice<ChevronDown size={14} /></a>
                        <ul className="submenu">
                          <li><Link to="/practice">Practice Problems</Link></li>
                          <li><Link to="/practice/tests">Mock Tests</Link></li>
                          <li><Link to="/dashboard">My Progress</Link></li>
                        </ul>
                      </li>

                      <li className="has-dropdown">
                        <a href="#">Resources<ChevronDown size={14} /></a>
                        <ul className="submenu">
                          <li><a href="/blog">Blog</a></li>
                          <li><a href="/faq">FAQs</a></li>
                          <li><a href="/tutors">Meet the AI Tutors</a></li>
                        </ul>
                      </li>

                      <li className="has-dropdown">
                        <a href="#">Company<ChevronDown size={14} /></a>
                        <ul className="submenu">
                          <li><a href="/about">About Us</a></li>
                          <li><a href="/contact">Contact</a></li>
                        </ul>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>

              {/* Right Side */}
              <div className="header-right d-flex justify-content-end align-items-center">
                <div className="header-right-icon">
                  {!isLoadingUser && (
                    user ? (
                      <button type="button" className="nav-auth-action" onClick={handleLogout} disabled={isLoggingOut}>
                        {isLoggingOut ? 'Logging out…' : 'Logout'}
                      </button>
                    ) : (
                      <Link to="/login" className="nav-auth-action">Login</Link>
                    )
                  )}
                  {authError && <span className="nav-auth-error" role="alert">{authError}</span>}
                </div>

                <motion.a
                  href="/SelectFriend"
                  className="theme-btn"
                  whileHover={{ scale: 1.06, y: -3 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ duration: 0.3, ease: easeOut }}
                >
                  Start Learning
                  <ArrowRight />
                </motion.a>

                <div className="header__hamburger my-auto d-xl-none">
                  <motion.div
                    className="sidebar__toggle"
                    onClick={onMenuClick}
                    whileTap={{ scale: 0.85 }}
                  >
                    <Menu size={22} />
                  </motion.div>
                </div>
                

              </div>

            </div>
          </div>
        </div>
      </motion.div>

      {/* Spacer to prevent content jump when navbar becomes fixed */}
      {isSticky && <div style={{ height: '80px' }}></div>}

    </header>
  );
};

export default Header;