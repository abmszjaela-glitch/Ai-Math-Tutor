
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Volume2, VolumeX, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import flower from '../assets/img/team/flower.png';

import team1 from '../assets/img/team/kanga.jpeg';
import team2 from '../assets/img/team/panda.png';
import team3 from '../assets/img/team/Koala3.png';

// Audio files
import bgMusic from '../assets/auido/ChooseFriend.mp3';
import clickingSound from '../assets/auido/clickingsound.mp3';

const easeOut = [0.25, 0.1, 0.25, 1];

const floatY = {
  animate: {
    y: [0, -16, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

const directionVariants = {
  fadeInRight: {
    hidden: {
      opacity: 0,
      x: 70,
    },
    visible: {
      opacity: 1,
      x: 0,
    },
  },

  fadeInLeft: {
    hidden: {
      opacity: 0,
      x: -70,
    },
    visible: {
      opacity: 1,
      x: 0,
    },
  },
};

const teachers = [
  {
    id: 'kanga',
    name: 'Kanga',
    role: 'AI Math Tutor',
    image: team1,
    animation: 'fadeInRight',
    delay: 0.2,
  },

  {
    id: 'pandy',
    name: 'Pandy',
    role: 'AI Math Tutor',
    image: team2,
    animation: 'fadeInLeft',
    delay: 0.35,
  },

  {
    id: 'koala',
    name: 'Koala',
    role: 'AI Math Tutor',
    image: team3,
    animation: 'fadeInLeft',
    delay: 0.35,
  },
];

const STORAGE_KEY = 'selectedTutorId';

const SelectFriend = ({
  onSelect = () => {},
  onContinue = () => {},
}) => {
  const navigate = useNavigate();

  const [selectedId, setSelectedId] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return teachers.some((teacher) => teacher.id === saved) ? saved : null;
  });
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef(null);
  const clickAudioRef = useRef(null);


  /*
   * Background music
   */
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.volume = 0.35;
    audio.loop = true;

    const tryPlay = async () => {
      try {
        await audio.play();
        setIsMuted(false);
      } catch {
        // Browser blocked autoplay
        setIsMuted(true);
      }
    };

    tryPlay();

    /*
     * Stop music when leaving page
     */
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  /*
   * Play click sound
   */
  const playClickSound = () => {
    const click = clickAudioRef.current;

    if (!click) return;

    click.currentTime = 0;

    click.play().catch(() => {
      // Ignore autoplay/audio errors
    });
  };

  /*
   * Toggle background music
   */
  const toggleSound = () => {
    const audio = audioRef.current;

    if (!audio) return;

    if (audio.paused) {
      audio.play().then(() => setIsMuted(false)).catch(() => setIsMuted(true));
    } else {
      audio.pause();
      setIsMuted(true);
    }
  };

  /*
   * Select tutor
   *
   * IMPORTANT:
   * This does NOT navigate.
   * Navigation happens only when Continue is clicked.
   */
  const handleSelect = (id) => {
    playClickSound();

    setSelectedId(id);

    localStorage.setItem(STORAGE_KEY, id);

    onSelect(id);
  };

  /*
   * Keyboard selection
   */
  const handleKeyDown = (e, id) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();

      handleSelect(id);
    }
  };

  /*
   * Continue button
   */
  const handleContinue = () => {
    if (!selectedId) return;

    playClickSound();

    /*
     * Pass selected tutor to parent
     */
    onContinue(selectedId);

    /*
     * Navigate to Tutor Session
     */
    navigate('/tutor-session');
  };

  /*
   * Find selected tutor
   */
  const selectedTeacher = teachers.find(
    (teacher) => teacher.id === selectedId
  );

  return (
    <section
      className="team-section section-padding pt-0 fix select-friend-section"
      style={{
        position: 'relative',
      }}
    >
      {/* Responsive avatar selection styles */}
      <style>{`
        .select-friend-section {
          padding: 100px 0 50px;
          overflow: hidden;
        }

        .select-friend-section .container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding-left: 16px;
          padding-right: 16px;
        }

        .select-friend-heading {
          width: 100%;
          max-width: 600px;
          margin: 0 auto 40px;
          padding: 0 12px;
          text-align: center;
        }

        .select-friend-heading h2 {
          font-size: clamp(24px, 4vw, 38px);
          line-height: 1.3;
          margin-bottom: 0;
        }

        .avatar-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 24px;
          align-items: stretch;
          max-width: 1050px;
          margin: 0 auto;
        }

        .avatar-grid-item {
          min-width: 0;
          width: 100%;
        }

        .avatar-select-card {
          width: 100%;
          height: 100%;
          min-height: 300px;
          padding: 16px;
          border-radius: 20px;
          background: var(--color-surface);
          border: 2px solid var(--color-border);
          box-shadow: 0 8px 24px var(--color-shadow);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
          user-select: none;
        }

        .avatar-select-card:focus-visible {
          outline: 3px solid var(--color-accent);
          outline-offset: 4px;
        }

        .avatar-select-card.is-selected {
          border-color: var(--color-accent);
          background: var(--color-surface);
        }

        .avatar-select-image {
          width: 100%;
          height: 250px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border-radius: 14px;
        }

        .avatar-select-image img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center;
          pointer-events: none;
        }

        .avatar-select-content {
          width: 100%;
          text-align: center;
          padding-top: 12px;
        }

        .avatar-select-content h3 {
          font-size: 22px;
          font-weight: 700;
          margin-bottom: 6px;
        }

        .avatar-select-content p {
          font-size: 14px;
          margin-bottom: 0;
        }

        .avatar-selected-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          z-index: 2;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--color-accent);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px var(--color-shadow);
        }

        .avatar-continue-button {
          width: auto;
          max-width: 100%;
          min-height: 52px;
          padding: 14px 32px;
          border-radius: 14px;
          font-size: 16px;
          font-weight: 700;
          border: none;
          white-space: normal;
          line-height: 1.4;
        }

        @media (max-width: 991px) {
          .select-friend-section {
            padding-top: 90px;
          }

          .avatar-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 20px;
            max-width: 760px;
          }

          .avatar-select-card {
            min-height: 290px;
          }

          .avatar-select-image {
            height: 230px;
          }

          .avatar-grid-item:last-child:nth-child(odd) {
            grid-column: 1 / -1;
            width: calc(50% - 10px);
            justify-self: center;
          }
        }

        @media (max-width: 575px) {
          .select-friend-section {
            padding-top: 78px;
            padding-bottom: 35px;
          }

          .select-friend-section .container {
            padding-left: 12px;
            padding-right: 12px;
          }

          .select-friend-heading {
            margin-bottom: 24px;
          }

          .select-friend-heading h2 {
            font-size: 26px;
          }

          .avatar-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px;
          }

          .avatar-select-card {
            min-height: 230px;
            padding: 10px;
            border-radius: 16px;
          }

          .avatar-select-image {
            height: 160px;
          }

          .avatar-select-content {
            padding-top: 8px;
          }

          .avatar-select-content h3 {
            font-size: 18px;
            margin-bottom: 4px;
          }

          .avatar-select-content p {
            font-size: 12px;
            line-height: 1.4;
          }

          .avatar-selected-badge {
            width: 28px;
            height: 28px;
            top: 8px;
            right: 8px;
          }

          .avatar-selected-badge svg {
            width: 14px;
            height: 14px;
          }

          .avatar-grid-item:last-child:nth-child(odd) {
            grid-column: 1 / -1;
            width: calc(50% - 6px);
            justify-self: center;
          }

          .avatar-continue-button {
            width: 100%;
            min-height: 52px;
            padding: 12px 16px;
            font-size: 15px;
          }

          .avatar-back-button {
            left: 12px !important;
            top: 8px !important;
            padding: 8px 12px !important;
            font-size: 13px !important;
          }

          .avatar-sound-button {
            right: 12px !important;
            top: 8px !important;
            width: 38px !important;
            height: 38px !important;
          }
        }

        @media (max-width: 360px) {
          .avatar-grid {
            gap: 8px;
          }

          .avatar-select-card {
            min-height: 210px;
            padding: 8px;
          }

          .avatar-select-image {
            height: 140px;
          }

          .avatar-select-content h3 {
            font-size: 16px;
          }

          .avatar-select-content p {
            font-size: 11px;
          }

          .select-friend-heading h2 {
            font-size: 23px;
          }
        }

        @media (hover: none) {
          .avatar-select-card {
            transition: border-color 0.2s ease;
          }
        }
      `}</style>

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
    top: '0px',
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
      {/* Background sound */}
      <audio
        ref={audioRef}
        src={bgMusic}
        preload="auto"
      />

      {/* Click sound effect */}
      <audio
        ref={clickAudioRef}
        src={clickingSound}
        preload="auto"
      />

      {/* Sound toggle button */}
      <motion.button
        type="button"
        className="avatar-sound-button"
        onClick={toggleSound}
        aria-label={
          isMuted
            ? 'Turn sound on'
            : 'Turn sound off'
        }
        whileHover={{
          scale: 1.08,
        }}
        whileTap={{
          scale: 0.92,
        }}
        transition={{
          duration: 0.2,
          ease: easeOut,
        }}
        style={{
          position: 'absolute',
          top: '0px',
          right: '20px',
          zIndex: 5,
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          border: '1.5px solid var(--color-border)',
          background: 'var(--color-surface)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow:
            '0 4px 12px var(--color-shadow)',
          cursor: 'pointer',
        }}
      >
        {isMuted ? (
          <VolumeX
            size={18}
            color="var(--color-primary)"
          />
        ) : (
          <Volume2
            size={18}
            color="var(--color-accent)"
          />
        )}
      </motion.button>

      <div className="container">

        {/* Decorative Flower */}
        <motion.div
          className="flower-shape"
          initial={{
            opacity: 0,
            scale: 0.6,
            rotate: -20,
          }}
          whileInView={{
            opacity: 1,
            scale: 1,
            rotate: 0,
          }}
          viewport={{
            once: true,
            amount: 0.3,
          }}
          transition={{
            duration: 0.9,
            ease: easeOut,
          }}
        >
          <motion.img
            src={flower}
            alt="decorative-shape"
            animate={floatY.animate}
          />
        </motion.div>

        {/* Section Heading */}
        <motion.h2
          className="text-center select-friend-heading"
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.3,
          }}
          transition={{
            duration: 0.7,
            ease: easeOut,
          }}
          style={{
            maxWidth: '600px',
            margin: '0 auto 48px auto',
            textAlign: 'center',
          }}
        >
          Choose Your AI Friend
        </motion.h2>

        {/* AI Math Tutors */}
        <div className="avatar-grid">

          {teachers.map((teacher) => {
            const isSelected =
              selectedId === teacher.id;

            return (
              <div
                key={teacher.id}
                className="avatar-grid-item"
              >
                <motion.div
                  className={`team-card-item avatar-select-card${
                    isSelected
                      ? ' is-selected'
                      : ''
                  }`}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  aria-label={`Select ${teacher.name} as your AI math tutor`}
                  onClick={() =>
                    handleSelect(teacher.id)
                  }
                  onKeyDown={(e) =>
                    handleKeyDown(
                      e,
                      teacher.id
                    )
                  }
                  variants={
                    directionVariants[
                      teacher.animation
                    ]
                  }
                  initial="hidden"
                  whileInView="visible"
                  viewport={{
                    once: true,
                    amount: 0.25,
                  }}
                  transition={{
                    duration: 0.8,
                    delay: teacher.delay,
                    ease: easeOut,
                  }}
                  whileHover={{
                    y: -12,
                    boxShadow:
                      '0 20px 40px var(--color-shadow)',
                    transition: {
                      duration: 0.35,
                      ease: easeOut,
                    },
                  }}
                  style={{
                    cursor: 'pointer',
                    position: 'relative',
                    outline: isSelected
                      ? '3px solid var(--color-accent)'
                      : '3px solid transparent',
                    outlineOffset: '4px',
                    borderRadius: '16px',
                    transition:
                      'outline-color 0.25s ease',
                  }}
                >

                  {/* Selected badge */}
                  {isSelected && (
                    <motion.div
                      className="avatar-selected-badge"
                      initial={{
                        opacity: 0,
                        scale: 0.5,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                      }}
                      transition={{
                        duration: 0.25,
                        ease: easeOut,
                      }}
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        zIndex: 2,
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        background: 'var(--color-accent)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow:
                          '0 4px 10px var(--color-shadow)',
                      }}
                    >
                      <Check
                        size={16}
                        color="var(--color-deep)"
                        strokeWidth={3}
                      />
                    </motion.div>
                  )}

                  {/* AI Tutor Character Image */}
                  <div className="team-image avatar-select-image">
                    <motion.img
                      src={teacher.image}
                      alt={`${teacher.name} - AI Math Tutor`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        objectPosition: 'center',
                        pointerEvents: 'none',
                      }}
                      whileHover={{
                        scale: 1.1,
                      }}
                      transition={{
                        duration: 0.5,
                        ease: easeOut,
                      }}
                    />
                  </div>

                  {/* AI Tutor Details */}
                  <motion.div
                    className="team-content avatar-select-content"
                    initial={{
                      opacity: 0,
                    }}
                    whileInView={{
                      opacity: 1,
                    }}
                    viewport={{
                      once: true,
                      amount: 0.5,
                    }}
                    transition={{
                      duration: 0.5,
                      delay:
                        teacher.delay + 0.3,
                    }}
                  >
                    <h3>
                      {teacher.name}
                    </h3>

                    <p>
                      {isSelected
                        ? 'Selected as your tutor'
                        : teacher.role}
                    </p>
                  </motion.div>

                </motion.div>
              </div>
            );
          })}

        </div>

        {/* Continue Button */}
        <div
          className="text-center"
          style={{
            marginTop: '32px',
          }}
        >
          <motion.button
            type="button"
            className="avatar-continue-button"
            disabled={!selectedId}
            onClick={handleContinue}
            whileHover={
              selectedId
                ? {
                    scale: 1.04,
                    y: -2,
                  }
                : {}
            }
            whileTap={
              selectedId
                ? {
                    scale: 0.97,
                  }
                : {}
            }
            transition={{
              duration: 0.25,
              ease: easeOut,
            }}
            style={{
              padding: '14px 36px',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '1rem',
              border: 'none',
              color: 'var(--color-ink)',
              background: selectedId
                ? 'var(--color-accent)'
                : 'var(--color-surface-soft)',
              cursor: selectedId
                ? 'pointer'
                : 'not-allowed',
              transition:
                'background 0.25s ease',
            }}
          >
            {selectedTeacher
              ? `Continue with ${selectedTeacher.name}`
              : 'Select a tutor to continue'}
          </motion.button>
        </div>

      </div>
    </section>
  );
};

export default SelectFriend;

