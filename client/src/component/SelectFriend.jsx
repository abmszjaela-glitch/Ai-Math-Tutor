
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Volume2, VolumeX } from 'lucide-react';
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

  const [selectedId, setSelectedId] = useState(null);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef(null);
  const clickAudioRef = useRef(null);

  /*
   * Restore previous tutor selection
   */
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      setSelectedId(saved);
    }
  }, []);

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
      } catch (err) {
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
      audio.play();
      setIsMuted(false);
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
      className="team-section section-padding pt-0 fix"
      style={{
        marginTop: '38px',
        position: 'relative',
      }}
    >
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
          border: '1.5px solid #E6E4DD',
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow:
            '0 4px 12px rgba(0,0,0,0.08)',
          cursor: 'pointer',
        }}
      >
        {isMuted ? (
          <VolumeX
            size={18}
            color="#5B6B85"
          />
        ) : (
          <Volume2
            size={18}
            color="#F5A623"
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
          className="text-center"
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
        <div className="row text-center justify-content-center">

          {teachers.map((teacher) => {
            const isSelected =
              selectedId === teacher.id;

            return (
              <div
                key={teacher.id}
                className="col-lg-4 col-md-6 col-sm-6"
              >
                <motion.div
                  className={`team-card-item${
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
                      '0 20px 40px rgba(0,0,0,0.12)',
                    transition: {
                      duration: 0.35,
                      ease: easeOut,
                    },
                  }}
                  style={{
                    cursor: 'pointer',
                    position: 'relative',
                    outline: isSelected
                      ? '3px solid #F5A623'
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
                        background: '#F5A623',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow:
                          '0 4px 10px rgba(245,166,35,0.4)',
                      }}
                    >
                      <Check
                        size={16}
                        color="#14213D"
                        strokeWidth={3}
                      />
                    </motion.div>
                  )}

                  {/* AI Tutor Character Image */}
                  <div
                    className="team-image"
                    style={{
                      width: '100%',
                      height: '300px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                    }}
                  >
                    <motion.img
                      src={teacher.image}
                      alt={`${teacher.name} - AI Math Tutor`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        objectPosition: 'center',
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
                    className="team-content"
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
              color: '#14213D',
              background: selectedId
                ? '#F5A623'
                : '#E6E4DD',
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

