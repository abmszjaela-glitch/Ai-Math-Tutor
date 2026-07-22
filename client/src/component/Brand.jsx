import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';

import 'swiper/css';

import brand01 from '../assets/img/brand/brand-01.png';
import brand02 from '../assets/img/brand/brand-02.png';
import brand03 from '../assets/img/brand/brand-03.png';
import brand04 from '../assets/img/brand/brand-04.png';
import brand05 from '../assets/img/brand/brand-05.png';
import brand06 from '../assets/img/brand/brand-06.png';

const brands = [
  brand01,
  brand02,
  brand03,
  brand04,
  brand05,
  brand06,
];

const easeOut = [0.25, 0.1, 0.25, 1];

const Brand = () => {
  return (
    <section className="brand-section section-padding fix">
      <div className="container">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: easeOut }}
        >

          <Swiper
            modules={[Autoplay]}
            loop={true}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
            }}
            speed={4000}
            spaceBetween={90}
            slidesPerView={1}
            breakpoints={{
              576: {
                slidesPerView: 2,
              },
              768: {
                slidesPerView: 3,
              },
              992: {
                slidesPerView: 4,
              },
              1200: {
                slidesPerView: 5,
              },
              1400: {
                slidesPerView: 6,
              },
            }}
            className="brand-slider"
          >
            {brands.map((brand, index) => (
              <SwiperSlide key={index}>
                <motion.div
                  className="brand-image"
                  initial={{ opacity: 0.6, filter: 'grayscale(100%)' }}
                  whileHover={{
                    opacity: 1,
                    filter: 'grayscale(0%)',
                    scale: 1.08,
                  }}
                  transition={{ duration: 0.35, ease: easeOut }}
                >
                  <img
                    src={brand}
                    alt={`Brand ${index + 1}`}
                  />
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

        </motion.div>

      </div>
    </section>
  );
};

export default Brand;