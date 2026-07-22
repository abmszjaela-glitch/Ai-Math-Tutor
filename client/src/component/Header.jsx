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

  return (
    <header className="header-section">

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
                          <li><a href="/practice">Practice Problems</a></li>
                          <li><a href="/practice/tests">Mock Tests</a></li>
                          <li><a href="/practice/progress">My Progress</a></li>
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
                  <motion.a
                    href="/login"
                    className="main-header__signin"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.25, ease: easeOut }}
                  >
                    Sign In
                  </motion.a>
                </div>

                <motion.a
                  href="/signup"
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