"use client";

import { useState, useEffect, useCallback } from "react";
import { Word, Sentence, Tag } from "@/lib/db/schema";
import { WordCard } from "@/components/WordCard";
import { SentenceCarousel } from "@/components/SentenceCarousel";
import { ProgressBar } from "@/components/ProgressBar";
import { TokenInfo } from "@/components/TokenizedSentence";
import { TagSelector } from "@/components/TagSelector";
import { AudioButton } from "@/components/AudioButton";

type LearnMode = "words" | "sentences";

export default function LearnPage() {
  const [mode, setMode] = useState<LearnMode>("words");
  const [words, setWords] = useState<Word[]>([]);
  const [learnSentences, setLearnSentences] = useState<Sentence[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [tokenData, setTokenData] = useState<Record<string, TokenInfo>>({});
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [showPinyin, setShowPinyin] = useState(false);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  const DAILY_LIMIT = 20;

  const fetchWords = useCallback(async (tags: Tag[]) => {
    setLoading(true);
    try {
      const tagNames = tags.map((t) => t.name).join(",");
      const url = tagNames
        ? `/api/words/unlearned?limit=${DAILY_LIMIT}&tags=${encodeURIComponent(tagNames)}`
        : `/api/words/unlearned?limit=${DAILY_LIMIT}`;
      const res = await fetch(url);
      const data = await res.json();
      setWords(data);
      setCurrentIndex(0);
      setShowDetails(false);
      setSentences([]);
      setTokenData({});
      if (data.length === 0) {
        setSessionComplete(true);
      } else {
        setSessionComplete(false);
      }
    } catch (error) {
      console.error("Failed to fetch words:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSentencesToLearn = useCallback(async (tags: Tag[]) => {
    setLoading(true);
    try {
      const tagNames = tags.map((t) => t.name).join(",");
      const url = tagNames
        ? `/api/sentences/unlearned?limit=${DAILY_LIMIT}&tags=${encodeURIComponent(tagNames)}`
        : `/api/sentences/unlearned?limit=${DAILY_LIMIT}`;
      const res = await fetch(url);
      const data = await res.json();
      setLearnSentences(data);
      setCurrentIndex(0);
      setShowDetails(false);
      if (data.length === 0) {
        setSessionComplete(true);
      } else {
        setSessionComplete(false);
      }
    } catch (error) {
      console.error("Failed to fetch sentences:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (mode === "words") {
      fetchWords(selectedTags);
    } else {
      fetchSentencesToLearn(selectedTags);
    }
    fetchSettings();
  }, [fetchWords, fetchSentencesToLearn, selectedTags, mode]);

  useEffect(() => {
    if (mode === "words" && words.length > 0 && currentIndex < words.length) {
      fetchExampleSentences(words[currentIndex].id);
    }
  }, [currentIndex, words, mode]);

  const fetchExampleSentences = async (wordId: number) => {
    try {
      const res = await fetch(`/api/words/${wordId}/sentences`);
      const data = await res.json();
      setSentences(data.sentences);
      setTokenData(data.tokenData || {});
    } catch (error) {
      console.error("Failed to fetch sentences:", error);
      setSentences([]);
      setTokenData({});
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      setShowPinyin(data.showSentencePinyin);
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    }
  };

  const handleWordGrade = async (gotIt: boolean) => {
    const word = words[currentIndex];

    await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        wordId: word.id,
        quality: gotIt ? 4 : 2,
      }),
    });

    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowDetails(false);
      setSentences([]);
      setTokenData({});
    } else {
      setSessionComplete(true);
    }
  };

  const handleSentenceGrade = async (gotIt: boolean) => {
    const sentence = learnSentences[currentIndex];

    await fetch("/api/sentences/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sentenceId: sentence.id,
        quality: gotIt ? 4 : 2,
      }),
    });

    if (currentIndex < learnSentences.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowDetails(false);
    } else {
      setSessionComplete(true);
    }
  };

  const handleModeChange = (newMode: LearnMode) => {
    setMode(newMode);
    setCurrentIndex(0);
    setShowDetails(false);
    setSessionComplete(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-xl text-gray-500">Loading...</div>
      </div>
    );
  }

  const items = mode === "words" ? words : learnSentences;

  if (sessionComplete || items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        {/* Mode Toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-gray-50">
            <button
              onClick={() => handleModeChange("words")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                mode === "words"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Words
            </button>
            <button
              onClick={() => handleModeChange("sentences")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                mode === "sentences"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Sentences
            </button>
          </div>
        </div>

        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {items.length === 0 ? "All Caught Up!" : "Session Complete!"}
          </h1>
          <p className="text-gray-600 mb-8">
            {items.length === 0
              ? `You've learned all available ${mode}. Come back tomorrow for reviews!`
              : `You learned ${items.length} new ${mode} today.`}
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
      </div>
    );
  }

  const currentWord = mode === "words" ? words[currentIndex] : null;
  const currentSentence = mode === "sentences" ? learnSentences[currentIndex] : null;

  return (
    <div className="max-w-2xl mx-auto pb-24">
      {/* Mode Toggle */}
      <div className="flex justify-center mb-4">
        <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-gray-50">
          <button
            onClick={() => handleModeChange("words")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === "words"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Words
          </button>
          <button
            onClick={() => handleModeChange("sentences")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === "sentences"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Sentences
          </button>
        </div>
      </div>

      {/* Tag Filter */}
      <div className="mb-4 flex items-center gap-3">
        <span className="text-sm text-gray-600">Filter:</span>
        <TagSelector
          selectedTags={selectedTags}
          onTagsChange={setSelectedTags}
          mode="filter"
          placeholder={mode === "words" ? "All words" : "All sentences"}
        />
      </div>

      {/* Progress */}
      <div className="mb-6">
        <ProgressBar
          current={currentIndex + 1}
          total={items.length}
          label="Today's Progress"
          color="red"
        />
      </div>

      {/* Word Mode */}
      {mode === "words" && currentWord && (
        <>
          <div className="mb-6" onClick={() => setShowDetails(true)}>
            <WordCard word={currentWord} showDetails={showDetails} />
            {!showDetails && (
              <p className="text-center text-gray-500 mt-4">
                Tap card to reveal details
              </p>
            )}
          </div>

          {showDetails && sentences.length > 0 && (
            <SentenceCarousel
              sentences={sentences}
              highlightWord={currentWord.hanzi}
              showPinyin={showPinyin}
              tokenData={tokenData}
              onPinyinToggle={() => setShowPinyin(!showPinyin)}
            />
          )}

          {showDetails && (
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
              <div className="max-w-2xl mx-auto flex gap-4">
                <button
                  onClick={() => handleWordGrade(false)}
                  className="flex-1 py-4 bg-gray-200 hover:bg-gray-300 rounded-lg text-lg font-medium text-gray-700 transition-colors"
                >
                  Missed it
                </button>
                <button
                  onClick={() => handleWordGrade(true)}
                  className="flex-1 py-4 bg-green-500 hover:bg-green-600 rounded-lg text-lg font-medium text-white transition-colors"
                >
                  Got it!
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Sentence Mode */}
      {mode === "sentences" && currentSentence && (
        <>
          <div className="mb-6">
            <div
              className="bg-white rounded-xl shadow-lg p-6 cursor-pointer"
              onClick={() => setShowDetails(true)}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <p className="text-2xl text-gray-900 leading-relaxed">
                  {currentSentence.chinese}
                </p>
                {currentSentence.audioPath && (
                  <AudioButton src={currentSentence.audioPath} />
                )}
              </div>
              {showPinyin && currentSentence.pinyin && (
                <p className="text-red-600 text-base mb-4">{currentSentence.pinyin}</p>
              )}

              {showDetails ? (
                <p className="text-lg text-gray-600 border-t pt-4">
                  {currentSentence.english}
                </p>
              ) : (
                <div className="py-3 bg-gray-100 rounded-lg text-gray-600 text-center mt-4">
                  Tap to reveal translation
                </div>
              )}
            </div>

            {/* Pinyin toggle for sentences */}
            <div className="flex justify-end mt-2">
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
          </div>

          {showDetails && (
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
              <div className="max-w-2xl mx-auto flex gap-4">
                <button
                  onClick={() => handleSentenceGrade(false)}
                  className="flex-1 py-4 bg-gray-200 hover:bg-gray-300 rounded-lg text-lg font-medium text-gray-700 transition-colors"
                >
                  Missed it
                </button>
                <button
                  onClick={() => handleSentenceGrade(true)}
                  className="flex-1 py-4 bg-green-500 hover:bg-green-600 rounded-lg text-lg font-medium text-white transition-colors"
                >
                  Got it!
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
