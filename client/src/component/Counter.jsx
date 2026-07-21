import { useEffect, useState } from 'react';

import snake from '../assets/img/counter/snake.png';
import sun from '../assets/img/counter/sun.png';

import icon1 from '../assets/img/counter/icon1.svg';
import icon2 from '../assets/img/counter/icon2.svg';
import icon3 from '../assets/img/counter/icon3.svg';
import icon4 from '../assets/img/counter/icon4.svg';

const counterData = [
  {
    icon: icon1,
    count: 5000,
    label: 'Math Problems Solved',
    delay: '.2s',
  },
  {
    icon: icon2,
    count: 1500,
    label: 'AI Learning Sessions',
    delay: '.4s',
  },
  {
    icon: icon3,
    count: 6,
    label: 'Australian Grade Levels',
    delay: '.6s',
  },
  {
    icon: icon4,
    count: 2500,
    label: 'Students Learning Math',
    delay: '.8s',
  },
];

const CounterItem = ({ item, index }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
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
  }, [item.count]);

  return (
    <div
      className="col-lg-3 col-md-4 col-sm-6 wow fadeInUp"
      data-wow-delay={item.delay}
    >
      <div
        className={`counter-items ${
          index === counterData.length - 1 ? 'border-none' : ''
        }`}
      >
        {/* Icon */}
        <div className="icon">
          <img
            src={item.icon}
            alt={item.label}
          />
        </div>

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
      </div>
    </div>
  );
};

const Counter = () => {
  return (
    <section className="counter-section section-padding">

      {/* Decorative Shapes */}

      <div className="snake-shape float-bob-y">
        <img
          src={snake}
          alt="snake-shape"
        />
      </div>

      <div className="sun-shape float-bob-x">
        <img
          src={sun}
          alt="sun-shape"
        />
      </div>

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