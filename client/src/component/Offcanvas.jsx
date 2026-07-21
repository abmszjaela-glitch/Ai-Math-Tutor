const Offcanvas = () => {
  return (
    <>
      <div className="fix-area">
        <div className="offcanvas__info">
          <div className="offcanvas__wrapper">
            <div className="offcanvas__content">

              {/* Top */}
              <div className="offcanvas__top mb-5 d-flex justify-content-between align-items-center">
                <div className="offcanvas__logo">
                  <a href="/">
                    <img
                      src="/assets/img/logo/black-logo.svg"
                      alt="logo"
                    />
                  </a>
                </div>

                <div className="offcanvas__close">
                  <button type="button">
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>

              {/* Content */}
              <h3 className="offcanvas-title">
                Hello There!
              </h3>

              <p>
                Lorem ipsum dolor sit amet consectetur
                adipisicing elit. Animi natus quasi sunt eum
                ducimus.
              </p>

              {/* Mobile Menu */}
              <div className="mobile-menu fix mt-3">
                <nav className="mean-nav">
                  <ul>

                    {/* Home */}
                    <li className="has-dropdown">
                      <a href="#">
                        Home
                        <i className="fas fa-chevron-down"></i>
                      </a>

                      <ul className="submenu">
                        <li>
                          <a href="/">Home 01</a>
                        </li>

                        <li>
                          <a href="/home-2">Home 02</a>
                        </li>

                        <li>
                          <a href="/home-3">Home 03</a>
                        </li>

                        <li>
                          <a href="/home-4">Home 04</a>
                        </li>
                      </ul>
                    </li>

                    {/* Pages */}
                    <li className="has-dropdown">
                      <a href="#">
                        Pages
                        <i className="fas fa-chevron-down"></i>
                      </a>

                      <ul className="submenu">

                        <li>
                          <a href="/about">
                            About Us
                          </a>
                        </li>

                        <li className="has-dropdown">
                          <a href="#">
                            Teachers
                            <i className="fas fa-angle-right"></i>
                          </a>

                          <ul className="submenu">
                            <li>
                              <a href="/team">
                                Our Teachers
                              </a>
                            </li>

                            <li>
                              <a href="/team-details">
                                Teacher Details
                              </a>
                            </li>
                          </ul>
                        </li>

                        <li className="has-dropdown">
                          <a href="#">
                            Event
                            <i className="fas fa-angle-right"></i>
                          </a>

                          <ul className="submenu">
                            <li>
                              <a href="/event">
                                Our Event
                              </a>
                            </li>

                            <li>
                              <a href="/event-details">
                                Event Details
                              </a>
                            </li>
                          </ul>
                        </li>

                        <li>
                          <a href="/pricing">
                            Pricing Plan
                          </a>
                        </li>

                        <li>
                          <a href="/testimonial">
                            Testimonials
                          </a>
                        </li>

                        <li>
                          <a href="/history">
                            Our History
                          </a>
                        </li>

                        <li>
                          <a href="/faq">
                            FAQs
                          </a>
                        </li>

                      </ul>
                    </li>

                    {/* Programs */}
                    <li className="has-dropdown">
                      <a href="#">
                        Programs
                        <i className="fas fa-chevron-down"></i>
                      </a>

                      <ul className="submenu">
                        <li>
                          <a href="/program">
                            Our Programs
                          </a>
                        </li>

                        <li>
                          <a href="/program-details">
                            Program Details
                          </a>
                        </li>
                      </ul>
                    </li>

                    {/* Blog */}
                    <li className="has-dropdown">
                      <a href="#">
                        Blog
                        <i className="fas fa-chevron-down"></i>
                      </a>

                      <ul className="submenu">
                        <li>
                          <a href="/blog">
                            Blog Grid
                          </a>
                        </li>

                        <li>
                          <a href="/blog-standard">
                            Blog Standard
                          </a>
                        </li>

                        <li>
                          <a href="/blog-details">
                            Blog Details
                          </a>
                        </li>
                      </ul>
                    </li>

                    {/* Shop */}
                    <li className="has-dropdown">
                      <a href="#">
                        Shop
                        <i className="fas fa-chevron-down"></i>
                      </a>

                      <ul className="submenu">
                        <li>
                          <a href="/shop">
                            Shop Page
                          </a>
                        </li>

                        <li>
                          <a href="/shop-details">
                            Shop Details
                          </a>
                        </li>

                        <li>
                          <a href="/shop-cart">
                            Shop Cart
                          </a>
                        </li>

                        <li>
                          <a href="/checkout">
                            Checkout
                          </a>
                        </li>
                      </ul>
                    </li>

                  </ul>
                </nav>
              </div>

              {/* Social Icons */}
              <div className="social-icon d-flex align-items-center">
                <a href="#">
                  <i className="fab fa-facebook-f"></i>
                </a>

                <a href="#">
                  <i className="fab fa-twitter"></i>
                </a>

                <a href="#">
                  <i className="fab fa-youtube"></i>
                </a>

                <a href="#">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>

              {/* Contact */}
              <div className="offcanvas__contact">
                <h3>Contact Us</h3>

                <ul className="contact-list">

                  <li>
                    <div className="icon">
                      <i className="far fa-phone-alt"></i>
                    </div>

                    <div className="content">
                      <p>Call Us</p>

                      <h4>
                        <a href="tel:+4903983493999">
                          +49 (03) 9834 939 99
                        </a>
                      </h4>
                    </div>
                  </li>

                  <li>
                    <div className="icon">
                      <i className="fal fa-envelope"></i>
                    </div>

                    <div className="content">
                      <p>Send Email</p>

                      <h4>
                        <a href="mailto:yordomain@gmail.com">
                          yordomain@gmail.com
                        </a>
                      </h4>
                    </div>
                  </li>

                  <li>
                    <div className="icon">
                      <i className="fal fa-map-marker-alt"></i>
                    </div>

                    <div className="content">
                      <p>Location</p>

                      <h4>
                        Chicago 53755 NY, USA
                      </h4>
                    </div>
                  </li>

                </ul>
              </div>

              {/* Button */}
              <a href="/contact" className="theme-btn">
                Start Learning
                <i className="icon-arrow-icon"></i>
              </a>

            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      <div className="offcanvas__overlay"></div>
    </>
  );
};

export default Offcanvas;