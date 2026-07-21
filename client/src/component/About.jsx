import aboutImage from '../assets/img/about/about-1.png';
import aboutBg from '../assets/img/about/about-bg-1.png';
import counterImage from '../assets/img/about/ab-counter.png';
import {  ArrowRight } from 'lucide-react';
import tubelightImage from '../assets/img/about/tubelight.png';
import sunImage from '../assets/img/about/sun.png';
import starImage from '../assets/img/about/star.png';
import loveImage from '../assets/img/about/love.png';
import frameImage from '../assets/img/about/frame.png';

import { Check } from 'lucide-react';

const About = () => {
  return (
    <section className="about-section section-padding fix">

      {/* Decorative Shapes */}
      <div className="tubelight-shape">
        <img
          src={tubelightImage}
          alt="AI Math Learning"
        />
      </div>

      <div className="sun-shape float-bob-y">
        <img
          src={sunImage}
          alt="Fun Mathematics Learning"
        />
      </div>

      <div className="star-shape">
        <img
          src={starImage}
          alt="Math Learning Star"
        />
      </div>

      <div className="love-shape float-bob-x">
        <img
          src={loveImage}
          alt="Friendly AI Tutor"
        />
      </div>

      <div className="frame-shape">
        <img
          src={frameImage}
          alt="Interactive Math Learning"
        />
      </div>

      <div className="container">

        <div className="about-wrapper">

          <div className="row g-4 align-items-center">

            {/* About Images */}
            <div className="col-lg-6">

              <div className="about-image-box">

                <div className="about-image">

                  <img
                    src={aboutImage}
                    alt="Australian Students Learning Mathematics with AI Tutor"
                    className="wow fadeInUp"
                    data-wow-delay=".5s"
                  />

                  <div
                    className="shape-bg wow zoomIn"
                    data-wow-delay=".5s"
                  >
                    <img
                      src={aboutBg}
                      alt="AI Math Tutor Background"
                    />
                  </div>

                </div>

                {/* Learning Counter */}
                <div className="counter-image float-bob-x">

                  <img
                    src={counterImage}
                    alt="Interactive Math Lessons"
                  />

                  <div className="counter-box">

                    <div className="count">

                      <h2 className="odometer">
                        6
                      </h2>

                      <span className="plus">
                        +
                      </span>

                    </div>

                    <p>
                      Grade Levels
                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* About Content */}
            <div className="col-lg-6">

              <div className="about-content">

                <div className="section-title text-left">

                  <span
                    className="sub-title wow fadeInUp text-left"
                  >
                    About Our AI Math Tutor
                  </span>

                  <h2 className="char-animation">
                    Making Mathematics Fun,
                    Interactive &amp; Easy to Understand
                  </h2>

                </div>

                <div className="content-bottom mt-4 mt-md-0">

                  <p
                    className="wow fadeInUp"
                    data-wow-delay=".7s"
                  >
                    Our AI Math Tutor helps Australian students
                    from Grade 1 to Grade 6 build strong
                    mathematics skills through fun, interactive
                    and personalised learning. Students can learn
                    step by step with friendly AI tutor characters
                    that explain mathematical concepts, guide
                    them through problems and help them learn
                    from their mistakes.
                  </p>

                  {/* Features List */}
                  <div
                    className="about-list wow fadeInUp"
                    data-wow-delay=".8s"
                  >

                    <ul>

                      <li className="mb-3">
                        <Check size={18} />
                        AI-Powered Math Learning
                      </li>

                      <li>
                        <Check size={18} />
                        Australian Curriculum Aligned
                      </li>

                    </ul>

                    <ul>

                      <li className="mb-3">
                        <Check size={18} />
                        Friendly AI Tutor Characters
                      </li>

                      <li>
                        <Check size={18} />
                        Personalised Learning Support
                      </li>

                    </ul>

                  </div>

                  {/* Button */}
                  <div
                    className="about-button wow fadeInUp"
                    data-wow-delay=".9s"
                  >

                    <a
                      href="/about"
                      className="theme-btn"
                    >
                      Explore AI Math Learning
                      <ArrowRight/>
                    </a>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

export default About;