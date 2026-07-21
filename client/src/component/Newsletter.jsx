import newsletterImage from '../assets/img/newsletter/newsletter1.png';

const Newsletter = () => {
  const handleSubmit = (e) => {
    e.preventDefault();

    const email = e.target.email.value;

    console.log('Subscribed Email:', email);

    // මෙතනට පස්සේ API එක connect කරන්න පුළුවන්
  };

  return (
    <section className="newsletter-section section-padding pt-0 fix">

      <div className="container">

        {/* Section Title */}
        <div className="section-title text-center">

          <span
            className="sub-title wow fadeInUp"
            data-wow-delay=".3s"
          >
            Learn Smarter with AI
          </span>

          <h2 className="char-animation">
            Get the Latest Math Learning Tips
          </h2>

          <p className="mt-4 wow fadeInUp">
            Join our learning community and receive helpful mathematics
            tips, fun learning activities, and updates designed for
            Australian Grade 1–6 students.
          </p>

        </div>


        {/* Newsletter Form */}
        <div className="signUp-box mt-4 mt-md-0">

          <form onSubmit={handleSubmit}>

            <div
              className="input-wrapper wow fadeInLeft"
              data-wow-delay=".5s"
            >

              <input
                type="email"
                id="emailInput"
                name="email"
                placeholder="Enter your email address"
                required
              />

              <i className="far fa-house house-icon"></i>

            </div>


            <button
              type="submit"
              className="theme-btn wow fadeInRight"
              data-wow-delay=".5s"
            >
              Join Our Learning Community

              <i className="icon-arrow-icon"></i>

            </button>

          </form>

        </div>


        {/* Newsletter Image */}
        <div
          className="newsletter-image wow fadeInUp"
          data-wow-delay=".5s"
        >
          <img
            src={newsletterImage}
            alt="AI Math Tutor learning mathematics"
          />
        </div>

      </div>

    </section>
  );
};

export default Newsletter;