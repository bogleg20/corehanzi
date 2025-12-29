"use client";

import { useState, useEffect } from "react";
import { Word, Sentence, Settings } from "@/lib/db/schema";
import { WordCard } from "@/components/WordCard";
import { SentenceCard } from "@/components/SentenceCard";
import { ProgressBar } from "@/components/ProgressBar";

export default function LearnPage() {
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [showPinyin, setShowPinyin] = useState(false);

  const DAILY_LIMIT = 20;

  useEffect(() => {
    fetchWords();
    fetchSettings();
  }, []);

  useEffect(() => {
    if (words.length > 0 && currentIndex < words.length) {
      fetchSentences(words[currentIndex].id);
    }
  }, [currentIndex, words]);

  const fetchWords = async () => {
    try {
      const res = await fetch(`/api/words/unlearned?limit=${DAILY_LIMIT}`);
      const data = await res.json();
      setWords(data);
      if (data.length === 0) {
        setSessionComplete(true);
      }
    } catch (error) {
      console.error("Failed to fetch words:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSentences = async (wordId: number) => {
    try {
      const res = await fetch(`/api/words/${wordId}/sentences`);
      const data = await res.json();
      setSentences(data.slice(0, 2)); // Show max 2 sentences
    } catch (error) {
      console.error("Failed to fetch sentences:", error);
      setSentences([]);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      setSettings(data);
      setShowPinyin(data.showSentencePinyin);
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    }
  };

  const handleGrade = async (gotIt: boolean) => {
    const word = words[currentIndex];

    // Record progress
    await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        wordId: word.id,
        quality: gotIt ? 4 : 2, // Good or Hard
      }),
    });

    // Move to next word
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowDetails(false);
      setSentences([]);
    } else {
      setSessionComplete(true);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-xl text-gray-500">Loading...</div>
      </div>
    );
  }

  if (sessionComplete || words.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {words.length === 0
            ? "All Caught Up!"
            : `Session Complete!`}
        </h1>
        <p className="text-gray-600 mb-8">
          {words.length === 0
            ? "You've learned all available words. Come back tomorrow for reviews!"
            : `You learned ${words.length} new words today.`}
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/review"
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Start Review
          </a>
          <a
            href="/"
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    );
  }

  const currentWord = words[currentIndex];

  return (
    <div className="max-w-2xl mx-auto pb-24">
      {/* Progress */}
      <div className="mb-6">
        <ProgressBar
          current={currentIndex + 1}
          total={words.length}
          label="Today's Progress"
          color="red"
        />
      </div>

      {/* Word Card */}
      <div className="mb-6" onClick={() => setShowDetails(true)}>
        <WordCard word={currentWord} showDetails={showDetails} />
        {!showDetails && (
          <p className="text-center text-gray-500 mt-4">
            Tap card to reveal details
          </p>
        )}
      </div>

      {/* Example Sentences */}
      {showDetails && sentences.length > 0 && (
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700">
              Example Sentences
            </h3>
            <button
              onClick={() => setShowPinyin(!showPinyin)}
              className={`text-xs px-2 py-1 rounded transition-colors ${
                showPinyin
                  ? "bg-red-100 text-red-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {showPinyin ? "Hide Pinyin" : "Show Pinyin"}
            </button>
          </div>
          {sentences.map((sentence) => (
            <SentenceCard
              key={sentence.id}
              sentence={sentence}
              highlightWord={currentWord.hanzi}
              showPinyin={showPinyin}
            />
          ))}
        </div>
      )}

      {/* Grade Buttons - Fixed at bottom */}
      {showDetails && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
          <div className="max-w-2xl mx-auto flex gap-4">
            <button
              onClick={() => handleGrade(false)}
              className="flex-1 py-4 bg-gray-200 hover:bg-gray-300 rounded-lg text-lg font-medium text-gray-700 transition-colors"
            >
              Missed it 😕
            </button>
            <button
              onClick={() => handleGrade(true)}
              className="flex-1 py-4 bg-green-500 hover:bg-green-600 rounded-lg text-lg font-medium text-white transition-colors"
            >
              Got it! 👍
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
