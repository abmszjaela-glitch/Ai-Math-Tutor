import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

import snake from '../assets/img/counter/snake.png';
import sun from '../assets/img/counter/sun.png';

import icon1 from '../assets/img/counter/icon1.svg';
import icon2 from '../assets/img/counter/icon2.svg';
import icon3 from '../assets/img/counter/icon3.svg';
import icon4 from '../assets/img/counter/icon4.svg';

const easeOut = [0.25, 0.1, 0.25, 1];

const floatY = {
  animate: { y: [0, -16, 0], transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' } },
};
const floatX = {
  animate: { x: [0, 14, 0], transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' } },
};

const counterData = [
  {
    icon: icon1,
    count: 5000,
    label: 'Math Problems Solved',
  },
  {
    icon: icon2,
    count: 1500,
    label: 'AI Learning Sessions',
  },
  {
    icon: icon3,
    count: 6,
    label: 'Australian Grade Levels',
  },
  {
    icon: icon4,
    count: 2500,
    label: 'Students Learning Math',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: easeOut },
  },
};

const CounterItem = ({ item, index }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;

    const duration = 2000;
    const incrementTime = 20;
    const increment = item.count / (duration / incrementTime);

    const counter = setInterval(() => {
      start += increment;

      if (start >= item.count) {
        start = item.count;
        clearInterval(counter);
      }

      setCount(Math.floor(start));
    }, incrementTime);

    return () => clearInterval(counter);
  }, [isInView, item.count]);

  return (
    <motion.div
      ref={ref}
      className="col-lg-3 col-md-4 col-sm-6"
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      transition={{ delay: index * 0.15 }}
    >
      <motion.div
        className={`counter-items ${
          index === counterData.length - 1 ? 'border-none' : ''
        }`}
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3, ease: easeOut }}
      >
        {/* Icon */}
        <motion.div
          className="icon"
          initial={{ scale: 0, rotate: -30 }}
          animate={isInView ? { scale: 1, rotate: 0 } : {}}
          transition={{ duration: 0.6, delay: index * 0.15 + 0.2, ease: easeOut }}
        >
          <img
            src={item.icon}
            alt={item.label}
          />
        </motion.div>

        {/* Counter */}
        <div className="counter-box">
          <div className="count">
            <h3 className="odometer">
              {count.toLocaleString()}
            </h3>

            <span className="plus">
              +
            </span>
          </div>

          <p>
            {item.label}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Counter = () => {
  return (
    <section className="counter-section section-padding">

      {/* Decorative Shapes */}

      <motion.div
        className="snake-shape"
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1, ease: easeOut }}
      >
        <motion.img src={snake} alt="snake-shape" animate={floatY.animate} />
      </motion.div>

      <motion.div
        className="sun-shape"
        initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, delay: 0.15, ease: easeOut }}
      >
        <motion.img src={sun} alt="sun-shape" animate={floatX.animate} />
      </motion.div>

      {/* Background */}

      <div className="counter-bg"></div>

      {/* Counter Content */}

      <div className="container">

        <div className="row g-4">

          {counterData.map((item, index) => (
            <CounterItem
              key={index}
              item={item}
              index={index}
            />
          ))}

        </div>

      </div>

    </section>
  );
};

export default Counter;