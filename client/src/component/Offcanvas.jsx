import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const easeOut = [0.25, 0.1, 0.25, 1];

const panelVariants = {
  hidden: { x: '100%' },
  visible: {
    x: 0,
    transition: { duration: 0.5, ease: easeOut },
  },
  exit: {
    x: '100%',
    transition: { duration: 0.4, ease: easeOut },
  },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

const contentContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};

const contentItem = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: easeOut } },
};

// Accordion submenu (mobile has-dropdown items)
const SubmenuAccordion = ({ label, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <li className="has-dropdown">
      <a href="#" onClick={(e) => { e.preventDefault(); setOpen(!open); }}>
        {label}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: easeOut }}
          style={{ display: 'inline-flex', marginLeft: 6 }}
        >
          <ChevronDown size={14} />
        </motion.span>
      </a>

      <AnimatePresence initial={false}>
        {open && (
          <motion.ul
            className="submenu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: easeOut }}
            style={{ overflow: 'hidden' }}
          >
            {children}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
};

const Offcanvas = ({ isOpen = false, onClose = () => {} }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fix-area">
            <motion.div
              className="offcanvas__info"
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="offcanvas__wrapper">
                <motion.div
                  className="offcanvas__content"
                  variants={contentContainer}
                  initial="hidden"
                  animate="visible"
                >

                  {/* Top */}
                  <motion.div
                    className="offcanvas__top mb-5 d-flex justify-content-between align-items-center"
                    variants={contentItem}
                  >
                    <div className="offcanvas__logo">
                      <a href="/">
                        <img
                          src="/assets/img/logo/black-logo.svg"
                          alt="logo"
                        />
                      </a>
                    </div>

                    <div className="offcanvas__close">
                      <motion.button
                        type="button"
                        onClick={onClose}
                        whileHover={{ rotate: 90, scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ duration: 0.25, ease: easeOut }}
                      >
                        <i className="fas fa-times"></i>
                      </motion.button>
                    </div>
                  </motion.div>

                  {/* Content */}
                  <motion.h3 className="offcanvas-title" variants={contentItem}>
                    Hello There!
                  </motion.h3>

                  <motion.p variants={contentItem}>
                    Lorem ipsum dolor sit amet consectetur
                    adipisicing elit. Animi natus quasi sunt eum
                    ducimus.
                  </motion.p>

                  {/* Mobile Menu */}
                  <motion.div className="mobile-menu fix mt-3" variants={contentItem}>
                    <nav className="mean-nav">
                      <ul>

                        <SubmenuAccordion label="Home">
                          <li><a href="/">Home 01</a></li>
                          <li><a href="/home-2">Home 02</a></li>
                          <li><a href="/home-3">Home 03</a></li>
                          <li><a href="/home-4">Home 04</a></li>
                        </SubmenuAccordion>

                        <SubmenuAccordion label="Pages">
                          <li><a href="/about">About Us</a></li>

                          <SubmenuAccordion label="Teachers">
                            <li><a href="/team">Our Teachers</a></li>
                            <li><a href="/team-details">Teacher Details</a></li>
                          </SubmenuAccordion>

                          <SubmenuAccordion label="Event">
                            <li><a href="/event">Our Event</a></li>
                            <li><a href="/event-details">Event Details</a></li>
                          </SubmenuAccordion>

                          <li><a href="/pricing">Pricing Plan</a></li>
                          <li><a href="/testimonial">Testimonials</a></li>
                          <li><a href="/history">Our History</a></li>
                          <li><a href="/faq">FAQs</a></li>
                        </SubmenuAccordion>

                        <SubmenuAccordion label="Programs">
                          <li><a href="/program">Our Programs</a></li>
                          <li><a href="/program-details">Program Details</a></li>
                        </SubmenuAccordion>

                        <SubmenuAccordion label="Blog">
                          <li><a href="/blog">Blog Grid</a></li>
                          <li><a href="/blog-standard">Blog Standard</a></li>
                          <li><a href="/blog-details">Blog Details</a></li>
                        </SubmenuAccordion>

                        <SubmenuAccordion label="Shop">
                          <li><a href="/shop">Shop Page</a></li>
                          <li><a href="/shop-details">Shop Details</a></li>
                          <li><a href="/shop-cart">Shop Cart</a></li>
                          <li><a href="/checkout">Checkout</a></li>
                        </SubmenuAccordion>

                      </ul>
                    </nav>
                  </motion.div>

                  {/* Social Icons */}
                  <motion.div
                    className="social-icon d-flex align-items-center"
                    variants={contentItem}
                  >
                    {['facebook-f', 'twitter', 'youtube', 'linkedin-in'].map((iconName) => (
                      <motion.a
                        key={iconName}
                        href="#"
                        whileHover={{ scale: 1.15, y: -4 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ duration: 0.25, ease: easeOut }}
                      >
                        <i className={`fab fa-${iconName}`}></i>
                      </motion.a>
                    ))}
                  </motion.div>

                  {/* Contact */}
                  <motion.div className="offcanvas__contact" variants={contentItem}>
                    <h3>Contact Us</h3>

                    <ul className="contact-list">

                      <li>
                        <div className="icon">
                          <i className="far fa-phone-alt"></i>
                        </div>

                        <div className="content">
                          <p>Call Us</p>
                          <h4>
                            <a href="tel:+4903983493999">
                              +49 (03) 9834 939 99
                            </a>
                          </h4>
                        </div>
                      </li>

                      <li>
                        <div className="icon">
                          <i className="fal fa-envelope"></i>
                        </div>

                        <div className="content">
                          <p>Send Email</p>
                          <h4>
                            <a href="mailto:yordomain@gmail.com">
                              yordomain@gmail.com
                            </a>
                          </h4>
                        </div>
                      </li>

                      <li>
                        <div className="icon">
                          <i className="fal fa-map-marker-alt"></i>
                        </div>

                        <div className="content">
                          <p>Location</p>
                          <h4>Chicago 53755 NY, USA</h4>
                        </div>
                      </li>

                    </ul>
                  </motion.div>

                  {/* Button */}
                  <motion.a
                    href="/contact"
                    className="theme-btn"
                    variants={contentItem}
                    whileHover={{ scale: 1.06, y: -3 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ duration: 0.3, ease: easeOut }}
                  >
                    Start Learning
                    <i className="icon-arrow-icon"></i>
                  </motion.a>

                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Overlay */}
          <motion.div
            className="offcanvas__overlay"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          ></motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Offcanvas;