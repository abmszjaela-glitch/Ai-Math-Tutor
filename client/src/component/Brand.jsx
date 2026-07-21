import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

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

const Brand = () => {
  return (
    <section className="brand-section section-padding fix">
      <div className="container">

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
            <SwiperSlide
              key={index}
              className="wow fadeInUp"
              data-wow-delay={`.${index + 2}s`}
            >
              <div className="brand-image">
                <img
                  src={brand}
                  alt={`Brand ${index + 1}`}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

      </div>
    </section>
  );
};

export default Brand;