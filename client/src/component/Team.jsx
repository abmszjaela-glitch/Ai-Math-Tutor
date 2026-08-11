import { motion } from 'framer-motion';

import flower from '../assets/img/team/flower.png';

import team1 from '../assets/img/team/kanga.jpeg';
import team2 from '../assets/img/team/panda.png';
import team3 from '../assets/img/team/Koala3.png';

const easeOut = [0.25, 0.1, 0.25, 1];

const floatY = {
  animate: { y: [0, -16, 0], transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' } },
};

const directionVariants = {
  fadeInRight: { hidden: { opacity: 0, x: 70 }, visible: { opacity: 1, x: 0 } },
  fadeInLeft: { hidden: { opacity: 0, x: -70 }, visible: { opacity: 1, x: 0 } },
};

const titleContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};
const titleItem = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOut } },
};

const teachers = [
  {
    name: 'Kanga',
    role: 'Friendly AI Math Tutor',
    image: team1,
    animation: 'fadeInRight',
    delay: 0.2,
  },
  {
    name: 'Pandy',
    role: 'Friendly AI Math Tutor',
    image: team2,
    animation: 'fadeInLeft',
    delay: 0.35,
  },
  {
    name: 'Koala',
    role: 'Friendly AI Math Tutor',
    image: team3,
    animation: 'fadeInLeft',
    delay: 0.35,
  },

];

const Team = () => {
  return (
    <section className="team-section section-padding pt-0 fix">
      <div className="container">

        {/* Decorative Flower */}
        <motion.div
          className="flower-shape"
          initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: easeOut }}
        >
          <motion.img
            src={flower}
            alt="decorative-shape"
            animate={floatY.animate}
          />
        </motion.div>

        {/* Section Title */}
        <motion.div
          className="section-title-area text-center text-lg-start"
          variants={titleContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >

          <div className="section-title">

            <motion.span className="sub-title" variants={titleItem}>
              Meet Your AI Math Tutors
            </motion.span>

            <motion.h2 variants={titleItem}>
              Learn Maths With Your <span>AI Tutor Friends</span>
            </motion.h2>

          </div>

          <motion.p variants={titleItem}>
            Meet Kanga and Pandy, your friendly AI math tutor friends.
            They are here to help Australian students learn mathematics
            through fun explanations, guided practice, and problem-solving.
          </motion.p>

        </motion.div>

        {/* AI Math Tutors */}
        <div className="row text-center justify-content-center">

          {teachers.map((teacher, index) => (
            <div
              key={index}
              className="col-lg-4 col-md-6 col-sm-6"
            >

              <motion.div
                className="team-card-item"
                variants={directionVariants[teacher.animation]}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.8, delay: teacher.delay, ease: easeOut }}
                whileHover={{
                  y: -12,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                  transition: { duration: 0.35, ease: easeOut },
                }}
              >

                {/* AI Tutor Character Image */}
                <div
                  className="team-image"
                  style={{
                    width: '100%',
                    height: '300px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}
                >
                  <motion.img
                    src={teacher.image}
                    alt={`${teacher.name} - AI Math Tutor`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      objectPosition: 'center',
                    }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5, ease: easeOut }}
                  />
                </div>

                {/* AI Tutor Details */}
                <motion.div
                  className="team-content"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5, delay: teacher.delay + 0.3 }}
                >

                  <h3>
                    <a href="/team-details">
                      {teacher.name}
                    </a>
                  </h3>

                  <p>
                    {teacher.role}
                  </p>

                </motion.div>

              </motion.div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default Team;