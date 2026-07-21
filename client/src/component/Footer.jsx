import bottomShape from '../assets/img/footer/bg-bottom.png';
import basketShape from '../assets/img/footer/busket.png';
import ballShape from '../assets/img/footer/ball.png';

import NUMORA from '../assets/img/logo/NUMORA.png';
import emailIcon from '../assets/img/footer/email.svg';
import locationIcon from '../assets/img/footer/location.svg';

const Footer = () => {
  return (
    <footer className="footer-section">

      {/* Bottom Shape */}
      <div className="bottom-shape">
        <img
          src={bottomShape}
          alt="AI Math Tutor footer background"
        />
      </div>

      {/* Basket Shape */}
      <div className="busket-shape float-bob-x">
        <img
          src={basketShape}
          alt="Decorative learning basket"
        />
      </div>

      {/* Ball Shape */}
      <div className="ball-shape float-bob-y">
        <img
          src={ballShape}
          alt="Decorative learning ball"
        />
      </div>


      <div className="container">

        <div className="footer-widgets-wrapper">

          <div className="row">

            {/* About / Logo */}
            <div
              className="col-xl-4 col-lg-6 col-md-8 wow fadeInUp"
              data-wow-delay=".2s"
            >
              <div className="single-footer-widget">

                <div className="widget-head">
                  <a href="/">
                    <img
                      src={NUMORA}
                      alt="AI Math Tutor Logo"
                    />
                  </a>
                </div>

                <div className="widget-content">

                  <p>
                    NUMORA is an AI-powered Math Tutor platform designed
                    to help Australian Grade 1 to 6 students learn
                    mathematics through friendly AI tutors, interactive
                    lessons, practice activities, and personalised
                    learning support.
                  </p>

                  {/* Social Media */}
                  <ul className="social-icon">

                    <li>
                      <a href="#">
                        <i className="fab fa-facebook-f"></i>
                      </a>
                    </li>

                    <li>
                      <a href="#">
                        <i className="fab fa-twitter"></i>
                      </a>
                    </li>

                    <li>
                      <a href="#">
                        <i className="fab fa-youtube"></i>
                      </a>
                    </li>

                    <li>
                      <a href="#">
                        <i className="fab fa-linkedin-in"></i>
                      </a>
                    </li>

                  </ul>

                </div>

              </div>
            </div>


            {/* Quick Links */}
            <div
              className="col-xl-2 col-lg-3 col-md-4 col-sm-6 wow fadeInUp"
              data-wow-delay=".4s"
            >
              <div className="single-footer-widget">

                <div className="widget-head">
                  <h3>
                    Quick Links
                  </h3>
                </div>

                <div className="widget-content">

                  <ul className="list-area">

                    <li>
                      <a href="/program">
                        Math Lessons
                      </a>
                    </li>

                    <li>
                      <a href="/program">
                        Practice
                      </a>
                    </li>

                    <li>
                      <a href="/about">
                        About NUMORA
                      </a>
                    </li>

                    <li>
                      <a href="/contact">
                        Contact Us
                      </a>
                    </li>

                  </ul>

                </div>

              </div>
            </div>


            {/* Learning Resources */}
            <div
              className="col-xl-2 col-lg-3 col-md-6 col-sm-6 wow fadeInUp"
              data-wow-delay=".6s"
            >
              <div className="single-footer-widget">

                <div className="widget-head">
                  <h3>
                    Learning
                  </h3>
                </div>

                <div className="widget-content">

                  <ul className="list-area">

                    <li>
                      <a href="/program">
                        Grade 1–6 Maths
                      </a>
                    </li>

                    <li>
                      <a href="/program">
                        AI Math Tutor
                      </a>
                    </li>

                    <li>
                      <a href="/program">
                        Maths Practice
                      </a>
                    </li>

                    <li>
                      <a href="/news">
                        Learning Tips
                      </a>
                    </li>

                  </ul>

                </div>

              </div>
            </div>


            {/* Contact Information */}
            <div
              className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp"
              data-wow-delay=".8s"
            >
              <div className="single-footer-widget">

                <div className="widget-content">

                  {/* Email */}
                  <div className="contact-info">

                    <div className="icon">
                      <img
                        src={emailIcon}
                        alt="Email icon"
                      />
                    </div>

                    <div className="content">

                      <h3>
                        Email us
                      </h3>

                      <p>
                        <a href="mailto:support@numora.com">
                          support@numora.com
                        </a>
                      </p>

                    </div>

                  </div>


                  {/* Location */}
                  <div className="contact-info">

                    <div className="icon">
                      <img
                        src={locationIcon}
                        alt="Location icon"
                      />
                    </div>

                    <div className="content">

                      <h3>
                        Serving Australian Students
                      </h3>

                      <p>
                        <a href="#">
                          Supporting young learners across
                          <br />
                          Australia with AI-powered maths learning.
                        </a>
                      </p>

                    </div>

                  </div>

                </div>

              </div>
            </div>

          </div>


          {/* Copyright */}
          <p
            className="footer-bottom wow fadeInUp"
            data-wow-delay=".5s"
          >
            ©{' '}
            <a href="/">
              NUMORA
            </a>{' '}
            2026. All Rights Reserved, ABMSZ
          </p>

        </div>

      </div>

    </footer>
  );
};

export default Footer;