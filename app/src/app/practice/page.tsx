"use client";

import { useState, useEffect } from "react";
import { Sentence } from "@/lib/db/schema";
import { Tooltip } from "@/components/Tooltip";
import { TokenInfo } from "@/components/TokenizedSentence";

export default function PracticePage() {
  const [sentence, setSentence] = useState<Sentence | null>(null);
  const [tokenData, setTokenData] = useState<Record<string, TokenInfo>>({});
  const [scrambledTokens, setScrambledTokens] = useState<string[]>([]);
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [stats, setStats] = useState({ correct: 0, total: 0 });
  const [noSentences, setNoSentences] = useState(false);

  useEffect(() => {
    fetchSentence();
  }, []);

  const fetchSentence = async () => {
    setLoading(true);
    setShowResult(false);
    setSelectedTokens([]);

    try {
      const res = await fetch("/api/practice/sentence");
      if (res.status === 404) {
        setNoSentences(true);
        return;
      }
      const data = await res.json();
      setSentence(data.sentence);
      setTokenData(data.tokenData || {});

      // Scramble tokens
      const tokens = data.sentence.tokens || [];
      const shuffled = [...tokens].sort(() => Math.random() - 0.5);
      setScrambledTokens(shuffled);
    } catch (error) {
      console.error("Failed to fetch sentence:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTokenClick = (token: string, fromSelected: boolean) => {
    if (showResult) return;

    if (fromSelected) {
      // Remove from selected, add back to scrambled
      setSelectedTokens((prev) => {
        const index = prev.indexOf(token);
        return [...prev.slice(0, index), ...prev.slice(index + 1)];
      });
      setScrambledTokens((prev) => [...prev, token]);
    } else {
      // Add to selected, remove from scrambled
      setSelectedTokens((prev) => [...prev, token]);
      setScrambledTokens((prev) => {
        const index = prev.indexOf(token);
        return [...prev.slice(0, index), ...prev.slice(index + 1)];
      });
    }
  };

  const checkAnswer = () => {
    if (!sentence?.tokens) return;

    const userAnswer = selectedTokens.join("");
    const correctAnswer = (sentence.tokens as string[]).join("");

    const correct = userAnswer === correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);
    setStats((prev) => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1,
    }));
  };

  const handleNext = () => {
    fetchSentence();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-xl text-gray-500">Loading...</div>
      </div>
    );
  }

  if (noSentences) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📚</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Learn Some Words First
        </h1>
        <p className="text-gray-600 mb-8">
          Practice sentences will be available after you&apos;ve learned some vocabulary.
        </p>
        <a
          href="/learn"
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Start Learning
        </a>
      </div>
    );
  }

  if (!sentence) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No sentences available for practice.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Build the Sentence
        </h1>
        <p className="text-gray-600">
          Arrange the words in the correct order to match the English translation.
        </p>
        <div className="mt-2 text-sm text-gray-500">
          Score: {stats.correct}/{stats.total}
          {stats.total > 0 && ` (${Math.round((stats.correct / stats.total) * 100)}%)`}
        </div>
      </div>

      {/* English Translation */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <p className="text-lg text-blue-900">{sentence.english}</p>
      </div>

      {/* Answer Area */}
      <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 min-h-[80px] p-4 mb-4">
        {selectedTokens.length === 0 ? (
          <p className="text-gray-400 text-center">
            Tap words below to build the sentence
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selectedTokens.map((token, index) => (
              <button
                key={`selected-${index}`}
                onClick={() => handleTokenClick(token, true)}
                disabled={showResult}
                className={`px-4 py-2 rounded-lg text-lg font-medium transition-colors ${
                  showResult
                    ? isCorrect
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                    : "bg-red-500 text-white hover:bg-red-600"
                }`}
              >
                {token}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Word Bank */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-2 justify-center">
          {scrambledTokens.map((token, index) => {
            const wordInfo = tokenData[token];
            const button = (
              <button
                key={`scrambled-${index}`}
                onClick={() => handleTokenClick(token, false)}
                disabled={showResult}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                {token}
              </button>
            );

            if (wordInfo) {
              return (
                <Tooltip
                  key={`scrambled-${index}`}
                  content={
                    <span className="flex flex-col items-center gap-0.5">
                      <span className="text-red-400">{wordInfo.pinyin}</span>
                      <span>{wordInfo.definition}</span>
                    </span>
                  }
                >
                  {button}
                </Tooltip>
              );
            }

            return button;
          })}
        </div>
      </div>

      {/* Result */}
      {showResult && (
        <div
          className={`rounded-lg p-4 mb-6 ${
            isCorrect ? "bg-green-50" : "bg-red-50"
          }`}
        >
          <p
            className={`font-medium ${
              isCorrect ? "text-green-800" : "text-red-800"
            }`}
          >
            {isCorrect ? "✓ Correct!" : "✗ Not quite right"}
          </p>
          {!isCorrect && (
            <p className="text-gray-700 mt-2">
              Correct answer: <strong>{sentence.chinese}</strong>
            </p>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4">
        {!showResult ? (
          <button
            onClick={checkAnswer}
            disabled={selectedTokens.length === 0}
            className="flex-1 py-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 rounded-lg text-lg font-medium text-white transition-colors"
          >
            Check Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex-1 py-4 bg-red-600 hover:bg-red-700 rounded-lg text-lg font-medium text-white transition-colors"
          >
            Next Sentence →
          </button>
        )}
      </div>
    </div>
  );
}
