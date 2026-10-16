import { useEffect, useState } from 'react';
import graphicImage from '../assets/img/Login/graphic15.svg';
import logoImage from '../assets/img/logo/NUMORA.png';
import authStyles from '../assets/Hooks/Authstyles.js';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config/api';
const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isLoading) return;
    const form = new FormData(event.currentTarget);
    setError('');
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.get('name').trim(), email: form.get('email').trim(), password: form.get('password'), grade: Number(form.get('grade')) }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(Object.values(data.errors || {}).flat().join(' ') || data.message || 'Registration failed');
      navigate('/dashboard', { replace: true });
    } catch (error) { setError(error.message || 'Unable to register. Please try again.'); }
    finally { setIsLoading(false); }
  };

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
  Start Learning with Your AI Math Tutor!
</h3>

<p>
  Create your account and start improving your maths skills with AI.
</p>


              {/* Register Form */}
              <form onSubmit={handleSubmit}>
                {error && <p role="alert" style={{ color: "var(--color-error-text)" }}>{error}</p>}

                <input
                  className="form-control"
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  aria-label="Full name" minLength={2} maxLength={100}
                  required
                />

                <input
                  className="form-control"
                  type="email"
                  name="email"
                  placeholder="E-mail Address" aria-label="Email address" autoComplete="email"
                  required
                />

                <input
                  className="form-control"
                  type="password"
                  name="password"
                  placeholder="Password" aria-label="Password" minLength={6} maxLength={72} autoComplete="new-password"
                  required
                />


                <label htmlFor="grade">Grade</label>
                <select id="grade" name="grade" className="form-control" required defaultValue="">
                  <option value="" disabled>Select your grade</option>
                  {[1, 2, 3, 4, 5, 6].map((grade) => <option key={grade} value={grade}>Grade {grade}</option>)}
                </select>
                {/* Buttons */}
                <div className="form-button d-flex">

                  <button
                    id="submit"
                    type="submit" disabled={isLoading}
                    className="btn btn-primary"
                  >
                    {isLoading ? "Registering…" : "Register"}
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

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Register;