import flower from '../assets/img/team/flower.png';

import team1 from '../assets/img/team/kanga.jpeg';
import team2 from '../assets/img/team/panda.png';

const teachers = [
  {
    name: 'Kanga',
    role: 'Friendly AI Math Tutor',
    image: team1,
    animation: 'fadeInRight',
    delay: '.5s',
  },
  {
    name: 'Pandy',
    role: 'Friendly AI Math Tutor',
    image: team2,
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
            alt="decorative-shape"
          />
        </div>

        {/* Section Title */}
        <div className="section-title-area text-center text-lg-start">

          <div className="section-title">

            <span className="sub-title">
              Meet Your AI Math Tutors
            </span>

            <h2 className="char-animation">
              Learn Maths With Your <span>AI Tutor Friends</span>
            </h2>

          </div>

          <p
            className="wow fadeInLeft"
            data-wow-delay=".5s"
          >
            Meet Kanga and Pandy, your friendly AI math tutor friends.
            They are here to help Australian students learn mathematics
            through fun explanations, guided practice, and problem-solving.
          </p>

        </div>

        {/* AI Math Tutors */}
        <div className="row text-center justify-content-center">

          {teachers.map((teacher, index) => (
            <div
              key={index}
              className="col-lg-4 col-md-6 col-sm-6 wow"
              data-wow-delay={teacher.delay}
            >

              <div
                className={`team-card-item ${teacher.animation}`}
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
                  <img
                    src={teacher.image}
                    alt={`${teacher.name} - AI Math Tutor`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      objectPosition: 'center',
                    }}
                  />
                </div>

                {/* AI Tutor Details */}
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