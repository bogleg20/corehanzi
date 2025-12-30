"use client";

import { useState, useEffect, useCallback } from "react";
import { Sentence } from "@/lib/db/schema";
import { SentenceCard } from "./SentenceCard";
import { TokenInfo } from "./TokenizedSentence";

interface SentenceCarouselProps {
  sentences: Sentence[];
  highlightWord?: string;
  showPinyin: boolean;
  tokenData: Record<string, TokenInfo>;
  onPinyinToggle: () => void;
}

const ChevronLeftIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

export function SentenceCarousel({
  sentences,
  highlightWord,
  showPinyin,
  tokenData,
  onPinyinToggle,
}: SentenceCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Reset index when sentences change (new word selected)
  useEffect(() => {
    setCurrentIndex(0);
  }, [sentences]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + 1, sentences.length - 1));
  }, [sentences.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "ArrowLeft") goToPrevious();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrevious]);

  // Edge case: no sentences
  if (sentences.length === 0) return null;

  const showNavigation = sentences.length > 1;

  return (
    <div className="space-y-3 mb-6">
      {/* Header with title and pinyin toggle */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">
          Example Sentences
          {showNavigation && (
            <span className="ml-2 text-gray-400">
              ({currentIndex + 1} / {sentences.length})
            </span>
          )}
        </h3>
        <button
          onClick={onPinyinToggle}
          className={`text-xs px-2 py-1 rounded transition-colors ${
            showPinyin
              ? "bg-red-100 text-red-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {showPinyin ? "Hide Pinyin" : "Show Pinyin"}
        </button>
      </div>

      {/* Carousel Container */}
      <div className="flex items-center gap-2">
        {/* Left Arrow */}
        {showNavigation && (
          <button
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
              transition-all duration-200
              ${currentIndex === 0
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              }`}
            aria-label="Previous sentence"
          >
            <ChevronLeftIcon />
          </button>
        )}

        {/* Cards Container - padding top for tooltips */}
        <div className="flex-1 overflow-hidden rounded-lg pt-14 -mt-14">
          <div
            className="flex transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {sentences.map((sentence) => (
              <div key={sentence.id} className="w-full flex-shrink-0">
                <SentenceCard
                  sentence={sentence}
                  highlightWord={highlightWord}
                  showPinyin={showPinyin}
                  tokenData={tokenData}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Arrow */}
        {showNavigation && (
          <button
            onClick={goToNext}
            disabled={currentIndex === sentences.length - 1}
            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
              transition-all duration-200
              ${currentIndex === sentences.length - 1
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              }`}
            aria-label="Next sentence"
          >
            <ChevronRightIcon />
          </button>
        )}
      </div>

      {/* Position Indicator (dots) */}
      {showNavigation && (
        <div className="flex justify-center gap-1.5 pt-1">
          {sentences.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`transition-all duration-200 rounded-full
                ${index === currentIndex
                  ? "w-6 h-2 bg-red-500"
                  : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
                }`}
              aria-label={`Go to sentence ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
