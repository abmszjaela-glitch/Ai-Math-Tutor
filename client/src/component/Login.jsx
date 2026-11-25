import { API_URL } from '../config/api';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from '../vendor/sweetalert2/sweetalert2.esm.js';
import '../vendor/sweetalert2/sweetalert2.min.css';
import { motion } from 'framer-motion';

import graphicImage from '../assets/img/Login/graphic15.svg';
import logoImage from '../assets/img/logo/NUMORA.png';
import authStyles from '../assets/Hooks/Authstyles.js';
import './Login.css';
import { Check, Volume2, VolumeX, ArrowLeft } from 'lucide-react';




const Login = () => {
const easeOut = [0.25, 0.1, 0.25, 1];

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
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

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

    if (isLoading) return;
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





      // Restore this account's saved tutor before returning home.
      const tutorIds = { Kangaroo: 'kanga', Panda: 'pandy', Koala: 'koala' };
      const tutorId = tutorIds[data.user?.student?.avatar?.name] || 'kanga';
      localStorage.setItem('selectedTutorId', tutorId);
      await Swal.fire({
        icon: 'success',
        title: "You're in! 🎉",
        text: 'Login successful! Your math adventure awaits.',
        confirmButtonText: "Let's learn! ✨",
        buttonsStyling: false,
        timer: 3000,
        timerProgressBar: true,
        allowOutsideClick: false,
        heightAuto: false,
        returnFocus: false,
        customClass: {
          container: 'numora-login-alert-container',
          popup: 'numora-login-alert',
          confirmButton: 'numora-login-alert-button',
        },
      });
      navigate('/', { replace: true });
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

    <div className="form-body login-page">

      <div className="iofrm-layout">

        {/* =================================================
            LEFT IMAGE
        ================================================= */}

        <div className="img-holder">

          <div className="bg"></div>

          <div className="info-holder">

            <img
              src={graphicImage}
              alt="Login illustration"
              className="max-w-md w-full"
            />

          </div>

        </div>

    {/* Back Button */}
<motion.button
  type="button"
  className="avatar-back-button"
  onClick={() => navigate(-1)}
  whileHover={{ scale: 1.06, x: -3 }}
  whileTap={{ scale: 0.94 }}
  transition={{ duration: 0.2, ease: easeOut }}
  style={{
    position: 'absolute',
    top: '40px',
    left: '20px',
    zIndex: 5,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    borderRadius: '24px',
    border: '1.5px solid #E6E4DD',
    background: '#fff',
    color: '#14213D',
    fontWeight: 600,
    fontSize: '14px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    cursor: 'pointer',
  }}
>
  <ArrowLeft size={18} />
  Back
</motion.button>
        {/* =================================================
            LOGIN FORM
        ================================================= */}

        <div className="form-holder">

          <div className="form-content">

            <div className="form-items">


              {/* =================================================
                  LOGO
              ================================================= */}

              <div className="website-logo-inside logo-normal">

                <Link to="/" aria-label="Numora home">

                  <div className="logo">

                    <img
                      src={logoImage}
                      alt="Numora"
                    />

                  </div>

                </Link>

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
                    background: 'var(--color-surface-soft)',
                    color: 'var(--color-error-text)',
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
                  placeholder="E-mail Address" aria-label="Email address" autoComplete="email"
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
                  placeholder="Password" aria-label="Password" autoComplete="current-password"
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


                  <Link
                    to="/register"
                    className="btn btn-outline-primary"
                  >
                    Create account
                  </Link>

                </div>

              </form>


              {/* =================================================
                  SOCIAL LOGIN
              ================================================= */}


            </div>

          </div>

        </div>

      </div>

    </div>

  );

};


export default Login;