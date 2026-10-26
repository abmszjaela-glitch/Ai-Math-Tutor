import { API_URL } from '../config/api';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ArrowLeft, Mic, MicOff, Send, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TutorAvatar from './TutorAvatar';
import { colors } from '../theme/colors';

const easeOut = [0.25, 0.1, 0.25, 1];
const AVATAR_NAMES = { kanga: 'Kangaroo', pandy: 'Panda', koala: 'Koala' };
const STORAGE_KEY = 'selectedTutorId';

// ============================================================
// DESIGN TOKENS (light theme)
// ============================================================

const palette = {
  ink: colors.ink,
  paper: colors.page,
  card: colors.surface,
  surface: colors.soft,
  mist: colors.border,
  slate: colors.text,
  faint: colors.text,
  listening: colors.primary,
};

const fontDisplay = "'Baloo 2', 'Fredoka', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const fontBody = "'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

const shadow = {
  sm: '0 3px 0 var(--color-shadow)',
  md: '0 4px 0 var(--color-shadow)',
  lg: 'var(--shadow-card)',
};

// Every tutor shares the Home identity; character art provides individuality.
const tutorAppearance = {
  color: colors.primary,
  deep: colors.deep,
  soft: colors.primarySoft,
  gradient: colors.primary,
  buttonGradient: colors.primary,
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
    ...tutorAppearance,
  },
  pandy: {
    label: 'Pandy',
    greeting:
      "G'day, I'm Pandy! Ready to work through some maths together? Tap the microphone or type your question below.",
    ...tutorAppearance,
  },
  koala: {
    label: 'Koala',
    greeting:
      "G'day, I'm Koala! Let's take maths nice and easy together. Tap the microphone and ask me anything, or type your question below.",
    ...tutorAppearance,
  },
};

const DEFAULT_TUTOR_ID = 'kanga';
const LOG_PREFIX = '[TutorSession]';

const logTutorEvent = (event, details = {}) => {
  console.info(LOG_PREFIX, event, details);
};

// ============================================================
// STREAMING HELPERS
// ============================================================

// Split text into sentences without breaking decimals like "3.5".
const splitSentences = (text) =>
  text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

// What the tutor says out loud for each streamed part.
const partToSpeech = (part) => {
  switch (part.type) {
    case 'message':
      return part.text;
    case 'step':
      return part.explanation ? `Step ${part.step}. ${part.explanation}` : '';
    case 'answer':
      return part.text ? `The answer is ${part.text}.` : '';
    case 'hint':
      return part.text ? `Hint: ${part.text}` : '';
    case 'encouragement':
      return part.text;
    default:
      return '';
  }
};

// Turn a complete tutor object into the same list of parts the stream sends.
// Used as a fallback when the backend still returns plain JSON.
const tutorToParts = (tutor) => {
  const parts = [];
  if (tutor.message?.trim()) parts.push({ type: 'message', text: tutor.message.trim() });
  tutor.steps?.forEach((step) => parts.push({ type: 'step', ...step }));
  if (tutor.answer) parts.push({ type: 'answer', text: String(tutor.answer) });
  if (tutor.hint) parts.push({ type: 'hint', text: tutor.hint });
  if (tutor.encouragement) parts.push({ type: 'encouragement', text: tutor.encouragement });
  return parts;
};

// Merge one streamed part into the tutor object shown in the bubble.
const applyPartToTutor = (tutor, part) => {
  switch (part.type) {
    case 'message':
      return { ...tutor, message: part.text };
    case 'step': {
      const { type, ...step } = part; // eslint-disable-line no-unused-vars
      return { ...tutor, steps: [...(tutor.steps || []), step] };
    }
    case 'answer':
      return { ...tutor, answer: part.text };
    case 'hint':
      return { ...tutor, hint: part.text };
    case 'encouragement':
      return { ...tutor, encouragement: part.text };
    default:
      return tutor;
  }
};

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

const SoundBars = ({ active, reducedMotion, color = 'var(--color-surface)', count = 4, height = 15 }) => (
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
  const [lessonId] = useState(() => new URLSearchParams(window.location.search).get('lesson'));
  const [isSessionReady, setIsSessionReady] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [replayingId, setReplayingId] = useState(null); // message whose speaker icon was tapped

  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);
  const hasGreetedRef = useRef(false);
  const noticeTimeoutRef = useRef(null);
  const handleStudentMessageRef = useRef(null);
  const speakTokenRef = useRef(0);
  const pendingSpeechRef = useRef(0); // utterances queued but not finished
  const abortRef = useRef(null); // AbortController for the active stream
  const messageIdRef = useRef(0);

  const nextMessageId = () => {
    messageIdRef.current += 1;
    return messageIdRef.current;
  };

  const showNotice = (text) => {
    logTutorEvent('notice', { text });
    setNotice(text);
    if (noticeTimeoutRef.current) clearTimeout(noticeTimeoutRef.current);
    noticeTimeoutRef.current = setTimeout(() => setNotice(null), 4000);
  };

  // ==========================================================
  // SPEECH RECOGNITION (microphone input)
  // ==========================================================

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      logTutorEvent('speech recognition unavailable');
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
      logTutorEvent('speech recognition result', {
        hasFinalTranscript: Boolean(finalTranscript.trim()),
        interimLength: interim.length,
      });

      if (finalTranscript.trim()) {
        handleStudentMessageRef.current?.(finalTranscript.trim());
      }
    };

    recognition.onend = () => {
      logTutorEvent('speech recognition ended');
      setIsListening(false);
      setInterimText('');
    };

    recognition.onerror = (event) => {
      console.warn(LOG_PREFIX, 'speech recognition error', { error: event.error });
      setIsListening(false);
      setInterimText('');
    };

    logTutorEvent('speech recognition ready', { language: recognition.lang });
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
        logTutorEvent('session setup started', {
          apiUrl: API_URL,
          tutor: profile.label,
          lessonId: lessonId || null,
        });
        const avatarsResponse = await fetch(`${API_URL}/avatars`, { credentials: 'include' });
        logTutorEvent('avatars request completed', { status: avatarsResponse.status });
        if (avatarsResponse.status === 401) {
          console.warn(LOG_PREFIX, 'session setup requires login');
          navigate('/login', { replace: true });
          return;
        }
        const avatarsData = await avatarsResponse.json();
        if (!avatarsResponse.ok || !avatarsData.success) throw new Error(avatarsData.message || 'Unable to load tutors');
        const avatar = avatarsData.avatars.find((item) => item.name === AVATAR_NAMES[tutorId]);
        if (!avatar) throw new Error('Selected tutor is unavailable. Please seed the database.');
        logTutorEvent('tutor avatar selected', { avatarId: avatar.id, tutor: avatar.name });
        if (cancelled) return;
        const selection = await fetch(`${API_URL}/avatars/me`, {
          method: 'PUT', credentials: 'include', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ avatarId: avatar.id }),
        });
        logTutorEvent('avatar selection completed', { status: selection.status });
        if (!selection.ok) throw new Error('Unable to select tutor');
        if (cancelled) return;
        const response = await fetch(`${API_URL}/conversations`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: `${profile.label} Math Session` }),
        });

        const data = await response.json();
        logTutorEvent('conversation request completed', { status: response.status });

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Failed to create conversation');
        }

        if (cancelled) return;

        setConversationId(data.conversation.id);
        setIsSessionReady(true);
        logTutorEvent('session ready', { conversationId: data.conversation.id });
      } catch (error) {
        if (cancelled) return;

        console.error(LOG_PREFIX, 'session setup failed', error);
        setIsSessionReady(false);
        showNotice('I could not start the math session. Please try again.');
      }
    };

    createConversation();

    return () => {
      cancelled = true;
    };
  }, [lessonId, profile.label, tutorId, navigate]);

  // ==========================================================
  // TEXT TO SPEECH (basic browser voice, sentence queue)
  // ==========================================================

  const stopSpeaking = () => {
    logTutorEvent('speech stopped');
    speakTokenRef.current += 1;
    pendingSpeechRef.current = 0;

    if ('speechSynthesis' in window) {
      const synth = window.speechSynthesis;
      if (synth.speaking || synth.pending) synth.cancel();
    }

    setIsSpeaking(false);
    setReplayingId(null);
  };

  // Adds text to the end of the speech queue WITHOUT interrupting what is
  // already being said. Each sentence is its own utterance, which starts
  // speaking sooner and avoids Chrome cutting off long utterances.
  const enqueueSpeech = (text) => {
    const speechText = text?.trim();
    if (!speechText) {
      logTutorEvent('speech skipped', { reason: 'empty text' });
      return;
    }
    if (!('speechSynthesis' in window)) {
      console.warn(LOG_PREFIX, 'speech synthesis unavailable');
      return;
    }

    const token = speakTokenRef.current;
    const sentences = splitSentences(speechText);
    logTutorEvent('speech queued', { sentenceCount: sentences.length });

    sentences.forEach((sentence) => {
      const utterance = new SpeechSynthesisUtterance(sentence);
      utterance.lang = 'en-AU';
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;

      pendingSpeechRef.current += 1;

      utterance.onstart = () => {
        if (token !== speakTokenRef.current) return;
        logTutorEvent('speech started');
        setIsSpeaking(true);
      };

      const finish = () => {
        if (token !== speakTokenRef.current) return;
        pendingSpeechRef.current = Math.max(0, pendingSpeechRef.current - 1);
        if (pendingSpeechRef.current === 0) {
          logTutorEvent('speech finished');
          setIsSpeaking(false);
          setReplayingId(null);
        }
      };

      utterance.onend = finish;

      utterance.onerror = (event) => {
        if (event.error !== 'canceled' && event.error !== 'interrupted') {
          console.warn(LOG_PREFIX, 'speech synthesis error', { error: event.error });
        }
        finish();
      };

      window.speechSynthesis.speak(utterance);
    });
  };

  // Replaces whatever is being said (used for greeting and error lines).
  const speak = (text) => {
    stopSpeaking();
    enqueueSpeech(text);
  };

  // ==========================================================
  // INITIAL GREETING
  // ==========================================================

  useEffect(() => {
    if (hasGreetedRef.current) return;
    hasGreetedRef.current = true;

    setMessages((prev) => [
      ...prev,
      { id: nextMessageId(), sender: 'tutor', text: profile.greeting },
    ]);
    speak(profile.greeting);
    // Speech is triggered once for this greeting, not for each render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.greeting]);

  // ==========================================================
  // CLEANUP
  // ==========================================================

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      stopSpeaking();

      try {
        recognitionRef.current?.abort();
      } catch {
        // Ignore cleanup errors.
      }

      if (noticeTimeoutRef.current) clearTimeout(noticeTimeoutRef.current);
    };
  }, []);

  // ==========================================================
  // MESSAGE HELPERS
  // ==========================================================

  const addTutorMessage = (text) => {
    setMessages((prev) => [...prev, { id: nextMessageId(), sender: 'tutor', text }]);
    speak(text);
  };

  const addStudentMessage = (text) => {
    setMessages((prev) => [...prev, { id: nextMessageId(), sender: 'student', text }]);
  };

  // Stops the current answer: cancels the network stream and the voice.
  const cancelTutorResponse = () => {
    logTutorEvent('tutor response cancelled', {
      hadActiveRequest: Boolean(abortRef.current),
    });
    abortRef.current?.abort();
    abortRef.current = null;
    setIsThinking(false);
    stopSpeaking();
  };

  // ==========================================================
  // REPLAY A PREVIOUS MESSAGE (speaker icon)
  // ==========================================================

  // Builds what the tutor should say for a saved message.
  const getMessageSpeech = (msg) => {
    if (msg.tutor) {
      return tutorToParts(msg.tutor).map(partToSpeech).filter(Boolean).join(' ');
    }
    return msg.text || ''; // greeting and plain messages
  };

  const replayMessage = (msg) => {
    const text = getMessageSpeech(msg);
    if (!text) return;

    // Tapping the same icon again stops the voice.
    if (isSpeaking && replayingId === msg.id) {
      stopSpeaking();
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

    cancelTutorResponse(); // stops any current voice or streaming answer
    setReplayingId(msg.id);
    enqueueSpeech(text);
  };

  // ==========================================================
  // HANDLE STUDENT MESSAGE (streaming)
  // ==========================================================

  const handleStudentMessage = async (text) => {
    const cleanText = text?.trim();

    if (!cleanText) {
      logTutorEvent('student message ignored', { reason: 'empty text' });
      return;
    }

    if (!conversationId || !isSessionReady) {
      logTutorEvent('student message blocked', { reason: 'session not ready' });
      showNotice('Your tutor is still getting ready. Please try again in a moment.');
      return;
    }

    logTutorEvent('student message submitted', { characterCount: cleanText.length });
    // A new question replaces any answer that is still streaming or speaking.
    cancelTutorResponse();
    setInterimText('');

    addStudentMessage(cleanText);
    setIsThinking(true);

    const controller = new AbortController();
    abortRef.current = controller;

    // Id of the tutor bubble for this answer. Created on the first part.
    let tutorMessageId = null;
    let partCount = 0;
    let receivedAnyPart = false;

    // Renders a part in the bubble and queues it for speech right away.
    const handlePart = (part) => {
      if (controller.signal.aborted) return;

      if (part.type === 'error') {
        throw new Error(part.message || 'Tutor stream failed');
      }

      if (!['message', 'step', 'answer', 'hint', 'encouragement'].includes(part.type)) {
        return; // ignore 'done' and unknown types
      }

      receivedAnyPart = true;
      partCount += 1;
      logTutorEvent('tutor response part received', {
        type: part.type,
        partNumber: partCount,
      });

      if (tutorMessageId === null) {
        tutorMessageId = nextMessageId();
        const id = tutorMessageId;
        setIsThinking(false);
        setMessages((prev) => [
          ...prev,
          {
            id,
            sender: 'tutor',
            text: part.type === 'message' ? part.text : '',
            tutor: applyPartToTutor({}, part),
          },
        ]);
      } else {
        const id = tutorMessageId;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === id
              ? {
                  ...m,
                  text: part.type === 'message' ? part.text : m.text,
                  tutor: applyPartToTutor(m.tutor || {}, part),
                }
              : m
          )
        );
      }

      enqueueSpeech(partToSpeech(part));
    };

    try {
      const response = await fetch(`${API_URL}/tutor/message`, {
        method: 'POST',
        credentials: 'include',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/x-ndjson, application/json',
        },
        body: JSON.stringify({
          conversationId,
          lessonId,
          message: cleanText,
        }),
      });

      const contentType = response.headers.get('content-type') || '';
      logTutorEvent('tutor request completed', {
        status: response.status,
        contentType,
        streaming: !contentType.includes('application/json'),
      });

      // ---- Fallback: backend still returns one complete JSON object ----
      if (!response.ok || contentType.includes('application/json')) {
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Tutor request failed');
        }

        const tutor = data.response?.tutor;
        if (!tutor) throw new Error('Tutor returned an invalid response');

        const parts = tutorToParts(tutor);
        parts.forEach(handlePart);
        setIsThinking(false);
        logTutorEvent('tutor response completed', { mode: 'json', partCount: parts.length });
        return;
      }

      // ---- Streaming: one JSON object per line (NDJSON) ----
      if (!response.body) throw new Error('Streaming is not supported by this browser');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let chunkCount = 0;

      const processLine = (line) => {
        const trimmed = line.trim();
        if (!trimmed) return;
        handlePart(JSON.parse(trimmed));
      };

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        chunkCount += 1;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split('\n');
        buffer = lines.pop() ?? ''; // keep the incomplete last line

        lines.forEach(processLine);
      }

      buffer += decoder.decode();
      processLine(buffer);

      if (!receivedAnyPart) throw new Error('Tutor returned an empty response');

      setIsThinking(false);
      logTutorEvent('tutor response completed', {
        mode: 'stream',
        chunkCount,
        partCount,
        receivedAnyPart,
      });
    } catch (error) {
      if (error.name === 'AbortError' || controller.signal.aborted) {
        logTutorEvent('tutor request aborted');
        return;
      }

      console.error(LOG_PREFIX, 'tutor request failed', error);

      setIsThinking(false);

      if (receivedAnyPart) {
        // Part of the answer already showed and was spoken. Keep it.
        showNotice('The answer was cut short. Ask again if something is missing.');
      } else {
        addTutorMessage(
          "Sorry! I had a little trouble thinking about that question. Let's try again."
        );
        showNotice('Something went wrong while talking to your math tutor.');
      }
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
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
      logTutorEvent('microphone action blocked', { reason: 'session not ready' });
      showNotice('Your tutor is still getting ready. Please wait a moment.');
      return;
    }

    if (!micSupported) {
      logTutorEvent('microphone action blocked', { reason: 'browser unsupported' });
      showNotice("Voice input isn't available in this browser. Try Chrome on desktop or Android.");
      return;
    }

    if (isListening) {
      logTutorEvent('microphone stopping');
      try {
        recognitionRef.current?.stop();
      } catch {
        // Ignore stop errors.
      }
      setIsListening(false);
    } else {
      logTutorEvent('microphone starting');
      // Student wants to talk: stop the tutor's voice and any answer still streaming.
      cancelTutorResponse();

      try {
        recognitionRef.current?.start();
        setIsListening(true);
        logTutorEvent('microphone listening');
      } catch (error) {
        console.warn(LOG_PREFIX, 'could not start speech recognition', error);
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

    if (!value) {
      logTutorEvent('text message ignored', { reason: 'empty text' });
      return;
    }

    if (!isSessionReady) {
      logTutorEvent('text message blocked', { reason: 'session not ready' });
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
    color: 'var(--color-on-primary)',
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
          outline: 2px solid var(--accent, var(--color-border));
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
          boxShadow: '0 2px 10px var(--color-shadow)',
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
              color: 'var(--color-on-primary)',
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
                background: 'var(--color-surface)',
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
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
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
                {msg.text && <div>{msg.text}</div>}

                {msg.sender === 'tutor' && msg.tutor && (
                  <div style={{ marginTop: msg.text ? '16px' : 0 }}>
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

                            {step.calculation && (
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
                            )}
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

                {msg.sender === 'tutor' && (
                  <button
                    type="button"
                    onClick={() => replayMessage(msg)}
                    className="focus-ring"
                    aria-label={
                      isSpeaking && replayingId === msg.id
                        ? 'Stop reading'
                        : 'Read this message aloud'
                    }
                    style={{
                      marginTop: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      border: `2px solid ${profile.color}`,
                      background: profile.soft,
                      color: profile.deep,
                      cursor: 'pointer',
                    }}
                  >
                    {isSpeaking && replayingId === msg.id ? (
                      <VolumeX size={16} />
                    ) : (
                      <Volume2 size={16} />
                    )}
                  </button>
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
              color: 'var(--color-on-primary)',
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
              disabled={!isSessionReady || isThinking}
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
                disabled={!textInput.trim() || !isSessionReady || isThinking}
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
                  color: 'var(--color-on-primary)',
                  cursor: textInput.trim() ? 'pointer' : 'not-allowed',
                  boxShadow: textInput.trim() ? `0 4px 0 ${profile.deep}` : 'none',
                }}
              >
                <Send size={18} color={textInput.trim() ? 'var(--color-surface)' : palette.faint} />
              </motion.button>
            </div>

            <motion.button
              type="button"
              onClick={toggleMic}
              disabled={!isSessionReady || isThinking || !micSupported}
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
                  ? 'var(--color-primary)'
                  : profile.buttonGradient,
                color: 'var(--color-on-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: isSessionReady && micSupported ? 'pointer' : 'not-allowed',
                opacity: isSessionReady ? 1 : 0.6,
                boxShadow: isListening ? '0 5px 0 var(--color-accent)' : `0 5px 0 ${profile.deep}`,
              }}
            >
              {isListening ? <MicOff size={22} color="var(--color-surface)" /> : <Mic size={22} color="var(--color-surface)" />}

              {isListening && !reducedMotion && (
                <>
                  <motion.span
                    animate={{ opacity: [0.5, 0], scale: [1, 1.8] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '50%',
                      border: '3px solid var(--color-border)',
                    }}
                  />
                  <motion.span
                    animate={{ opacity: [0.5, 0], scale: [1, 1.8] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut', delay: 0.4 }}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '50%',
                      border: '3px solid var(--color-border)',
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