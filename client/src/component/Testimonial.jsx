import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';

import 'swiper/css';
import 'swiper/css/navigation';

import pencil from '../assets/img/testimonial/pencil.png';
import flower from '../assets/img/testimonial/follwer.png';
import border from '../assets/img/testimonial/border.png';
import client1 from '../assets/img/testimonial/client1.png';
import client2 from '../assets/img/testimonial/client2.png';
import client3 from '../assets/img/testimonial/client3.png';
import koma from '../assets/img/testimonial/koma.png';

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

const testimonials = [
  {
    name: 'Emily Johnson',
    role: 'Grade 6 Student',
    image: client1,
    text: 'My AI Math Tutor makes maths much easier to understand. I can ask questions whenever I get stuck, and the AI explains each step in a simple way.',
  },
  {
    name: 'Michael Williams',
    role: 'Parent of a Grade 6 Student',
    image: client2,
    text: 'The AI Math Tutor has helped my child become more confident with mathematics. The interactive lessons make learning maths more enjoyable and engaging.',
  },
  {
    name: 'Sarah Taylor',
    role: 'Parent of a Grade 5 Student',
    image: client3,
    text: 'My daughter enjoys learning maths with her friendly AI tutor. She can practise topics at her own pace and get instant help when she needs it.',
  },
];

const Testimonial = () => {
  return (
    <section className="testimonial-section section-padding fix pb-0">

      {/* Pencil Shape */}
      <motion.div
        className="pencil-icon"
        initial={{ opacity: 0, y: -30, rotate: -15 }}
        whileInView={{ opacity: 1, y: 0, rotate: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease: easeOut }}
      >
        <motion.img src={pencil} alt="Math learning pencil" animate={floatY.animate} />
      </motion.div>

      {/* Flower Shape */}
      <motion.div
        className="flower-shape"
        initial={{ opacity: 0, scale: 0.6 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, delay: 0.15, ease: easeOut }}
      >
        <motion.img src={flower} alt="Educational decoration" animate={floatX.animate} />
      </motion.div>

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
            What Our Learners Say
          </motion.span>

          <motion.h2 variants={titleItem}>
            Loved by Students &amp; Parents
            <br />
            Across Australian Classrooms
          </motion.h2>

        </motion.div>

        {/* Testimonials */}
        <motion.div
          className="testimonial-wrapper"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8, delay: 0.2, ease: easeOut }}
        >

          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={10}
            slidesPerView={3}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            navigation={{
              nextEl: '.array-next',
              prevEl: '.array-prev',
            }}
            breakpoints={{
              0: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
              1200: {
                slidesPerView: 3,
              },
            }}
            className="testimonial-slider"
          >

            {testimonials.map((testimonial, index) => (

              <SwiperSlide key={index}>

                <motion.div
                  className="testimonial-box-items"
                  whileHover={{ y: -10 }}
                  transition={{ duration: 0.35, ease: easeOut }}
                >

                  {/* Border */}
                  <div className="item-border">
                    <img
                      src={border}
                      alt="Decorative border"
                    />
                  </div>

                  <div className="testimonial-item">

                    {/* Client Image */}
                    <div className="client-image">

                      <motion.img
                        src={testimonial.image}
                        alt={`${testimonial.name} - ${testimonial.role}`}
                        whileHover={{ scale: 1.08 }}
                        transition={{ duration: 0.4, ease: easeOut }}
                      />

                      {/* Stars */}
                      <ul className="icon">
                        {[...Array(5)].map((_, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, scale: 0 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.3, delay: i * 0.08, ease: easeOut }}
                          >
                            <i className="fas fa-star"></i>
                          </motion.li>
                        ))}
                      </ul>

                    </div>

                    {/* Testimonial */}
                    <p className="testi-text">
                      “{testimonial.text}”
                    </p>

                    {/* Client Info */}
                    <div className="client-info">

                      <h3>
                        {testimonial.name}
                      </h3>

                      <p>
                        {testimonial.role}
                      </p>

                    </div>

                    {/* Quote Icon */}
                    <motion.div
                      className="koma-icon"
                      animate={{ rotate: [0, 8, 0, -8, 0] }}
                      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <img
                        src={koma}
                        alt="Testimonial quote"
                      />
                    </motion.div>

                  </div>

                </motion.div>

              </SwiperSlide>

            ))}

          </Swiper>

          {/* Slider Buttons */}
          <div className="array-button">

            <motion.button
              className="array-prev"
              aria-label="Previous testimonial"
              whileHover={{ scale: 1.15, x: -3 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.25, ease: easeOut }}
            >
              <i className="fal fa-arrow-left"></i>
            </motion.button>

            <motion.button
              className="array-next"
              aria-label="Next testimonial"
              whileHover={{ scale: 1.15, x: 3 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.25, ease: easeOut }}
            >
              <i className="fal fa-arrow-right"></i>
            </motion.button>

          </div>

        </motion.div>

      </div>

    </section>
  );
};

export default Testimonial;