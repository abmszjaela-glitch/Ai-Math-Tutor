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
              We're Here to Help
            </span>

            <h2 className="char-animation text-white">
              Get in Touch With Your Math Tutor Team
            </h2>

          </div>

          <p
            className="text-white wow fadeInUp"
            data-wow-delay=".4s"
          >
            Have a question about learning mathematics with our AI Math Tutor?
            <br />
            Our friendly support team is here to help students, parents, and teachers.
            <br />
            Send us a message and we'll be happy to assist you.
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
                    alt="Support contact icon"
                  />
                </div>

                <div className="content">

                  <h3>
                    Contact Support:
                  </h3>

                  <p>
                    <a
                      href="tel:+61000000000"
                      className="text-white d-block"
                    >
                      +61 000 000 000
                    </a>

                    <a
                      href="mailto:support@aimathtutor.com"
                      className="text-white"
                    >
                      support@aimathtutor.com
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
                    Supporting Australian students
                    <br />
                    from Grade 1 to Grade 6
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
                    alt="Support hours icon"
                  />
                </div>

                <div className="content">

                  <h3>
                    Support Hours:
                  </h3>

                  <p>
                    Mon - Fri: 8:00am - 6:00pm
                    <br />
                    Saturday - Sunday: 9:00am - 4:00pm
                  </p>

                </div>
              </div>

            </div>


            {/* Contact Form */}
            <div className="col-xl-8 col-lg-7 col-md-8">

              <div className="contact-from">

                <h3 className="text-white mb-3">
                  Ask Our Math Tutor Team
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
                        placeholder="Parent or Student Email"
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
                        placeholder="What Can We Help With?"
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
                        placeholder="Tell us how we can help you with your maths learning journey..."
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