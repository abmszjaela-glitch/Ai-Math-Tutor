import { useState } from 'react';
import headerImage from '../assets/img/header1.png';
import logo from '../assets/img/logo/NUMORA.png';
import {
  FaEnvelope as Mail,
  FaPhone as Phone,
  FaChevronDown as ChevronDown,
  FaBars as Menu,
  FaTimes as X,
  FaCalculator as Calculator,
  FaSquareRootAlt as Sigma,
  FaChartLine as ChartSpline,
  FaShapes as Shapes
  ,FaArrowRight as ArrowRight
} from 'react-icons/fa';

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="header-section">

      {/* Header Top */}
      <div className="header-top-section">

        <div className="header-shape">
          <img
            src={headerImage}
            alt="Header"
          />
        </div>

        <div className="container">
          <div className="header-top-wrapper">

            <p>
              Numora is an AI-powered math tutor that meets every learner
              where they are {' '}
              <a href="/about">
                Learn More
              </a>
            </p>

            <ul className="header-contact-list">

              <li>
                <Mail size={16} />
                <a href="mailto:support@numora.ai">
                  support@numora.ai
                </a>
              </li>

              <li>
                <Phone size={16} />
                <a href="tel:+71081742">
                  +71 (47) 939 4888
                </a>
              </li>

            </ul>

          </div>
        </div>
      </div>

      {/* Main Header */}
      <div id="header-sticky" className="header-1">

        <div className="container">

          <div className="mega-menu-wrapper">

            <div className="header-main">

              {/* Logo + Subjects */}
              <div className="header-left">

                <a href="/" className="header-logo">
                  <img
                    src={logo}
                    alt="Logo"
                  />
                </a>

                <div className="category-wrapper">

                  <button className="category-btn">
                    <span className="icon">
                      <Calculator size={18} />
                    </span>

                    Subjects

                    <span className="arrow">
                      <ChevronDown size={14} />
                    </span>
                  </button>

                  <div className="category-dropdown">
                    <ul>
                      <li>
                        <a href="/subjects/algebra">
                          <Sigma size={16} /> Algebra
                        </a>
                      </li>

                      <li>
                        <a href="/subjects/geometry">
                          <Shapes size={16} /> Geometry
                        </a>
                      </li>

                      <li>
                        <a href="/subjects/calculus">
                          <ChartSpline size={16} /> Calculus & Statistics
                        </a>
                      </li>
                    </ul>
                  </div>

                </div>
              </div>

              {/* Navigation */}
              <div className="mean__menu-wrapper">

                <div className="main-menu">

                  <nav id="mobile-menu">

                    <ul>

                      <li>
                        <a href="/">
                          Home
                        </a>
                      </li>


                      <li className="has-dropdown">
                        <a href="#">
                          Practice
                          <ChevronDown size={14} />
                        </a>

                        <ul className="submenu">

                          <li>
                            <a href="/practice">
                              Practice Problems
                            </a>
                          </li>

                          <li>
                            <a href="/practice/tests">
                              Mock Tests
                            </a>
                          </li>

                          <li>
                            <a href="/practice/progress">
                              My Progress
                            </a>
                          </li>

                        </ul>
                      </li>

                     

                      <li className="has-dropdown">
                        <a href="#">
                          Resources
                          <ChevronDown size={14} />
                        </a>

                        <ul className="submenu">

                          <li>
                            <a href="/blog">
                              Blog
                            </a>
                          </li>

                          <li>
                            <a href="/faq">
                              FAQs
                            </a>
                          </li>

                          <li>
                            <a href="/tutors">
                              Meet the AI Tutors
                            </a>
                          </li>

                        </ul>
                      </li>

                      <li className="has-dropdown">
                        <a href="#">
                          Company
                          <ChevronDown size={14} />
                        </a>

                        <ul className="submenu">

                          <li>
                            <a href="/about">
                              About Us
                            </a>
                          </li>

                          <li>
                            <a href="/contact">
                              Contact
                            </a>
                          </li>

                        </ul>
                      </li>

                    </ul>

                  </nav>

                </div>
              </div>

              {/* Right Side */}
              <div className="header-right d-flex justify-content-end align-items-center">

                <div className="header-right-icon">

                

                  {/* Sign In */}
                  <a
                    href="/login"
                    className="main-header__signin"
                  >
                    Sign In
                  </a>

                </div>

                {/* Start Learning */}
                <a
                  href="/signup"
                  className="theme-btn"
                >
                  Start Learning
                  <ArrowRight/>
                </a>

                {/* Mobile Menu */}
                <div className="header__hamburger my-auto d-xl-none">
                  <div
                    className="sidebar__toggle"
                    onClick={() => setMobileOpen(!mobileOpen)}
                  >
                    {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </header>
  );
};

export default Header;