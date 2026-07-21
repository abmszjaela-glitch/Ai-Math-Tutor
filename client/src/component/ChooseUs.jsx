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
                  alt="AI Math Tutor helping a Grade 6 student learn mathematics"
                />

                <img
                  className="img-custom-anim-bottom"
                  src={choose1}
                  alt="Interactive mathematics learning for Australian students"
                />

                <div className="img-3">
                  <img
                    className="img-custom-anim-right"
                    src={choose3}
                    alt="Friendly AI tutor character for mathematics learning"
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
                    Why Choose Our AI Math Tutor
                  </span>

                  <h2 className="char-animation">
                    Learn Maths
                    <span>
                      Your Way
                    </span>
                    <br />
                    With Your AI Tutor
                  </h2>

                </div>

                {/* Description */}
                <p
                  className="mt-3 mt-md-0 wow fadeInUp"
                  data-wow-delay=".5s"
                >
                  Make mathematics easier and more enjoyable with a friendly
                  AI tutor designed for Australian Grade 6 students. Learn
                  step by step, practise important maths skills, and get
                  helpful guidance whenever you need it.
                </p>

                {/* AI-Powered Learning */}
                <div
                  className="icon-items wow fadeInUp"
                  data-wow-delay=".6s"
                >

                  <div className="icon">
                    <img
                      src={bricksIcon}
                      alt="AI-powered mathematics learning"
                    />
                  </div>

                  <div className="content">

                    <h3 className="mb-2">
                      Learn With Your AI Tutor
                    </h3>

                    <p>
                      Get friendly, step-by-step support from AI tutor
                      characters that help you understand mathematical
                      concepts, solve problems, practise your skills, and
                      build confidence in learning.
                    </p>

                  </div>

                </div>

                {/* Progress Bars */}
                <div
                  className="progress-wrap wow fadeInUp"
                  data-wow-delay=".7s"
                >

                  {/* Problem Solving */}
                  <div className="pro-items">

                    <div className="pro-head">

                      <h4 className="title">
                        Problem Solving
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

                  {/* Maths Confidence */}
                  <div className="pro-items">

                    <div className="pro-head">

                      <h4 className="title">
                        Maths Confidence
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
                    Start Learning Maths
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