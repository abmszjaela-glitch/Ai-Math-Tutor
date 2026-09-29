import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const AVATARS = {
  kanga: {
    name: 'Kanga',
    src: '/avatar/kanga-talking.webm',
    glow: 'rgba(240, 162, 61, 0.30)',
  },

  koala: {
    name: 'Koala',
    src: '/avatar/koala-talking.webm',
    glow: 'rgba(110, 150, 170, 0.30)',
  },

  pandy: {
    name: 'Pandy',
    src: '/avatar/panda-talking.webm',
    glow: 'rgba(74, 95, 224, 0.30)',
  },
};

const TutorAvatar = ({
  tutorId = 'kanga',
  speaking = false,
  size = 170,
  reducedMotion = false,
}) => {
  const videoRef = useRef(null);

  const avatar = AVATARS[tutorId] || AVATARS.kanga;

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    if (speaking && !reducedMotion) {
      video.currentTime = 0;

      video.play().catch((error) => {
        console.warn('Avatar animation could not play:', error);
      });
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [speaking, reducedMotion, tutorId]);

  return (
    <motion.div
      style={{
        position: 'relative',
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      animate={
        speaking && !reducedMotion
          ? { scale: [1, 1.02, 1] }
          : { scale: 1 }
      }
      transition={{
        duration: 1.1,
        repeat: speaking && !reducedMotion ? Infinity : 0,
        ease: 'easeInOut',
      }}
    >
 

      {/* Transparent animated tutor */}
      <video
        ref={videoRef}
        src={avatar.src}
        muted
        playsInline
        loop
        preload="auto"
        aria-label={`${avatar.name} animated tutor`}
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          height: '100%',
          objectFit: 'contain',

          /* Important */
          background: 'transparent',

          border: 'none',
          outline: 'none',
          display: 'block',
          pointerEvents: 'none',
        }}
      />
    </motion.div>
  );
};

export default TutorAvatar;