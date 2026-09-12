import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ArrowLeft, ArrowRight, Mic, MicOff, Sparkles, Volume2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// === DUMMY PLACEHOLDER IMAGES ===
// Replace these with your own images inside src/assets/img/lessons/.
// Keep the same import names below so nothing else needs to change.
import slideDummy1 from '../assets/img/lessons/87116574037358326.jpeg';
import slideDummy2 from '../assets/img/lessons/k2.jpeg';
import slideDummy3 from '../assets/img/lessons/k3.jpeg';
import slideDummy4 from '../assets/img/lessons/k4.jpeg';

// === REDESIGN NOTES ===
// Same voice-tutor logic as before (speech recognition + synthesis, lesson
// data, the reply engine) — nothing about how it *works* has changed.
// What changed is the visual layer:
//  - a small, deliberate color/type token system instead of scattered hexes
//  - a signature "tutor mark" (a mascot silhouette — kangaroo ears for Kanga,
//    panda ears for Pandy) built from CSS, replacing the letter-in-a-circle
//  - glass surfaces on the header and tutor bubbles
//  - a "thinking…" indicator while a reply is on its way
//  - an inline toast instead of a blocking alert() for the unsupported-mic case
//  - keyboard (← →, Esc) and swipe navigation in the lesson viewer
//  - prefers-reduced-motion is respected throughout
//  - mobile breakpoints (≤575px, ≤380px) added via classNames + a media
//    query block, since most layout here uses inline styles

const easeOut = [0.25, 0.1, 0.25, 1];
const STORAGE_KEY = 'selectedTutorId';
const API_URL = 'http://localhost:5000/api';

// === DESIGN TOKENS ===
const palette = {
  ink: '#161A2E',
  paper: '#F5F6FA',
  surface: '#FFFFFF',
  mist: '#E3E6EF',
  slate: '#6B7288',
  faint: '#9AA1B4',
  listening: '#E2483F',
};

const fontDisplay = "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const fontBody = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const fontMono = "'IBM Plex Mono', 'SFMono-Regular', Consolas, monospace";

const shadow = {
  sm: '0 2px 10px rgba(22,26,46,0.06)',
  md: '0 10px 28px rgba(22,26,46,0.10)',
  lg: '0 24px 56px rgba(22,26,46,0.16)',
};

// Voice personalities — tuned for a warm, clear, kid-friendly Australian accent.
// lang 'en-AU' asks the browser for an Australian voice first; namePreferHints
// are common Australian voice names shipped on Chrome/Edge/Safari/Windows.
// color/deep/gradient/buttonGradient/glow/earStyle drive the tutor's visual
// mark (see TutorMark below) — everything else here is unchanged.
const tutorProfiles = {
  kanga: {
    label: 'Kanga',
    lang: 'en-AU',
    pitch: 1.18,
    rate: 0.96,
    namePreferHints: ['Australia', 'Karen', 'Catherine', 'female'],
    greeting: "G'day, I'm Kanga! I'm so excited to help you learn maths today. Tap the microphone and ask me anything, or ask me to show you a step-by-step example.",
    color: '#F0A23D',
    deep: '#C4611A',
    gradient: 'linear-gradient(135deg, #FFCB82 0%, #F0A23D 55%, #E1791F 100%)',
    buttonGradient: 'linear-gradient(135deg, #F0A23D 0%, #C4611A 100%)',
    glow: 'rgba(240,162,61,0.38)',
    earStyle: 'kangaroo',
  },
  pandy: {
    label: 'Pandy',
    lang: 'en-AU',
    pitch: 0.88,
    rate: 0.94,
    namePreferHints: ['Australia', 'male', 'Lee', 'William'],
    greeting: "G'day, I'm Pandy! Ready to work through some maths together? Tap the microphone and ask me a question, or ask for a step-by-step example.",
    color: '#4A5FE0',
    deep: '#1E1A4A',
    gradient: 'linear-gradient(135deg, #93A4FF 0%, #4A5FE0 55%, #3626B8 100%)',
    buttonGradient: 'linear-gradient(135deg, #4A5FE0 0%, #1E1A4A 100%)',
    glow: 'rgba(74,95,224,0.38)',
    earStyle: 'panda',
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

// Respects the OS-level "reduce motion" setting so looping/ambient
// animation can stand down for anyone who's asked for that.
const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (!window.matchMedia) return;
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(query.matches);
    const handleChange = (e) => setReduced(e.matches);
    if (query.addEventListener) query.addEventListener('change', handleChange);
    else query.addListener(handleChange);
    return () => {
      if (query.removeEventListener) query.removeEventListener('change', handleChange);
      else query.removeListener(handleChange);
    };
  }, []);

  return reduced;
};

// A small voice-reactive equalizer — shows "audio is actively happening"
// (speaking or listening) without relying on words alone.
const SoundBars = ({ active, reducedMotion, color = '#fff', count = 4, height = 15 }) => (
  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height }}>
    {Array.from({ length: count }).map((_, i) =>
      reducedMotion ? (
        <span
          key={i}
          style={{
            display: 'block',
            width: '3px',
            height: active ? '70%' : '30%',
            borderRadius: '2px',
            background: color,
          }}
        />
      ) : (
        <motion.span
          key={i}
          animate={active ? { scaleY: [0.3, 1, 0.45, 0.85, 0.3] } : { scaleY: 0.3 }}
          transition={{ duration: 0.9, repeat: active ? Infinity : 0, ease: 'easeInOut', delay: i * 0.12 }}
          style={{
            display: 'block',
            width: '3px',
            height: '100%',
            borderRadius: '2px',
            background: color,
            transformOrigin: 'bottom',
          }}
        />
      )
    )}
  </div>
);

// Shown in place of a reply while the tutor "thinks" — a standard chat
// affordance so a short pause never reads as the app having stalled.
const ThinkingDots = ({ color, reducedMotion }) => (
  <div style={{ display: 'flex', gap: '5px', padding: '3px 2px' }}>
    {[0, 1, 2].map((i) =>
      reducedMotion ? (
        <span
          key={i}
          style={{ width: 6, height: 6, borderRadius: '50%', background: color, opacity: 0.5 + i * 0.15 }}
        />
      ) : (
        <motion.span
          key={i}
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut', delay: i * 0.15 }}
          style={{ width: 6, height: 6, borderRadius: '50%', background: color, display: 'inline-block' }}
        />
      )
    )}
  </div>
);

// The signature mark: a mascot silhouette built from a gradient core plus
// a pair of ear shapes unique to each tutor — Kanga's angled kangaroo ears,
// Pandy's round panda ears — instead of a generic orb or a letter-in-a-circle.
// Ears only render above a legible size; small chip-sized uses fall back to
// a clean glowing dot so nothing turns to mush at 30px.
const TutorMark = ({ profile, size = 112, speaking = false, reducedMotion = false }) => {
  const earSize = size * 0.34;
  const wrapHeight = size + earSize * 0.62;
  const showEars = size >= 80;

  return (
    <div style={{ position: 'relative', width: size, height: wrapHeight, flexShrink: 0 }}>
      {/* static ambient glow — gives presence at rest without any motion */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: 0,
          transform: 'translateX(-50%)',
          width: size * 1.3,
          height: size * 1.3,
          borderRadius: '50%',
          background: profile.gradient,
          opacity: 0.24,
          filter: `blur(${Math.round(size * 0.22)}px)`,
        }}
      />

      {showEars && profile.earStyle === 'kangaroo' && (
        <>
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: size * 0.06,
              width: earSize * 0.6,
              height: earSize,
              borderRadius: '60% 60% 55% 55% / 70% 70% 35% 35%',
              background: profile.deep,
              transform: 'rotate(-26deg)',
              transformOrigin: 'bottom center',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: size * 0.06,
              width: earSize * 0.6,
              height: earSize,
              borderRadius: '60% 60% 55% 55% / 70% 70% 35% 35%',
              background: profile.deep,
              transform: 'rotate(26deg)',
              transformOrigin: 'bottom center',
            }}
          />
        </>
      )}

      {showEars && profile.earStyle === 'panda' && (
        <>
          <div
            style={{
              position: 'absolute',
              top: earSize * 0.05,
              left: -earSize * 0.1,
              width: earSize,
              height: earSize,
              borderRadius: '50%',
              background: profile.deep,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: earSize * 0.05,
              right: -earSize * 0.1,
              width: earSize,
              height: earSize,
              borderRadius: '50%',
              background: profile.deep,
            }}
          />
        </>
      )}

      <motion.div
        animate={speaking && !reducedMotion ? { scale: [1, 1.045, 1] } : { scale: 1 }}
        transition={{ duration: 1.1, repeat: speaking && !reducedMotion ? Infinity : 0, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: size,
          height: size,
          borderRadius: '50%',
          background: profile.gradient,
          boxShadow: `0 ${Math.round(size * 0.12)}px ${Math.round(size * 0.3)}px ${profile.glow}`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '15%',
            left: '19%',
            width: '34%',
            height: '26%',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.32)',
            filter: 'blur(4px)',
          }}
        />
      </motion.div>
    </div>
  );
};

const TutorSession = () => {
  const navigate = useNavigate();
  const reducedMotion = usePrefersReducedMotion();

  const [tutorId, setTutorId] = useState(DEFAULT_TUTOR_ID);
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [voicesReady, setVoicesReady] = useState(false);
  const [micSupported, setMicSupported] = useState(true);
  const [interimText, setInterimText] = useState('');
  const [notice, setNotice] = useState(null);
  const [conversationId, setConversationId] = useState(null);
const [lessonId, setLessonId] = useState(null);

  // Lesson slide state
  const [activeLessonKey, setActiveLessonKey] = useState(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [isSlideNarrating, setIsSlideNarrating] = useState(false);

  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);
  const hasGreetedRef = useRef(false);
  const noticeTimeoutRef = useRef(null);
  const touchStartXRef = useRef(null);

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
      if (noticeTimeoutRef.current) clearTimeout(noticeTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, interimText, isThinking]);

  useEffect(() => {
    if (voicesReady && !hasGreetedRef.current) {
      hasGreetedRef.current = true;
      addTutorMessage(profile.greeting);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voicesReady, tutorId]);

  // Keyboard navigation for the lesson viewer — arrow keys move between
  // slides, Escape closes it. Purely additive; the on-screen buttons and
  // swipe gesture below still work exactly the same.
  useEffect(() => {
    if (!activeLessonKey) return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') goToSlide(slideIndex + 1);
      else if (e.key === 'ArrowLeft') goToSlide(slideIndex - 1);
      else if (e.key === 'Escape') closeLesson();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeLessonKey, slideIndex]);


  useEffect(() => {
  const createConversation = async () => {
    try {
      const response = await fetch(
        `${API_URL}/conversations`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: `${profile.label} Math Session`,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || 'Failed to create conversation'
        );
      }

      setConversationId(data.conversation.id);
    } catch (error) {
      console.error(
        'Conversation creation error:',
        error
      );

      showNotice(
        'I could not start the math session. Please try again.'
      );
    }
  };

  createConversation();
}, [profile.label]);

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

  const showNotice = (text) => {
    setNotice(text);
    if (noticeTimeoutRef.current) clearTimeout(noticeTimeoutRef.current);
    noticeTimeoutRef.current = setTimeout(() => setNotice(null), 4000);
  };

 const handleStudentMessage = async (text) => {
  const cleanText = text?.trim();

  if (!cleanText) return;

  if (!conversationId) {
    showNotice(
      'Your tutor is still getting ready. Please try again in a moment.'
    );
    return;
  }

  // Stop current speech
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }

  setIsSpeaking(false);
  setInterimText('');

  // Show student's message immediately
  addStudentMessage(cleanText);

  // Show thinking animation
  setIsThinking(true);

  try {
    const response = await fetch(
      `${API_URL}/tutor/message`,
      {
        method: 'POST',
        credentials: 'include',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          conversationId,
          lessonId,
          message: cleanText,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || 'Tutor request failed'
      );
    }

    const tutor = data.response?.tutor;

    if (!tutor) {
      throw new Error(
        'Tutor returned an invalid response'
      );
    }

    // Stop thinking
    setIsThinking(false);

    // Add structured tutor response
    setMessages((prev) => [
      ...prev,
      {
        sender: 'tutor',
        text: tutor.message,
        tutor,
      },
    ]);

    // Read tutor's explanation aloud
    speak(tutor.message);

  } catch (error) {
    console.error(
      'Tutor request error:',
      error
    );

    setIsThinking(false);

    addTutorMessage(
      "Sorry! I had a little trouble thinking about that question. Let's try again."
    );

    showNotice(
      'Something went wrong while talking to your math tutor.'
    );
  }
};

  const toggleMic = () => {
    if (!micSupported) {
      showNotice("Voice input isn't available in this browser. Try Chrome on desktop or Android.");
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

  // Swipe left/right on the slide image — an alternate path to the same
  // Back/Next functions, handy on phones and tablets.
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartXRef.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    touchStartXRef.current = null;
    if (Math.abs(deltaX) < 40) return;
    if (deltaX < 0) goToSlide(slideIndex + 1);
    else goToSlide(slideIndex - 1);
  };

  const isLastSlide = activeLesson && slideIndex === activeLesson.slides.length - 1;

  const tutorBubbleStyle = {
    maxWidth: '78%',
    padding: '13px 17px',
    borderRadius: '18px',
    borderBottomLeftRadius: '6px',
    fontFamily: fontBody,
    fontSize: '0.93rem',
    lineHeight: 1.55,
    background: 'rgba(255,255,255,0.82)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    color: palette.ink,
    border: `1px solid ${palette.mist}`,
    borderLeft: `3px solid ${profile.color}`,
    boxShadow: shadow.sm,
  };

  const studentBubbleStyle = {
    maxWidth: '78%',
    padding: '13px 17px',
    borderRadius: '18px',
    borderBottomRightRadius: '6px',
    fontFamily: fontBody,
    fontSize: '0.93rem',
    lineHeight: 1.55,
    background: 'linear-gradient(135deg, #1E2440 0%, #12172B 100%)',
    color: '#fff',
    boxShadow: shadow.sm,
  };

  return (
    <section
      style={{
        '--accent': profile.color,
        minHeight: '100vh',
        background: palette.paper,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: fontBody,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500;600&family=Inter:wght@400;500;600;700&family=Outfit:wght@600;700;800&display=swap');

        .focus-ring:focus-visible {
          outline: 2px solid var(--accent, #4A5FE0);
          outline-offset: 2px;
        }
        .focus-ring:focus:not(:focus-visible) {
          outline: none;
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* ===================================================
           Mobile fixes (≤575px) — most layout above is inline
           styled, so !important is needed to win specificity.
           =================================================== */
        @media (max-width: 575px) {
          .ts-header {
            padding: 12px 14px !important;
          }
          .ts-header-label {
            font-size: 0.85rem !important;
          }
          .ts-header-status {
            font-size: 0.66rem !important;
          }

          .ts-hero {
            padding: 22px 14px 12px !important;
          }
          .ts-tutor-hero {
            transform: scale(0.82);
          }
          .ts-status-text {
            font-size: 0.82rem !important;
            text-align: center;
            padding: 0 10px;
          }
          .ts-example-btn {
            padding: 8px 14px !important;
            font-size: 0.76rem !important;
          }

          .ts-conversation {
            padding: 8px 12px 150px !important;
          }
          .ts-bubble {
            max-width: 90% !important;
            font-size: 0.88rem !important;
            padding: 11px 14px !important;
          }

          .ts-notice {
            bottom: 104px !important;
            left: 12px !important;
            right: 12px !important;
            transform: none !important;
            max-width: none !important;
            font-size: 0.78rem !important;
          }

          .ts-mic-wrap {
            bottom: 18px !important;
          }
          .ts-mic-btn {
            width: 58px !important;
            height: 58px !important;
          }

          .ts-lesson-overlay {
            padding: 10px !important;
          }
          .ts-lesson-card {
            max-width: 100% !important;
            border-radius: 18px !important;
          }
          .ts-slide-header {
            padding: 12px 14px !important;
          }
          .ts-slide-header-title {
            font-size: 0.85rem !important;
          }
          .ts-step-info {
            padding: 12px 16px 0 !important;
          }
          .ts-slide-image-pad {
            padding: 12px 14px 0 !important;
          }
          .ts-slide-image-wrap {
            height: 190px !important;
          }
          .ts-slide-caption-pad {
            padding: 14px 14px 4px !important;
          }
          .ts-slide-caption {
            font-size: 1.02rem !important;
          }
          .ts-lesson-controls {
            padding: 12px 14px 18px !important;
            gap: 8px !important;
          }
          .ts-lesson-controls button {
            padding: 10px !important;
            font-size: 0.8rem !important;
          }
        }

        /* ===================================================
           Extra small phones (≤380px)
           =================================================== */
        @media (max-width: 380px) {
          .ts-header {
            padding: 10px 10px !important;
          }
          .ts-header-label {
            font-size: 0.78rem !important;
          }

          .ts-hero {
            padding: 16px 10px 10px !important;
          }
          .ts-tutor-hero {
            transform: scale(0.7);
          }
          .ts-status-text {
            font-size: 0.75rem !important;
          }
          .ts-example-btn {
            padding: 7px 12px !important;
            font-size: 0.7rem !important;
          }

          .ts-conversation {
            padding: 6px 8px 140px !important;
          }
          .ts-bubble {
            max-width: 94% !important;
            font-size: 0.82rem !important;
          }

          .ts-mic-btn {
            width: 52px !important;
            height: 52px !important;
          }

          .ts-slide-image-wrap {
            height: 160px !important;
          }
          .ts-slide-caption {
            font-size: 0.92rem !important;
          }
          .ts-lesson-controls button {
            font-size: 0.74rem !important;
          }
        }
      `}</style>

      {/* Header */}
      <div
        className="ts-header"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          borderBottom: `1px solid ${palette.mist}`,
          background: 'rgba(255,255,255,0.78)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
        }}
      >
        <motion.button
          type="button"
          onClick={() => navigate(-1)}
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.95 }}
          className="focus-ring"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: 'none',
            color: palette.ink,
            fontFamily: fontBody,
            fontWeight: 600,
            fontSize: '0.95rem',
            cursor: 'pointer',
            padding: '6px 8px',
            borderRadius: '10px',
          }}
        >
          <ArrowLeft size={18} />
          Back
        </motion.button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: 1.15 }}>
            <span
              className="ts-header-label"
              style={{ fontFamily: fontDisplay, fontWeight: 700, color: palette.ink, fontSize: '0.95rem' }}
            >
              {profile.label}
            </span>
            <span
              className="ts-header-status"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.72rem',
                color: palette.slate,
                fontWeight: 500,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: isSpeaking ? profile.color : isListening ? palette.listening : palette.faint,
                }}
              />
              {isSpeaking ? 'Speaking' : isListening ? 'Listening' : 'Ready'}
            </span>
          </div>
          <TutorMark profile={profile} size={38} speaking={isSpeaking} reducedMotion={reducedMotion} />
        </div>
      </div>

      {/* Hero: tutor mark + live status */}
      <div
        className="ts-hero"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '36px 20px 16px',
        }}
      >
        <div className="ts-tutor-hero">
          <TutorMark profile={profile} size={116} speaking={isSpeaking} reducedMotion={reducedMotion} />
        </div>

        <p
          className="ts-status-text"
          style={{
            marginTop: '18px',
            fontFamily: fontBody,
            fontSize: '0.92rem',
            fontWeight: 600,
            color: palette.slate,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            minHeight: '20px',
          }}
        >
          {isSpeaking ? (
            <>
              <SoundBars active reducedMotion={reducedMotion} color={profile.color} height={14} />
              {profile.label} is speaking…
            </>
          ) : isListening ? (
            <>
              <SoundBars active reducedMotion={reducedMotion} color={palette.listening} height={14} />
              Listening…
            </>
          ) : (
            `Tap the microphone to talk with ${profile.label}`
          )}
        </p>

        {/* Quick action: ask for a visual example */}
        <motion.button
          type="button"
          onClick={requestExample}
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
          className="focus-ring ts-example-btn"
          style={{
            marginTop: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            padding: '9px 18px',
            borderRadius: '999px',
            border: `1.5px solid ${profile.color}`,
            background: `${profile.color}14`,
            color: palette.ink,
            fontFamily: fontBody,
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
        role="log"
        aria-live="polite"
        className="ts-conversation"
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '10px 20px 150px',
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
              <div className="ts-bubble" style={msg.sender === 'student' ? studentBubbleStyle : tutorBubbleStyle}>
                {msg.text}
              </div>
            </motion.div>
          ))}

          {isThinking && (
            <motion.div
              key="thinking"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: easeOut }}
              style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '10px' }}
            >
              <div className="ts-bubble" style={tutorBubbleStyle}>
                <ThinkingDots color={profile.color} reducedMotion={reducedMotion} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {interimText && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
            <div
              className="ts-bubble"
              style={{
                ...studentBubbleStyle,
                background: 'rgba(18,23,43,0.5)',
                fontStyle: 'italic',
              }}
            >
              {interimText}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Inline notice — replaces a jarring browser alert() */}
      <AnimatePresence>
        {notice && (
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.25, ease: easeOut }}
            role="alert"
            className="ts-notice"
            style={{
              position: 'fixed',
              bottom: '114px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              alignItems: 'center',
              gap: '9px',
              padding: '11px 18px',
              borderRadius: '14px',
              background: palette.ink,
              color: '#fff',
              fontFamily: fontBody,
              fontSize: '0.82rem',
              fontWeight: 500,
              boxShadow: shadow.lg,
              zIndex: 60,
              maxWidth: '86vw',
              textAlign: 'center',
            }}
          >
            <AlertCircle size={16} color={profile.color} style={{ flexShrink: 0 }} />
            {notice}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mic button */}
      <div className="ts-mic-wrap" style={{ position: 'fixed', bottom: '28px', left: '50%', transform: 'translateX(-50%)' }}>
        <motion.button
          type="button"
          onClick={toggleMic}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          className="focus-ring ts-mic-btn"
          aria-label={!micSupported ? 'Voice input not supported' : isListening ? 'Stop listening' : 'Start voice input'}
          style={{
            position: 'relative',
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            border: 'none',
            background: !micSupported
              ? palette.slate
              : isListening
              ? 'linear-gradient(135deg, #FF8A80, #E2483F)'
              : profile.buttonGradient,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: micSupported ? 'pointer' : 'not-allowed',
            opacity: micSupported ? 1 : 0.85,
            boxShadow: isListening ? '0 16px 36px rgba(226,72,63,0.42)' : `0 16px 36px ${profile.glow}`,
          }}
        >
          {isListening ? <MicOff size={26} color="#fff" /> : <Mic size={26} color="#fff" />}

          {isListening && !reducedMotion && (
            <>
              <motion.span
                animate={{ opacity: [0.5, 0], scale: [1, 1.8] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
                style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '3px solid #E2483F' }}
              />
              <motion.span
                animate={{ opacity: [0.5, 0], scale: [1, 1.8] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut', delay: 0.4 }}
                style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '3px solid #E2483F' }}
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
            className="ts-lesson-overlay"
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(15,20,40,0.58)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
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
              className="ts-lesson-card"
              style={{
                width: '100%',
                maxWidth: '480px',
                background: palette.surface,
                borderRadius: '22px',
                overflow: 'hidden',
                boxShadow: shadow.lg,
              }}
            >
              <div style={{ height: '5px', background: profile.gradient }} />

              {/* Slide header */}
              <div
                className="ts-slide-header"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '15px 18px',
                  borderBottom: `1px solid ${palette.mist}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <TutorMark profile={profile} size={30} speaking={isSlideNarrating} reducedMotion={reducedMotion} />
                  <span
                    className="ts-slide-header-title"
                    style={{ fontFamily: fontDisplay, fontWeight: 700, color: palette.ink, fontSize: '0.95rem' }}
                  >
                    {activeLesson.title}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={closeLesson}
                  aria-label="Close example"
                  className="focus-ring"
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    border: 'none',
                    background: palette.paper,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  <X size={16} color={palette.slate} />
                </button>
              </div>

              {/* Step counter + progress */}
              <div className="ts-step-info" style={{ padding: '14px 20px 0' }}>
                <div
                  style={{
                    fontFamily: fontMono,
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: palette.faint,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    marginBottom: '6px',
                  }}
                >
                  Step {slideIndex + 1} of {activeLesson.slides.length}
                </div>
                <div style={{ height: '5px', borderRadius: '999px', background: palette.mist, overflow: 'hidden' }}>
                  <motion.div
                    animate={{ width: `${((slideIndex + 1) / activeLesson.slides.length) * 100}%` }}
                    transition={{ duration: 0.4, ease: easeOut }}
                    style={{ height: '100%', borderRadius: '999px', background: profile.gradient }}
                  />
                </div>
              </div>

              {/* Slide image — tap the arrows, use ← →, or swipe */}
              <div className="ts-slide-image-pad" style={{ padding: '16px 20px 0' }}>
                <div
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                  className="ts-slide-image-wrap"
                  style={{
                    width: '100%',
                    height: '240px',
                    borderRadius: '16px',
                    background: palette.paper,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    boxShadow: `inset 0 0 0 1px ${palette.mist}`,
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
              </div>

              {/* Slide caption + narration indicator */}
              <div className="ts-slide-caption-pad" style={{ padding: '18px 20px 6px' }}>
                <AnimatePresence mode="wait">
                  <motion.h3
                    key={slideIndex}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3, ease: easeOut }}
                    aria-live="polite"
                    className="ts-slide-caption"
                    style={{
                      fontFamily: fontDisplay,
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      color: palette.ink,
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
                      fontFamily: fontBody,
                      fontSize: '0.8rem',
                      color: profile.color,
                      fontWeight: 600,
                      marginTop: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '7px',
                    }}
                  >
                    <Volume2 size={14} />
                    {profile.label} is explaining…
                  </p>
                )}
              </div>

              {/* Controls */}
              <div className="ts-lesson-controls" style={{ display: 'flex', gap: '10px', padding: '14px 20px 22px' }}>
                <motion.button
                  type="button"
                  onClick={() => goToSlide(slideIndex - 1)}
                  disabled={slideIndex === 0}
                  whileHover={slideIndex !== 0 ? { scale: 1.02 } : {}}
                  whileTap={slideIndex !== 0 ? { scale: 0.97 } : {}}
                  className="focus-ring"
                  style={{
                    flex: 1,
                    padding: '11px',
                    borderRadius: '12px',
                    border: `1.5px solid ${palette.mist}`,
                    background: palette.surface,
                    color: palette.ink,
                    fontFamily: fontBody,
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: slideIndex === 0 ? 'not-allowed' : 'pointer',
                    opacity: slideIndex === 0 ? 0.4 : 1,
                  }}
                >
                  Back
                </motion.button>

                {isLastSlide ? (
                  <motion.button
                    type="button"
                    onClick={closeLesson}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="focus-ring"
                    style={{
                      flex: 2,
                      padding: '11px',
                      borderRadius: '12px',
                      border: 'none',
                      background: profile.buttonGradient,
                      color: '#fff',
                      fontFamily: fontBody,
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                    }}
                  >
                    Got it!
                  </motion.button>
                ) : (
                  <motion.button
                    type="button"
                    onClick={() => goToSlide(slideIndex + 1)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="focus-ring"
                    style={{
                      flex: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '11px',
                      borderRadius: '12px',
                      border: 'none',
                      background: profile.buttonGradient,
                      color: '#fff',
                      fontFamily: fontBody,
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                    }}
                  >
                    Next
                    <ArrowRight size={15} />
                  </motion.button>
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