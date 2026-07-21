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
            Subscribe Now
          </span>

          <h2 className="char-animation">
            Sign up for our newsletter
          </h2>

          <p className="mt-4 wow fadeInUp">
            Keep up to date with the latest news and offers
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
              Subscribe Now

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
            alt="Newsletter"
          />
        </div>

      </div>

    </section>
  );
};

export default Newsletter;