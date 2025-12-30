"use client";

import { Word } from "@/lib/db/schema";
import { AudioButton } from "./AudioButton";

const posLabels: Record<string, string> = {
  n: "noun",
  v: "verb",
  a: "adjective",
  d: "adverb",
  p: "preposition",
  c: "conjunction",
  r: "pronoun",
  m: "numeral",
  q: "measure word",
  u: "particle",
  e: "interjection",
  f: "location",
  t: "time",
  b: "bound form",
  g: "morpheme",
  y: "modal particle",
  cc: "coordinating conj.",
  qv: "verb classifier",
  qt: "time classifier",
};

function formatPos(pos: string): string {
  return pos
    .split(",")
    .map((code) => posLabels[code.trim()] || code.trim())
    .join(", ");
}

interface WordCardProps {
  word: Word;
  showDetails?: boolean;
  onFlip?: () => void;
}

export function WordCard({ word, showDetails = true, onFlip }: WordCardProps) {
  return (
    <div
      className="bg-white rounded-xl shadow-lg p-8 text-center cursor-pointer hover:shadow-xl transition-shadow"
      onClick={onFlip}
    >
      {/* Hanzi */}
      <div className="text-6xl font-bold text-gray-900 mb-4">{word.hanzi}</div>

      {showDetails && (
        <>
          {/* Traditional (if different) */}
          {word.traditional && word.traditional !== word.hanzi && (
            <div className="text-2xl text-gray-500 mb-2">
              ({word.traditional})
            </div>
          )}

          {/* Pinyin */}
          <div className="text-2xl text-red-600 mb-4">{word.pinyin}</div>

          {/* Definition */}
          <div className="text-xl text-gray-700 mb-4">{word.definition}</div>

          {/* Additional meanings */}
          {word.definitions &&
            Array.isArray(word.definitions) &&
            word.definitions.length > 1 && (
              <div className="text-sm text-gray-500 mb-4">
                Also: {word.definitions.slice(1, 4).join("; ")}
              </div>
            )}

          {/* Metadata row */}
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <span className="bg-red-100 text-red-700 px-2 py-1 rounded">
              HSK {word.hskLevel}
            </span>
            {word.pos && (
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {formatPos(word.pos)}
              </span>
            )}
            {word.audioPath && <AudioButton src={word.audioPath} />}
          </div>

          {/* Classifiers */}
          {word.classifiers &&
            Array.isArray(word.classifiers) &&
            word.classifiers.length > 0 && (
              <div className="mt-4 text-sm text-gray-500">
                Measure word: {word.classifiers.join(", ")}
              </div>
            )}
        </>
      )}
    </div>
  );
}

interface WordCardCompactProps {
  word: Word;
  onClick?: () => void;
  progress?: "new" | "learning" | "mastered";
  onToggleLearned?: () => void;
}

export function WordCardCompact({
  word,
  onClick,
  progress = "new",
  onToggleLearned,
}: WordCardCompactProps) {
  const isLearned = progress === "mastered";

  return (
    <div
      className="bg-white rounded-lg border-2 border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <span className="text-2xl font-bold text-gray-900">{word.hanzi}</span>
          <span className="text-sm text-red-600 ml-2">{word.pinyin}</span>
        </div>
        <div className="flex items-center gap-2">
          {word.audioPath && (
            <AudioButton src={word.audioPath} size="sm" />
          )}
          {onToggleLearned && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleLearned();
              }}
              className={`p-1 rounded-full transition-colors ${
                isLearned
                  ? "bg-green-100 text-green-600 ring-2 ring-green-500 hover:bg-green-200"
                  : "bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
              }`}
              title={isLearned ? "Mark as unlearned" : "Mark as learned"}
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          )}
          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
            HSK {word.hskLevel}
          </span>
        </div>
      </div>
      <div className="text-gray-600 text-sm mt-1 truncate">{word.definition}</div>
    </div>
  );
}
