const Session = () => {
  return (
    <section className="session-section fix">
      <div className="container">
        <div className="session-wrapper zoom-effect-style">
          <div className="row g-4 align-items-center">

            {/* Left Content */}
            <div className="col-xl-6 col-lg-6">
              <div className="session-content">
                <div className="section-title">
                  <span
                    className="sub-title wow fadeInUp"
                  >
                    Session Times
                  </span>

                  <h2 className="char-animation">
                    Our{" "}
                    <span>
                      Session Times
                    </span>
                  </h2>
                </div>

                <p
                  className="wow fadeInUp"
                  data-wow-delay=".5s"
                >
                  Dolor sit amet, consectetur adipiscing elit.
                  Nibh <br /> ullamcorper felis arcu elementum.
                </p>
              </div>

              <span className="vertical-dashed"></span>
            </div>

            {/* Right Session Times */}
            <div className="col-xl-6 col-lg-6">

              <div
                className="session-box wow zoomInUp"
                data-wow-delay=".2s"
              >
                <h3>Early Drop Off</h3>
                <p>8.00am – 10.00am</p>
              </div>

              <div
                className="session-box wow zoomInUp"
                data-wow-delay=".4s"
              >
                <h3>Morning</h3>
                <p>10.30am – 12.00pm</p>
              </div>

              <div
                className="session-box wow zoomInUp"
                data-wow-delay=".6s"
              >
                <h3>Lunch</h3>
                <p>12.00pm – 1.00pm</p>
              </div>

              <div
                className="session-box wow zoomInUp"
                data-wow-delay=".7s"
              >
                <h3>Afternoon</h3>
                <p>2.00pm – 4.00pm</p>
              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Session;