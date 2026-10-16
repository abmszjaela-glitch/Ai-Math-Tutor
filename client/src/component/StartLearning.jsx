
import { useState, useRef, useEffect } from "react";
import { Mic, MicOff } from "lucide-react";

import pandaVideo from "../assets/video/intro-lesson-panda.mp4";
import kangarooVideo from "../assets/video/intro-lesson-kangaroo.mp4";
import koalaVideo from "../assets/video/intro-lesson-koala.mp4";

import pandaAfterQuestion from "../assets/video/panda-after-question.mp4";
import kangarooAfterQuestion from "../assets/video/kangaroo-after-question.mp4";
import koalaafterVideo from "../assets/video/Koala-after-question.mp4";

const TUTORS = [
  {
    id: "pandy",
    name: "Pandy",
    introSrc: pandaVideo,
    afterSrc: pandaAfterQuestion,
  },
  {
    id: "kanga",
    name: "Kanga",
    introSrc: kangarooVideo,
    afterSrc: kangarooAfterQuestion,
  },
  {
    id: "koala",
    name: "Koala",
    introSrc: koalaVideo,
    afterSrc: koalaafterVideo,
  },
];

const STORAGE_KEY = "selectedTutorId";

const StartLearning = () => {
  const [videoEnded, setVideoEnded] = useState(false);
  const [currentClip, setCurrentClip] = useState("intro");
  const [selectedTutor] = useState(() => TUTORS.find((t) => t.id === localStorage.getItem(STORAGE_KEY)) || TUTORS[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");

  const videoRef = useRef(null);
  const recognitionRef = useRef(null);


  /*
   * Speech Recognition setup
   */
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn(
        "SpeechRecognition is not supported in this browser."
      );
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let finalText = "";
      let interimText = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        const result = event.results[i];

        if (result.isFinal) {
          finalText += result[0].transcript;
        } else {
          interimText += result[0].transcript;
        }
      }

      if (finalText) {
        setTranscript((prev) => prev.replace(/\[\.\.\..*?\]$/, "") + finalText);
      }

      if (interimText) {
        setTranscript((prev) => {
          const cleanPrev = prev.replace(
            /\[\.\.\..*?\]$/,
            ""
          );

          return (
            cleanPrev +
            `[...${interimText}]`
          );
        });
      }
    };

    /*
     * When microphone/speech recognition ends,
     * play the after-question video.
     */
    recognition.onend = () => {
      setIsRecording(false);

      /*
       * Only change to after video if
       * the intro has already finished.
       */
      setCurrentClip("after");
    };

    recognition.onerror = (event) => {
      console.error(
        "Speech recognition error:",
        event.error
      );

      setIsRecording(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.onresult = null;
      recognition.onend = null;
      recognition.onerror = null;
      try {
        recognition.abort();
      } catch {
        // Ignore stop errors during cleanup
      }
    };
  }, []);

  /*
   * Automatically play video when:
   *
   * 1. Tutor is loaded
   * 2. Current clip changes
   *
   * Since this page is reached after a user click
   * on the Select Tutor page, the browser normally
   * allows this video to play with sound.
   */
  useEffect(() => {
    if (!selectedTutor || !videoRef.current) {
      return;
    }

    const video = videoRef.current;

    video.currentTime = 0;

    const playVideo = async () => {
      try {
        await video.play();
      } catch (error) {
        console.error(
          "Video autoplay failed:",
          error
        );

        /*
         * If browser blocks autoplay with sound,
         * try muted autoplay.
         */
        try {
          video.muted = true;
          await video.play();
        } catch (mutedError) {
          console.error(
            "Muted autoplay also failed:",
            mutedError
          );
        }
      }
    };

    playVideo();
  }, [selectedTutor, currentClip]);

  /*
   * Intro video finished
   */
  const handleVideoEnded = (e) => {
    e.currentTarget.pause();

    if (currentClip === "intro") {
      /*
       * Intro is finished.
       * Now microphone becomes available.
       */
      setVideoEnded(true);
      setCurrentClip("intro");
    }
  };

  /*
   * Start / stop microphone
   */
  const toggleMic = () => {
    if (!videoEnded || !recognitionRef.current) {
      return;
    }

    if (isRecording) {
      /*
       * Stop speaking.
       * recognition.onend() will then
       * switch to the after-question video.
       */
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      /*
       * Start speaking.
       */
      setTranscript("");

      /*
       * Make sure after video is not showing
       * while user is recording.
       */
      videoRef.current?.pause();

      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (error) {
        console.error(
          "Could not start speech recognition:",
          error
        );
      }
    }
  };

  /*
   * Get current video
   */
  const activeVideoSrc = selectedTutor
    ? currentClip === "intro"
      ? selectedTutor.introSrc
      : selectedTutor.afterSrc
    : null;

  return (
    <section
      className="section-padding"
      style={{
        position: "relative",
        backgroundColor: "#EAEAEA",
      }}
    >
      <div className="container">

        <br />
        <br />

        {/* Heading */}
        <h1>
          Start Learning Maths
          {selectedTutor
            ? ` with ${selectedTutor.name}`
            : ""}
        </h1>

        <p>
          Welcome to your AI Maths Tutor.
          {selectedTutor
            ? ` ${selectedTutor.name} is ready to help you learn mathematics.`
            : ""}
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

          {/* LEFT SIDE */}
          <div
            style={{
              flex: "1 1 400px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >

            {/* Transcript */}
            <div
              style={{
                flex: 1,
                minHeight: "280px",
                backgroundColor: "#f9fafb",
                border: "1px solid #e5e7eb",
                borderRadius: "16px",
                padding: "20px",
                fontSize: "16px",
                color: transcript
                  ? "#111827"
                  : "#9ca3af",
                overflowY: "auto",
              }}
            >
              {transcript ||
                (!videoEnded
                  ? `Watch ${selectedTutor?.name || "your tutor"}'s introduction...`
                  : isRecording
                  ? "Listening to you..."
                  : currentClip === "after"
                  ? `${selectedTutor?.name || "Your tutor"} is responding...`
                  : `Tap the mic and talk to ${selectedTutor?.name || "your tutor"}.`)}
            </div>

            {/* MIC */}
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
                aria-label={
                  isRecording
                    ? "Stop recording"
                    : "Start recording"
                }
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: videoEnded
                    ? "pointer"
                    : "not-allowed",

                  backgroundColor: !videoEnded
                    ? "#c7c7c7"
                    : isRecording
                    ? "#ef4444"
                    : "#4f46e5",

                  color: "#fff",

                  boxShadow: videoEnded
                    ? "0 8px 24px rgba(79, 70, 229, 0.35)"
                    : "none",

                  transition:
                    "background-color 0.2s ease, transform 0.15s ease",

                  opacity: videoEnded
                    ? 1
                    : 0.6,
                }}
                onMouseDown={(e) => {
                  if (videoEnded) {
                    e.currentTarget.style.transform =
                      "scale(0.95)";
                  }
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform =
                    "scale(1)";
                }}
              >
                {isRecording ? (
                  <MicOff size={32} />
                ) : (
                  <Mic size={32} />
                )}
              </button>

              <p
                style={{
                  fontSize: "13px",
                  color: "#6b7280",
                }}
              >
                {!videoEnded
                  ? "Mic unlocks after the introduction"
                  : isRecording
                  ? "Listening..."
                  : currentClip === "after"
                  ? "Tutor is responding..."
                  : `Tap to talk to ${
                      selectedTutor?.name ||
                      "your tutor"
                    }`}
              </p>
            </div>
          </div>

          {/* RIGHT SIDE - VIDEO */}
          <div
            style={{
              flex: "1 1 400px",
              maxWidth: "500px",
              position: "relative",
            }}
          >
            {selectedTutor && activeVideoSrc ? (
              <video
                key={`${selectedTutor.id}-${currentClip}`}
                ref={videoRef}
                src={activeVideoSrc}
                playsInline
                autoPlay
                preload="auto"
                disablePictureInPicture
                onEnded={handleVideoEnded}
                style={{
                  width: "100%",
                  borderRadius: "16px",
                  display: "block",
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
                  color: "#fff",
                }}
              >
                Loading tutor...
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default StartLearning;

