import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import top1 from '../assets/img/program/top-1.png';
import top2 from '../assets/img/program/top-2.png';
import top3 from '../assets/img/program/top-3.png';
import top4 from '../assets/img/program/top-4.png';

import bottom1 from '../assets/img/program/bottom-1.png';
import bottom2 from '../assets/img/program/bottom-2.png';
import bottom3 from '../assets/img/program/bottom-3.png';
import bottom4 from '../assets/img/program/bottom-4.png';

import bookIcon from '../assets/img/program/book.png';
import phoneIcon from '../assets/img/program/phone.png';
import boyIcon from '../assets/img/program/boy.png';
import chemicalBookIcon from '../assets/img/program/camical-book.png';

const easeOut = [0.25, 0.1, 0.25, 1];

// Create the motion-wrapped Link ONCE, outside the component,
// so it isn't recreated on every render.
const MotionLink = motion(Link);

const programs = [
  {
    title: 'Number & Algebra',
    path: '/Algebra',
    age: 'Australian Grade 6',
    description:
      'Build strong number skills with your friendly AI Math Tutor. Learn fractions, decimals, percentages, integers, and algebra through step-by-step explanations and interactive practice.',
    topImage: top1,
    bottomImage: bottom1,
    icon: bookIcon,
    styleClass: 'style-2',
    delay: 0.1,
  },
  {
    title: 'Measurement & Geometry',
    path: '/Measurement',
    age: 'Australian Grade 6',
    description:
      'Explore measurement, shapes, angles, area, perimeter, and volume with your AI tutor. Understand mathematical ideas through clear examples and guided problem-solving.',
    topImage: top2,
    bottomImage: bottom2,
    icon: phoneIcon,
    styleClass: '',
    bgClass: 'bg-2',
    delay: 0.25,
  },
  {
    title: 'Statistics & Probability',
    path: '/Statistics',
    age: 'Australian Grade 6',
    description:
      'Learn how to read and understand data, graphs, tables, and probability. Your AI Math Tutor helps you discover patterns and solve real-world maths problems with confidence.',
    topImage: top3,
    bottomImage: bottom3,
    icon: boyIcon,
    styleClass: 'style-2',
    bgClass: 'bg-3',
    delay: 0.4,
  },
  {
    title: 'Problem Solving',
    path: '/ProblemSolving',
    age: 'Australian Grade 6',
    description:
      'Put your maths skills into action with fun challenges and real-life problems. Get friendly AI guidance, hints, and step-by-step support without simply giving away the answer.',
    topImage: top4,
    bottomImage: bottom4,
    icon: chemicalBookIcon,
    styleClass: '',
    bgClass: 'bg-4',
    delay: 0.55,
  },
];

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 60,
    scale: 0.92,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.75,
      ease: easeOut,
    },
  },
};

const Program = () => {
  return (
    <section className="program-section section-padding pt-0 fix">
      <div className="container">
        <div className="row g-4">

          {programs.map((program, index) => (
            <div
              key={index}
              className="col-xl-3 col-lg-4 col-md-6 col-sm-6"
            >
              <motion.div
                className={`program-box-item ${program.styleClass || ''}`}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{
                  once: true,
                  amount: 0.25,
                }}
                transition={{
                  delay: program.delay,
                }}
                whileHover={{
                  y: -14,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                  transition: {
                    duration: 0.35,
                    ease: easeOut,
                  },
                }}
              >

                {/* Top Decoration */}
                <motion.div
                  className="top-bar"
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{
                    duration: 0.6,
                    delay: program.delay + 0.15,
                    ease: easeOut,
                  }}
                >
                  <img src={program.topImage} alt="AI Math Tutor decoration" />
                </motion.div>

                {/* Bottom Decoration */}
                <motion.div
                  className="bottom-bar"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{
                    duration: 0.6,
                    delay: program.delay + 0.15,
                    ease: easeOut,
                  }}
                >
                  <img src={program.bottomImage} alt="AI Math Tutor decoration" />
                </motion.div>

                {/* Background */}
                <div className={`program-bg ${program.bgClass || ''}`}></div>

                {/* Program Icon */}
                <motion.div
                  className="program-icon"
                  initial={{ opacity: 0, scale: 0, rotate: -30 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{
                    duration: 0.6,
                    delay: program.delay + 0.25,
                    ease: easeOut,
                  }}
                  whileHover={{ scale: 1.15, rotate: 10 }}
                >
                  <img
                    src={program.icon}
                    alt={`${program.title} AI Math Tutor icon`}
                  />
                </motion.div>

                {/* Program Content */}
                <div className="program-content">

                  <h3>{program.title}</h3>

                  <span>{program.age}</span>

                  <p>{program.description}</p>

                  {/* Navigate to Topic */}
                  <MotionLink
                    to={program.path}
                    className="link-btn"
                    whileHover={{ x: 6 }}
                    transition={{ duration: 0.25, ease: easeOut }}
                  >
                    Explore Topic
                    <ArrowRight size={18} />
                  </MotionLink>

                </div>

              </motion.div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default Program;