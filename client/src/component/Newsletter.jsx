import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import newsletterImage from '../assets/img/newsletter/newsletter1.png';

const easeOut = [0.25, 0.1, 0.25, 1];

const titleContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};
const titleItem = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOut } },
};

const Newsletter = () => {
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    console.log('Subscribed Email:', email);

    setSubscribed(true);
    e.target.reset();

    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <section className="newsletter-section section-padding pt-0 fix">

      <div className="container">

        {/* Section Title */}
        <motion.div
          className="section-title text-center"
          variants={titleContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >

          <motion.span className="sub-title" variants={titleItem}>
            Learn Smarter with AI
          </motion.span>

          <motion.h2 variants={titleItem}>
            Get the Latest Math Learning Tips
          </motion.h2>

          <motion.p className="mt-4" variants={titleItem}>
            Join our learning community and receive helpful mathematics
            tips, fun learning activities, and updates designed for
            Australian Grade 1–6 students.
          </motion.p>

        </motion.div>


        {/* Newsletter Form */}
        <div className="signUp-box mt-4 mt-md-0">

          <AnimatePresence mode="wait">
            {!subscribed ? (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: easeOut }}
              >

                <motion.div
                  className="input-wrapper"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.7, delay: 0.2, ease: easeOut }}
                >

                  <motion.input
                    type="email"
                    id="emailInput"
                    name="email"
                    placeholder="Enter your email address"
                    required
                    whileFocus={{ scale: 1.02, borderColor: '#ffcb00' }}
                    transition={{ duration: 0.25, ease: easeOut }}
                  />

                  <i className="far fa-house house-icon"></i>

                </motion.div>


                <motion.button
                  type="submit"
                  className="theme-btn"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.7, delay: 0.35, ease: easeOut }}
                  whileHover={{ scale: 1.06, y: -3 }}
                  whileTap={{ scale: 0.96 }}
                >
                  Join Our Learning Community
                  <i className="icon-arrow-icon"></i>
                </motion.button>

              </motion.form>
            ) : (
              <motion.div
                key="success"
                className="newsletter-success"
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, ease: easeOut }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  padding: '20px',
                }}
              >
                <motion.div
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.5, delay: 0.15, ease: easeOut }}
                >
                  <CheckCircle size={24} color="#2ecc71" />
                </motion.div>
                You're subscribed! Welcome to our learning community.
              </motion.div>
            )}
          </AnimatePresence>

        </div>


        {/* Newsletter Image */}
        <motion.div
          className="newsletter-image"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, delay: 0.2, ease: easeOut }}
        >
          <motion.img
            src={newsletterImage}
            alt="AI Math Tutor learning mathematics"
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

      </div>

    </section>
  );
};

export default Newsletter;