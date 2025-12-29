"use client";

import { useState, useEffect } from "react";
import { Word, Sentence, WordProgress, Settings } from "@/lib/db/schema";
import { ProgressBar } from "@/components/ProgressBar";
import { getIntervalPreviews, QualityLabel } from "@/lib/srs/sm2";

type CardType = "word-to-def" | "def-to-word" | "sentence" | "cloze";

interface ReviewWord extends Word {
  progress: WordProgress;
}

export default function ReviewPage() {
  const [reviews, setReviews] = useState<ReviewWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [loading, setLoading] = useState(true);
  const [revealed, setRevealed] = useState(false);
  const [cardType, setCardType] = useState<CardType>("word-to-def");
  const [sessionComplete, setSessionComplete] = useState(false);
  const [stats, setStats] = useState({ correct: 0, total: 0 });
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    fetchReviews();
    fetchSettings();
  }, []);

  useEffect(() => {
    if (reviews.length > 0 && currentIndex < reviews.length) {
      fetchSentences(reviews[currentIndex].id);
      // Randomize card type
      const types: CardType[] = ["word-to-def", "def-to-word", "sentence", "cloze"];
      setCardType(types[Math.floor(Math.random() * types.length)]);
    }
  }, [currentIndex, reviews]);

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/reviews");
      const data = await res.json();
      setReviews(data);
      if (data.length === 0) {
        setSessionComplete(true);
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSentences = async (wordId: number) => {
    try {
      const res = await fetch(`/api/words/${wordId}/sentences`);
      const data = await res.json();
      setSentences(data);
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
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    }
  };

  const handleGrade = async (quality: QualityLabel) => {
    const word = reviews[currentIndex];

    // Record progress
    await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        wordId: word.id,
        quality,
      }),
    });

    // Update stats
    const isCorrect = quality !== "again";
    setStats((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));

    // Move to next word
    if (currentIndex < reviews.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setRevealed(false);
    } else {
      setSessionComplete(true);
    }
  };

  const currentWord = reviews[currentIndex];

  const intervalPreviews = currentWord
    ? getIntervalPreviews(
        currentWord.progress.easeFactor,
        currentWord.progress.interval,
        currentWord.progress.timesSeen
      )
    : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-xl text-gray-500">Loading...</div>
      </div>
    );
  }

  if (sessionComplete || reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {reviews.length === 0 ? "No Reviews Due" : "Review Complete!"}
        </h1>
        {stats.total > 0 && (
          <p className="text-xl text-gray-600 mb-4">
            Score: {stats.correct}/{stats.total} (
            {Math.round((stats.correct / stats.total) * 100)}%)
          </p>
        )}
        <p className="text-gray-600 mb-8">
          {reviews.length === 0
            ? "Great job staying on top of your reviews!"
            : "Come back tomorrow for more reviews."}
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/learn"
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Learn New Words
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

  const renderCard = () => {
    switch (cardType) {
      case "word-to-def":
        return (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-6xl font-bold text-gray-900 mb-4">
              {currentWord.hanzi}
            </div>
            {revealed && (
              <>
                <div className="text-2xl text-red-600 mb-2">
                  {currentWord.pinyin}
                </div>
                <div className="text-xl text-gray-700">
                  {currentWord.definition}
                </div>
              </>
            )}
          </div>
        );

      case "def-to-word":
        return (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-2xl text-gray-700 mb-4">
              {currentWord.definition}
            </div>
            {currentWord.pos && (
              <div className="text-sm text-gray-500 mb-4">({currentWord.pos})</div>
            )}
            {revealed && (
              <>
                <div className="text-6xl font-bold text-gray-900 mb-2">
                  {currentWord.hanzi}
                </div>
                <div className="text-2xl text-red-600">{currentWord.pinyin}</div>
              </>
            )}
          </div>
        );

      case "sentence":
        const sentence = sentences[0];
        if (!sentence) {
          setCardType("word-to-def");
          return null;
        }
        return (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <p className="text-2xl text-gray-900 mb-2">{sentence.chinese}</p>
            {settings?.showSentencePinyin && sentence.pinyin && (
              <p className="text-red-600 text-sm mb-4">{sentence.pinyin}</p>
            )}
            {revealed && (
              <p className="text-lg text-gray-600 border-t pt-4">
                {sentence.english}
              </p>
            )}
          </div>
        );

      case "cloze":
        const clozeSentence = sentences[0];
        if (!clozeSentence) {
          setCardType("word-to-def");
          return null;
        }
        const clozeText = clozeSentence.chinese.replace(
          currentWord.hanzi,
          "______"
        );
        const clozePinyin = clozeSentence.pinyin?.replace(
          currentWord.pinyin,
          "______"
        );
        return (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <p className="text-2xl text-gray-900 mb-2">{clozeText}</p>
            {settings?.showSentencePinyin && clozePinyin && (
              <p className="text-red-600 text-sm mb-4">{clozePinyin}</p>
            )}
            <p className="text-gray-600 mb-4">{clozeSentence.english}</p>
            {revealed && (
              <div className="text-4xl font-bold text-red-600">
                {currentWord.hanzi}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-6">
        <ProgressBar
          current={currentIndex + 1}
          total={reviews.length}
          label="Review Progress"
          color="blue"
        />
      </div>

      {/* Card Type Indicator */}
      <div className="text-center text-sm text-gray-500 mb-4">
        {cardType === "word-to-def" && "What does this word mean?"}
        {cardType === "def-to-word" && "What word matches this definition?"}
        {cardType === "sentence" && "Translate this sentence"}
        {cardType === "cloze" && "Fill in the blank"}
      </div>

      {/* Card */}
      <div className="mb-6" onClick={() => setRevealed(true)}>
        {renderCard()}
        {!revealed && (
          <p className="text-center text-gray-500 mt-4">
            Tap to reveal answer
          </p>
        )}
      </div>

      {/* Grade Buttons */}
      {revealed && intervalPreviews && (
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={() => handleGrade("again")}
            className="py-4 bg-red-500 hover:bg-red-600 rounded-lg text-white transition-colors"
          >
            <div className="font-medium">Again</div>
            <div className="text-xs opacity-80">{intervalPreviews.again}</div>
          </button>
          <button
            onClick={() => handleGrade("hard")}
            className="py-4 bg-orange-500 hover:bg-orange-600 rounded-lg text-white transition-colors"
          >
            <div className="font-medium">Hard</div>
            <div className="text-xs opacity-80">{intervalPreviews.hard}</div>
          </button>
          <button
            onClick={() => handleGrade("good")}
            className="py-4 bg-green-500 hover:bg-green-600 rounded-lg text-white transition-colors"
          >
            <div className="font-medium">Good</div>
            <div className="text-xs opacity-80">{intervalPreviews.good}</div>
          </button>
          <button
            onClick={() => handleGrade("easy")}
            className="py-4 bg-blue-500 hover:bg-blue-600 rounded-lg text-white transition-colors"
          >
            <div className="font-medium">Easy</div>
            <div className="text-xs opacity-80">{intervalPreviews.easy}</div>
          </button>
        </div>
      )}
    </div>
  );
}
