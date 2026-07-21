import flower from '../assets/img/team/flower.png';

import team1 from '../assets/img/team/team1.png';
import team2 from '../assets/img/team/team2.png';
import team3 from '../assets/img/team/team3.png';

const teachers = [
  {
    name: 'John Smith',
    role: 'Online Teacher',
    image: team1,
    animation: 'fadeInRight',
    delay: '.5s',
  },
  {
    name: 'David William',
    role: 'Online Teacher',
    image: team2,
    animation: 'fadeInUp',
    delay: '.1s',
  },
  {
    name: 'Sarah William',
    role: 'Online Teacher',
    image: team3,
    animation: 'fadeInLeft',
    delay: '.5s',
  },
];

const Team = () => {
  return (
    <section className="team-section section-padding pt-0 fix">
      <div className="container">

        {/* Decorative Flower */}
        <div className="flower-shape">
          <img
            src={flower}
            alt="flower-shape"
          />
        </div>

        {/* Section Title */}
        <div className="section-title-area text-center text-lg-start">

          <div className="section-title">

            <span className="sub-title">
              Our Teacher
            </span>

            <h2 className="char-animation">
              Meet With <span>Our Teacher</span>
            </h2>

          </div>

          <p
            className="wow fadeInLeft"
            data-wow-delay=".5s"
          >
            Dolor sit amet, consectetur adipiscing elit. Nibh
            ullamcorper as <br />
            felis arcu elementum viverra lectus nullam.
          </p>

        </div>

        {/* Teachers */}
        <div className="row text-center">

          {teachers.map((teacher, index) => (
            <div
              key={index}
              className="col-lg-4 col-md-6 col-sm-6 wow"
              data-wow-delay={teacher.delay}
            >

              <div
                className={`team-card-item ${teacher.animation}`}
              >

                {/* Teacher Image */}
                <div className="team-image">
                  <img
                    src={teacher.image}
                    alt={teacher.name}
                  />
                </div>

                {/* Teacher Details */}
                <div className="team-content">

                  <h3>
                    <a href="/team-details">
                      {teacher.name}
                    </a>
                  </h3>

                  <p>
                    {teacher.role}
                  </p>

                </div>

              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default Team;