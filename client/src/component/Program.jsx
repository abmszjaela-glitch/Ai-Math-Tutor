import top1 from '../assets/img/program/top-1.png';
import top2 from '../assets/img/program/top-2.png';
import top3 from '../assets/img/program/top-3.png';
import top4 from '../assets/img/program/top-4.png';

import bottom1 from '../assets/img/program/bottom-1.png';
import bottom2 from '../assets/img/program/bottom-2.png';
import bottom3 from '../assets/img/program/bottom-3.png';
import bottom4 from '../assets/img/program/bottom-4.png';

import bookIcon from '../assets/img/program/book.png';
import phoneIcon from '../assets/img/program/phone.png';
import boyIcon from '../assets/img/program/boy.png';
import chemicalBookIcon from '../assets/img/program/camical-book.png';

const programs = [
  {
    title: 'Toddler',
    age: '(1,5 – 3 years)',
    description:
      'Dolor sit amet, adipiscing elit. Nibh ullamcorper felis arcu elementum.',
    topImage: top1,
    bottomImage: bottom1,
    icon: bookIcon,
    styleClass: 'style-2',
    delay: '.2s',
  },
  {
    title: 'Preschool',
    age: '(2 – 3 years)',
    description:
      'Dolor sit amet, adipiscing elit. Nibh ullamcorper felis arcu elementum.',
    topImage: top2,
    bottomImage: bottom2,
    icon: phoneIcon,
    styleClass: '',
    bgClass: 'bg-2',
    delay: '.4s',
  },
  {
    title: 'Kindergarten',
    age: '(3 – 4 years)',
    description:
      'Dolor sit amet, adipiscing elit. Nibh ullamcorper felis arcu elementum.',
    topImage: top3,
    bottomImage: bottom3,
    icon: boyIcon,
    styleClass: 'style-2',
    bgClass: 'bg-3',
    delay: '.6s',
  },
  {
    title: 'Pre-K Program',
    age: '(4 – 5 years)',
    description:
      'Dolor sit amet, adipiscing elit. Nibh ullamcorper felis arcu elementum.',
    topImage: top4,
    bottomImage: bottom4,
    icon: chemicalBookIcon,
    styleClass: '',
    bgClass: 'bg-4',
    delay: '.8s',
  },
];

const Program = () => {
  return (
    <section className="program-section section-padding pt-0 fix">
      <div className="container">

        <div className="row g-4">

          {programs.map((program, index) => (
            <div
              key={index}
              className="col-xl-3 col-lg-4 col-md-6 col-sm-6 wow fadeInUp"
              data-wow-delay={program.delay}
            >
              <div
                className={`program-box-item ${program.styleClass}`}
              >

                {/* Top Decoration */}
                <div className="top-bar">
                  <img
                    src={program.topImage}
                    alt="Program decoration"
                  />
                </div>

                {/* Bottom Decoration */}
                <div className="bottom-bar">
                  <img
                    src={program.bottomImage}
                    alt="Program decoration"
                  />
                </div>

                {/* Background */}
                <div
                  className={`program-bg ${program.bgClass || ''}`}
                ></div>

                {/* Program Icon */}
                <div className="program-icon">
                  <img
                    src={program.icon}
                    alt={`${program.title} icon`}
                  />
                </div>

                {/* Program Content */}
                <div className="program-content">

                  <h3>
                    {program.title}
                  </h3>

                  <span>
                    {program.age}
                  </span>

                  <p>
                    {program.description}
                  </p>

                  <a
                    href="/program-details"
                    className="link-btn"
                  >
                    Learn More
                    <i className="icon-arrow-icon"></i>
                  </a>

                </div>

              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default Program;