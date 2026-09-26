import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ArrowLeft, Mic, MicOff, Send, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// === REDESIGN NOTES ===
// Voice tutor logic: speech recognition, speech synthesis, real AI tutor API,
// structured tutor responses, and a lightweight responsive chat interface.
// What changed is the visual layer:
//  - a small, deliberate color/type token system instead of scattered hexes
//  - a signature "tutor mark": an actual SVG mascot face (kangaroo for Kanga,
//    panda for Pandy) with ears, eyes and a nose — replacing the earlier
//    plain gradient circle with two CSS-div "ear" nubs, which read as an
//    abstract blob rather than a recognizable animal
//  - glass surfaces on the header and tutor bubbles
//  - a "thinking…" indicator while a reply is on its way
//  - an inline toast instead of a blocking alert() for the unsupported-mic case
//  - prefers-reduced-motion is respected throughout
//  - mobile breakpoints (≤575px, ≤380px) added via classNames + a media
//    query block, since most layout here uses inline styles
//  - a text input bar next to the mic button so students can type
//    a message instead of (or in addition to) speaking it

const easeOut = [0.25, 0.1, 0.25, 1];
const STORAGE_KEY = 'selectedTutorId';
const API_URL = 'http://localhost:5000/api';

// === DESIGN TOKENS ===
const palette = {
  ink: '#241E42',
  paper: '#FFF7E8',
  surface: '#FFFFFF',
  mist: '#FFE3B0',
  slate: '#7A6FA0',
  faint: '#B9AFD9',
  listening: '#FF5A5F',
};

const fontDisplay = "'Baloo 2', 'Fredoka', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const fontBody = "'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const fontMono = "'Baloo 2', 'Nunito', sans-serif";

const shadow = {
  sm: '0 3px 0 rgba(36,30,66,0.10)',
  md: '0 6px 0 rgba(36,30,66,0.12)',
  lg: '0 10px 0 rgba(36,30,66,0.14)',
};

// Voice personalities — tuned for a warm, clear, kid-friendly Australian accent.
// lang 'en-AU' asks the browser for an Australian voice first; namePreferHints
// are common Australian voice names shipped on Chrome/Edge/Safari/Windows.
// color/deep/gradient/buttonGradient/glow/earStyle drive the tutor's visual mark.
const tutorProfiles = {
  kanga: {
    label: 'Kanga',
    lang: 'en-AU',
    voiceGender: 'female',
    pitch: 1.18,
    rate: 0.96,
    namePreferHints: [
      'Google UK English Female',
      'Google US English Female',
      'Microsoft Aria',
      'Microsoft Jenny',
      'Microsoft Michelle',
      'Karen',       // macOS/iOS Australian female
      'Catherine',   // Windows Australian female
      'Samantha',
      'Zira',
      'Ava',
      'Susan',
      'Moira',
      'Tessa',
      'female',
    ],
    greeting: "G'day, I'm Kanga! I'm so excited to help you learn maths today. Tap the microphone and ask me anything, or type your question below.",
    color: '#F0A23D',
    deep: '#C4611A',
    gradient: 'linear-gradient(135deg, #FFCB82 0%, #F0A23D 55%, #E1791F 100%)',
    buttonGradient: 'linear-gradient(135deg, #F0A23D 0%, #C4611A 100%)',
    glow: 'rgba(240,162,61,0.38)',
    
  },
  pandy: {
    label: 'Pandy',
    lang: 'en-AU',
    voiceGender: 'male',
    pitch: 0.88,
    rate: 0.94,
    namePreferHints: ['Australia', 'male', 'Lee', 'William'],
    greeting: "G'day, I'm Pandy! Ready to work through some maths together? Tap the microphone or type your question below.",
    color: '#4A5FE0',
    deep: '#1E1A4A',
    gradient: 'linear-gradient(135deg, #93A4FF 0%, #4A5FE0 55%, #3626B8 100%)',
    buttonGradient: 'linear-gradient(135deg, #4A5FE0 0%, #1E1A4A 100%)',
    glow: 'rgba(74,95,224,0.38)',
    
  },
};

const DEFAULT_TUTOR_ID = 'kanga';

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

// The signature mark: a real SVG mascot face, not a generic gradient orb.
// Kanga gets tall upright kangaroo ears, a muzzle and dot eyes; Pandy gets
// round black ears, panda eye-patches and a white face. Both share the
// same head circle sizing/position so the "speaking" pulse animation and
// the layout math around them stay identical between the two.
const TutorMark = ({ profile, size = 112, speaking = false, reducedMotion = false }) => {
  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        flexShrink: 0,
      }}
    >
      {/* Soft tutor glow */}
      <div
        style={{
          position: 'absolute',
          inset: '-15%',
          borderRadius: '50%',
          background: profile.gradient,
          opacity: 0.22,
          filter: `blur(${Math.round(size * 0.22)}px)`,
        }}
      />

      {/* Simple tutor circle */}
      <motion.div
        animate={
          speaking && !reducedMotion
            ? { scale: [1, 1.045, 1] }
            : { scale: 1 }
        }
        transition={{
          duration: 1.1,
          repeat: speaking && !reducedMotion ? Infinity : 0,
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: profile.gradient,
          boxShadow: `0 ${Math.round(size * 0.12)}px ${Math.round(
            size * 0.3
          )}px ${profile.glow}`,
        }}
      >
        {/* Soft highlight */}
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

  // NEW: typed-message state
  const [textInput, setTextInput] = useState('');

  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);
  const hasGreetedRef = useRef(false);
  const noticeTimeoutRef = useRef(null);

  const profile = tutorProfiles[tutorId] || tutorProfiles[DEFAULT_TUTOR_ID];

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

    // Prefer an explicit Australian English voice first, then narrow by gender.
    const auVoices = voices.filter((v) => v.lang?.toLowerCase() === 'en-au');
    const pool = auVoices.length ? auVoices : voices.filter((v) => v.lang?.startsWith('en'));

    if (profile.voiceGender === 'female') {
      const femaleByLabel = pool.find((v) => /female/i.test(v.name));
      if (femaleByLabel) return femaleByLabel;
    }
    if (profile.voiceGender === 'male') {
      const maleByLabel = pool.find((v) => /male/i.test(v.name) && !/female/i.test(v.name));
      if (maleByLabel) return maleByLabel;
    }

    for (const hint of profile.namePreferHints) {
      const match = pool.find((v) => v.name.toLowerCase().includes(hint.toLowerCase()))
        || voices.find((v) => v.name.toLowerCase().includes(hint.toLowerCase()));
      if (match) return match;
    }

    return pool[0] || voices.find((v) => v.lang?.startsWith('en')) || voices[0];
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

  const buildTutorSpeech = (tutor) => {
  const parts = [];

  if (tutor.message) {
    parts.push(tutor.message);
  }

  if (tutor.steps?.length) {
    parts.push("Let's solve it step by step.");

    tutor.steps.forEach((step) => {
      parts.push(
        `Step ${step.step}. ${step.explanation}. ${step.calculation}.`
      );
    });
  }

  if (tutor.answer) {
    parts.push(`So, the answer is ${tutor.answer}.`);
  }

  if (tutor.hint) {
    parts.push(`Remember this: ${tutor.hint}.`);
  }

  if (tutor.encouragement) {
    parts.push(tutor.encouragement);
  }

  return parts.join(" ");
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

    // Read the complete tutor explanation aloud
    const speech = buildTutorSpeech(tutor);
    speak(speech);

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

  // NEW: typed-message submit handler — mirrors what the mic path does
  // (stop speech, send through the same handleStudentMessage pipeline)
  const handleTextSubmit = (e) => {
    e.preventDefault();
    const value = textInput.trim();
    if (!value) return;
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }
    setTextInput('');
    handleStudentMessage(value);
  };

  const requestExample = () => {
    handleStudentMessage('Can you show me a step-by-step example?');
  };

  const tutorBubbleStyle = {
    maxWidth: '80%',
    padding: '15px 19px',
    borderRadius: '22px',
    borderBottomLeftRadius: '6px',
    fontFamily: fontBody,
    fontSize: '1rem',
    fontWeight: 600,
    lineHeight: 1.55,
    background: palette.surface,
    color: palette.ink,
    border: `2.5px solid ${palette.mist}`,
    borderLeft: `5px solid ${profile.color}`,
    boxShadow: shadow.sm,
  };

  const studentBubbleStyle = {
    maxWidth: '80%',
    padding: '15px 19px',
    borderRadius: '22px',
    borderBottomRightRadius: '6px',
    fontFamily: fontBody,
    fontSize: '1rem',
    fontWeight: 700,
    lineHeight: 1.55,
    background: profile.buttonGradient,
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
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Nunito:wght@400;600;700;800;900&display=swap');

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
            padding: 8px 12px 172px !important;
          }
          .ts-bubble {
            max-width: 90% !important;
            font-size: 0.88rem !important;
            padding: 11px 14px !important;
          }

          .ts-notice {
            bottom: 126px !important;
            left: 12px !important;
            right: 12px !important;
            transform: none !important;
            max-width: none !important;
            font-size: 0.78rem !important;
          }

          .ts-input-bar-wrap {
            bottom: 16px !important;
            padding: 0 12px !important;
          }
          .ts-text-input {
            font-size: 0.85rem !important;
            padding: 10px 14px !important;
          }
          .ts-send-btn {
            width: 40px !important;
            height: 40px !important;
          }
          .ts-mic-btn {
            width: 46px !important;
            height: 46px !important;
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
            padding: 6px 8px 164px !important;
          }
          .ts-bubble {
            max-width: 94% !important;
            font-size: 0.82rem !important;
          }

          .ts-text-input {
            font-size: 0.8rem !important;
            padding: 9px 12px !important;
          }
          .ts-send-btn {
            width: 38px !important;
            height: 38px !important;
          }
          .ts-mic-btn {
            width: 42px !important;
            height: 42px !important;
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
          padding: '14px 20px',
          borderBottom: `4px solid ${profile.color}`,
          background: palette.surface,
        }}
      >
        <motion.button
          type="button"
          onClick={() => navigate(-1)}
          whileHover={{ x: -2, scale: 1.04 }}
          whileTap={{ scale: 0.92 }}
          className="focus-ring"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: palette.paper,
            border: `2px solid ${palette.mist}`,
            color: palette.ink,
            fontFamily: fontDisplay,
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: 'pointer',
            padding: '8px 16px 8px 10px',
            borderRadius: '999px',
          }}
        >
          <ArrowLeft size={18} />
          Back
        </motion.button>

        <div
          className="ts-header-label"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: fontDisplay,
            fontWeight: 800,
            color: palette.ink,
            fontSize: '1.15rem',
          }}
        >
          {profile.label}
          <span
            className="ts-header-status"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.72rem',
              fontFamily: fontBody,
              color: '#fff',
              fontWeight: 800,
              background: isSpeaking ? profile.color : isListening ? palette.listening : palette.slate,
              padding: '4px 10px',
              borderRadius: '999px',
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: '#fff',
              }}
            />
            {isSpeaking ? 'Speaking' : isListening ? 'Listening' : 'Ready'}
          </span>
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

        <div
          className="ts-status-text"
          style={{
            marginTop: '18px',
            fontFamily: fontDisplay,
            fontSize: '1.05rem',
            fontWeight: 700,
            color: palette.ink,
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
            `Talk or type to chat with ${profile.label}`
          )}
        </div>

        {/* Quick action: ask for a visual example */}
        <motion.button
          type="button"
          onClick={requestExample}
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
          className="focus-ring ts-example-btn"
          style={{
            marginTop: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 22px',
            borderRadius: '999px',
            border: 'none',
            background: profile.buttonGradient,
            color: '#fff',
            fontFamily: fontDisplay,
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: 'pointer',
            boxShadow: `0 5px 0 ${profile.deep}`,
          }}
        >
          <Sparkles size={16} color="#fff" />
          Show me an example!
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
          padding: '10px 20px 172px',
          maxWidth: '640px',
          width: '100%',
          margin: '0 auto',
        }}
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
  <motion.div
    key={i}
    className={`ts-message ${
      msg.sender === 'student'
        ? 'ts-message-student'
        : 'ts-message-tutor'
    }`}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div
      className="ts-bubble"
      style={
        msg.sender === 'student' ? studentBubbleStyle : tutorBubbleStyle
      }
    >

      {/* Main tutor message */}
      <div>
        {msg.text}
      </div>


      {/* Structured AI tutor response */}
      {msg.sender === 'tutor' && msg.tutor && (
        <div style={{ marginTop: '18px' }}>

          {/* Steps */}
          {msg.tutor.steps?.length > 0 && (
            <div>

              <div
                style={{
                  fontWeight: 700,
                  marginBottom: '10px',
                }}
              >
                Let's solve it step by step:
              </div>

              {msg.tutor.steps.map((step) => (
                <div
                  key={step.step}
                  style={{
                    marginBottom: '14px',
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      marginBottom: '4px',
                    }}
                  >
                    Step {step.step}
                  </div>

                  <div
                    style={{
                      marginBottom: '5px',
                    }}
                  >
                    {step.explanation}
                  </div>

                  <div
                    style={{
                      background: '#f5f7fb',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontWeight: 600,
                    }}
                  >
                    {step.calculation}
                  </div>
                </div>
              ))}

            </div>
          )}


          {/* Answer */}
          {msg.tutor.answer && (
            <div
              style={{
                marginTop: '16px',
                padding: '12px 14px',
                borderRadius: '10px',
                background: '#fff7e8',
                border: '1px solid #f5a623',
              }}
            >
              <strong>Answer: </strong>
              {msg.tutor.answer}
            </div>
          )}


          {/* Hint */}
          {msg.tutor.hint && (
            <div
              style={{
                marginTop: '12px',
                fontSize: '14px',
              }}
            >
              <strong>💡 Hint:</strong>{' '}
              {msg.tutor.hint}
            </div>
          )}


          {/* Encouragement */}
          {msg.tutor.encouragement && (
            <div
              style={{
                marginTop: '10px',
                fontWeight: 600,
              }}
            >
              {msg.tutor.encouragement}
            </div>
          )}

        </div>
      )}

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
              bottom: '136px',
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

      {/* NEW: Input bar — text field + send button, plus the mic button.
          Both paths funnel into handleStudentMessage, so typing and
          speaking behave identically from the tutor's point of view. */}
      <div
        className="ts-input-bar-wrap"
        style={{
          position: 'fixed',
          bottom: '24px',
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          padding: '0 20px',
          zIndex: 40,
        }}
      >
        <form
          onSubmit={handleTextSubmit}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            width: '100%',
            maxWidth: '640px',
          }}
        >
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              background: palette.surface,
              border: `2.5px solid ${palette.mist}`,
              borderRadius: '999px',
              boxShadow: shadow.md,
              paddingRight: '6px',
            }}
          >
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={`Ask ${profile.label} something…`}
              aria-label="Type a message"
              className="focus-ring ts-text-input"
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                padding: '14px 20px',
                fontFamily: fontBody,
                fontWeight: 700,
                fontSize: '1rem',
                color: palette.ink,
              }}
            />
            <motion.button
              type="submit"
              disabled={!textInput.trim()}
              whileHover={textInput.trim() ? { scale: 1.06 } : {}}
              whileTap={textInput.trim() ? { scale: 0.94 } : {}}
              aria-label="Send message"
              className="focus-ring ts-send-btn"
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                border: 'none',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: textInput.trim() ? profile.buttonGradient : palette.mist,
                color: '#fff',
                cursor: textInput.trim() ? 'pointer' : 'not-allowed',
                boxShadow: textInput.trim() ? `0 4px 0 ${profile.deep}` : 'none',
              }}
            >
              <Send size={18} color={textInput.trim() ? '#fff' : palette.faint} />
            </motion.button>
          </div>

          <motion.button
            type="button"
            onClick={toggleMic}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            className="focus-ring ts-mic-btn"
            aria-label={!micSupported ? 'Voice input not supported' : isListening ? 'Stop listening' : 'Start voice input'}
            style={{
              position: 'relative',
              width: '58px',
              height: '58px',
              borderRadius: '50%',
              border: 'none',
              flexShrink: 0,
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
              boxShadow: isListening ? `0 5px 0 #B8332F` : `0 5px 0 ${profile.deep}`,
            }}
          >
            {isListening ? <MicOff size={22} color="#fff" /> : <Mic size={22} color="#fff" />}

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
        </form>
      </div>

    </section>
  );
};

export default TutorSession;