import aboutImage from '../assets/img/about/about-1.png';
import aboutBg from '../assets/img/about/about-bg-1.png';
import counterImage from '../assets/img/about/ab-counter.png';

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
          alt="Tubelight"
        />
      </div>

      <div className="sun-shape float-bob-y">
        <img
          src={sunImage}
          alt="Sun"
        />
      </div>

      <div className="star-shape">
        <img
          src={starImage}
          alt="Star"
        />
      </div>

      <div className="love-shape float-bob-x">
        <img
          src={loveImage}
          alt="Love"
        />
      </div>

      <div className="frame-shape">
        <img
          src={frameImage}
          alt="Frame"
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
                    alt="About Us"
                    className="wow fadeInUp"
                    data-wow-delay=".5s"
                  />

                  <div
                    className="shape-bg wow zoomIn"
                    data-wow-delay=".5s"
                  >
                    <img
                      src={aboutBg}
                      alt="Background Shape"
                    />
                  </div>

                </div>

                {/* Experience Counter */}
                <div className="counter-image float-bob-x">

                  <img
                    src={counterImage}
                    alt="Experience"
                  />

                  <div className="counter-box">

                    <div className="count">

                      <h2 className="odometer">
                        38
                      </h2>

                      <span className="plus">
                        +
                      </span>

                    </div>

                    <p>
                      Experience
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
                    About Us
                  </span>

                  <h2 className="char-animation">
                    Safe, Fun &amp; Educational
                    – Just What Your Child Needs
                  </h2>

                </div>

                <div className="content-bottom mt-4 mt-md-0">

                  <p
                    className="wow fadeInUp"
                    data-wow-delay=".7s"
                  >
                    Dolor sit amet, consectetur adipiscing
                    elit. Nibh ullamcorper felis arcu elementum.
                    Viverra lectus nullam sagittis nunc
                    imperdiet leo felis. Ultrices mauris vitae
                    cum bibendum Dolor sit amet, consectetur
                    adipiscing elit.
                  </p>

                  {/* Features List */}
                  <div
                    className="about-list wow fadeInUp"
                    data-wow-delay=".8s"
                  >

                    <ul>

                      <li className="mb-3">
                        <Check size={18} />
                        Learning &amp; Fun
                      </li>

                      <li>
                        <Check size={18} />
                        Children Safety
                      </li>

                    </ul>

                    <ul>

                      <li className="mb-3">
                        <Check size={18} />
                        Healthy Meals
                      </li>

                      <li>
                        <Check size={18} />
                        Cute Environment
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
                      Online Admission
                      <i className="icon-arrow-icon"></i>
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