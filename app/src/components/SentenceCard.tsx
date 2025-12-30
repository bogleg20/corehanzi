"use client";

import { Sentence } from "@/lib/db/schema";
import { AudioButton } from "./AudioButton";
import { TokenizedSentence, TokenInfo } from "./TokenizedSentence";

interface SentenceCardProps {
  sentence: Sentence;
  highlightWord?: string;
  showTranslation?: boolean;
  showPinyin?: boolean;
  tokenData?: Record<string, TokenInfo>;
}

export function SentenceCard({
  sentence,
  highlightWord,
  showTranslation = true,
  showPinyin = false,
  tokenData,
}: SentenceCardProps) {
  const renderChinese = () => {
    // Use tokenized rendering with tooltips if token data available
    if (sentence.tokens && tokenData) {
      return (
        <TokenizedSentence
          tokens={sentence.tokens}
          tokenData={tokenData}
          highlightWord={highlightWord}
        />
      );
    }

    // Fallback: simple highlighting without tooltips
    if (!highlightWord) {
      return sentence.chinese;
    }

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
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="text-xl text-gray-900 leading-relaxed mb-1">{renderChinese()}</p>
          {showPinyin && sentence.pinyin && (
            <p className="text-red-600 text-base mb-2">{sentence.pinyin}</p>
          )}
          {showTranslation && (
            <p className="text-gray-600 text-base">{sentence.english}</p>
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
  showPinyin?: boolean;
}

export function SentenceCardInteractive({
  sentence,
  onReveal,
  revealed = false,
  showPinyin = false,
}: SentenceCardInteractiveProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-start justify-between gap-3 mb-2">
        <p className="text-2xl text-gray-900 leading-relaxed">{sentence.chinese}</p>
        {sentence.audioPath && <AudioButton src={sentence.audioPath} />}
      </div>
      {showPinyin && sentence.pinyin && (
        <p className="text-red-600 text-base mb-4">{sentence.pinyin}</p>
      )}

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
