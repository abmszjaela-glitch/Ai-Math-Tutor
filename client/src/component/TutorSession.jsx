import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Mic, MicOff, Sparkles, Volume2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// === DUMMY PLACEHOLDER IMAGES ===
// Replace these with your own images inside src/assets/img/lessons/.
// Keep the same import names below so nothing else needs to change.
import slideDummy1 from '../assets/img/lessons/87116574037358326.jpeg';
import slideDummy2 from '../assets/img/lessons/k2.jpeg';
import slideDummy3 from '../assets/img/lessons/k3.jpeg';
import slideDummy4 from '../assets/img/lessons/k4.jpeg';

const easeOut = [0.25, 0.1, 0.25, 1];
const STORAGE_KEY = 'selectedTutorId';

// Voice personalities — tuned for a warm, clear, kid-friendly Australian accent.
// lang 'en-AU' asks the browser for an Australian voice first; namePreferHints
// are common Australian voice names shipped on Chrome/Edge/Safari/Windows.
const tutorProfiles = {
  kanga: {
    label: 'Kanga',
    lang: 'en-AU',
    pitch: 1.18,
    rate: 0.96,
    namePreferHints: ['Australia', 'Karen', 'Catherine', 'female'],
    greeting: "G'day, I'm Kanga! I'm so excited to help you learn maths today. Tap the microphone and ask me anything, or ask me to show you a step-by-step example.",
    color: '#F5A623',
  },
  pandy: {
    label: 'Pandy',
    lang: 'en-AU',
    pitch: 0.88,
    rate: 0.94,
    namePreferHints: ['Australia', 'male', 'Lee', 'William'],
    greeting: "G'day, I'm Pandy! Ready to work through some maths together? Tap the microphone and ask me a question, or ask for a step-by-step example.",
    color: '#4C6EF5',
  },
};

const DEFAULT_TUTOR_ID = 'kanga';

// Rule-based reply engine — client-side only, no backend required.
const knowledgeBase = [
  {
    keywords: ['fraction'],
    reply: "Great question about fractions! A fraction shows a part of a whole, like a slice of pizza out of the whole pizza. Want me to show you a step-by-step example?",
    lesson: 'fractions',
  },
  {
    keywords: ['algebra', 'equation', 'x ='],
    reply: "Algebra is like solving a puzzle to find a missing number, usually called x. Want me to show you a step-by-step example?",
    lesson: 'algebra',
  },
  {
    keywords: ['angle', 'geometry', 'shape'],
    reply: "Geometry is all about shapes, angles, and space. Want me to show you a step-by-step example?",
    lesson: 'geometry',
  },
  {
    keywords: ['decimal'],
    reply: "Decimals are just another way to write fractions, using a dot to separate whole numbers from parts. Want me to show you a step-by-step example?",
    lesson: 'fractions',
  },
  {
    keywords: ['percentage', 'percent'],
    reply: "Percentages tell us how much out of 100. Want me to show you a step-by-step example?",
    lesson: 'fractions',
  },
  {
    keywords: ['example', 'show me', 'slide'],
    reply: "Sure thing! Let's walk through it together, step by step.",
    lesson: 'algebra',
  },
  {
    keywords: ['hello', 'hi', 'hey'],
    reply: "Hello! I'm really glad you're here. What would you like to learn about today — numbers, geometry, or maybe a bit of algebra?",
  },
  {
    keywords: ['thank'],
    reply: "You're very welcome! Keep asking questions — that's exactly how great mathematicians learn.",
  },
];

const fallbackReplies = [
  "That's an interesting question! Could you ask about a specific topic, like fractions, algebra, or geometry?",
  "Let's break that down together. Which topic is this about — numbers, measurement, or problem solving?",
];

const getReplyEntry = (text) => {
  const lower = text.toLowerCase();
  return knowledgeBase.find((entry) => entry.keywords.some((k) => lower.includes(k)));
};

// === LESSON SLIDES ===
// Each lesson is a short, narrated, step-by-step walkthrough. Swap the
// `image` for your own artwork — these are just placeholders.
const lessons = {
  fractions: {
    title: 'Understanding Fractions',
    slides: [
      {
        image: slideDummy1,
        caption: '1 whole pizza',
        narration: "Let's start with one whole pizza. It's all in one piece — that's our whole.",
      },
      {
        image: slideDummy2,
        caption: 'Cut into 4 equal slices',
        narration: "Now let's cut it into four equal slices. Each slice is one out of four pieces.",
      },
      {
        image: slideDummy3,
        caption: '1 slice = 1/4',
        narration: "If we take just one slice, we write that as one over four — one quarter of the pizza.",
      },
      {
        image: slideDummy4,
        caption: 'Great work!',
        narration: "And that's a fraction! The top number is how many slices you have, the bottom number is how many slices make the whole. Well done!",
      },
    ],
  },
  algebra: {
    title: 'Solving a Simple Equation',
    slides: [
      {
        image: slideDummy1,
        caption: '2x + 5 = 17',
        narration: "Here's our equation: two x plus five equals seventeen. We want to find out what x is.",
      },
      {
        image: slideDummy2,
        caption: 'Subtract 5 from both sides',
        narration: "First, let's subtract five from both sides. That leaves us with two x equals twelve.",
      },
      {
        image: slideDummy3,
        caption: 'Divide both sides by 2',
        narration: "Now divide both sides by two. Twelve divided by two is six.",
      },
      {
        image: slideDummy4,
        caption: 'x = 6',
        narration: "So x equals six! Great job solving your first equation.",
      },
    ],
  },
  geometry: {
    title: 'Finding the Area of a Rectangle',
    slides: [
      {
        image: slideDummy1,
        caption: 'A rectangle',
        narration: "Here's a rectangle. It has a length and a width.",
      },
      {
        image: slideDummy2,
        caption: 'Length = 6, Width = 3',
        narration: "Let's say the length is six centimetres, and the width is three centimetres.",
      },
      {
        image: slideDummy3,
        caption: 'Area = length × width',
        narration: "To find the area, we multiply the length by the width. Six times three.",
      },
      {
        image: slideDummy4,
        caption: 'Area = 18 cm²',
        narration: "Six times three is eighteen. So the area is eighteen square centimetres. Nicely done!",
      },
    ],
  },
};

const TutorSession = () => {
  const navigate = useNavigate();

  const [tutorId, setTutorId] = useState(DEFAULT_TUTOR_ID);
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voicesReady, setVoicesReady] = useState(false);
  const [micSupported, setMicSupported] = useState(true);
  const [interimText, setInterimText] = useState('');

  // Lesson slide state
  const [activeLessonKey, setActiveLessonKey] = useState(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [isSlideNarrating, setIsSlideNarrating] = useState(false);

  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);
  const hasGreetedRef = useRef(false);

  const profile = tutorProfiles[tutorId] || tutorProfiles[DEFAULT_TUTOR_ID];
  const activeLesson = activeLessonKey ? lessons[activeLessonKey] : null;

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && tutorProfiles[saved]) setTutorId(saved);
  }, []);

  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    const handleVoices = () => {
      if (window.speechSynthesis.getVoices().length > 0) setVoicesReady(true);
    };
    handleVoices();
    window.speechSynthesis.onvoiceschanged = handleVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMicSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-AU';

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalTranscript += transcript;
        else interim += transcript;
      }
      setInterimText(interim);
      if (finalTranscript.trim()) handleStudentMessage(finalTranscript.trim());
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimText('');
    };
    recognition.onerror = () => {
      setIsListening(false);
      setInterimText('');
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.onresult = null;
      recognition.onend = null;
      recognition.onerror = null;
      recognition.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tutorId]);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      if (recognitionRef.current) recognitionRef.current.abort();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, interimText]);

  useEffect(() => {
    if (voicesReady && !hasGreetedRef.current) {
      hasGreetedRef.current = true;
      addTutorMessage(profile.greeting);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voicesReady, tutorId]);

  const pickVoice = () => {
    if (!('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) return null;

    // Prefer an explicit Australian English voice first.
    const auVoice = voices.find((v) => v.lang?.toLowerCase() === 'en-au');
    if (auVoice) return auVoice;

    for (const hint of profile.namePreferHints) {
      const match = voices.find((v) => v.name.toLowerCase().includes(hint.toLowerCase()));
      if (match) return match;
    }
    return voices.find((v) => v.lang?.startsWith('en')) || voices[0];
  };

  const speak = (text, onEnd) => {
    if (!('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = profile.pitch;
    utterance.rate = profile.rate;
    utterance.volume = 1;
    utterance.lang = profile.lang;

    const voice = pickVoice();
    if (voice) utterance.voice = voice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      if (onEnd) onEnd();
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  };

  const addTutorMessage = (text) => {
    setMessages((prev) => [...prev, { sender: 'tutor', text }]);
    speak(text);
  };

  const addStudentMessage = (text) => {
    setMessages((prev) => [...prev, { sender: 'student', text }]);
  };

  const handleStudentMessage = (text) => {
    addStudentMessage(text);
    setInterimText('');

    setTimeout(() => {
      const entry = getReplyEntry(text);
      const reply = entry ? entry.reply : fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
      addTutorMessage(reply);

      if (entry?.lesson) {
        // Give the reply a moment to finish, then open the lesson slides.
        setTimeout(() => startLesson(entry.lesson), 400);
      }
    }, 500);
  };

  const toggleMic = () => {
    if (!micSupported) {
      alert("Sorry, your browser doesn't support voice input. Try Chrome on desktop or Android.");
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsSpeaking(false);
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  // === Lesson slide controls ===

  const startLesson = (lessonKey) => {
    if (!lessons[lessonKey]) return;
    setActiveLessonKey(lessonKey);
    setSlideIndex(0);
    narrateSlide(lessonKey, 0);
  };

  const narrateSlide = (lessonKey, index) => {
    const lesson = lessons[lessonKey];
    if (!lesson || !lesson.slides[index]) return;

    setIsSlideNarrating(true);
    speak(lesson.slides[index].narration, () => {
      setIsSlideNarrating(false);
    });
  };

  const goToSlide = (index) => {
    if (!activeLessonKey) return;
    const lesson = lessons[activeLessonKey];
    if (index < 0 || index >= lesson.slides.length) return;

    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setSlideIndex(index);
    narrateSlide(activeLessonKey, index);
  };

  const closeLesson = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsSlideNarrating(false);
    setActiveLessonKey(null);
    setSlideIndex(0);
  };

  const requestExample = () => {
    handleStudentMessage('Can you show me a step-by-step example?');
  };

  const isLastSlide = activeLesson && slideIndex === activeLesson.slides.length - 1;

  return (
    <section
      style={{
        minHeight: '100vh',
        background: '#FAF9F6',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 24px',
          borderBottom: '1px solid #E6E4DD',
          background: '#fff',
        }}
      >
        <motion.button
          type="button"
          onClick={() => navigate(-1)}
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.95 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: 'none',
            color: '#14213D',
            fontWeight: 600,
            fontSize: '0.95rem',
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={18} />
          Back
        </motion.button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: profile.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.85rem',
            }}
          >
            {profile.label.charAt(0)}
          </div>
          <span style={{ fontWeight: 700, color: '#14213D', fontSize: '1rem' }}>
            {profile.label}
          </span>
        </div>
      </div>

      {/* Tutor avatar + status */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '32px 20px 12px',
        }}
      >
        <motion.div
          animate={isSpeaking ? { scale: [1, 1.06, 1] } : { scale: 1 }}
          transition={{ duration: 0.9, repeat: isSpeaking ? Infinity : 0, ease: 'easeInOut' }}
          style={{
            position: 'relative',
            width: '110px',
            height: '110px',
            borderRadius: '50%',
            background: profile.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '2.2rem',
            fontWeight: 700,
            boxShadow: `0 10px 30px ${profile.color}55`,
          }}
        >
          {profile.label.charAt(0)}
          {isSpeaking && (
            <motion.span
              initial={{ opacity: 0.5, scale: 1 }}
              animate={{ opacity: 0, scale: 1.6 }}
              transition={{ duration: 1.1, repeat: Infinity, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                border: `3px solid ${profile.color}`,
              }}
            />
          )}
        </motion.div>

        <p
          style={{
            marginTop: '14px',
            fontSize: '0.9rem',
            fontWeight: 600,
            color: '#5B6B85',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          {isSpeaking ? (
            <>
              <Volume2 size={16} color={profile.color} />
              {profile.label} is speaking…
            </>
          ) : isListening ? (
            'Listening…'
          ) : (
            `Tap the microphone to talk with ${profile.label}`
          )}
        </p>

        {/* Quick action: ask for a visual example */}
        <motion.button
          type="button"
          onClick={requestExample}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          style={{
            marginTop: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            borderRadius: '999px',
            border: `1.5px solid ${profile.color}`,
            background: `${profile.color}12`,
            color: '#14213D',
            fontWeight: 600,
            fontSize: '0.82rem',
            cursor: 'pointer',
          }}
        >
          <Sparkles size={14} color={profile.color} />
          Show me a step-by-step example
        </motion.button>
      </div>

      {/* Conversation */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '10px 20px 140px',
          maxWidth: '640px',
          width: '100%',
          margin: '0 auto',
        }}
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: easeOut }}
              style={{
                display: 'flex',
                justifyContent: msg.sender === 'student' ? 'flex-end' : 'flex-start',
                marginBottom: '10px',
              }}
            >
              <div
                style={{
                  maxWidth: '78%',
                  padding: '12px 16px',
                  borderRadius: '16px',
                  borderBottomRightRadius: msg.sender === 'student' ? '4px' : '16px',
                  borderBottomLeftRadius: msg.sender === 'tutor' ? '4px' : '16px',
                  background: msg.sender === 'student' ? '#14213D' : '#fff',
                  color: msg.sender === 'student' ? '#fff' : '#14213D',
                  border: msg.sender === 'tutor' ? '1px solid #E6E4DD' : 'none',
                  fontSize: '0.92rem',
                  lineHeight: 1.5,
                  boxShadow: msg.sender === 'tutor' ? '0 2px 8px rgba(0,0,0,0.04)' : 'none',
                }}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {interimText && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
            <div
              style={{
                maxWidth: '78%',
                padding: '12px 16px',
                borderRadius: '16px',
                background: 'rgba(20,33,61,0.5)',
                color: '#fff',
                fontSize: '0.92rem',
                fontStyle: 'italic',
              }}
            >
              {interimText}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Mic button */}
      <div style={{ position: 'fixed', bottom: '28px', left: '50%', transform: 'translateX(-50%)' }}>
        <motion.button
          type="button"
          onClick={toggleMic}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          style={{
            position: 'relative',
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            border: 'none',
            background: isListening ? '#E24C4C' : '#F5A623',
            color: '#14213D',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: isListening ? '0 10px 30px rgba(226,76,76,0.4)' : '0 10px 30px rgba(245,166,35,0.4)',
          }}
        >
          {micSupported ? (
            isListening ? <MicOff size={26} color="#fff" /> : <Mic size={26} />
          ) : (
            <MicOff size={26} />
          )}
          {isListening && (
            <>
              <motion.span
                animate={{ opacity: [0.5, 0], scale: [1, 1.8] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
                style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '3px solid #E24C4C' }}
              />
              <motion.span
                animate={{ opacity: [0.5, 0], scale: [1, 1.8] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut', delay: 0.4 }}
                style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '3px solid #E24C4C' }}
              />
            </>
          )}
        </motion.button>
      </div>

      {/* === Lesson slide overlay === */}
      <AnimatePresence>
        {activeLesson && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(15,29,56,0.55)',
              backdropFilter: 'blur(4px)',
              zIndex: 50,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ duration: 0.35, ease: easeOut }}
              style={{
                width: '100%',
                maxWidth: '480px',
                background: '#fff',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 30px 60px rgba(0,0,0,0.25)',
              }}
            >
              {/* Slide header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 18px',
                  borderBottom: '1px solid #E6E4DD',
                }}
              >
                <span style={{ fontWeight: 700, color: '#14213D', fontSize: '0.95rem' }}>
                  {activeLesson.title}
                </span>
                <button
                  type="button"
                  onClick={closeLesson}
                  aria-label="Close example"
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    border: 'none',
                    background: '#F5F4F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <X size={16} color="#5B6B85" />
                </button>
              </div>

              {/* Slide image */}
              <div
                style={{
                  width: '100%',
                  height: '260px',
                  background: '#FAF9F6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={slideIndex}
                    src={activeLesson.slides[slideIndex].image}
                    alt={activeLesson.slides[slideIndex].caption}
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.35, ease: easeOut }}
                    style={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain' }}
                  />
                </AnimatePresence>
              </div>

              {/* Slide caption + narration indicator */}
              <div style={{ padding: '18px 20px 8px' }}>
                <AnimatePresence mode="wait">
                  <motion.h3
                    key={slideIndex}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3, ease: easeOut }}
                    style={{
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      color: '#14213D',
                      textAlign: 'center',
                      margin: 0,
                    }}
                  >
                    {activeLesson.slides[slideIndex].caption}
                  </motion.h3>
                </AnimatePresence>

                {isSlideNarrating && (
                  <p
                    style={{
                      textAlign: 'center',
                      fontSize: '0.8rem',
                      color: profile.color,
                      fontWeight: 600,
                      marginTop: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    <Volume2 size={14} />
                    {profile.label} is explaining…
                  </p>
                )}
              </div>

              {/* Progress dots */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', padding: '10px 0' }}>
                {activeLesson.slides.map((_, i) => (
                  <span
                    key={i}
                    style={{
                      width: i === slideIndex ? '20px' : '7px',
                      height: '7px',
                      borderRadius: '4px',
                      background: i === slideIndex ? profile.color : '#E6E4DD',
                      transition: 'all 0.25s ease',
                    }}
                  />
                ))}
              </div>

              {/* Controls */}
              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  padding: '10px 20px 22px',
                }}
              >
                <button
                  type="button"
                  onClick={() => goToSlide(slideIndex - 1)}
                  disabled={slideIndex === 0}
                  style={{
                    flex: 1,
                    padding: '11px',
                    borderRadius: '10px',
                    border: '1.5px solid #E6E4DD',
                    background: '#fff',
                    color: '#14213D',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: slideIndex === 0 ? 'not-allowed' : 'pointer',
                    opacity: slideIndex === 0 ? 0.4 : 1,
                  }}
                >
                  Back
                </button>

                {isLastSlide ? (
                  <button
                    type="button"
                    onClick={closeLesson}
                    style={{
                      flex: 2,
                      padding: '11px',
                      borderRadius: '10px',
                      border: 'none',
                      background: profile.color,
                      color: '#14213D',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                    }}
                  >
                    Got it!
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => goToSlide(slideIndex + 1)}
                    style={{
                      flex: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '11px',
                      borderRadius: '10px',
                      border: 'none',
                      background: profile.color,
                      color: '#14213D',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                    }}
                  >
                    Next
                    <ArrowRight size={15} />
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default TutorSession;