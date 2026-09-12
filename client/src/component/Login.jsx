import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import graphicImage from '../assets/img/Login/graphic15.svg';
import logoImage from '../assets/img/logo/NUMORA.png';
import authStyles from '../assets/Hooks/Authstyles.js';

import {
  FaFacebookF,
  FaGoogle,
  FaLinkedinIn,
} from 'react-icons/fa';


const API_URL = 'http://localhost:5000/api';


const Login = () => {

  const navigate = useNavigate();

  // =====================================================
  // FORM STATE
  // =====================================================

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');


  // =====================================================
  // AUTH PAGE STYLES
  // =====================================================

  useEffect(() => {

    const styleTag =
      document.createElement('style');

    styleTag.id =
      'auth-inline-styles';

    styleTag.innerHTML =
      authStyles;

    document.head.appendChild(
      styleTag
    );

    return () => {

      const existingStyle =
        document.getElementById(
          'auth-inline-styles'
        );

      if (existingStyle) {
        existingStyle.remove();
      }

    };

  }, []);


  // =====================================================
  // LOGIN
  // =====================================================

  const handleSubmit = async (event) => {

    event.preventDefault();

    setError('');

    // Basic validation
    if (!email.trim() || !password) {

      setError(
        'Please enter your email and password.'
      );

      return;
    }


    setIsLoading(true);


    try {

      const response =
        await fetch(
          `${API_URL}/auth/login`,
          {
            method: 'POST',

            credentials: 'include',

            headers: {
              'Content-Type':
                'application/json',
            },

            body: JSON.stringify({
              email: email.trim(),
              password,
            }),
          }
        );


      const data =
        await response.json();


      if (
        !response.ok ||
        !data.success
      ) {

        throw new Error(
          data.message ||
          'Login failed. Please check your email and password.'
        );

      }


      console.log(
        'Login successful:',
        data
      );


      // Go to student dashboard
      navigate('/dashboard');

    } catch (error) {

      console.error(
        'Login error:',
        error
      );

      setError(
        error.message ||
        'Unable to login. Please try again.'
      );

    } finally {

      setIsLoading(false);

    }

  };


  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="form-body form-left">

      <div className="iofrm-layout flex min-h-screen w-full">

        {/* =================================================
            LEFT IMAGE
        ================================================= */}

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


        {/* =================================================
            LOGIN FORM
        ================================================= */}

        <div className="form-holder w-1/2 flex items-center justify-center">

          <div className="form-content justify-content-end flex flex-col items-center">

            <div className="form-items">


              {/* =================================================
                  LOGO
              ================================================= */}

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


              {/* =================================================
                  TITLE
              ================================================= */}

              <h3 className="font-md">
                Welcome Back to Your AI Math Tutor!
              </h3>

              <p>
                Log in to learn, practise, and improve
                your maths skills with your AI tutor.
              </p>


              {/* =================================================
                  ERROR MESSAGE
              ================================================= */}

              {error && (

                <div
                  style={{
                    marginBottom: '15px',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: '#ffe8e8',
                    color: '#c62828',
                    fontSize: '14px',
                  }}
                >
                  {error}
                </div>

              )}


              {/* =================================================
                  LOGIN FORM
              ================================================= */}

              <form
                onSubmit={handleSubmit}
              >

                {/* EMAIL */}

                <input
                  className="form-control"
                  type="email"
                  name="username"
                  placeholder="E-mail Address"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  required
                />


                {/* PASSWORD */}

                <input
                  className="form-control"
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  required
                />


                {/* BUTTONS */}

                <div className="form-button d-flex">

                  <button
                    id="submit"
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading}
                  >

                    {isLoading
                      ? 'Logging in...'
                      : 'Login'}

                  </button>


                  <a
                    href="/register"
                    className="btn btn-outline-primary"
                  >
                    Create account
                  </a>

                </div>

              </form>


              {/* =================================================
                  SOCIAL LOGIN
              ================================================= */}

              <div className="other-links">

                <span>
                  Or login with
                </span>

                <a href="#">
                  <FaFacebookF />
                </a>

                <a href="#">
                  <FaGoogle />
                </a>

                <a href="#">
                  <FaLinkedinIn />
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