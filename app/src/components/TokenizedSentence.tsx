"use client";

import { Tooltip } from "./Tooltip";

export interface TokenInfo {
  pinyin: string;
  definition: string;
}

interface TokenizedSentenceProps {
  tokens: string[];
  tokenData: Record<string, TokenInfo>;
  highlightWord?: string;
  className?: string;
}

// Chinese punctuation that should not have tooltips
const PUNCTUATION_REGEX = /^[，。？！、；：""''（）【】…—·\s]+$/;

export function TokenizedSentence({
  tokens,
  tokenData,
  highlightWord,
  className = "",
}: TokenizedSentenceProps) {
  return (
    <span className={className}>
      {tokens.map((token, index) => {
        const isPunctuation = PUNCTUATION_REGEX.test(token);
        const wordInfo = tokenData[token];
        const isHighlighted = highlightWord && token === highlightWord;

        // Punctuation or unknown words: render without tooltip
        if (isPunctuation || !wordInfo) {
          return (
            <span
              key={index}
              className={isHighlighted ? "text-red-600 font-bold" : ""}
            >
              {token}
            </span>
          );
        }

        // Known word: render with tooltip
        return (
          <Tooltip
            key={index}
            content={
              <span className="flex flex-col items-center gap-0.5">
                <span className="text-red-400">{wordInfo.pinyin}</span>
                <span>{wordInfo.definition}</span>
              </span>
            }
          >
            <span
              className={`cursor-help hover:bg-yellow-100 rounded transition-colors ${
                isHighlighted ? "text-red-600 font-bold" : ""
              }`}
            >
              {token}
            </span>
          </Tooltip>
        );
      })}
    </span>
  );
}
