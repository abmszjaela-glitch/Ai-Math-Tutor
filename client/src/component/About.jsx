import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';

import aboutImage from '../assets/img/about/about-1.png';
import aboutBg from '../assets/img/about/about-bg-1.png';
import counterImage from '../assets/img/about/ab-counter.png';
import tubelightImage from '../assets/img/about/tubelight.png';
import sunImage from '../assets/img/about/sun.png';
import starImage from '../assets/img/about/star.png';
import loveImage from '../assets/img/about/love.png';
import frameImage from '../assets/img/about/frame.png';

const easeOut = [0.25, 0.1, 0.25, 1];

// Continuous floating loops
const floatY = {
  animate: { y: [0, -16, 0], transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' } },
};
const floatX = {
  animate: { x: [0, 14, 0], transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' } },
};

// Text/content stagger
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18, delayChildren: 0.1 } },
};

const itemUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOut } },
};

const listContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const listItem = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: easeOut } },
};

const About = () => {
  return (
    <section className="about-section section-padding fix">

      {/* Decorative Shapes */}
      <motion.div
        className="tubelight-shape"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1, ease: easeOut }}
      >
        <img src={tubelightImage} alt="AI Math Learning" />
      </motion.div>

      <motion.div
        className="sun-shape"
        initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, delay: 0.15, ease: easeOut }}
      >
        <motion.img
          src={sunImage}
          alt="Fun Mathematics Learning"
          animate={floatY.animate}
        />
      </motion.div>

      <motion.div
        className="star-shape"
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, delay: 0.3, ease: easeOut }}
      >
        <motion.img
          src={starImage}
          alt="Math Learning Star"
          animate={{ rotate: [0, 15, 0, -15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      <motion.div
        className="love-shape"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, delay: 0.2, ease: easeOut }}
      >
        <motion.img
          src={loveImage}
          alt="Friendly AI Tutor"
          animate={floatX.animate}
        />
      </motion.div>

      <motion.div
        className="frame-shape"
        initial={{ opacity: 0, rotate: 10 }}
        whileInView={{ opacity: 1, rotate: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, delay: 0.25, ease: easeOut }}
      >
        <img src={frameImage} alt="Interactive Math Learning" />
      </motion.div>

      <div className="container">

        <div className="about-wrapper">

          <div className="row g-4 align-items-center">

            {/* About Images */}
            <div className="col-lg-6">

              <div className="about-image-box">

                <div className="about-image">

                  <motion.img
                    src={aboutImage}
                    alt="Australian Students Learning Mathematics with AI Tutor"
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.9, delay: 0.2, ease: easeOut }}
                  />

                  <motion.div
                    className="shape-bg"
                    initial={{ opacity: 0, scale: 0.7 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: easeOut }}
                  >
                    <img src={aboutBg} alt="AI Math Tutor Background" />
                  </motion.div>

                </div>

                {/* Learning Counter */}
                <motion.div
                  className="counter-image"
                  initial={{ opacity: 0, scale: 0.8, y: 30 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.7, delay: 0.6, ease: easeOut }}
                >

                  <motion.img
                    src={counterImage}
                    alt="Interactive Math Lessons"
                    animate={floatX.animate}
                  />

                  <div className="counter-box">

                    <div className="count">

                      <motion.h2
                        className="odometer"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                      >
                        6
                      </motion.h2>

                      <span className="plus">+</span>

                    </div>

                    <p>Grade Levels</p>

                  </div>

                </motion.div>

              </div>

            </div>

            {/* About Content */}
            <div className="col-lg-6">

              <motion.div
                className="about-content"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >

                <div className="section-title text-left">

                  <motion.span
                    className="sub-title text-left"
                    variants={itemUp}
                  >
                    About Our AI Math Tutor
                  </motion.span>

                  <motion.h2 variants={itemUp}>
                    Making Mathematics Fun,
                    Interactive &amp; Easy to Understand
                  </motion.h2>

                </div>

                <div className="content-bottom mt-4 mt-md-0">

                  <motion.p variants={itemUp}>
                    Our AI Math Tutor helps Australian students
                    from Grade 1 to Grade 6 build strong
                    mathematics skills through fun, interactive
                    and personalised learning. Students can learn
                    step by step with friendly AI tutor characters
                    that explain mathematical concepts, guide
                    them through problems and help them learn
                    from their mistakes.
                  </motion.p>

                  {/* Features List */}
                  <motion.div
                    className="about-list"
                    variants={listContainer}
                  >

                    <ul>

                      <motion.li className="mb-3" variants={listItem}>
                        <Check size={18} />
                        AI-Powered Math Learning
                      </motion.li>

                      <motion.li variants={listItem}>
                        <Check size={18} />
                        Australian Curriculum Aligned
                      </motion.li>

                    </ul>

                    <ul>

                      <motion.li className="mb-3" variants={listItem}>
                        <Check size={18} />
                        Friendly AI Tutor Characters
                      </motion.li>

                      <motion.li variants={listItem}>
                        <Check size={18} />
                        Personalised Learning Support
                      </motion.li>

                    </ul>

                  </motion.div>

                  {/* Button */}
                  <motion.div
                    className="about-button"
                    variants={itemUp}
                  >

                    <motion.a
                      href="/about"
                      className="theme-btn"
                      whileHover={{ scale: 1.06, y: -3 }}
                      whileTap={{ scale: 0.96 }}
                      transition={{ duration: 0.3, ease: easeOut }}
                    >
                      Explore AI Math Learning
                      <ArrowRight />
                    </motion.a>

                  </motion.div>

                </div>

              </motion.div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

export default About;