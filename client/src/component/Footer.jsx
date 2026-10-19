import { FaFacebookF as AppIconFaFacebookF, FaLinkedinIn as AppIconFaLinkedinIn, FaTwitter as AppIconFaTwitter, FaYoutube as AppIconFaYoutube } from 'react-icons/fa';
import { motion } from 'framer-motion';

import bottomShape from '../assets/img/footer/bg-bottom.png';
import basketShape from '../assets/img/footer/busket.png';
import ballShape from '../assets/img/footer/ball.png';

import NUMORA from '../assets/img/logo/NUMORA.png';
import emailIcon from '../assets/img/footer/email.svg';
import locationIcon from '../assets/img/footer/location.svg';

const easeOut = [0.25, 0.1, 0.25, 1];

const floatY = {
  animate: { y: [0, -16, 0], transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' } },
};
const floatX = {
  animate: { x: [0, 14, 0], transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' } },
};

const rowContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};

const widgetItem = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOut } },
};

const socialContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.4 } },
};

const socialItem = {
  hidden: { opacity: 0, scale: 0 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: easeOut } },
};

const Footer = () => {
  return (
    <footer className="footer-section">

      {/* Bottom Shape */}
      <div className="bottom-shape">
        <img
          src={bottomShape}
          alt="AI Math Tutor footer background"
        />
      </div>

      {/* Basket Shape */}
      <motion.div
        className="busket-shape"
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1, ease: easeOut }}
      >
        <motion.img src={basketShape} alt="Decorative learning basket" animate={floatX.animate} />
      </motion.div>

      {/* Ball Shape */}
      <motion.div
        className="ball-shape"
        initial={{ opacity: 0, y: -30, scale: 0.7 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, delay: 0.15, ease: easeOut }}
      >
        <motion.img src={ballShape} alt="Decorative learning ball" animate={floatY.animate} />
      </motion.div>


      <div className="container">

        <div className="footer-widgets-wrapper">

          <motion.div
            className="row"
            variants={rowContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >

            {/* About / Logo */}
            <motion.div
              className="col-xl-4 col-lg-6 col-md-8"
              variants={widgetItem}
            >
              <div className="single-footer-widget">

                <div className="widget-head">
                  <a href="/">
                    <img
                      src={NUMORA}
                      alt="AI Math Tutor Logo"
                    />
                  </a>
                </div>

                <div className="widget-content">

                  <p>
                    NUMORA is an AI-powered Math Tutor platform designed
                    to help Australian Grade 1 to 6 students learn
                    mathematics through friendly AI tutors, interactive
                    lessons, practice activities, and personalised
                    learning support.
                  </p>

                  {/* Social Media */}
                  <motion.ul
                    className="social-icon"
                    variants={socialContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                  >

                    <motion.li variants={socialItem}>
                      <motion.a
                        href="#"
                        whileHover={{ scale: 1.15, y: -4 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ duration: 0.25, ease: easeOut }}
                      >
                        <AppIconFaFacebookF aria-hidden="true" />
                      </motion.a>
                    </motion.li>

                    <motion.li variants={socialItem}>
                      <motion.a
                        href="#"
                        whileHover={{ scale: 1.15, y: -4 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ duration: 0.25, ease: easeOut }}
                      >
                        <AppIconFaTwitter aria-hidden="true" />
                      </motion.a>
                    </motion.li>

                    <motion.li variants={socialItem}>
                      <motion.a
                        href="#"
                        whileHover={{ scale: 1.15, y: -4 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ duration: 0.25, ease: easeOut }}
                      >
                        <AppIconFaYoutube aria-hidden="true" />
                      </motion.a>
                    </motion.li>

                    <motion.li variants={socialItem}>
                      <motion.a
                        href="#"
                        whileHover={{ scale: 1.15, y: -4 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ duration: 0.25, ease: easeOut }}
                      >
                        <AppIconFaLinkedinIn aria-hidden="true" />
                      </motion.a>
                    </motion.li>

                  </motion.ul>

                </div>

              </div>
            </motion.div>


            {/* Quick Links */}
            <motion.div
              className="col-xl-2 col-lg-3 col-md-4 col-sm-6"
              variants={widgetItem}
            >
              <div className="single-footer-widget">

                <div className="widget-head">
                  <h3>
                    Quick Links
                  </h3>
                </div>

                <div className="widget-content">

                  <ul className="list-area">

                    <li>
                      <a href="/program">
                        Math Lessons
                      </a>
                    </li>

                    <li>
                      <a href="/program">
                        Practice
                      </a>
                    </li>

                    <li>
                      <a href="/about">
                        About NUMORA
                      </a>
                    </li>

                    <li>
                      <a href="/contact">
                        Contact Us
                      </a>
                    </li>

                  </ul>

                </div>

              </div>
            </motion.div>


            {/* Learning Resources */}
            <motion.div
              className="col-xl-2 col-lg-3 col-md-6 col-sm-6"
              variants={widgetItem}
            >
              <div className="single-footer-widget">

                <div className="widget-head">
                  <h3>
                    Learning
                  </h3>
                </div>

                <div className="widget-content">

                  <ul className="list-area">

                    <li>
                      <a href="/program">
                        Grade 1–6 Maths
                      </a>
                    </li>

                    <li>
                      <a href="/program">
                        AI Math Tutor
                      </a>
                    </li>

                    <li>
                      <a href="/program">
                        Maths Practice
                      </a>
                    </li>

                    <li>
                      <a href="/news">
                        Learning Tips
                      </a>
                    </li>

                  </ul>

                </div>

              </div>
            </motion.div>


            {/* Contact Information */}
            <motion.div
              className="col-xl-4 col-lg-6 col-md-6"
              variants={widgetItem}
            >
              <div className="single-footer-widget">

                <div className="widget-content">

                  {/* Email */}
                  <motion.div
                    className="contact-info"
                    whileHover={{ x: 6 }}
                    transition={{ duration: 0.25, ease: easeOut }}
                  >

                    <div className="icon">
                      <img
                        src={emailIcon}
                        alt="Email icon"
                      />
                    </div>

                    <div className="content">

                      <h3>
                        Email us
                      </h3>

                      <p>
                        <a href="mailto:support@numora.com">
                          support@numora.com
                        </a>
                      </p>

                    </div>

                  </motion.div>


                  {/* Location */}
                  <motion.div
                    className="contact-info"
                    whileHover={{ x: 6 }}
                    transition={{ duration: 0.25, ease: easeOut }}
                  >

                    <div className="icon">
                      <img
                        src={locationIcon}
                        alt="Location icon"
                      />
                    </div>

                    <div className="content">

                      <h3>
                        Serving Australian Students
                      </h3>

                      <p>
                        <a href="#">
                          Supporting young learners across
                          <br />
                          Australia with AI-powered maths learning.
                        </a>
                      </p>

                    </div>

                  </motion.div>

                </div>

              </div>
            </motion.div>

          </motion.div>


          {/* Copyright */}
          <motion.p
            className="footer-bottom"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            ©{' '}
            <a href="/">
              NUMORA
            </a>{' '}
            2026. All Rights Reserved, ABMSZ
          </motion.p>

        </div>

      </div>

    </footer>
  );
};

export default Footer;