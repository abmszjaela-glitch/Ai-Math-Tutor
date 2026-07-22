import { motion } from 'framer-motion';
import { ArrowRight, Calculator, Star } from 'lucide-react';

import classes1 from '../assets/img/classes/classes1.jpg';
import classes2 from '../assets/img/classes/classes2.png';
import classes3 from '../assets/img/classes/classes3.jpg';

import perasute from '../assets/img/classes/perasute.png';
import crown from '../assets/img/classes/crown.png';
import star from '../assets/img/classes/star.png';
import zikzak from '../assets/img/classes/zikzak.png';
import border from '../assets/img/classes/border.png';

const easeOut = [0.25, 0.1, 0.25, 1];

const floatY = {
  animate: { y: [0, -16, 0], transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' } },
};
const floatX = {
  animate: { x: [0, 14, 0], transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' } },
};

// Map original animation names to Framer Motion initial states
const directionVariants = {
  fadeInRight: { hidden: { opacity: 0, x: 60 }, visible: { opacity: 1, x: 0 } },
  fadeInLeft: { hidden: { opacity: 0, x: -60 }, visible: { opacity: 1, x: 0 } },
  fadeInUp: { hidden: { opacity: 0, y: 60 }, visible: { opacity: 1, y: 0 } },
};

const classesData = [
  {
    image: classes1,
    date: 'Grade 1–2',
    title: 'Build Strong Foundations in Mathematics',
    animation: 'fadeInRight',
    delay: 0.1,
    active: false,
  },
  {
    image: classes2,
    date: 'Grade 3–4',
    title: 'Explore Mathematics With Your AI Tutor',
    animation: 'fadeInUp',
    delay: 0.25,
    active: true,
  },
  {
    image: classes3,
    date: 'Grade 5–6',
    title: 'Master Advanced Maths Skills With AI',
    animation: 'fadeInLeft',
    delay: 0.4,
    active: false,
  },
];

const titleContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const titleItem = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOut } },
};

const Classes = () => {
  return (
    <section className="classes-section section-padding fix">

      {/* Decorative Shapes */}
      <motion.div
        className="perasute-shape"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1, ease: easeOut }}
      >
        <motion.img src={perasute} alt="Decorative shape" animate={floatY.animate} />
      </motion.div>

      <motion.div
        className="crown-shape"
        initial={{ opacity: 0, scale: 0.6, rotate: -15 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, delay: 0.15, ease: easeOut }}
      >
        <motion.img
          src={crown}
          alt="Decorative crown"
          animate={{ rotate: [0, 8, 0, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      <motion.div
        className="star-shape"
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, delay: 0.3, ease: easeOut }}
      >
        <img src={star} alt="Decorative star" />
      </motion.div>

      <motion.div
        className="zikzak-shape"
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, delay: 0.2, ease: easeOut }}
      >
        <motion.img src={zikzak} alt="Decorative zigzag shape" animate={floatX.animate} />
      </motion.div>

      <motion.div
        className="border-shape"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1, delay: 0.25, ease: easeOut }}
      >
        <img src={border} alt="Decorative border" />
      </motion.div>

      <div className="container">

        {/* Section Title */}
        <motion.div
          className="section-title text-center custom-padding-top"
          variants={titleContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.span className="sub-title tittle-bg-2" variants={titleItem}>
            AI Maths Learning
          </motion.span>

          <motion.h2 className="text-white" variants={titleItem}>
            Learn Maths Your Way – with
            <br className="d-none d-lg-block" />
            Your Friendly AI Tutor
          </motion.h2>
        </motion.div>

        {/* Learning Levels */}
        <div className="row">

          {classesData.map((item, index) => (
            <div
              key={index}
              className="col-xl-4 col-lg-6 col-md-6"
            >
              <motion.div
                className={`classes-box-item ${item.active ? 'active' : ''}`}
                variants={directionVariants[item.animation]}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, delay: item.delay, ease: easeOut }}
                whileHover={{ y: -12, transition: { duration: 0.35, ease: easeOut } }}
              >

                {/* Learning Level Image */}
                <div className="classes-image">

                  <motion.img
                    src={item.image}
                    alt={item.title}
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.5, ease: easeOut }}
                  />

                  {/* Grade Level */}
                  <div className="date-box">
                    <span>
                      <i className="fas fa-graduation-cap"></i>
                      {item.date}
                    </span>
                  </div>

                </div>

                {/* Learning Content */}
                <div className="classes-content">

                  {/* Subject */}
                  <div className="location">
                    <span>
                      <Calculator />
                      Australian Mathematics Curriculum
                    </span>
                  </div>

                  {/* Title */}
                  <h3>
                    <a href="/program-details">
                      {item.title}
                    </a>
                  </h3>

                  {/* Bottom Area */}
                  <div className="classes-rate">

                    <motion.a
                      href="/program-details"
                      className="theme-btn"
                      whileHover={{ scale: 1.06, y: -3 }}
                      whileTap={{ scale: 0.96 }}
                      transition={{ duration: 0.3, ease: easeOut }}
                    >
                      Start Learning<ArrowRight />
                    </motion.a>

                    {/* AI Tutor Rating */}
                    <div className="rate">

                      <p>AI Tutor</p>

                      <motion.ul
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.5 }}
                        variants={{
                          hidden: {},
                          visible: { transition: { staggerChildren: 0.08, delayChildren: item.delay + 0.3 } },
                        }}
                        style={{ display: 'flex', listStyle: 'none', padding: 0 }}
                      >
                        {[...Array(5)].map((_, i) => (
                          <motion.li
                            key={i}
                            variants={{
                              hidden: { opacity: 0, scale: 0 },
                              visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: easeOut } },
                            }}
                          >
                            <i className="fas fa-star"></i>
                          </motion.li>
                        ))}
                      </motion.ul>

                    </div>

                  </div>

                </div>

              </motion.div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default Classes;