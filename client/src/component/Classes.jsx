import classes1 from '../assets/img/classes/classes1.jpg';
import classes2 from '../assets/img/classes/classes2.png';
import classes3 from '../assets/img/classes/classes3.jpg';

import perasute from '../assets/img/classes/perasute.png';
import crown from '../assets/img/classes/crown.png';
import star from '../assets/img/classes/star.png';
import zikzak from '../assets/img/classes/zikzak.png';
import border from '../assets/img/classes/border.png';
import {  ArrowRight,Calculator } from 'lucide-react';
const classesData = [
  {
    image: classes1,
    date: 'Grade 1–2',
    title: 'Build Strong Foundations in Mathematics',
    animation: 'fadeInRight',
    delay: '.5s',
    active: false,
  },
  {
    image: classes2,
    date: 'Grade 3–4',
    title: 'Explore Mathematics With Your AI Tutor',
    animation: 'fadeInUp',
    delay: '.1s',
    active: true,
  },
  {
    image: classes3,
    date: 'Grade 5–6',
    title: 'Master Advanced Maths Skills With AI',
    animation: 'fadeInLeft',
    delay: '.5s',
    active: false,
  },
];

const Classes = () => {
  return (
    <section className="classes-section section-padding fix">

      {/* Decorative Shapes */}
      <div className="perasute-shape float-bob-y">
        <img src={perasute} alt="Decorative shape" />
      </div>

      <div className="crown-shape">
        <img src={crown} alt="Decorative crown" />
      </div>

      <div className="star-shape">
        <img src={star} alt="Decorative star" />
      </div>

      <div className="zikzak-shape">
        <img src={zikzak} alt="Decorative zigzag shape" />
      </div>

      <div className="border-shape">
        <img src={border} alt="Decorative border" />
      </div>

      <div className="container">

        {/* Section Title */}
        <div className="section-title text-center custom-padding-top">
          <span className="sub-title tittle-bg-2">
            AI Maths Learning
          </span>

          <h2 className="char-animation text-white">
            Learn Maths Your Way – with
            <br className="d-none d-lg-block" />
            Your Friendly AI Tutor
          </h2>
        </div>

        {/* Learning Levels */}
        <div className="row">

          {classesData.map((item, index) => (
            <div
              key={index}
              className="col-xl-4 col-lg-6 col-md-6"
            >
              <div
                className={`classes-box-item ${
                  item.active ? 'active' : ''
                } wow ${item.animation}`}
                data-wow-delay={item.delay}
              >

                {/* Learning Level Image */}
                <div className="classes-image">

                  <img
                    src={item.image}
                    alt={item.title}
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
                    <Calculator/>
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

                    <a
                      href="/program-details"
                      className="theme-btn"
                    >
                      Start Learning<ArrowRight/>
                    </a>

                    {/* AI Tutor Rating */}
                    <div className="rate">

                      <p>
                        AI Tutor
                      </p>

                      <ul>
                        <li>
                          <i className="fas fa-star"></i>
                        </li>

                        <li>
                          <i className="fas fa-star"></i>
                        </li>

                        <li>
                          <i className="fas fa-star"></i>
                        </li>

                        <li>
                          <i className="fas fa-star"></i>
                        </li>

                        <li>
                          <i className="fas fa-star"></i>
                        </li>
                      </ul>

                    </div>

                  </div>

                </div>

              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default Classes;