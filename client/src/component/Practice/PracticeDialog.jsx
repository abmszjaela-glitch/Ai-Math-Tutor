import { useEffect, useRef } from 'react';
export default function PracticeDialog({ children, labelledBy, onClose, className = '' }) {
  const panel = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    const node = panel.current;
    const controls = () => [...node.querySelectorAll('button:not(:disabled), a[href], input:not(:disabled), [tabindex="0"]')];
    (controls()[0] || node).focus();
    const handleKey = (event) => {
      if (event.key === 'Escape') { event.preventDefault(); onClose(); }
      if (event.key !== 'Tab') return;
      const items = controls();
      if (!items.length) { event.preventDefault(); node.focus(); return; }
      if (event.shiftKey && document.activeElement === items[0]) { event.preventDefault(); items.at(-1).focus(); }
      else if (!event.shiftKey && document.activeElement === items.at(-1)) { event.preventDefault(); items[0].focus(); }
    };
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    node.addEventListener('keydown', handleKey);
    return () => { node.removeEventListener('keydown', handleKey); document.body.style.overflow = overflow; previous?.focus(); };
  }, [onClose]);
  return <div className="practice-modal-backdrop" onClick={onClose}><section ref={panel} className={`practice-modal ${className}`} role="dialog" aria-modal="true" aria-labelledby={labelledBy} tabIndex={-1} onClick={(event) => event.stopPropagation()}>{children}</section></div>;
}
