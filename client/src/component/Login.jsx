import { useEffect } from 'react';
import graphicImage from '../assets/img/Login/graphic15.svg';
import logoImage from '../assets/img/logo/NUMORA.png';
import authStyles from '../assets/Hooks/Authstyles.js';

import { FaFacebookF, FaGoogle, FaLinkedinIn } from "react-icons/fa";
const Login = () => {

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
              alt="Login illustration"
              className="max-w-md w-full"
            />
          </div>

        </div>


        {/* Login Form Section */}
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


             {/* Login Page Title */}
<h3 className="font-md">
  Welcome Back to Your AI Math Tutor!
</h3>

<p>
  Log in to learn, practise, and improve your maths skills with your AI tutor.
</p>


              {/* Login Form */}
              <form>

                {/* Email */}
                <input
                  className="form-control"
                  type="email"
                  name="username"
                  placeholder="E-mail Address"
                  required
                />


                {/* Password */}
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
                    Login
                  </button>

                  <a
                    href="/register"
                    className="btn btn-outline-primary"
                  >
                    Create account
                  </a>

                </div>

              </form>


              {/* Social Login */}
              <div className="other-links">

                <span>
                  Or login with
                </span>

                <a href="#">
                 <FaFacebookF/>
                </a>

                <a href="#">
                 <FaGoogle/>
                </a>

                <a href="#">
                 <FaLinkedinIn/>
                </a>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Login;