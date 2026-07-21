import choose1 from '../assets/img/choose/choose1.png';
import choose2 from '../assets/img/choose/choose2.jpg';
import choose3 from '../assets/img/choose/choose3.png';

import perasute from '../assets/img/choose/perasute.png';
import butterfly from '../assets/img/choose/butarfly.png';
import zikzak from '../assets/img/choose/zikzak.png';
import counShape from '../assets/img/choose/coun-shape.png';

import bricksIcon from '../assets/img/choose/bricks-1.svg';

const ChooseUs = () => {
  return (
    <section className="choose-us-section section-padding fix">

      {/* Decorative Shapes */}

      <div className="perasute-shape float-bob-y">
        <img
          src={perasute}
          alt="shape-img"
        />
      </div>

      <div className="butterfly-shape float-bob-y">
        <img
          src={butterfly}
          alt="shape-img"
        />
      </div>

      <div className="zikzak-shape float-bob-x">
        <img
          src={zikzak}
          alt="shape-img"
        />
      </div>

      <div className="coun-shape float-bob-y">
        <img
          src={counShape}
          alt="shape-img"
        />
      </div>

      <div className="container">

        <div className="choose-us-wrapper">

          <div className="row g-4">

            {/* Left Images */}
            <div className="col-lg-6">

              <div className="choose-img-box">

                <img
                  className="style-2 img-custom-anim-left"
                  src={choose2}
                  alt="choose-image"
                />

                <img
                  className="img-custom-anim-bottom"
                  src={choose1}
                  alt="choose-image"
                />

                <div className="img-3">
                  <img
                    className="img-custom-anim-right"
                    src={choose3}
                    alt="choose-image"
                  />
                </div>

              </div>

            </div>

            {/* Right Content */}
            <div className="col-lg-6">

              <div className="choose-us-content">

                {/* Section Title */}
                <div className="section-title text-left">

                  <span
                    className="sub-title wow fadeInUp"
                    data-wow-delay=".3s"
                  >
                    Why Choose Us
                  </span>

                  <h2 className="char-animation">
                    Where Every
                    <span>
                      Little Step
                    </span>
                    <br />
                    Leads to Big Discoveries
                  </h2>

                </div>

                {/* Description */}
                <p
                  className="mt-3 mt-md-0 wow fadeInUp"
                  data-wow-delay=".5s"
                >
                  Dolor sit amet, consectetur adipiscing elit.
                  Nibh ullamcorper felis arcu elementum. Viverra
                  lectus nullam sagittis nunc imperdiet.
                </p>

                {/* Early Learning */}
                <div
                  className="icon-items wow fadeInUp"
                  data-wow-delay=".6s"
                >

                  <div className="icon">
                    <img
                      src={bricksIcon}
                      alt="Early Learning"
                    />
                  </div>

                  <div className="content">

                    <h3 className="mb-2">
                      Early Learning
                    </h3>

                    <p>
                      Kindergarten is an early childhood
                      educational environment where most young
                      children engage in foundational.
                    </p>

                  </div>

                </div>

                {/* Progress Bars */}
                <div
                  className="progress-wrap wow fadeInUp"
                  data-wow-delay=".7s"
                >

                  {/* Creativity */}
                  <div className="pro-items">

                    <div className="pro-head">

                      <h4 className="title">
                        Creativity
                      </h4>

                      <span className="point">
                        90%
                      </span>

                    </div>

                    <div className="ber-box">

                      <div className="progress">
                        <div
                          className="progress-value"
                          style={{ width: '90%' }}
                        ></div>
                      </div>

                    </div>

                  </div>

                  {/* Experiences */}
                  <div className="pro-items">

                    <div className="pro-head">

                      <h4 className="title">
                        Experiences
                      </h4>

                      <span className="point">
                        70%
                      </span>

                    </div>

                    <div className="ber-box style-2">

                      <div className="progress progress-2">

                        <div
                          className="progress-value style-two"
                          style={{ width: '70%' }}
                        ></div>

                      </div>

                    </div>

                  </div>

                </div>

                {/* Button */}
                <div
                  className="choose-button wow fadeInUp"
                  data-wow-delay=".9s"
                >

                  <a
                    href="/contact"
                    className="theme-btn"
                  >
                    Start Your Learning
                    <i className="icon-arrow-icon"></i>
                  </a>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

export default ChooseUs;