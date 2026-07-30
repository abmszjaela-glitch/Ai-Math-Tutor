import { useState, useRef } from "react";
import { Mic, MicOff, ChevronDown } from "lucide-react";
import pandaVideo from "../assets/video/intro-lesson-panda.mp4";
import kangarooVideo from "../assets/video/intro-lesson-kangaroo.mp4";

const TUTORS = [
  { id: "panda", name: "Panda", src: pandaVideo },
  { id: "kangaroo", name: "Kangaroo", src: kangarooVideo },
];

const StartLearning = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState(TUTORS[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const videoRef = useRef(null);

  const toggleMic = () => {
    if (!hasStarted && videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch((err) => {
        console.error("Playback with audio failed:", err);
      });
      setHasStarted(true);
    }
    setIsRecording((prev) => !prev);
    // TODO: hook this up to your actual speech/audio capture logic
  };

  const handleTutorChange = (tutor) => {
    setSelectedTutor(tutor);
    setIsDropdownOpen(false);
    setHasStarted(false);
    setIsRecording(false);
  };

  return (
    <section className="section-padding" style={{ position: "relative" }}>
      {/* Tutor switcher — fixed to viewport, sits below header/orange button */}
      <div
        style={{
          position: "fixed",
          top: "100px",
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

        {/* Avatar (left) + Mic (right) row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "40px",
            marginTop: "24px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: "1 1 400px", maxWidth: "500px" }}>
            <video
              key={selectedTutor.id}
              ref={videoRef}
              src={selectedTutor.src}
              muted
              loop
              playsInline
              disablePictureInPicture
              style={{
                width: "100%",
                borderRadius: "16px",
                pointerEvents: "none",
              }}
            />
          </div>

          <div
            style={{
              flex: "1 1 200px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <button
              onClick={toggleMic}
              aria-label={isRecording ? "Stop recording" : "Start recording"}
              style={{
                width: "96px",
                height: "96px",
                borderRadius: "50%",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                backgroundColor: isRecording ? "#ef4444" : "#4f46e5",
                color: "#fff",
                boxShadow: "0 8px 24px rgba(79, 70, 229, 0.35)",
                transition: "background-color 0.2s ease, transform 0.15s ease",
              }}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              {isRecording ? <MicOff size={40} /> : <Mic size={40} />}
            </button>

            {!hasStarted && (
              <p style={{ fontSize: "14px", color: "#6b7280", textAlign: "center" }}>
                Tap to start talking with {selectedTutor.name}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StartLearning;