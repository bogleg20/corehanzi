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

  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
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
      className={`${sizeClasses[size]} flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-colors`}
      aria-label={isPlaying ? "Stop audio" : "Play audio"}
    >
      {isPlaying ? "⏹️" : "🔊"}
    </button>
  );
}
