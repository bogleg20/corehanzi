"use client";

import { useState, useEffect, useCallback } from "react";
import { Word } from "@/lib/db/schema";
import { WordCardCompact } from "@/components/WordCard";

export default function WordsPage() {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [level, setLevel] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const WORDS_PER_PAGE = 50;

  const fetchWords = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (level !== "all") params.set("level", level);
      if (search) params.set("search", search);
      params.set("page", page.toString());

      const res = await fetch(`/api/words?${params}`);
      const data = await res.json();
      setWords(data.words);
      setTotalPages(Math.ceil(data.total / WORDS_PER_PAGE));
    } catch (error) {
      console.error("Failed to fetch words:", error);
    } finally {
      setLoading(false);
    }
  }, [level, search, page]);

  useEffect(() => {
    fetchWords();
  }, [fetchWords]);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Vocabulary Browser
      </h1>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        {/* HSK Level Filter */}
        <div className="flex gap-2">
          {["all", "1", "2", "3"].map((l) => (
            <button
              key={l}
              onClick={() => { setLevel(l); setPage(1); }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                level === l
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {l === "all" ? "All" : `HSK ${l}`}
            </button>
          ))}
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search words..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>

      {/* Word Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="text-gray-500">Loading...</div>
        </div>
      ) : words.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500">No words found</div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {words.map((word) => (
              <WordCardCompact
                key={word.id}
                word={word}
                onClick={() => setSelectedWord(word)}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-gray-600">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Word Detail Modal */}
      {selectedWord && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedWord(null)}
        >
          <div
            className="bg-white rounded-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-900 mb-2">
                {selectedWord.hanzi}
              </div>
              {selectedWord.traditional &&
                selectedWord.traditional !== selectedWord.hanzi && (
                  <div className="text-xl text-gray-500 mb-2">
                    ({selectedWord.traditional})
                  </div>
                )}
              <div className="text-xl text-red-600 mb-4">
                {selectedWord.pinyin}
              </div>
              <div className="text-lg text-gray-700 mb-4">
                {selectedWord.definition}
              </div>
              {selectedWord.definitions &&
                Array.isArray(selectedWord.definitions) &&
                selectedWord.definitions.length > 1 && (
                  <div className="text-sm text-gray-500 mb-4">
                    Other meanings: {selectedWord.definitions.slice(1).join("; ")}
                  </div>
                )}
              <div className="flex justify-center gap-2 text-sm">
                <span className="bg-red-100 text-red-700 px-2 py-1 rounded">
                  HSK {selectedWord.hskLevel}
                </span>
                {selectedWord.pos && (
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {selectedWord.pos}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => setSelectedWord(null)}
              className="mt-6 w-full py-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
