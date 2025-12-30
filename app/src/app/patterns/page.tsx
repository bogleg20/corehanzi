"use client";

import { useState, useEffect, useRef } from "react";
import { Pattern, Sentence, Settings } from "@/lib/db/schema";
import { SentenceCard } from "@/components/SentenceCard";

export default function PatternsPage() {
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPattern, setSelectedPattern] = useState<Pattern | null>(null);
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [loadingSentences, setLoadingSentences] = useState(false);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [showPinyin, setShowPinyin] = useState(false);
  const detailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchPatterns();
    fetchSettings();
  }, []);

  useEffect(() => {
    if (selectedPattern) {
      fetchSentences(selectedPattern.id);
      // Scroll to detail panel after a short delay for render
      setTimeout(() => {
        detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [selectedPattern]);

  const fetchPatterns = async () => {
    try {
      const res = await fetch("/api/patterns");
      const data = await res.json();
      setPatterns(data);
    } catch (error) {
      console.error("Failed to fetch patterns:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSentences = async (patternId: number) => {
    setLoadingSentences(true);
    try {
      const res = await fetch(`/api/patterns?patternId=${patternId}`);
      const data = await res.json();
      setSentences(data);
    } catch (error) {
      console.error("Failed to fetch sentences:", error);
    } finally {
      setLoadingSentences(false);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-xl text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Grammar Patterns
      </h1>
      <p className="text-gray-600 mb-6">
        Learn common Chinese grammar patterns with example sentences.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {patterns.map((pattern) => (
          <div
            key={pattern.id}
            onClick={() => setSelectedPattern(pattern)}
            className={`bg-white rounded-lg border-2 p-4 cursor-pointer transition-all ${
              selectedPattern?.id === pattern.id
                ? "border-red-500 shadow-md"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="font-bold text-lg text-gray-900 mb-1">
              {pattern.name}
            </div>
            <div className="text-red-600 font-mono mb-2">{pattern.structure}</div>
            {pattern.example && (
              <div className="text-sm text-gray-600">{pattern.example}</div>
            )}
          </div>
        ))}
      </div>

      {/* Pattern Detail */}
      {selectedPattern && (
        <div ref={detailRef} className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {selectedPattern.name}
          </h2>
          <div className="text-red-600 font-mono text-lg mb-2">
            {selectedPattern.structure}
          </div>
          {selectedPattern.description && (
            <p className="text-gray-600 mb-4">{selectedPattern.description}</p>
          )}

          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Example Sentences</h3>
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
          {loadingSentences ? (
            <div className="text-gray-500">Loading sentences...</div>
          ) : sentences.length === 0 ? (
            <div className="text-gray-500">No example sentences available.</div>
          ) : (
            <div className="space-y-3">
              {sentences.map((sentence) => (
                <SentenceCard
                  key={sentence.id}
                  sentence={sentence}
                  showPinyin={showPinyin}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
