import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';

import pencil from '../assets/img/testimonial/pencil.png';
import flower from '../assets/img/testimonial/follwer.png';
import border from '../assets/img/testimonial/border.png';
import client1 from '../assets/img/testimonial/client1.png';
import client2 from '../assets/img/testimonial/client2.png';
import client3 from '../assets/img/testimonial/client3.png';
import koma from '../assets/img/testimonial/koma.png';

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
      <div className="pencil-icon">
        <img
          src={pencil}
          alt="Math learning pencil"
        />
      </div>

      {/* Flower Shape */}
      <div className="flower-shape">
        <img
          src={flower}
          alt="Educational decoration"
        />
      </div>

      <div className="container">

        {/* Section Title */}
        <div className="section-title text-center">

          <span className="sub-title">
            What Our Learners Say
          </span>

          <h2>
            Loved by Students &amp; Parents
            <br />
            Across Australian Classrooms
          </h2>

        </div>

        {/* Testimonials */}
        <div className="testimonial-wrapper">

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

                <div className="testimonial-box-items">

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

                      <img
                        src={testimonial.image}
                        alt={`${testimonial.name} - ${testimonial.role}`}
                      />

                      {/* Stars */}
                      <ul className="icon">
                        <li>
                          <i className="fas fa-star"></i>
                        </li>
                        <li>
                          <i className="fas fa-star"></i>
                        </li>
                        <li>
                          <i className="fas fa-star"></i>
                        </li>
                        <li>
                          <i className="fas fa-star"></i>
                        </li>
                        <li>
                          <i className="fas fa-star"></i>
                        </li>
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
                    <div className="koma-icon">
                      <img
                        src={koma}
                        alt="Testimonial quote"
                      />
                    </div>

                  </div>

                </div>

              </SwiperSlide>

            ))}

          </Swiper>

          {/* Slider Buttons */}
          <div className="array-button">

            <button
              className="array-prev"
              aria-label="Previous testimonial"
            >
              <i className="fal fa-arrow-left"></i>
            </button>

            <button
              className="array-next"
              aria-label="Next testimonial"
            >
              <i className="fal fa-arrow-right"></i>
            </button>

          </div>

        </div>

      </div>

    </section>
  );
};

export default Testimonial;