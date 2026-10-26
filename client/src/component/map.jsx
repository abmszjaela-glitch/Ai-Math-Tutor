
import React, { useEffect } from "react";
import bgMusic from "../assets/auido/ChooseFriend.mp3";
import mapImage from "../assets/img/map/map.png";

export default function Map() {
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
    />
  );
}
