"use client";

import { Sentence } from "@/lib/db/schema";
import { AudioButton } from "./AudioButton";

interface SentenceCardProps {
  sentence: Sentence;
  highlightWord?: string;
  showTranslation?: boolean;
}

export function SentenceCard({
  sentence,
  highlightWord,
  showTranslation = true,
}: SentenceCardProps) {
  const renderChinese = () => {
    if (!highlightWord) {
      return sentence.chinese;
    }

    // Highlight the target word
    const parts = sentence.chinese.split(highlightWord);
    return parts.map((part, i) => (
      <span key={i}>
        {part}
        {i < parts.length - 1 && (
          <span className="text-red-600 font-bold">{highlightWord}</span>
        )}
      </span>
    ));
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xl text-gray-900 mb-2">{renderChinese()}</p>
          {showTranslation && (
            <p className="text-gray-600">{sentence.english}</p>
          )}
        </div>
        {sentence.audioPath && (
          <AudioButton src={sentence.audioPath} size="sm" />
        )}
      </div>
    </div>
  );
}

interface SentenceCardInteractiveProps {
  sentence: Sentence;
  onReveal?: () => void;
  revealed?: boolean;
}

export function SentenceCardInteractive({
  sentence,
  onReveal,
  revealed = false,
}: SentenceCardInteractiveProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <p className="text-2xl text-gray-900">{sentence.chinese}</p>
        {sentence.audioPath && <AudioButton src={sentence.audioPath} />}
      </div>

      {revealed ? (
        <p className="text-lg text-gray-600 border-t pt-4">{sentence.english}</p>
      ) : (
        <button
          onClick={onReveal}
          className="w-full py-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors"
        >
          Tap to reveal translation
        </button>
      )}
    </div>
  );
}
