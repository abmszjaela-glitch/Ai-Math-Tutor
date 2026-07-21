import classes1 from '../assets/img/classes/classes1.jpg';
import classes2 from '../assets/img/classes/classes2.png';
import classes3 from '../assets/img/classes/classes3.jpg';

import perasute from '../assets/img/classes/perasute.png';
import crown from '../assets/img/classes/crown.png';
import star from '../assets/img/classes/star.png';
import zikzak from '../assets/img/classes/zikzak.png';
import border from '../assets/img/classes/border.png';

const classesData = [
  {
    image: classes1,
    date: 'Jan 16, 2024',
    title: 'Last Day of School end of Year Picnic',
    animation: 'fadeInRight',
    delay: '.5s',
    active: false,
  },
  {
    image: classes2,
    date: 'Jan 16, 2024',
    title: 'Spring Garden Exploration Week for Children',
    animation: 'fadeInUp',
    delay: '.1s',
    active: true,
  },
  {
    image: classes3,
    date: 'Jan 16, 2024',
    title: 'Color Day Creative Festival With Creative Design',
    animation: 'fadeInLeft',
    delay: '.5s',
    active: false,
  },
];

const Classes = () => {
  return (
    <section className="classes-section section-padding fix">

      {/* Decorative Shapes */}
      <div className="perasute-shape float-bob-y">
        <img src={perasute} alt="shape-img" />
      </div>

      <div className="crown-shape">
        <img src={crown} alt="shape-img" />
      </div>

      <div className="star-shape">
        <img src={star} alt="shape-img" />
      </div>

      <div className="zikzak-shape">
        <img src={zikzak} alt="shape-img" />
      </div>

      <div className="border-shape">
        <img src={border} alt="shape-img" />
      </div>

      <div className="container">

        {/* Section Title */}
        <div className="section-title text-center custom-padding-top">
          <span className="sub-title tittle-bg-2">
            Our Classes
          </span>

          <h2 className="char-animation text-white">
            Nurturing & Young Minds – with
            <br className="d-none d-lg-block" />
            Love & Learning
          </h2>
        </div>

        {/* Classes */}
        <div className="row">

          {classesData.map((item, index) => (
            <div
              key={index}
              className="col-xl-4 col-lg-6 col-md-6"
            >
              <div
                className={`classes-box-item ${
                  item.active ? 'active' : ''
                } wow ${item.animation}`}
                data-wow-delay={item.delay}
              >

                {/* Class Image */}
                <div className="classes-image">

                  <img
                    src={item.image}
                    alt="classes-image"
                  />

                  {/* Date */}
                  <div className="date-box">
                    <span>
                      <i className="far fa-calendar-alt"></i>
                      {item.date}
                    </span>
                  </div>

                </div>

                {/* Class Content */}
                <div className="classes-content">

                  {/* Location */}
                  <div className="location">
                    <span>
                      <i className="fa-solid fa-location-dot"></i>
                      6391 Elgin St. Celina, USA
                    </span>
                  </div>

                  {/* Title */}
                  <h3>
                    <a href="/program-details">
                      {item.title}
                    </a>
                  </h3>

                  {/* Bottom Area */}
                  <div className="classes-rate">

                    <a
                      href="/program-details"
                      className="theme-btn"
                    >
                      Get Ticket
                      <i className="icon-arrow-icon"></i>
                    </a>

                    {/* Rating */}
                    <div className="rate">

                      <p>
                        (10 Review)
                      </p>

                      <ul>
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

                  </div>

                </div>

              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default Classes;