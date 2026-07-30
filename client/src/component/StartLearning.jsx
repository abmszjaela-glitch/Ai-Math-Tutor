import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, ChevronDown, Play } from "lucide-react";
import pandaVideo from "../assets/video/intro-lesson-panda.mp4";
import kangarooVideo from "../assets/video/intro-lesson-kangaroo.mp4";
import pandaAfterQuestion from "../assets/video/panda-after-question.mp4";
import kangarooAfterQuestion from "../assets/video/kangaroo-after-question.mp4";

const TUTORS = [
  { id: "panda", name: "Panda", introSrc: pandaVideo, afterSrc: pandaAfterQuestion },
  { id: "kangaroo", name: "Kangaroo", introSrc: kangarooVideo, afterSrc: kangarooAfterQuestion },
];

const StartLearning = () => {
  const [hasEnteredExperience, setHasEnteredExperience] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [currentClip, setCurrentClip] = useState("intro");
  const [selectedTutor, setSelectedTutor] = useState(TUTORS[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [transcript, setTranscript] = useState("");
  const videoRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("SpeechRecognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let finalText = "";
      let interimText = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalText += result[0].transcript;
        } else {
          interimText += result[0].transcript;
        }
      }

      setTranscript((prev) => prev + finalText);
      if (interimText) {
        setTranscript((prev) => prev.replace(/\[\.\.\..*?\]$/, "") + `[...${interimText}]`);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.onend = () => {
      setIsRecording(false);
      setCurrentClip("after");
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, []);

  // This click is the user gesture that unlocks audio for the whole page.
  const handleEnterExperience = () => {
    setHasEnteredExperience(true);
    // videoRef will remount with the intro clip; play() happens in the
    // useEffect below once the new element exists.
  };

  // Whenever hasEnteredExperience flips true, or the clip/tutor changes,
  // explicitly call play() with sound (autoPlay alone can be flaky right
  // after a remount).
  useEffect(() => {
    if (hasEnteredExperience && videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.error("Playback with audio failed:", err);
      });
    }
  }, [hasEnteredExperience, currentClip, selectedTutor]);

  const toggleMic = () => {
    if (!videoEnded || !recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      setTranscript("");
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const handleVideoEnded = (e) => {
    e.currentTarget.pause();
    if (currentClip === "intro") {
      setVideoEnded(true);
    }
  };

  const handleTutorChange = (tutor) => {
    setSelectedTutor(tutor);
    setIsDropdownOpen(false);
    setVideoEnded(false);
    setCurrentClip("intro");
    setIsRecording(false);
    setTranscript("");
    if (recognitionRef.current) recognitionRef.current.stop();
  };

  const activeVideoSrc =
    currentClip === "intro" ? selectedTutor.introSrc : selectedTutor.afterSrc;

  return (
    <section className="section-padding" style={{ position: "relative" }}>
      {/* Tutor switcher */}
     <div
  style={{
    position: "fixed",
    top: "210px",
    right: "24px",
    zIndex: 999,
  }}
>
        <button
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 14px",
            borderRadius: "999px",
            border: "1px solid #d1d5db",
            backgroundColor: "#fff",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 500,
            color: "#374151",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          {selectedTutor.name}
          <ChevronDown size={16} />
        </button>

        {isDropdownOpen && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              right: 0,
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
              overflow: "hidden",
              minWidth: "140px",
            }}
          >
            {TUTORS.map((tutor) => (
              <button
                key={tutor.id}
                onClick={() => handleTutorChange(tutor)}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "10px 14px",
                  border: "none",
                  backgroundColor:
                    tutor.id === selectedTutor.id ? "#f3f4f6" : "#fff",
                  cursor: "pointer",
                  fontSize: "14px",
                  color: "#374151",
                }}
              >
                {tutor.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="container">
        <br />
        <br />
        <h1>Start Learning Maths</h1>

        <p>
          Welcome to your AI Maths Tutor. This page can contain your learning
          dashboard, course information, or a free trial.
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "stretch",
            justifyContent: "space-between",
            gap: "40px",
            marginTop: "24px",
            flexWrap: "wrap",
          }}
        >
          {/* Left: transcript screen + mic */}
          <div
            style={{
              flex: "1 1 400px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <div
              style={{
                flex: 1,
                minHeight: "280px",
                backgroundColor: "#f9fafb",
                border: "1px solid #e5e7eb",
                borderRadius: "16px",
                padding: "20px",
                fontSize: "16px",
                color: transcript ? "#111827" : "#9ca3af",
                overflowY: "auto",
              }}
            >
              {transcript ||
                (!hasEnteredExperience
                  ? "Tap the play button to meet your tutor."
                  : videoEnded
                  ? "Tap the mic and start speaking — your words will appear here."
                  : "Waiting for the intro to finish...")}
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <button
                onClick={toggleMic}
                disabled={!videoEnded}
                aria-label={isRecording ? "Stop recording" : "Start recording"}
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: videoEnded ? "pointer" : "not-allowed",
                  backgroundColor: !videoEnded
                    ? "#c7c7c7"
                    : isRecording
                    ? "#ef4444"
                    : "#4f46e5",
                  color: "#fff",
                  boxShadow: videoEnded
                    ? "0 8px 24px rgba(79, 70, 229, 0.35)"
                    : "none",
                  transition: "background-color 0.2s ease, transform 0.15s ease",
                  opacity: videoEnded ? 1 : 0.6,
                }}
                onMouseDown={(e) =>
                  videoEnded && (e.currentTarget.style.transform = "scale(0.95)")
                }
                onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                {isRecording ? <MicOff size={32} /> : <Mic size={32} />}
              </button>

              <p style={{ fontSize: "13px", color: "#6b7280" }}>
                {!hasEnteredExperience
                  ? "Tap play to begin"
                  : !videoEnded
                  ? "Mic unlocks after the intro"
                  : isRecording
                  ? "Listening..."
                  : `Tap to talk to ${selectedTutor.name}`}
              </p>
            </div>
          </div>

          {/* Right: avatar video */}
          <div
            style={{
              flex: "1 1 400px",
              maxWidth: "500px",
              position: "relative",
            }}
          >
            {hasEnteredExperience ? (
              <video
                key={`${selectedTutor.id}-${currentClip}`}
                ref={videoRef}
                src={activeVideoSrc}
                playsInline
                disablePictureInPicture
                onEnded={handleVideoEnded}
                style={{
                  width: "100%",
                  borderRadius: "16px",
                  pointerEvents: "none",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  aspectRatio: "16 / 9",
                  borderRadius: "16px",
                  backgroundColor: "#111827",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <button
                  onClick={handleEnterExperience}
                  aria-label="Start"
                  style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "50%",
                    border: "none",
                    backgroundColor: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
                  }}
                >
                  <Play size={32} fill="#4f46e5" color="#4f46e5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StartLearning;