import { useEffect } from 'react';
import graphicImage from '../assets/img/Login/graphic15.svg';
import logoImage from '../assets/img/logo/NUMORA.png';
import authStyles from '../assets/Hooks/Authstyles.js';

const Register = () => {

  // Inject the auth-page CSS only while this component is mounted,
  // and remove it again on unmount so it never leaks into other pages.
  useEffect(() => {
    const styleTag = document.createElement('style');
    styleTag.id = 'auth-inline-styles';
    styleTag.innerHTML = authStyles;
    document.head.appendChild(styleTag);

    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  return (
    <div className="form-body form-left">

      <div className="iofrm-layout flex min-h-screen w-full">

        {/* Left Image Section */}
        <div className="img-holder text-start w-1/2 flex items-center justify-center">

          <div className="bg"></div>

          <div className="info-holder flex items-center justify-center">
            <img
              src={graphicImage}
              alt="Register illustration"
              className="max-w-md w-full"
            />
          </div>

        </div>


        {/* Register Form Section */}
        <div className="form-holder w-1/2 flex items-center justify-center">

          <div className="form-content justify-content-end flex flex-col items-center">

            <div className="form-items">

              {/* Logo */}
              <div className="website-logo-inside logo-normal">

                <a href="/">
                  <div className="logo">

                    <img
                      src={logoImage}
                      alt="Logo"
                    />

                  </div>
                </a>

              </div>


              {/* Title */}
              <h3 className="font-md">
                Get more things done with Login platform.
              </h3>

              <p>
                Access to the most powerful tool in the entire
                design and web industry.
              </p>


              {/* Register Form */}
              <form>

                <input
                  className="form-control"
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  required
                />

                <input
                  className="form-control"
                  type="email"
                  name="email"
                  placeholder="E-mail Address"
                  required
                />

                <input
                  className="form-control"
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                />


                {/* Buttons */}
                <div className="form-button d-flex">

                  <button
                    id="submit"
                    type="submit"
                    className="btn btn-primary"
                  >
                    Register
                  </button>

                  <a
                    href="/login"
                    className="btn btn-outline-primary"
                  >
                    Login
                  </a>

                </div>

              </form>


              {/* Social Login */}
              <div className="other-links">

                <span>
                  Or login with
                </span>

                <a href="#">
                  <i className="fab fa-facebook-f"></i>
                </a>

                <a href="#">
                  <i className="fab fa-google"></i>
                </a>

                <a href="#">
                  <i className="fab fa-linkedin-in"></i>
                </a>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Register;