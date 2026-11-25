
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import bgMusic from "../assets/auido/ChooseFriend.mp3";
import mapImage from "../assets/img/map/map.png";

export default function Map() {
  const navigate = useNavigate();

  useEffect(() => {
    const audio = new Audio(bgMusic);
    audio.loop = true;
    audio.volume = 0.5;

    audio.play().catch((error) => {
      console.log("Audio playback requires user interaction:", error);
    });

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        backgroundImage: `url(${mapImage})`,
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <button
        type="button"
        onClick={() => navigate(-1)}
        aria-label="Go back"
        style={{
          position: "absolute",
          top: "16px",
          left: "16px",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "10px 16px",
          border: "1px solid rgba(20, 33, 61, 0.18)",
          borderRadius: "999px",
          background: "rgba(255, 255, 255, 0.94)",
          color: "#14213D",
          fontSize: "14px",
          fontWeight: 700,
          boxShadow: "0 4px 14px rgba(20, 33, 61, 0.22)",
          cursor: "pointer",
        }}
      >
        <ArrowLeft size={18} />
        Back
      </button>
    </div>
  );
}
