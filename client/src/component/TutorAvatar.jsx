import { useEffect, useRef } from 'react';

const AVATARS = {
  kanga: {
    name: 'Kanga',
    src: '/avatar/kanga-talking .mp4',
  },

  koala: {
    name: 'Koala',
    src: '/avatar/koala-talking .mp4',
  },

  pandy: {
    name: 'Pandy',
    src: '/avatar/panda-talking .mp4',
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

  /*
   * One effect controls playback. The MP4 already contains the full
   * talking animation. When the tutor changes, the <video> remounts
   * (key={avatar.src}) and this effect runs again via tutorId.
   */
  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    if (speaking && !reducedMotion) {
      const playPromise = video.play();

      if (playPromise) {
        playPromise.catch((error) => {
          console.warn('Avatar animation could not play:', error);
        });
      }
    } else {
      video.pause();

      try {
        video.currentTime = 0;
      } catch (error) {
        console.warn('Could not reset avatar video:', error);
      }
    }

    return () => {
      video.pause();
    };
  }, [tutorId, speaking, reducedMotion]);

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

        // Do not clip the ears or head.
        overflow: 'visible',

        // White backdrop inside this element, so the video's
        // multiply blend below always has white to blend with.
        background: 'var(--color-surface)',
        transform: 'translateZ(0)',
      }}
      aria-label={`${avatar.name} animated tutor`}
    >
      <video
        ref={videoRef}
        key={avatar.src}
        src={avatar.src}
        muted
        playsInline
        loop
        preload="auto"
        controls={false}
        disablePictureInPicture
        tabIndex={-1}
        aria-label={`${avatar.name} animated tutor`}
        style={{
          position: 'relative',
          zIndex: 2,

          width: '100%',
          height: '100%',

          filter: 'brightness(1.08)',

          // contain prevents the ears/head from being cropped.
          objectFit: 'contain',

          // The clip has an off-white square background. Multiply
          // turns that near-white into pure white on the white page,
          // so the square edge disappears.
          mixBlendMode: 'multiply',

          background: 'transparent',

          border: 'none',
          outline: 'none',

          display: 'block',

          // The avatar should never block UI buttons.
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

export default TutorAvatar;