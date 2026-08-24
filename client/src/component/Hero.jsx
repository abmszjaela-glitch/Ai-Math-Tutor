import { Play } from 'lucide-react';

import parachuteImage from '../assets/img/hero/perashute.png';
import carImage from '../assets/img/hero/car.png';
import treeImage from '../assets/img/hero/tree.png';
import crownImage from '../assets/img/hero/crown.png';
import frameImage from '../assets/img/hero/frame.png';
import lineImage from '../assets/img/hero/hero-line.png';
import heroImage from '../assets/img/hero/hero1.png';
import {  ArrowRight } from 'lucide-react';
const Hero = () => {
  return (
    <section className="hero-section hero-1 hero-bg fix">

      {/* Mobile responsive CSS - scoped to this component's markup */}
      <style>{`
        /* ---------- Tablet (max-width: 1199px) ---------- */
        @media (max-width: 1199px) {
          .hero-1 {
            padding-top: 150px;
            padding-bottom: 60px;
            overflow: hidden;
          }

          .hero-1 .hero-container {
            max-width: 100%;
          }

          .hero-1 .car-shape,
          .hero-1 .crown-shape,
          .hero-1 .frame-shape {
            opacity: 0.35;
          }

          .hero-1 .hero-content {
            text-align: center;
            margin-top: 0;
          }

          .hero-1 .hero-content h1 {
            font-size: 42px;
          }

          .hero-1 .hero-content p {
            font-size: 16px;
            max-width: 520px;
            margin: 0 auto;
          }

          .hero-1 .hero-content .hero-button {
            justify-content: center;
            flex-wrap: wrap;
            gap: 20px;
            margin-top: 30px;
          }

          .hero-1 .hero-img {
            margin-left: 0;
            margin-top: 40px;
            text-align: center;
            max-width: 560px;
            margin-right: auto;
            margin-left: auto;
          }
          .hero-1 .hero-img img {
            width: 100%;
            height: auto;
          }

          .hero-1 .line-shape {
            display: none;
          }
        }

        /* ---------- Small tablet / large phone (max-width: 767px) ---------- */
        @media (max-width: 767px) {
          .hero-1 {
            padding-top: 130px;
            padding-bottom: 40px;
          }

          .hero-1 .hero-content h1 {
            font-size: 32px;
          }

          .hero-1 .hero-content p {
            font-size: 15px;
          }

          .hero-1 .hero-content .hero-button {
            gap: 16px;
          }

          .hero-1 .hero-content .hero-button .theme-btn {
            font-size: 14px;
            padding: 0 22px;
            height: 50px;
            line-height: 50px;
          }

          .hero-1 .hero-content .wave-area {
            gap: 15px;
          }

          .hero-1 .hero-img {
            max-width: 400px;
          }

          /* hide extra decorative clutter on small screens */
          .hero-1 .car-shape,
          .hero-1 .crown-shape,
          .hero-1 .tree-shape {
            display: none;
          }

          .hero-1 .perasute-shape img,
          .hero-1 .frame-shape img {
            width: 40px;
            height: auto;
          }
        }

        /* ---------- Mobile (max-width: 575px) ---------- */
        @media (max-width: 575px) {
          .hero-1 {
            padding-top: 110px;
            padding-bottom: 30px;
          }

          .hero-1 .hero-content h1 {
            font-size: 26px;
            line-height: 1.3;
          }

          .hero-1 .hero-content p {
            font-size: 14px;
          }

          .hero-1 .hero-content .hero-button {
            flex-direction: column;
            align-items: center;
            gap: 20px;
          }

          .hero-1 .hero-content .hero-button .theme-btn {
            width: 100%;
            text-align: center;
          }

          .hero-1 .hero-content .wave-area {
            flex-direction: column;
            gap: 10px;
          }

          .hero-1 .hero-img {
            max-width: 300px;
          }

          .hero-1 .frame-shape {
            display: none;
          }
        }

        /* ---------- Extra small phones (max-width: 380px) ---------- */
        @media (max-width: 380px) {
          .hero-1 .hero-content h1 {
            font-size: 22px;
          }

          .hero-1 .hero-img {
            max-width: 260px;
          }
        }
      `}</style>

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
                Numora is an early childhood educational
                environment where most young for your children life.
              </p>

              {/* Buttons */}
              <div
                className="hero-button wow fadeInUp"
                data-wow-delay=".5s"
              >

                {/* Admission Button */}
                <a
                  href="/SelectFriend"
                  className="theme-btn"
                >
                   Start Learning
                  <ArrowRight/>
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
                      href="https://youtu.be/0x1jJaIcWIo?si=Rjs5KjmtFpBanXxg"
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
             

            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

export default Hero;