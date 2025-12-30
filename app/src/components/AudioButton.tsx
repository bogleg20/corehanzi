"use client";

import { useState, useRef } from "react";

interface AudioButtonProps {
  src: string;
  size?: "sm" | "md" | "lg";
}

export function AudioButton({
  src,
  size = "md",
}: AudioButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const sizeConfig = {
    sm: { button: "w-6 h-6", icon: "w-4 h-4" },
    md: { button: "w-8 h-8", icon: "w-5 h-5" },
    lg: { button: "w-10 h-10", icon: "w-6 h-6" },
  };

  const handlePlay = async () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(src);
      audioRef.current.addEventListener("ended", () => setIsPlaying(false));
      audioRef.current.addEventListener("error", () => setIsPlaying(false));
    }

    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error("Audio playback failed:", error);
        setIsPlaying(false);
      }
    }
  };

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        handlePlay();
      }}
      className={`
        ${sizeConfig[size].button}
        flex items-center justify-center rounded-full
        transition-all duration-200
        ${isPlaying
          ? "bg-red-500 text-white ring-2 ring-red-300 ring-offset-1"
          : "bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500"
        }
      `}
      aria-label={isPlaying ? "Stop audio" : "Play audio"}
    >
      {isPlaying ? (
        <svg
          className={`${sizeConfig[size].icon} animate-pulse`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          {/* Sound waves animation icon */}
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
        </svg>
      ) : (
        <svg
          className={sizeConfig[size].icon}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          {/* Speaker icon */}
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
        </svg>
      )}
    </button>
  );
}
