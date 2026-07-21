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
                    Learning Sessions
                  </span>

                  <h2 className="char-animation">
                    Learn Maths{" "}
                    <span>
                      Your Way
                    </span>
                  </h2>
                </div>

                <p
                  className="wow fadeInUp"
                  data-wow-delay=".5s"
                >
                  Get personalised maths support with your friendly AI tutor.
                  <br />
                  Learn, practise, and improve at your own pace.
                </p>
              </div>

              <span className="vertical-dashed"></span>
            </div>

            {/* Right Learning Sessions */}
            <div className="col-xl-6 col-lg-6">

              <div
                className="session-box wow zoomInUp"
                data-wow-delay=".2s"
              >
                <h3>Quick Practice</h3>
                <p>10–15 minutes</p>
              </div>

              <div
                className="session-box wow zoomInUp"
                data-wow-delay=".4s"
              >
                <h3>Daily Maths</h3>
                <p>20–30 minutes</p>
              </div>

              <div
                className="session-box wow zoomInUp"
                data-wow-delay=".6s"
              >
                <h3>Focused Learning</h3>
                <p>30–45 minutes</p>
              </div>

              <div
                className="session-box wow zoomInUp"
                data-wow-delay=".7s"
              >
                <h3>Challenge Time</h3>
                <p>45+ minutes</p>
              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Session;