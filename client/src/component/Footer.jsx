import bottomShape from '../assets/img/footer/bg-bottom.png';
import basketShape from '../assets/img/footer/busket.png';
import ballShape from '../assets/img/footer/ball.png';

import footerLogo from '../assets/img/footer/Logo.svg';
import emailIcon from '../assets/img/footer/email.svg';
import locationIcon from '../assets/img/footer/location.svg';

const Footer = () => {
  return (
    <footer className="footer-section">

      {/* Bottom Shape */}
      <div className="bottom-shape">
        <img
          src={bottomShape}
          alt="Footer background"
        />
      </div>

      {/* Basket Shape */}
      <div className="busket-shape float-bob-x">
        <img
          src={basketShape}
          alt="Decorative basket"
        />
      </div>

      {/* Ball Shape */}
      <div className="ball-shape float-bob-y">
        <img
          src={ballShape}
          alt="Decorative ball"
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
                      src={footerLogo}
                      alt="Kidza Logo"
                    />
                  </a>
                </div>

                <div className="widget-content">

                  <p>
                    Kidza is an early childhood education school
                    where all children, typically aged 4 to 6,
                    begin their learning journey.
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
                        Courses
                      </a>
                    </li>

                    <li>
                      <a href="/program">
                        Program
                      </a>
                    </li>

                    <li>
                      <a href="/about">
                        About Us
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


            {/* Company Info */}
            <div
              className="col-xl-2 col-lg-3 col-md-6 col-sm-6 wow fadeInUp"
              data-wow-delay=".6s"
            >
              <div className="single-footer-widget">

                <div className="widget-head">
                  <h3>
                    Company info
                  </h3>
                </div>

                <div className="widget-content">

                  <ul className="list-area">

                    <li>
                      <a href="/contact">
                        Our Support
                      </a>
                    </li>

                    <li>
                      <a href="/contact">
                        System Status
                      </a>
                    </li>

                    <li>
                      <a href="/contact">
                        Knowledge base
                      </a>
                    </li>

                    <li>
                      <a href="/news">
                        Blog &amp; News
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
                        <a href="mailto:support@kidza.com">
                          support@kidza.com
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
                        Location
                      </h3>

                      <p>
                        <a href="#">
                          Office: 2220 Plymouth R02 Road,
                          <br />
                          Hopkins, Minnesota (MN), UK
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