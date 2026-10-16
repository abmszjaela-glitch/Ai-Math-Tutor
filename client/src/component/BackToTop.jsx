import { useEffect, useState } from 'react';
import { FaArrowUp } from 'react-icons/fa';
export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const update = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  return <button id="back-top" className="back-to-top" aria-label="Back to top"
    style={{ opacity: visible ? 1 : 0, visibility: visible ? 'visible' : 'hidden' }}
    onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}>
    <FaArrowUp aria-hidden="true" />
  </button>;
}
