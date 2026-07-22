import { motion } from 'framer-motion';

const easeOut = [0.25, 0.1, 0.25, 1];

const titleContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};
const titleItem = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOut } },
};

const boxContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};

const zoomInUp = {
  hidden: { opacity: 0, y: 40, scale: 0.85 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.65, ease: easeOut },
  },
};

const sessions = [
  { title: 'Quick Practice', duration: '10–15 minutes' },
  { title: 'Daily Maths', duration: '20–30 minutes' },
  { title: 'Focused Learning', duration: '30–45 minutes' },
  { title: 'Challenge Time', duration: '45+ minutes' },
];

const Session = () => {
  return (
    <section className="session-section fix">
      <div className="container">
        <div className="session-wrapper zoom-effect-style">
          <div className="row g-4 align-items-center">

            {/* Left Content */}
            <div className="col-xl-6 col-lg-6">
              <motion.div
                className="session-content"
                variants={titleContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
              >
                <div className="section-title">
                  <motion.span className="sub-title" variants={titleItem}>
                    Learning Sessions
                  </motion.span>

                  <motion.h2 variants={titleItem}>
                    Learn Maths{" "}
                    <span>
                      Your Way
                    </span>
                  </motion.h2>
                </div>

                <motion.p variants={titleItem}>
                  Get personalised maths support with your friendly AI tutor.
                  <br />
                  Learn, practise, and improve at your own pace.
                </motion.p>
              </motion.div>

              <motion.span
                className="vertical-dashed"
                initial={{ scaleY: 0, opacity: 0 }}
                whileInView={{ scaleY: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1, delay: 0.4, ease: easeOut }}
                style={{ transformOrigin: 'top' }}
              ></motion.span>
            </div>

            {/* Right Learning Sessions */}
            <motion.div
              className="col-xl-6 col-lg-6"
              variants={boxContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >

              {sessions.map((session, index) => (
                <motion.div
                  key={index}
                  className="session-box"
                  variants={zoomInUp}
                  whileHover={{
                    scale: 1.04,
                    y: -6,
                    boxShadow: '0 15px 30px rgba(0,0,0,0.1)',
                    transition: { duration: 0.3, ease: easeOut },
                  }}
                >
                  <h3>{session.title}</h3>
                  <p>{session.duration}</p>
                </motion.div>
              ))}

            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Session;