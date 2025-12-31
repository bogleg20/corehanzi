"use client";

import { useState } from "react";
import { Tag } from "@/lib/db/schema";
import { TagSelector } from "@/components/TagSelector";

type TabType = "words" | "sentences" | "ocr";

export default function AddPage() {
  const [activeTab, setActiveTab] = useState<TabType>("words");

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add Content</h1>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-8">
          <button
            onClick={() => setActiveTab("words")}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "words"
                ? "border-red-500 text-red-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Words
          </button>
          <button
            onClick={() => setActiveTab("sentences")}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "sentences"
                ? "border-red-500 text-red-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Sentences
          </button>
          <button
            onClick={() => setActiveTab("ocr")}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "ocr"
                ? "border-red-500 text-red-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            OCR Import
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "words" && <WordForm />}
      {activeTab === "sentences" && <SentenceForm />}
      {activeTab === "ocr" && <OCRImport />}
    </div>
  );
}

function WordForm() {
  const [hanzi, setHanzi] = useState("");
  const [pinyin, setPinyin] = useState("");
  const [definition, setDefinition] = useState("");
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [existingWord, setExistingWord] = useState<{ id: number; hanzi: string; pinyin: string; definition: string } | null>(null);

  const generatePinyin = async () => {
    if (!hanzi.trim()) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/pinyin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: hanzi }),
      });
      const data = await res.json();
      if (data.pinyin) {
        setPinyin(data.pinyin);
      }
    } catch (error) {
      console.error("Failed to generate pinyin:", error);
    } finally {
      setGenerating(false);
    }
  };

  const checkExisting = async () => {
    if (!hanzi.trim()) return;
    try {
      const res = await fetch(`/api/words?hanzi=${encodeURIComponent(hanzi)}`);
      const data = await res.json();
      if (data.words && data.words.length > 0) {
        const word = data.words[0];
        setExistingWord(word);
        setPinyin(word.pinyin || "");
        setDefinition(word.definition || "");
      } else {
        setExistingWord(null);
      }
    } catch (error) {
      console.error("Failed to check existing word:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hanzi.trim() || !definition.trim()) {
      setMessage({ type: "error", text: "Hanzi and definition are required" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const url = existingWord ? `/api/words/${existingWord.id}` : "/api/words";
      const method = existingWord ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hanzi: hanzi.trim(),
          pinyin: pinyin.trim(),
          definition: definition.trim(),
          tagIds: selectedTags.map((t) => t.id),
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to save word");
      }

      setMessage({
        type: "success",
        text: existingWord ? "Word updated successfully!" : "Word added successfully!",
      });

      // Reset form
      setHanzi("");
      setPinyin("");
      setDefinition("");
      setSelectedTags([]);
      setExistingWord(null);
    } catch (error) {
      setMessage({ type: "error", text: (error as Error).message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div
          className={`p-3 rounded-lg ${
            message.type === "success"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {existingWord && (
        <div className="p-3 rounded-lg bg-yellow-50 text-yellow-700">
          Word already exists. Editing existing entry.
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Hanzi (Chinese)
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={hanzi}
            onChange={(e) => setHanzi(e.target.value)}
            onBlur={() => {
              checkExisting();
              if (!pinyin) generatePinyin();
            }}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none"
            placeholder="e.g. 你好"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Pinyin
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={pinyin}
            onChange={(e) => setPinyin(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none"
            placeholder="e.g. nǐ hǎo"
          />
          <button
            type="button"
            onClick={generatePinyin}
            disabled={generating || !hanzi.trim()}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 disabled:opacity-50"
          >
            {generating ? "..." : "Generate"}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Definition
        </label>
        <input
          type="text"
          value={definition}
          onChange={(e) => setDefinition(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none"
          placeholder="e.g. hello"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tags
        </label>
        <TagSelector
          selectedTags={selectedTags}
          onTagsChange={setSelectedTags}
          mode="assign"
          allowCreate
          placeholder="Select or create tags..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
      >
        {loading ? "Saving..." : existingWord ? "Update Word" : "Add Word"}
      </button>
    </form>
  );
}

function SentenceForm() {
  const [chinese, setChinese] = useState("");
  const [english, setEnglish] = useState("");
  const [pinyin, setPinyin] = useState("");
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [existingSentence, setExistingSentence] = useState<{ id: number } | null>(null);

  const generatePinyin = async () => {
    if (!chinese.trim()) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/pinyin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: chinese }),
      });
      const data = await res.json();
      if (data.pinyin) {
        setPinyin(data.pinyin);
      }
    } catch (error) {
      console.error("Failed to generate pinyin:", error);
    } finally {
      setGenerating(false);
    }
  };

  const checkExisting = async () => {
    if (!chinese.trim()) return;
    try {
      const res = await fetch("/api/sentences/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chinese: chinese.trim() }),
      });
      const data = await res.json();
      if (data.exists && data.sentence) {
        setExistingSentence(data.sentence);
        setEnglish(data.sentence.english || "");
        setPinyin(data.sentence.pinyin || "");
      } else {
        setExistingSentence(null);
      }
    } catch (error) {
      console.error("Failed to check existing sentence:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chinese.trim() || !english.trim()) {
      setMessage({ type: "error", text: "Chinese and English are required" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const url = existingSentence ? `/api/sentences/${existingSentence.id}` : "/api/sentences";
      const method = existingSentence ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chinese: chinese.trim(),
          english: english.trim(),
          pinyin: pinyin.trim(),
          tagIds: selectedTags.map((t) => t.id),
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to save sentence");
      }

      setMessage({
        type: "success",
        text: existingSentence ? "Sentence updated successfully!" : "Sentence added successfully!",
      });

      // Reset form
      setChinese("");
      setEnglish("");
      setPinyin("");
      setSelectedTags([]);
      setExistingSentence(null);
    } catch (error) {
      setMessage({ type: "error", text: (error as Error).message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div
          className={`p-3 rounded-lg ${
            message.type === "success"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {existingSentence && (
        <div className="p-3 rounded-lg bg-yellow-50 text-yellow-700">
          Sentence already exists. Editing existing entry.
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Chinese Sentence
        </label>
        <textarea
          value={chinese}
          onChange={(e) => setChinese(e.target.value)}
          onBlur={() => {
            checkExisting();
            if (!pinyin) generatePinyin();
          }}
          rows={2}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none resize-none"
          placeholder="e.g. 我今天很高兴。"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Pinyin
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={pinyin}
            onChange={(e) => setPinyin(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none"
            placeholder="e.g. wǒ jīn tiān hěn gāo xìng."
          />
          <button
            type="button"
            onClick={generatePinyin}
            disabled={generating || !chinese.trim()}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 disabled:opacity-50"
          >
            {generating ? "..." : "Generate"}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          English Translation
        </label>
        <textarea
          value={english}
          onChange={(e) => setEnglish(e.target.value)}
          rows={2}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none resize-none"
          placeholder="e.g. I am very happy today."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tags
        </label>
        <TagSelector
          selectedTags={selectedTags}
          onTagsChange={setSelectedTags}
          mode="assign"
          allowCreate
          placeholder="Select or create tags..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
      >
        {loading ? "Saving..." : existingSentence ? "Update Sentence" : "Add Sentence"}
      </button>
    </form>
  );
}

interface SentenceData {
  chinese: string;
  pinyin: string;
  english: string;
  selected: boolean;
}

function OCRImport() {
  const [extractedText, setExtractedText] = useState("");
  const [sentenceData, setSentenceData] = useState<SentenceData[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState({ status: "", progress: 0 });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  const processImage = async (file: File) => {
    setProcessing(true);
    setProgress({ status: "Extracting text...", progress: 0 });
    setMessage(null);
    setSentenceData([]);

    try {
      const { extractChineseText, parseSentences } = await import("@/lib/ocr");

      const text = await extractChineseText(file, (p) => {
        setProgress({ status: p.status, progress: p.progress * 0.5 }); // First 50% for OCR
      });

      setExtractedText(text);
      const sentences = parseSentences(text);

      if (sentences.length === 0) {
        setMessage({ type: "error", text: "No sentences found in image" });
        setProcessing(false);
        return;
      }

      // Generate pinyin and translations for all sentences
      setProgress({ status: "Generating translations...", progress: 0.5 });

      const enrichedSentences: SentenceData[] = [];
      for (let i = 0; i < sentences.length; i++) {
        const chinese = sentences[i];
        setProgress({
          status: `Translating ${i + 1}/${sentences.length}...`,
          progress: 0.5 + (i / sentences.length) * 0.5,
        });

        // Generate pinyin and translation in parallel
        const [pinyinRes, translateRes] = await Promise.all([
          fetch("/api/pinyin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: chinese }),
          }),
          fetch("/api/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: chinese }),
          }),
        ]);

        const pinyinData = await pinyinRes.json();
        const translateData = await translateRes.json();

        enrichedSentences.push({
          chinese,
          pinyin: pinyinData.pinyin || "",
          english: translateData.translation || "",
          selected: true,
        });
      }

      setSentenceData(enrichedSentences);
      setProgress({ status: "", progress: 0 });
    } catch (error) {
      console.error("OCR error:", error);
      setMessage({ type: "error", text: "Failed to process image" });
    } finally {
      setProcessing(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processImage(file);
    }
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (const item of Array.from(items)) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) {
          await processImage(file);
        }
        break;
      }
    }
  };

  const toggleSentence = (index: number) => {
    setSentenceData((prev) =>
      prev.map((s, i) => (i === index ? { ...s, selected: !s.selected } : s))
    );
  };

  const updateSentence = (index: number, field: "pinyin" | "english", value: string) => {
    setSentenceData((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  };

  const selectedCount = sentenceData.filter((s) => s.selected).length;

  const handleSaveSelected = async () => {
    const toSave = sentenceData.filter((s) => s.selected);
    if (toSave.length === 0) {
      setMessage({ type: "error", text: "No sentences selected" });
      return;
    }

    setSaving(true);
    setMessage(null);
    let saved = 0;
    let skipped = 0;

    try {
      for (const sentence of toSave) {
        const res = await fetch("/api/sentences", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chinese: sentence.chinese,
            english: sentence.english,
            pinyin: sentence.pinyin,
            tagIds: selectedTags.map((t) => t.id),
          }),
        });

        if (res.ok) {
          saved++;
        } else {
          skipped++;
        }
      }

      setMessage({
        type: "success",
        text: `Saved ${saved} sentences${skipped > 0 ? `, ${skipped} skipped (duplicates)` : ""}`,
      });

      // Remove saved sentences from the list
      setSentenceData((prev) => prev.filter((s) => !s.selected));
    } catch {
      setMessage({ type: "error", text: "Failed to save sentences" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`p-3 rounded-lg ${
            message.type === "success"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Upload/Paste Area */}
      <div
        onPaste={handlePaste}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors focus:outline-none focus:border-red-400"
        tabIndex={0}
      >
        <div className="text-5xl mb-4">📷</div>
        <p className="text-gray-600 mb-4">
          Paste an image (Ctrl/Cmd + V) or upload a file
        </p>
        <label className="inline-block px-6 py-2 bg-red-600 text-white rounded-lg cursor-pointer hover:bg-red-700 transition-colors">
          Upload Image
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Processing indicator */}
      {processing && (
        <div className="text-center py-4">
          <div className="text-gray-600 mb-2">{progress.status}</div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-red-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress.progress * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Extracted text preview */}
      {extractedText && !processing && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Extracted Text
          </h3>
          <div className="bg-gray-50 rounded-lg p-4 text-gray-700 text-sm whitespace-pre-wrap max-h-32 overflow-y-auto">
            {extractedText}
          </div>
        </div>
      )}

      {/* Parsed sentences with editable fields */}
      {sentenceData.length > 0 && !processing && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-700">
              Sentences ({selectedCount}/{sentenceData.length} selected)
            </h3>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSentenceData((prev) => prev.map((s) => ({ ...s, selected: true })))}
                className="text-xs text-red-600 hover:text-red-700"
              >
                Select All
              </button>
              <button
                type="button"
                onClick={() => setSentenceData((prev) => prev.map((s) => ({ ...s, selected: false })))}
                className="text-xs text-gray-600 hover:text-gray-700"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            {sentenceData.map((sentence, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border transition-colors ${
                  sentence.selected
                    ? "bg-red-50 border-red-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <input
                    type="checkbox"
                    checked={sentence.selected}
                    onChange={() => toggleSentence(index)}
                    className="mt-1 w-4 h-4 text-red-500 rounded border-gray-300 focus:ring-red-500"
                  />
                  <p className="text-lg text-gray-900 flex-1">{sentence.chinese}</p>
                </div>

                <div className="ml-7 space-y-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Pinyin</label>
                    <input
                      type="text"
                      value={sentence.pinyin}
                      onChange={(e) => updateSentence(index, "pinyin", e.target.value)}
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-red-400 focus:border-red-400 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">English</label>
                    <input
                      type="text"
                      value={sentence.english}
                      onChange={(e) => updateSentence(index, "english", e.target.value)}
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-red-400 focus:border-red-400 outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tags for imported sentences */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags for imported sentences
            </label>
            <TagSelector
              selectedTags={selectedTags}
              onTagsChange={setSelectedTags}
              mode="assign"
              allowCreate
              placeholder="Select or create tags..."
            />
          </div>

          <button
            type="button"
            onClick={handleSaveSelected}
            disabled={saving || selectedCount === 0}
            className="w-full mt-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : `Save ${selectedCount} Sentences`}
          </button>
        </div>
      )}
    </div>
  );
}
