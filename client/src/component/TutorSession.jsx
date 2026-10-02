import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ArrowLeft, Mic, MicOff, Send, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TutorAvatar from './TutorAvatar';

const easeOut = [0.25, 0.1, 0.25, 1];
const STORAGE_KEY = 'selectedTutorId';
const API_URL = 'http://localhost:5000/api';

// ============================================================
// DESIGN TOKENS (light theme)
// ============================================================

const palette = {
  ink: '#1F1B2E', // main text
  paper: '#F4F4F6', // page background
  card: '#FFFFFF', // input bar
  surface: '#F6F3FB', // tutor bubble background
  mist: '#E6E1F0', // borders
  slate: '#7A7394', // secondary text / idle status
  faint: '#B9B3CC', // disabled
  listening: '#E2483F',
};

const fontDisplay = "'Baloo 2', 'Fredoka', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const fontBody = "'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

const shadow = {
  sm: '0 3px 0 rgba(36,30,66,0.10)',
  md: '0 4px 0 rgba(36,30,66,0.08)',
  lg: '0 10px 24px rgba(36,30,66,0.18)',
};

// ============================================================
// TUTOR PROFILES
// Speech uses the plain browser default voice at normal speed.
// ============================================================

const tutorProfiles = {
  kanga: {
    label: 'Kanga',
    greeting:
      "G'day, I'm Kanga! I'm so excited to help you learn maths today. Tap the microphone and ask me anything, or type your question below.",
    color: '#F0A23D',
    deep: '#C4611A',
    soft: '#FFF3E0',
    gradient: 'linear-gradient(135deg, #FFCB82 0%, #F0A23D 55%, #E1791F 100%)',
    buttonGradient: 'linear-gradient(135deg, #F0A23D 0%, #C4611A 100%)',
  },
  pandy: {
    label: 'Pandy',
    greeting:
      "G'day, I'm Pandy! Ready to work through some maths together? Tap the microphone or type your question below.",
    color: '#4A5FE0',
    deep: '#1E1A4A',
    soft: '#ECEFFF',
    gradient: 'linear-gradient(135deg, #93A4FF 0%, #4A5FE0 55%, #3626B8 100%)',
    buttonGradient: 'linear-gradient(135deg, #4A5FE0 0%, #1E1A4A 100%)',
  },
  koala: {
    label: 'Koala',
    greeting:
      "G'day, I'm Koala! Let's take maths nice and easy together. Tap the microphone and ask me anything, or type your question below.",
    color: '#6E96AA',
    deep: '#3E5A68',
    soft: '#E8F2F6',
    gradient: 'linear-gradient(135deg, #A8CBDA 0%, #6E96AA 55%, #4A7385 100%)',
    buttonGradient: 'linear-gradient(135deg, #6E96AA 0%, #3E5A68 100%)',
  },
};

const DEFAULT_TUTOR_ID = 'kanga';

// ============================================================
// HOOKS
// ============================================================

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(() =>
    Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)
  );

  useEffect(() => {
    if (!window.matchMedia) return;
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
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

// Smaller avatar on short or narrow screens so the chat keeps its space.
const useAvatarSize = () => {
  const compute = () =>
    window.innerWidth < 576 || window.innerHeight < 700 ? 104 : 140;

  const [size, setSize] = useState(compute);

  useEffect(() => {
    const onResize = () => setSize(compute());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return size;
};

// ============================================================
// SOUND BARS
// ============================================================

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
          transition={{
            duration: 0.9,
            repeat: active ? Infinity : 0,
            ease: 'easeInOut',
            delay: i * 0.12,
          }}
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

// ============================================================
// THINKING DOTS
// ============================================================

const ThinkingDots = ({ color, reducedMotion }) => (
  <div style={{ display: 'flex', gap: '5px', padding: '3px 2px' }}>
    {[0, 1, 2].map((i) =>
      reducedMotion ? (
        <span
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: color,
            opacity: 0.5 + i * 0.15,
          }}
        />
      ) : (
        <motion.span
          key={i}
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut', delay: i * 0.15 }}
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: color,
            display: 'inline-block',
          }}
        />
      )
    )}
  </div>
);

// ============================================================
// MAIN COMPONENT
// ============================================================

const TutorSession = () => {
  const navigate = useNavigate();
  const reducedMotion = usePrefersReducedMotion();
  const avatarSize = useAvatarSize();

  const [tutorId] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved && tutorProfiles[saved] ? saved : DEFAULT_TUTOR_ID;
  });

  const profile = tutorProfiles[tutorId] || tutorProfiles[DEFAULT_TUTOR_ID];

  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [micSupported] = useState(() =>
    Boolean(window.SpeechRecognition || window.webkitSpeechRecognition)
  );
  const [interimText, setInterimText] = useState('');
  const [notice, setNotice] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [lessonId] = useState(null);
  const [isSessionReady, setIsSessionReady] = useState(false);
  const [textInput, setTextInput] = useState('');

  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);
  const hasGreetedRef = useRef(false);
  const noticeTimeoutRef = useRef(null);
  const handleStudentMessageRef = useRef(null);
  const speakTokenRef = useRef(0);

  const showNotice = (text) => {
    setNotice(text);
    if (noticeTimeoutRef.current) clearTimeout(noticeTimeoutRef.current);
    noticeTimeoutRef.current = setTimeout(() => setNotice(null), 4000);
  };

  // ==========================================================
  // SPEECH RECOGNITION (microphone input)
  // ==========================================================

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

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

      if (finalTranscript.trim()) {
        handleStudentMessageRef.current?.(finalTranscript.trim());
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimText('');
    };

    recognition.onerror = (event) => {
      console.warn('Speech recognition error:', event.error);
      setIsListening(false);
      setInterimText('');
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.onresult = null;
      recognition.onend = null;
      recognition.onerror = null;
      try {
        recognition.abort();
      } catch {
        // Ignore cleanup errors.
      }
      recognitionRef.current = null;
    };
  }, [tutorId]);

  // ==========================================================
  // CHAT SCROLLING (interimText is intentionally not included)
  // ==========================================================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto', block: 'nearest' });
  }, [messages, isThinking]);

  // ==========================================================
  // CREATE CONVERSATION
  // ==========================================================

  useEffect(() => {
    let cancelled = false;

    const createConversation = async () => {
      try {
        const response = await fetch(`${API_URL}/conversations`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: `${profile.label} Math Session` }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Failed to create conversation');
        }

        if (cancelled) return;

        setConversationId(data.conversation.id);
        setIsSessionReady(true);
      } catch (error) {
        if (cancelled) return;

        console.error('Conversation creation error:', error);
        setIsSessionReady(false);
        showNotice('I could not start the math session. Please try again.');
      }
    };

    createConversation();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.label]);

  // ==========================================================
  // TEXT TO SPEECH (basic browser voice)
  // ==========================================================

  const stopSpeaking = () => {
    speakTokenRef.current += 1;

    if ('speechSynthesis' in window) {
      const synth = window.speechSynthesis;
      if (synth.speaking || synth.pending) synth.cancel();
    }

    setIsSpeaking(false);
  };

  const speak = (text, onEnd) => {
    stopSpeaking();

    const speechText = text?.trim();

    if (!speechText || !('speechSynthesis' in window)) {
      onEnd?.();
      return;
    }

    const token = speakTokenRef.current;

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.lang = 'en-AU';
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      if (token !== speakTokenRef.current) return;
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      if (token !== speakTokenRef.current) return;
      setIsSpeaking(false);
      onEnd?.();
    };

    utterance.onerror = (event) => {
      if (token !== speakTokenRef.current) return;

      if (event.error !== 'canceled' && event.error !== 'interrupted') {
        console.warn('Speech error:', event.error);
      }

      setIsSpeaking(false);
      onEnd?.();
    };

    window.speechSynthesis.speak(utterance);
  };

  // ==========================================================
  // INITIAL GREETING
  // ==========================================================

  useEffect(() => {
    if (hasGreetedRef.current) return;
    hasGreetedRef.current = true;

    setMessages((prev) => [...prev, { sender: 'tutor', text: profile.greeting }]);
    speak(profile.greeting);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.greeting]);

  // ==========================================================
  // CLEANUP
  // ==========================================================

  useEffect(() => {
    return () => {
      stopSpeaking();

      try {
        recognitionRef.current?.abort();
      } catch {
        // Ignore cleanup errors.
      }

      if (noticeTimeoutRef.current) clearTimeout(noticeTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ==========================================================
  // MESSAGE HELPERS
  // ==========================================================

  const addTutorMessage = (text) => {
    setMessages((prev) => [...prev, { sender: 'tutor', text }]);
    speak(text);
  };

  const addStudentMessage = (text) => {
    setMessages((prev) => [...prev, { sender: 'student', text }]);
  };

const getTutorSpeech = (tutor) => {
  const parts = [];

  if (tutor.message?.trim()) parts.push(tutor.message.trim());

  tutor.steps?.forEach((step) => {
    if (step.explanation) parts.push(`Step ${step.step}. ${step.explanation}`);
  });

  if (tutor.answer) parts.push(`The answer is ${tutor.answer}.`);
  if (tutor.hint) parts.push(`Hint: ${tutor.hint}`);
  if (tutor.encouragement) parts.push(tutor.encouragement);

  return parts.join(' ') || "Let's work through this together.";
};

  // ==========================================================
  // HANDLE STUDENT MESSAGE
  // ==========================================================

  const handleStudentMessage = async (text) => {
    const cleanText = text?.trim();

    if (!cleanText) return;

    if (!conversationId || !isSessionReady) {
      showNotice('Your tutor is still getting ready. Please try again in a moment.');
      return;
    }

    stopSpeaking();
    setInterimText('');

    addStudentMessage(cleanText);
    setIsThinking(true);

    try {
      const response = await fetch(`${API_URL}/tutor/message`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          lessonId,
          message: cleanText,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Tutor request failed');
      }

      const tutor = data.response?.tutor;

      if (!tutor) {
        throw new Error('Tutor returned an invalid response');
      }

      setIsThinking(false);

      setMessages((prev) => [
        ...prev,
        {
          sender: 'tutor',
          text: tutor.message,
          tutor,
        },
      ]);

      speak(getTutorSpeech(tutor));
    } catch (error) {
      console.error('Tutor request error:', error);

      setIsThinking(false);

      addTutorMessage(
        "Sorry! I had a little trouble thinking about that question. Let's try again."
      );

      showNotice('Something went wrong while talking to your math tutor.');
    }
  };

  useEffect(() => {
    handleStudentMessageRef.current = handleStudentMessage;
  });

  // ==========================================================
  // MICROPHONE
  // ==========================================================

  const toggleMic = () => {
    if (!isSessionReady) {
      showNotice('Your tutor is still getting ready. Please wait a moment.');
      return;
    }

    if (!micSupported) {
      showNotice("Voice input isn't available in this browser. Try Chrome on desktop or Android.");
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch {
        // Ignore stop errors.
      }
      setIsListening(false);
    } else {
      stopSpeaking();

      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (error) {
        console.warn('Could not start speech recognition:', error);
        setIsListening(false);
      }
    }
  };

  // ==========================================================
  // TEXT SUBMIT
  // ==========================================================

  const handleTextSubmit = (event) => {
    event.preventDefault();

    const value = textInput.trim();

    if (!value) return;

    if (!isSessionReady) {
      showNotice('Your tutor is still getting ready. Please wait a moment.');
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch {
        // Ignore stop errors.
      }
      setIsListening(false);
    }

    setTextInput('');
    handleStudentMessage(value);
  };

  const requestExample = () => {
    handleStudentMessage('Can you show me a step-by-step example?');
  };

  // ==========================================================
  // STYLES
  // ==========================================================

  const tutorBubbleStyle = {
    maxWidth: '82%',
    padding: '14px 18px',
    borderRadius: '20px',
    borderBottomLeftRadius: '6px',
    fontFamily: fontBody,
    fontSize: '1rem',
    fontWeight: 600,
    lineHeight: 1.55,
    background: palette.surface,
    color: palette.ink,
    border: `2px solid ${palette.mist}`,
    borderLeft: `5px solid ${profile.color}`,
  };

  const studentBubbleStyle = {
    maxWidth: '82%',
    padding: '14px 18px',
    borderRadius: '20px',
    borderBottomRightRadius: '6px',
    fontFamily: fontBody,
    fontSize: '1rem',
    fontWeight: 700,
    lineHeight: 1.55,
    background: profile.buttonGradient,
    color: '#fff',
    boxShadow: shadow.sm,
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <section
      className="ts-root"
      style={{
        '--accent': profile.color,
        background: palette.paper,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: fontBody,
        color: palette.ink,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Nunito:wght@400;600;700;800;900&display=swap');

        .ts-root {
          height: 100vh;
          height: 100dvh;
          overflow: hidden;
        }

        .ts-text-input::placeholder {
          color: ${palette.slate};
          opacity: 0.8;
        }

        .focus-ring:focus-visible {
          outline: 2px solid var(--accent, #4A5FE0);
          outline-offset: 2px;
        }
        .focus-ring:focus:not(:focus-visible) {
          outline: none;
        }

        .ts-conversation::-webkit-scrollbar { width: 8px; }
        .ts-conversation::-webkit-scrollbar-thumb {
          background: ${palette.mist};
          border-radius: 8px;
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        @media (max-width: 575px) {
          .ts-header { padding: 10px 14px !important; }
          .ts-header-label { font-size: 0.95rem !important; }
          .ts-header-status { font-size: 0.66rem !important; }
          .ts-status-text { font-size: 0.85rem !important; }
          .ts-conversation { padding: 8px 12px !important; }
          .ts-bubble {
            max-width: 90% !important;
            font-size: 0.9rem !important;
            padding: 11px 14px !important;
          }
          .ts-dock { padding: 8px 12px calc(12px + env(safe-area-inset-bottom)) !important; }
          .ts-text-input { font-size: 0.9rem !important; padding: 11px 14px !important; }
          .ts-send-btn { width: 40px !important; height: 40px !important; }
          .ts-mic-btn { width: 48px !important; height: 48px !important; }
          .ts-notice {
            left: 12px !important;
            right: 12px !important;
            transform: none !important;
            max-width: none !important;
          }
        }
      `}</style>

      {/* Header */}
      <div
        className="ts-header"
        style={{
          flex: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 20px',
          background: palette.paper,
          borderBottom: `4px solid ${profile.color}`,
          boxShadow: '0 2px 10px rgba(36,30,66,0.08)',
          zIndex: 20,
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
              background: isSpeaking
                ? profile.color
                : isListening
                ? palette.listening
                : palette.slate,
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

      {/* Tutor avatar and status */}
      <div
        style={{
          flex: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '14px 20px 8px',
        }}
      >
        <TutorAvatar
          tutorId={tutorId}
          speaking={isSpeaking}
          size={avatarSize}
          reducedMotion={reducedMotion}
        />

        <div
          className="ts-status-text"
          style={{
            marginTop: '8px',
            fontFamily: fontDisplay,
            fontSize: '1rem',
            fontWeight: 700,
            color: palette.ink,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            minHeight: '20px',
            textAlign: 'center',
          }}
        >
          {isSpeaking ? (
            <>
              <SoundBars active reducedMotion={reducedMotion} color={profile.color} height={14} />
              {profile.label} is speaking…
            </>
          ) : isListening ? (
            <>
              <SoundBars
                active
                reducedMotion={reducedMotion}
                color={palette.listening}
                height={14}
              />
              Listening…
            </>
          ) : (
            `Talk or type to chat with ${profile.label}`
          )}
        </div>
      </div>

      {/* Conversation (scrolls on its own, never hides behind the input) */}
      <div
        role="log"
        aria-live="polite"
        className="ts-conversation"
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          padding: '8px 20px',
          maxWidth: '680px',
          width: '100%',
          margin: '0 auto',
        }}
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={`${msg.sender}-${i}`}
              className={`ts-message ${
                msg.sender === 'student' ? 'ts-message-student' : 'ts-message-tutor'
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: 'flex',
                justifyContent: msg.sender === 'student' ? 'flex-end' : 'flex-start',
                marginBottom: '10px',
              }}
            >
              <div
                className="ts-bubble"
                style={msg.sender === 'student' ? studentBubbleStyle : tutorBubbleStyle}
              >
                <div>{msg.text}</div>

                {msg.sender === 'tutor' && msg.tutor && (
                  <div style={{ marginTop: '16px' }}>
                    {msg.tutor.steps?.length > 0 && (
                      <div>
                        <div style={{ fontWeight: 800, marginBottom: '10px' }}>
                          Let's solve it step by step:
                        </div>

                        {msg.tutor.steps.map((step) => (
                          <div key={step.step} style={{ marginBottom: '14px' }}>
                            <div
                              style={{
                                fontWeight: 800,
                                marginBottom: '4px',
                                color: profile.deep,
                              }}
                            >
                              Step {step.step}
                            </div>

                            <div style={{ marginBottom: '6px' }}>{step.explanation}</div>

                            <div
                              style={{
                                background: profile.soft,
                                border: `1.5px solid ${profile.color}55`,
                                borderRadius: '10px',
                                padding: '8px 12px',
                                fontWeight: 700,
                              }}
                            >
                              {step.calculation}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {msg.tutor.answer && (
                      <div
                        style={{
                          marginTop: '16px',
                          padding: '12px 14px',
                          borderRadius: '12px',
                          background: profile.soft,
                          border: `2px solid ${profile.color}`,
                        }}
                      >
                        <strong>Answer: </strong>
                        {msg.tutor.answer}
                      </div>
                    )}

                    {msg.tutor.hint && (
                      <div style={{ marginTop: '12px', fontSize: '0.9rem' }}>
                        <strong>💡 Hint:</strong> {msg.tutor.hint}
                      </div>
                    )}

                    {msg.tutor.encouragement && (
                      <div style={{ marginTop: '10px', fontWeight: 700 }}>
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
                background: palette.surface,
                color: palette.slate,
                border: `2px dashed ${palette.faint}`,
                boxShadow: 'none',
                fontStyle: 'italic',
              }}
            >
              {interimText}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Notice */}
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
              bottom: '150px',
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
              fontSize: '0.85rem',
              fontWeight: 600,
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

      {/* Input dock */}
      <div
        className="ts-dock"
        style={{
          flex: 'none',
          padding: '10px 20px calc(16px + env(safe-area-inset-bottom))',
          background: palette.paper,
          borderTop: `1px solid ${palette.mist}`,
          zIndex: 40,
        }}
      >
        <div
          style={{
            maxWidth: '680px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex' }}>
            <motion.button
              type="button"
              onClick={requestExample}
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="focus-ring"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: '999px',
                border: `2px solid ${profile.color}`,
                background: profile.soft,
                color: profile.deep,
                fontFamily: fontDisplay,
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              <Sparkles size={15} color={profile.deep} />
              Show me an example!
            </motion.button>
          </div>

          <form
            onSubmit={handleTextSubmit}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              width: '100%',
            }}
          >
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                background: palette.card,
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
                  minWidth: 0,
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  padding: '13px 20px',
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
                  width: '44px',
                  height: '44px',
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
              aria-label={
                !isSessionReady
                  ? 'Tutor is still connecting'
                  : !micSupported
                  ? 'Voice input not supported'
                  : isListening
                  ? 'Stop listening'
                  : 'Start voice input'
              }
              style={{
                position: 'relative',
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                border: 'none',
                flexShrink: 0,
                background: !isSessionReady
                  ? palette.faint
                  : !micSupported
                  ? palette.slate
                  : isListening
                  ? 'linear-gradient(135deg, #FF8A80, #E2483F)'
                  : profile.buttonGradient,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: isSessionReady && micSupported ? 'pointer' : 'not-allowed',
                opacity: isSessionReady ? 1 : 0.6,
                boxShadow: isListening ? '0 5px 0 #B8332F' : `0 5px 0 ${profile.deep}`,
              }}
            >
              {isListening ? <MicOff size={22} color="#fff" /> : <Mic size={22} color="#fff" />}

              {isListening && !reducedMotion && (
                <>
                  <motion.span
                    animate={{ opacity: [0.5, 0], scale: [1, 1.8] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '50%',
                      border: '3px solid #E2483F',
                    }}
                  />
                  <motion.span
                    animate={{ opacity: [0.5, 0], scale: [1, 1.8] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut', delay: 0.4 }}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '50%',
                      border: '3px solid #E2483F',
                    }}
                  />
                </>
              )}
            </motion.button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default TutorSession;