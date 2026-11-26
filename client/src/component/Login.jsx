import { API_URL } from '../config/api';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from '../vendor/sweetalert2/sweetalert2.esm.js';
import '../vendor/sweetalert2/sweetalert2.min.css';
import { motion } from 'framer-motion';

// ✅ All images taken from the About component
import aboutImage from '../assets/img/about/about-1.png';
import aboutBg from '../assets/img/about/about-bg-1.png';
import counterImage from '../assets/img/about/ab-counter.png';
import tubelightImage from '../assets/img/about/tubelight.png';
import sunImage from '../assets/img/about/sun.png';
import starImage from '../assets/img/about/star.png';
import loveImage from '../assets/img/about/love.png';
import frameImage from '../assets/img/about/frame.png';

import logoImage from '../assets/img/logo/NUMORA.png';
import authStyles from '../assets/Hooks/Authstyles.js';
import './Login.css';
import { ArrowLeft } from 'lucide-react';

const easeOut = [0.25, 0.1, 0.25, 1];

// Continuous floating loops
const floatY = {
  animate: { y: [0, -16, 0], transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' } },
};
const floatX = {
  animate: { x: [0, 14, 0], transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' } },
};

// Shared style for decorative shapes
const shapeBase = {
  position: 'absolute',
  zIndex: 2,
  pointerEvents: 'none',
};

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
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    const styleTag = document.createElement('style');
    styleTag.id = 'auth-inline-styles';
    styleTag.innerHTML = authStyles;
    document.head.appendChild(styleTag);

    return () => {
      const existingStyle = document.getElementById('auth-inline-styles');
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
      setError('Please enter your email and password.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
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
      console.error('Login error:', error);
      setError(error.message || 'Unable to login. Please try again.');
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
            LEFT IMAGE AREA (all About photos)
        ================================================= */}

        <div className="img-holder">
          <div className="bg"></div>

          <div className="info-holder">
            <div
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '520px',
                margin: '0 auto',
              }}
            >
              {/* Tubelight (top-left) */}
              <motion.div
                style={{ ...shapeBase, top: '-30px', left: '0', width: '70px' }}
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: easeOut }}
              >
                <img src={tubelightImage} alt="AI Math Learning" style={{ width: '100%', height: 'auto' }} />
              </motion.div>

              {/* Sun (top-right) */}
              <motion.div
                style={{ ...shapeBase, top: '-20px', right: '0', width: '80px' }}
                initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.9, delay: 0.15, ease: easeOut }}
              >
                <motion.img
                  src={sunImage}
                  alt="Fun Mathematics Learning"
                  animate={floatY.animate}
                  style={{ width: '100%', height: 'auto' }}
                />
              </motion.div>

              {/* Star (bottom-left) */}
              <motion.div
                style={{ ...shapeBase, bottom: '12%', left: '-10px', width: '50px' }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3, ease: easeOut }}
              >
                <motion.img
                  src={starImage}
                  alt="Math Learning Star"
                  animate={{ rotate: [0, 15, 0, -15, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ width: '100%', height: 'auto' }}
                />
              </motion.div>

              {/* Love (middle-left) */}
              <motion.div
                style={{ ...shapeBase, top: '40%', left: '-30px', width: '55px' }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: easeOut }}
              >
                <motion.img
                  src={loveImage}
                  alt="Friendly AI Tutor"
                  animate={floatX.animate}
                  style={{ width: '100%', height: 'auto' }}
                />
              </motion.div>

              {/* Frame (bottom-right corner) */}
              <motion.div
                style={{ ...shapeBase, bottom: '-20px', right: '20%', width: '60px' }}
                initial={{ opacity: 0, rotate: 10 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ duration: 0.9, delay: 0.25, ease: easeOut }}
              >
                <img src={frameImage} alt="Interactive Math Learning" style={{ width: '100%', height: 'auto' }} />
              </motion.div>

              {/* Background circle (behind the photo) */}
              <motion.div
                style={{
                  position: 'absolute',
                  zIndex: 0,
                  bottom: 0,
                  left: '50%',
                  width: '90%',
                  transform: 'translateX(-50%)',
                  pointerEvents: 'none',
                }}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4, ease: easeOut }}
              >
              </motion.div>

              {/* Main photo */}
              <motion.img
                src={aboutImage}
                alt="Australian Students Learning Mathematics with AI Tutor"
                style={{
                  position: 'relative',
                  zIndex: 1,
                  display: 'block',
                  width: '100%',
                  height: 'auto',
                }}
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.2, ease: easeOut }}
              />

              {/* Counter badge (bottom-right) */}
              <motion.div
                style={{
                  position: 'absolute',
                  zIndex: 3,
                  right: '-10px',
                  bottom: '6%',
                  width: '150px',
                }}
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.6, ease: easeOut }}
              >
                <motion.img
                  src={counterImage}
                  alt="Interactive Math Lessons"
                  animate={floatX.animate}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />

                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'baseline', lineHeight: 1 }}>
                    <h2 style={{ margin: 0, fontSize: '32px', fontWeight: 700 }}>6</h2>
                    <span style={{ fontSize: '24px', fontWeight: 700 }}>+</span>
                  </div>
                </div>
              </motion.div>
            </div>
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
              {/* LOGO */}
              <div className="website-logo-inside logo-normal">
                <Link to="/" aria-label="Numora home">
                  <div className="logo">
                    <img src={logoImage} alt="Numora" />
                  </div>
                </Link>
              </div>

              {/* TITLE */}
              <h3 className="font-md">Welcome Back to Your AI Math Tutor!</h3>

              <p>
                Log in to learn, practise, and improve your maths skills with
                your AI tutor.
              </p>

              {/* ERROR MESSAGE */}
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

              {/* LOGIN FORM */}
              <form onSubmit={handleSubmit}>
                <input
                  className="form-control"
                  type="email"
                  name="username"
                  placeholder="E-mail Address"
                  aria-label="Email address"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />

                <input
                  className="form-control"
                  type="password"
                  name="password"
                  placeholder="Password"
                  aria-label="Password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />

                <div className="form-button d-flex">
                  <button
                    id="submit"
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Logging in...' : 'Login'}
                  </button>

                  <Link to="/register" className="btn btn-outline-primary">
                    Create account
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;