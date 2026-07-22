import { motion } from 'framer-motion';

import perasuteShape from '../assets/img/contact/perasute.png';
import starShape from '../assets/img/contact/star.png';
import emojiShape from '../assets/img/contact/emoji.png';

import microphoneIcon from '../assets/img/contact/microphone.svg';
import locationIcon from '../assets/img/contact/location.svg';
import clockIcon from '../assets/img/contact/clock.svg';

const easeOut = [0.25, 0.1, 0.25, 1];

const floatY = {
  animate: { y: [0, -16, 0], transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' } },
};
const floatX = {
  animate: { x: [0, 14, 0], transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' } },
};

const titleContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};
const titleItem = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOut } },
};

const infoContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18, delayChildren: 0.2 } },
};
const infoItem = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: easeOut } },
};

const formContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
};
const fieldLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: easeOut } },
};
const fieldRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: easeOut } },
};
const fieldUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
};

const Contact = () => {
  return (
    <section className="contact-section section-padding">

      {/* Decorative Shapes */}
      <motion.div
        className="perasute-shape"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1, ease: easeOut }}
      >
        <motion.img src={perasuteShape} alt="Decorative shape" animate={floatY.animate} />
      </motion.div>

      <motion.div
        className="star-shape"
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, delay: 0.2, ease: easeOut }}
      >
        <motion.img
          src={starShape}
          alt="Star shape"
          animate={{ rotate: [0, 15, 0, -15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      <motion.div
        className="emoji-shape"
        initial={{ opacity: 0, scale: 0.6, rotate: -15 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, delay: 0.25, ease: easeOut }}
      >
        <motion.img src={emojiShape} alt="Emoji shape" animate={floatX.animate} />
      </motion.div>


      <div className="container">

        {/* Section Title */}
        <motion.div
          className="section-title-area custom-padding-top2"
          variants={titleContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >

          <div className="section-title">

            <motion.span className="sub-title" variants={titleItem}>
              We're Here to Help
            </motion.span>

            <motion.h2 className="text-white" variants={titleItem}>
              Get in Touch With Your Math Tutor Team
            </motion.h2>

          </div>

          <motion.p className="text-white" variants={titleItem}>
            Have a question about learning mathematics with our AI Math Tutor?
            <br />
            Our friendly support team is here to help students, parents, and teachers.
            <br />
            Send us a message and we'll be happy to assist you.
          </motion.p>

        </motion.div>


        {/* Contact Wrapper */}
        <div className="contact-wrapper">

          <div className="row g-4">

            {/* Contact Information */}
            <motion.div
              className="col-xl-4 col-lg-5 col-md-4"
              variants={infoContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >

              {/* Phone & Email */}
              <motion.div
                className="contact-info"
                variants={infoItem}
                whileHover={{ x: 6, transition: { duration: 0.25 } }}
              >
                <motion.div
                  className="icon"
                  whileHover={{ scale: 1.1, rotate: 8 }}
                  transition={{ duration: 0.3, ease: easeOut }}
                >
                  <img src={microphoneIcon} alt="Support contact icon" />
                </motion.div>

                <div className="content">

                  <h3>Contact Support:</h3>

                  <p>
                    <a href="tel:+61000000000" className="text-white d-block">
                      +61 000 000 000
                    </a>

                    <a href="mailto:support@aimathtutor.com" className="text-white">
                      support@aimathtutor.com
                    </a>
                  </p>

                </div>
              </motion.div>


              {/* Location */}
              <motion.div
                className="contact-info"
                variants={infoItem}
                whileHover={{ x: 6, transition: { duration: 0.25 } }}
              >
                <motion.div
                  className="icon"
                  whileHover={{ scale: 1.1, rotate: 8 }}
                  transition={{ duration: 0.3, ease: easeOut }}
                >
                  <img src={locationIcon} alt="Location icon" />
                </motion.div>

                <div className="content">

                  <h3>Our Location:</h3>

                  <p>
                    Supporting Australian students
                    <br />
                    from Grade 1 to Grade 6
                  </p>

                </div>
              </motion.div>


              {/* Working Time */}
              <motion.div
                className="contact-info"
                variants={infoItem}
                whileHover={{ x: 6, transition: { duration: 0.25 } }}
              >
                <motion.div
                  className="icon"
                  whileHover={{ scale: 1.1, rotate: 8 }}
                  transition={{ duration: 0.3, ease: easeOut }}
                >
                  <img src={clockIcon} alt="Support hours icon" />
                </motion.div>

                <div className="content">

                  <h3>Support Hours:</h3>

                  <p>
                    Mon - Fri: 8:00am - 6:00pm
                    <br />
                    Saturday - Sunday: 9:00am - 4:00pm
                  </p>

                </div>
              </motion.div>

            </motion.div>


            {/* Contact Form */}
            <div className="col-xl-8 col-lg-7 col-md-8">

              <div className="contact-from">

                <motion.h3
                  className="text-white mb-3"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, ease: easeOut }}
                >
                  Ask Our Math Tutor Team
                </motion.h3>

                <motion.form
                  className="contFrm"
                  variants={formContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.15 }}
                >

                  <div className="row">

                    {/* Name */}
                    <motion.div className="col-sm-6" variants={fieldLeft}>
                      <motion.input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        className="inptFld"
                        whileFocus={{ scale: 1.02, borderColor: '#ffcb00' }}
                        transition={{ duration: 0.25, ease: easeOut }}
                      />
                    </motion.div>


                    {/* Email */}
                    <motion.div className="col-sm-6" variants={fieldRight}>
                      <motion.input
                        type="email"
                        name="email"
                        placeholder="Parent or Student Email"
                        className="inptFld"
                        whileFocus={{ scale: 1.02, borderColor: '#ffcb00' }}
                        transition={{ duration: 0.25, ease: easeOut }}
                      />
                    </motion.div>


                    {/* Phone */}
                    <motion.div className="col-sm-6" variants={fieldLeft}>
                      <motion.input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        className="inptFld"
                        whileFocus={{ scale: 1.02, borderColor: '#ffcb00' }}
                        transition={{ duration: 0.25, ease: easeOut }}
                      />
                    </motion.div>


                    {/* Subject */}
                    <motion.div className="col-sm-6" variants={fieldRight}>
                      <motion.input
                        type="text"
                        name="subject"
                        placeholder="What Can We Help With?"
                        className="inptFld"
                        whileFocus={{ scale: 1.02, borderColor: '#ffcb00' }}
                        transition={{ duration: 0.25, ease: easeOut }}
                      />
                    </motion.div>


                    {/* Message */}
                    <motion.div className="col-sm-12" variants={fieldUp}>
                      <motion.textarea
                        name="message"
                        className="inptFld mb-0"
                        placeholder="Tell us how we can help you with your maths learning journey..."
                        whileFocus={{ scale: 1.01, borderColor: '#ffcb00' }}
                        transition={{ duration: 0.25, ease: easeOut }}
                      ></motion.textarea>
                    </motion.div>

                  </div>


                  {/* Submit Button */}
                  <motion.div className="contact-button" variants={fieldUp}>
                    <motion.button
                      type="submit"
                      className="theme-btn style-2"
                      whileHover={{ scale: 1.06, y: -3 }}
                      whileTap={{ scale: 0.94 }}
                      transition={{ duration: 0.3, ease: easeOut }}
                    >
                      Send Your Message
                      <i className="icon-arrow-icon"></i>
                    </motion.button>
                  </motion.div>

                </motion.form>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

export default Contact;