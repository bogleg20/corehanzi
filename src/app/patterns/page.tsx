"use client";

import { useState, useEffect } from "react";
import { Pattern, Sentence } from "@/lib/db/schema";
import { SentenceCard } from "@/components/SentenceCard";

export default function PatternsPage() {
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPattern, setSelectedPattern] = useState<Pattern | null>(null);
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [loadingSentences, setLoadingSentences] = useState(false);

  useEffect(() => {
    fetchPatterns();
  }, []);

  useEffect(() => {
    if (selectedPattern) {
      fetchSentences(selectedPattern.id);
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
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {selectedPattern.name}
          </h2>
          <div className="text-red-600 font-mono text-lg mb-2">
            {selectedPattern.structure}
          </div>
          {selectedPattern.description && (
            <p className="text-gray-600 mb-4">{selectedPattern.description}</p>
          )}

          <h3 className="font-semibold text-gray-900 mb-3">Example Sentences</h3>
          {loadingSentences ? (
            <div className="text-gray-500">Loading sentences...</div>
          ) : sentences.length === 0 ? (
            <div className="text-gray-500">No example sentences available.</div>
          ) : (
            <div className="space-y-3">
              {sentences.map((sentence) => (
                <SentenceCard key={sentence.id} sentence={sentence} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
