import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import {
  ChevronDown,
  X,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
} from 'lucide-react';

import {
  FaFacebookF,
  FaTwitter,
  FaYoutube,
  FaLinkedinIn,
} from 'react-icons/fa';

const easeOut = [0.25, 0.1, 0.25, 1];

const panelVariants = {
  hidden: { x: '100%' },
  visible: {
    x: 0,
    transition: {
      duration: 0.5,
      ease: easeOut,
    },
  },
  exit: {
    x: '100%',
    transition: {
      duration: 0.4,
      ease: easeOut,
    },
  },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
};

const contentContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const contentItem = {
  hidden: {
    opacity: 0,
    x: 30,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: easeOut,
    },
  },
};

// Social media icons
const socials = [
  {
    name: 'Facebook',
    Icon: FaFacebookF,
  },
  {
    name: 'Twitter',
    Icon: FaTwitter,
  },
  {
    name: 'YouTube',
    Icon: FaYoutube,
  },
  {
    name: 'LinkedIn',
    Icon: FaLinkedinIn,
  },
];

// Self-contained styles
const css = `
.oc-root {
  --oc-accent: #4A5FE0;
  --oc-accent-dark: #1E1A4A;
  --oc-ink: #1b1a2e;
  --oc-muted: #6b6a80;
  --oc-line: #ececf3;
  --oc-bg: #ffffff;
}

.oc-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 8, 30, 0.55);
  z-index: 9998;
  cursor: pointer;
}

.oc-panel {
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  width: min(400px, 100vw);
  background: var(--oc-bg);
  color: var(--oc-ink);
  z-index: 9999;
  box-shadow: -12px 0 40px rgba(0, 0, 0, 0.25);
  overflow-y: auto;
  overscroll-behavior: contain;
  font-family: inherit;
}

.oc-content {
  padding: 28px 28px 40px;
}

.oc-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
}

.oc-logo img {
  display: block;
  max-height: 44px;
  width: auto;
}

.oc-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 2px solid var(--oc-line);
  background: transparent;
  color: var(--oc-ink);
  cursor: pointer;
}

.oc-close:hover {
  border-color: var(--oc-accent);
  color: var(--oc-accent);
}

.oc-title {
  font-size: 1.6rem;
  font-weight: 800;
  margin: 0 0 8px;
}

.oc-text {
  color: var(--oc-muted);
  line-height: 1.6;
  margin: 0;
}

.oc-menu {
  margin-top: 20px;
}

.oc-menu ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.oc-menu > ul > li {
  border-bottom: 1px solid var(--oc-line);
}

.oc-menu li > a {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 13px 0;
  color: var(--oc-ink);
  font-weight: 700;
  font-size: 1rem;
  text-decoration: none;
}

.oc-menu li > a:hover {
  color: var(--oc-accent);
}

.oc-submenu {
  padding-left: 14px !important;
  border-left: 2px solid var(--oc-line);
  margin-left: 4px;
}

.oc-submenu li > a {
  font-weight: 600;
  font-size: 0.93rem;
  padding: 10px 0;
  color: var(--oc-muted);
}

.oc-submenu li > a:hover {
  color: var(--oc-accent);
}

.oc-chevron {
  display: inline-flex;
  margin-left: 8px;
}

.oc-social {
  display: flex;
  gap: 10px;
  margin: 24px 0;
}

.oc-social a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f3f3f9;
  color: var(--oc-ink);
  text-decoration: none;
}

.oc-social a:hover {
  background: var(--oc-accent);
  color: #fff;
}

.oc-contact h3 {
  font-size: 1.2rem;
  font-weight: 800;
  margin: 0 0 14px;
}

.oc-contact ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 16px;
}

.oc-contact li {
  display: flex;
  align-items: center;
  gap: 14px;
}

.oc-contact .oc-icon {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--oc-accent);
  color: #fff;
}

.oc-contact p {
  margin: 0;
  font-size: 0.82rem;
  color: var(--oc-muted);
}

.oc-contact h4 {
  margin: 2px 0 0;
  font-size: 0.98rem;
  font-weight: 700;
}

.oc-contact h4 a {
  color: var(--oc-ink);
  text-decoration: none;
}

.oc-contact h4 a:hover {
  color: var(--oc-accent);
}

.oc-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-top: 28px;
  padding: 14px 28px;
  border-radius: 999px;
  background: var(--oc-accent);
  color: #fff;
  font-weight: 800;
  text-decoration: none;
  box-shadow: 0 5px 0 var(--oc-accent-dark);
}

.oc-root a:focus-visible,
.oc-root button:focus-visible {
  outline: 2px solid var(--oc-accent);
  outline-offset: 2px;
}

@media (max-width: 575px) {
  .oc-content {
    padding: 20px 18px 32px;
  }

  .oc-title {
    font-size: 1.35rem;
  }
}
`;

// Accordion submenu
const SubmenuAccordion = ({ label, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <li>
      <a
        href="#"
        aria-expanded={open}
        onClick={(e) => {
          e.preventDefault();
          setOpen(!open);
        }}
      >
        {label}

        <motion.span
          className="oc-chevron"
          animate={{
            rotate: open ? 180 : 0,
          }}
          transition={{
            duration: 0.25,
            ease: easeOut,
          }}
        >
          <ChevronDown size={16} />
        </motion.span>
      </a>

      <AnimatePresence initial={false}>
        {open && (
          <motion.ul
            className="oc-submenu"
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: 'auto',
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            transition={{
              duration: 0.35,
              ease: easeOut,
            }}
            style={{
              overflow: 'hidden',
            }}
          >
            {children}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
};

const Offcanvas = ({
  isOpen = false,
  onClose = () => {},
}) => {
  // Lock page scroll while open + close on Escape
  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    const onKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="oc-root">
          <style>{css}</style>

          {/* Overlay */}
          <motion.div
            className="oc-overlay"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.aside
            className="oc-panel"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <motion.div
              className="oc-content"
              variants={contentContainer}
              initial="hidden"
              animate="visible"
            >
              {/* Top */}
              <motion.div
                className="oc-top"
                variants={contentItem}
              >
                <div className="oc-logo">
                  <a href="/">
                    <img
                      src="/assets/img/logo/black-logo.svg"
                      alt="logo"
                    />
                  </a>
                </div>

                <motion.button
                  type="button"
                  className="oc-close"
                  aria-label="Close menu"
                  onClick={onClose}
                  whileHover={{
                    rotate: 90,
                    scale: 1.1,
                  }}
                  whileTap={{
                    scale: 0.9,
                  }}
                  transition={{
                    duration: 0.25,
                    ease: easeOut,
                  }}
                >
                  <X size={20} />
                </motion.button>
              </motion.div>

              {/* Intro */}
              <motion.h3
                className="oc-title"
                variants={contentItem}
              >
                Hello There!
              </motion.h3>

              <motion.p
                className="oc-text"
                variants={contentItem}
              >
                Lorem ipsum dolor sit amet consectetur
                adipisicing elit. Animi natus quasi sunt eum
                ducimus.
              </motion.p>

              {/* Menu */}
              <motion.nav
                className="oc-menu"
                variants={contentItem}
              >
                <ul>
                  <SubmenuAccordion label="Home">
                    <li>
                      <a href="/">Home 01</a>
                    </li>

                    <li>
                      <a href="/home-2">Home 02</a>
                    </li>

                    <li>
                      <a href="/home-3">Home 03</a>
                    </li>

                    <li>
                      <a href="/home-4">Home 04</a>
                    </li>
                  </SubmenuAccordion>

                  <SubmenuAccordion label="Practice">
                    <li>
                      <Link to="/dashboard" onClick={onClose}>My Progress</Link>
                    </li>
                  </SubmenuAccordion>

                  <SubmenuAccordion label="Pages">
                    <li>
                      <a href="/about">About Us</a>
                    </li>

                    <SubmenuAccordion label="Teachers">
                      <li>
                        <a href="/team">
                          Our Teachers
                        </a>
                      </li>

                      <li>
                        <a href="/team-details">
                          Teacher Details
                        </a>
                      </li>
                    </SubmenuAccordion>

                    <SubmenuAccordion label="Event">
                      <li>
                        <a href="/event">
                          Our Event
                        </a>
                      </li>

                      <li>
                        <a href="/event-details">
                          Event Details
                        </a>
                      </li>
                    </SubmenuAccordion>

                    <li>
                      <a href="/pricing">
                        Pricing Plan
                      </a>
                    </li>

                    <li>
                      <a href="/testimonial">
                        Testimonials
                      </a>
                    </li>

                    <li>
                      <a href="/history">
                        Our History
                      </a>
                    </li>

                    <li>
                      <a href="/faq">
                        FAQs
                      </a>
                    </li>
                  </SubmenuAccordion>

                  <SubmenuAccordion label="Programs">
                    <li>
                      <a href="/program">
                        Our Programs
                      </a>
                    </li>

                    <li>
                      <a href="/program-details">
                        Program Details
                      </a>
                    </li>
                  </SubmenuAccordion>

                  <SubmenuAccordion label="Blog">
                    <li>
                      <a href="/blog">
                        Blog Grid
                      </a>
                    </li>

                    <li>
                      <a href="/blog-standard">
                        Blog Standard
                      </a>
                    </li>

                    <li>
                      <a href="/blog-details">
                        Blog Details
                      </a>
                    </li>
                  </SubmenuAccordion>

                  <SubmenuAccordion label="Shop">
                    <li>
                      <a href="/shop">
                        Shop Page
                      </a>
                    </li>

                    <li>
                      <a href="/shop-details">
                        Shop Details
                      </a>
                    </li>

                    <li>
                      <a href="/shop-cart">
                        Shop Cart
                      </a>
                    </li>

                    <li>
                      <a href="/checkout">
                        Checkout
                      </a>
                    </li>
                  </SubmenuAccordion>
                </ul>
              </motion.nav>

              {/* Social */}
              <motion.div
                className="oc-social"
                variants={contentItem}
              >
                {socials.map(({ name, Icon }) => (
                  <motion.a
                    key={name}
                    href="#"
                    aria-label={name}
                    whileHover={{
                      scale: 1.15,
                      y: -4,
                    }}
                    whileTap={{
                      scale: 0.9,
                    }}
                    transition={{
                      duration: 0.25,
                      ease: easeOut,
                    }}
                  >
                    <Icon size={18} />
                  </motion.a>
                ))}
              </motion.div>

              {/* Contact */}
              <motion.div
                className="oc-contact"
                variants={contentItem}
              >
                <h3>Contact Us</h3>

                <ul>
                  <li>
                    <span className="oc-icon">
                      <Phone size={18} />
                    </span>

                    <div>
                      <p>Call Us</p>

                      <h4>
                        <a href="tel:+4903983493999">
                          +49 (03) 9834 939 99
                        </a>
                      </h4>
                    </div>
                  </li>

                  <li>
                    <span className="oc-icon">
                      <Mail size={18} />
                    </span>

                    <div>
                      <p>Send Email</p>

                      <h4>
                        <a href="mailto:yordomain@gmail.com">
                          yordomain@gmail.com
                        </a>
                      </h4>
                    </div>
                  </li>

                  <li>
                    <span className="oc-icon">
                      <MapPin size={18} />
                    </span>

                    <div>
                      <p>Location</p>

                      <h4>
                        Chicago 53755 NY, USA
                      </h4>
                    </div>
                  </li>
                </ul>
              </motion.div>

              {/* Button */}
              <motion.a
                href="/contact"
                className="oc-btn"
                variants={contentItem}
                whileHover={{
                  scale: 1.06,
                  y: -3,
                }}
                whileTap={{
                  scale: 0.96,
                }}
                transition={{
                  duration: 0.3,
                  ease: easeOut,
                }}
              >
                Start Learning
                <ArrowRight size={18} />
              </motion.a>
            </motion.div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Offcanvas;