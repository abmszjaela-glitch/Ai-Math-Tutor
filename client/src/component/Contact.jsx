import perasuteShape from '../assets/img/contact/perasute.png';
import starShape from '../assets/img/contact/star.png';
import emojiShape from '../assets/img/contact/emoji.png';

import microphoneIcon from '../assets/img/contact/microphone.svg';
import locationIcon from '../assets/img/contact/location.svg';
import clockIcon from '../assets/img/contact/clock.svg';

const Contact = () => {
  return (
    <section className="contact-section section-padding">

      {/* Decorative Shapes */}
      <div className="perasute-shape float-bob-y">
        <img
          src={perasuteShape}
          alt="Decorative shape"
        />
      </div>

      <div className="star-shape">
        <img
          src={starShape}
          alt="Star shape"
        />
      </div>

      <div className="emoji-shape float-bob-x">
        <img
          src={emojiShape}
          alt="Emoji shape"
        />
      </div>


      <div className="container">

        {/* Section Title */}
        <div className="section-title-area custom-padding-top2">

          <div className="section-title">

            <span
              className="sub-title wow fadeInUp"
              data-wow-delay=".3s"
            >
              Quick Contact
            </span>

            <h2 className="char-animation text-white">
              Quick Contact With Us
            </h2>

          </div>

          <p
            className="text-white wow fadeInUp"
            data-wow-delay=".4s"
          >
            Dolor sit amet, consectetur adipiscing elit.
            Nibh ullamcorper as <br />
            felis arcu elementum viverra lectus nullam.
            Dolor sit amet, <br />
            consectetur adipiscing elit. Nibh ullamcorper.
          </p>

        </div>


        {/* Contact Wrapper */}
        <div className="contact-wrapper">

          <div className="row g-4">

            {/* Contact Information */}
            <div className="col-xl-4 col-lg-5 col-md-4">

              {/* Phone & Email */}
              <div
                className="contact-info wow fadeInLeft"
                data-wow-delay=".3s"
              >
                <div className="icon">
                  <img
                    src={microphoneIcon}
                    alt="Contact icon"
                  />
                </div>

                <div className="content">

                  <h3>
                    Contact us:
                  </h3>

                  <p>
                    <a
                      href="tel:+483939993900"
                      className="text-white d-block"
                    >
                      +483 9399 939 00
                    </a>

                    <a
                      href="mailto:helloflybed@gmail.com"
                      className="text-white"
                    >
                      helloflybed@gmail.com
                    </a>
                  </p>

                </div>
              </div>


              {/* Location */}
              <div
                className="contact-info wow fadeInLeft"
                data-wow-delay=".5s"
              >
                <div className="icon">
                  <img
                    src={locationIcon}
                    alt="Location icon"
                  />
                </div>

                <div className="content">

                  <h3>
                    Our Location:
                  </h3>

                  <p>
                    2220 Plymouth Rd #302,
                    <br />
                    Hopkins, New York, USA
                  </p>

                </div>
              </div>


              {/* Working Time */}
              <div
                className="contact-info wow fadeInLeft"
                data-wow-delay=".7s"
              >
                <div className="icon">
                  <img
                    src={clockIcon}
                    alt="Clock icon"
                  />
                </div>

                <div className="content">

                  <h3>
                    Working Time:
                  </h3>

                  <p>
                    Mon - Fri: 8:00am - 6.00pm
                    <br />
                    Sunday: Closed
                  </p>

                </div>
              </div>

            </div>


            {/* Contact Form */}
            <div className="col-xl-8 col-lg-7 col-md-8">

              <div className="contact-from">

                <h3 className="text-white mb-3">
                  Send Your Message
                </h3>

                <form className="contFrm">

                  <div className="row">

                    {/* Name */}
                    <div
                      className="col-sm-6 wow fadeInLeft"
                      data-wow-delay=".3s"
                    >
                      <input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        className="inptFld"
                      />
                    </div>


                    {/* Email */}
                    <div
                      className="col-sm-6 wow fadeInRight"
                      data-wow-delay=".3s"
                    >
                      <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        className="inptFld"
                      />
                    </div>


                    {/* Phone */}
                    <div
                      className="col-sm-6 wow fadeInLeft"
                      data-wow-delay=".5s"
                    >
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        className="inptFld"
                      />
                    </div>


                    {/* Subject */}
                    <div
                      className="col-sm-6 wow fadeInRight"
                      data-wow-delay=".5s"
                    >
                      <input
                        type="text"
                        name="subject"
                        placeholder="Subject"
                        className="inptFld"
                      />
                    </div>


                    {/* Message */}
                    <div
                      className="col-sm-12 wow fadeInUp"
                      data-wow-delay=".5s"
                    >
                      <textarea
                        name="message"
                        className="inptFld mb-0"
                        placeholder="Your Message..."
                      ></textarea>
                    </div>

                  </div>


                  {/* Submit Button */}
                  <div
                    className="contact-button wow fadeInUp"
                    data-wow-delay=".7s"
                  >
                    <button
                      type="submit"
                      className="theme-btn style-2"
                    >
                      Send Your Message
                      <i className="icon-arrow-icon"></i>
                    </button>
                  </div>

                </form>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

export default Contact;