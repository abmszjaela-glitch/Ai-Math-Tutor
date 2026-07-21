import { Play } from 'lucide-react';

import parachuteImage from '../assets/img/hero/perashute.png';
import carImage from '../assets/img/hero/car.png';
import treeImage from '../assets/img/hero/tree.png';
import crownImage from '../assets/img/hero/crown.png';
import frameImage from '../assets/img/hero/frame.png';
import lineImage from '../assets/img/hero/hero-line.png';
import heroImage from '../assets/img/hero/hero1.png';
import textImage from '../assets/img/hero/text.png';

const Hero = () => {
  return (
    <section className="hero-section hero-1 hero-bg fix">

      {/* Decorative Shapes */}
      <div className="perasute-shape float-bob-y">
        <img
          src={parachuteImage}
          alt="Parachute"
        />
      </div>

      <div className="car-shape float-bob-x">
        <img
          src={carImage}
          alt="Car"
        />
      </div>

      <div className="tree-shape">
        <img
          src={treeImage}
          alt="Tree"
        />
      </div>

      <div className="crown-shape">
        <img
          src={crownImage}
          alt="Crown"
        />
      </div>

      <div className="frame-shape float-bob-y">
        <img
          src={frameImage}
          alt="Frame"
        />
      </div>

      <div className="line-shape">
        <img
          src={lineImage}
          alt="Decorative line"
        />
      </div>

      {/* Hero Content */}
      <div className="container hero-container">

        <div className="row g-4 align-items-center">

          {/* Left Content */}
          <div className="col-lg-5">

            <div className="hero-content">

              <h1 className="char-animation">
                A Happy Place to Grow, Play And Learn
              </h1>

              <p
                className="wow fadeInUp"
                data-wow-delay=".3s"
              >
                Kindergarten is an early childhood educational
                environment where most young for your children life.
              </p>

              {/* Buttons */}
              <div
                className="hero-button wow fadeInUp"
                data-wow-delay=".5s"
              >

                {/* Admission Button */}
                <a
                  href="/contact"
                  className="theme-btn"
                >
                  Online Admission
                  <i className="icon-arrow-icon"></i>
                </a>

                {/* Video */}
                <div className="wave-area">

                  <div className="promo-video">

                    {/* Animated Waves */}
                    <div className="waves-block">
                      <div className="waves wave-1"></div>
                      <div className="waves wave-2"></div>
                      <div className="waves wave-3"></div>
                    </div>

                    {/* Play Button */}
                    <a
                      className="video-popup"
                      href="https://www.youtube.com/watch?v=Cn4G2lZ_g2I"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Play video"
                    >
                      <Play size={18} fill="currentColor" />
                    </a>

                  </div>

                  <p className="video-text">
                    Play Video
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* Right Hero Image */}
          <div
            className="col-lg-6 wow fadeInUp"
            data-wow-delay=".3s"
          >

            <div className="hero-img">

              <img
                src={heroImage}
                alt="Children learning"
              />

              {/* Text Shape */}
              <div className="text-shape float-bob-y">

                <img
                  src={textImage}
                  alt="Learning"
                />

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

export default Hero;