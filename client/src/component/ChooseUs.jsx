import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

import choose1 from '../assets/img/choose/choose1.png';
import choose2 from '../assets/img/choose/choose2.jpg';
import choose3 from '../assets/img/choose/choose3.png';

import perasute from '../assets/img/choose/perasute.png';
import butterfly from '../assets/img/choose/butarfly.png';
import zikzak from '../assets/img/choose/zikzak.png';
import counShape from '../assets/img/choose/coun-shape.png';

import bricksIcon from '../assets/img/choose/bricks-1.svg';

const easeOut = [0.25, 0.1, 0.25, 1];

const floatY = {
  animate: { y: [0, -16, 0], transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' } },
};
const floatX = {
  animate: { x: [0, 14, 0], transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' } },
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};

const itemUp = {
  hidden: { opacity: 0, y: 35 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOut } },
};

// Animated progress bar sub-component
const ProgressBar = ({ title, percent, styleTwo = false }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <div className="pro-items" ref={ref}>

      <div className="pro-head">
        <h4 className="title">{title}</h4>
        <motion.span
          className="point"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          {percent}%
        </motion.span>
      </div>

      <div className={`ber-box ${styleTwo ? 'style-2' : ''}`}>
        <div className={`progress ${styleTwo ? 'progress-2' : ''}`}>
          <motion.div
            className={`progress-value ${styleTwo ? 'style-two' : ''}`}
            initial={{ width: '0%' }}
            animate={isInView ? { width: `${percent}%` } : { width: '0%' }}
            transition={{ duration: 1.2, ease: easeOut, delay: 0.2 }}
          ></motion.div>
        </div>
      </div>

    </div>
  );
};

const ChooseUs = () => {
  return (
    <section className="choose-us-section section-padding fix">

      {/* Decorative Shapes */}

      <motion.div
        className="perasute-shape"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1, ease: easeOut }}
      >
        <motion.img src={perasute} alt="shape-img" animate={floatY.animate} />
      </motion.div>

      <motion.div
        className="butterfly-shape"
        initial={{ opacity: 0, scale: 0.6 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, delay: 0.15, ease: easeOut }}
      >
        <motion.img src={butterfly} alt="shape-img" animate={floatY.animate} />
      </motion.div>

      <motion.div
        className="zikzak-shape"
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, delay: 0.2, ease: easeOut }}
      >
        <motion.img src={zikzak} alt="shape-img" animate={floatX.animate} />
      </motion.div>

      <motion.div
        className="coun-shape"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, delay: 0.25, ease: easeOut }}
      >
        <motion.img src={counShape} alt="shape-img" animate={floatY.animate} />
      </motion.div>

      <div className="container">

        <div className="choose-us-wrapper">

          <div className="row g-4">

            {/* Left Images */}
            <div className="col-lg-6">

              <div className="choose-img-box">

                <motion.img
                  className="style-2"
                  src={choose2}
                  alt="AI Math Tutor helping a Grade 6 student learn mathematics"
                  initial={{ opacity: 0, x: -80 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.9, ease: easeOut }}
                />

                <motion.img
                  src={choose1}
                  alt="Interactive mathematics learning for Australian students"
                  initial={{ opacity: 0, y: 80 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.9, delay: 0.2, ease: easeOut }}
                />

                <div className="img-3">
                  <motion.img
                    src={choose3}
                    alt="Friendly AI tutor character for mathematics learning"
                    initial={{ opacity: 0, x: 80 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.9, delay: 0.4, ease: easeOut }}
                  />
                </div>

              </div>

            </div>

            {/* Right Content */}
            <div className="col-lg-6">

              <motion.div
                className="choose-us-content"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >

                {/* Section Title */}
                <div className="section-title text-left">

                  <motion.span className="sub-title" variants={itemUp}>
                    Why Choose Our AI Math Tutor
                  </motion.span>

                  <motion.h2 variants={itemUp}>
                    Learn Maths
                    <span>Your Way</span>
                    <br />
                    With Your AI Tutor
                  </motion.h2>

                </div>

                {/* Description */}
                <motion.p className="mt-3 mt-md-0" variants={itemUp}>
                  Make mathematics easier and more enjoyable with a friendly
                  AI tutor designed for Australian Grade 6 students. Learn
                  step by step, practise important maths skills, and get
                  helpful guidance whenever you need it.
                </motion.p>

                {/* AI-Powered Learning */}
                <motion.div className="icon-items" variants={itemUp}>

                  <motion.div
                    className="icon"
                    whileHover={{ scale: 1.1, rotate: 8 }}
                    transition={{ duration: 0.3, ease: easeOut }}
                  >
                    <img
                      src={bricksIcon}
                      alt="AI-powered mathematics learning"
                    />
                  </motion.div>

                  <div className="content">

                    <h3 className="mb-2">
                      Learn With Your AI Tutor
                    </h3>

                    <p>
                      Get friendly, step-by-step support from AI tutor
                      characters that help you understand mathematical
                      concepts, solve problems, practise your skills, and
                      build confidence in learning.
                    </p>

                  </div>

                </motion.div>

                {/* Progress Bars */}
                <motion.div className="progress-wrap" variants={itemUp}>

                  <ProgressBar title="Problem Solving" percent={90} />
                  <ProgressBar title="Maths Confidence" percent={70} styleTwo />

                </motion.div>

                {/* Button */}
                <motion.div className="choose-button" variants={itemUp}>

                  <motion.a
                    href="/contact"
                    className="theme-btn"
                    whileHover={{ scale: 1.06, y: -3 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ duration: 0.3, ease: easeOut }}
                  >
                    Start Learning Maths
                    <i className="icon-arrow-icon"></i>
                  </motion.a>

                </motion.div>

              </motion.div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

export default ChooseUs;