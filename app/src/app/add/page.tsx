"use client";

import { useState } from "react";
import { Tag } from "@/lib/db/schema";
import { TagSelector } from "@/components/TagSelector";

type TabType = "manual" | "ocr";

// Auto-detect if input is a word or sentence
function detectContentType(chinese: string): "word" | "sentence" {
  const trimmed = chinese.trim();
  const hasSentencePunctuation = /[。！？]/.test(trimmed);
  const charCount = trimmed.replace(/[^\u4e00-\u9fff]/g, "").length;

  // Sentence if: has sentence punctuation OR more than 4 Chinese characters
  if (hasSentencePunctuation || charCount > 4) {
    return "sentence";
  }
  return "word";
}

export default function AddPage() {
  const [activeTab, setActiveTab] = useState<TabType>("manual");

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add Content</h1>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-8">
          <button
            onClick={() => setActiveTab("manual")}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "manual"
                ? "border-red-500 text-red-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Manual
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
      {activeTab === "manual" && <ManualForm />}
      {activeTab === "ocr" && <OCRImport />}
    </div>
  );
}

function ManualForm() {
  const [chinese, setChinese] = useState("");
  const [pinyin, setPinyin] = useState("");
  const [english, setEnglish] = useState("");
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [generatingPinyin, setGeneratingPinyin] = useState(false);
  const [generatingEnglish, setGeneratingEnglish] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [existingItem, setExistingItem] = useState<{ id: number; type: "word" | "sentence" } | null>(null);

  const contentType = detectContentType(chinese);

  const generatePinyin = async () => {
    if (!chinese.trim()) return;
    setGeneratingPinyin(true);
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
      setGeneratingPinyin(false);
    }
  };

  const generateEnglish = async () => {
    if (!chinese.trim()) return;
    setGeneratingEnglish(true);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: chinese }),
      });
      const data = await res.json();
      if (data.translation) {
        setEnglish(data.translation);
      }
    } catch (error) {
      console.error("Failed to generate translation:", error);
    } finally {
      setGeneratingEnglish(false);
    }
  };

  const checkExisting = async () => {
    if (!chinese.trim()) return;
    const type = detectContentType(chinese);

    try {
      if (type === "word") {
        const res = await fetch(`/api/words?hanzi=${encodeURIComponent(chinese.trim())}`);
        const data = await res.json();
        if (data.words && data.words.length > 0) {
          const word = data.words[0];
          setExistingItem({ id: word.id, type: "word" });
          setPinyin(word.pinyin || "");
          setEnglish(word.definition || "");
        } else {
          setExistingItem(null);
        }
      } else {
        const res = await fetch("/api/sentences/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chinese: chinese.trim() }),
        });
        const data = await res.json();
        if (data.exists && data.sentence) {
          setExistingItem({ id: data.sentence.id, type: "sentence" });
          setPinyin(data.sentence.pinyin || "");
          setEnglish(data.sentence.english || "");
        } else {
          setExistingItem(null);
        }
      }
    } catch (error) {
      console.error("Failed to check existing:", error);
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

    const type = detectContentType(chinese);

    try {
      let url: string;
      let method: string;
      let body: object;

      if (type === "word") {
        url = existingItem?.type === "word" ? `/api/words/${existingItem.id}` : "/api/words";
        method = existingItem?.type === "word" ? "PUT" : "POST";
        body = {
          hanzi: chinese.trim(),
          pinyin: pinyin.trim(),
          definition: english.trim(),
          tagIds: selectedTags.map((t) => t.id),
        };
      } else {
        url = existingItem?.type === "sentence" ? `/api/sentences/${existingItem.id}` : "/api/sentences";
        method = existingItem?.type === "sentence" ? "PUT" : "POST";
        body = {
          chinese: chinese.trim(),
          pinyin: pinyin.trim(),
          english: english.trim(),
          tagIds: selectedTags.map((t) => t.id),
        };
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || `Failed to save ${type}`);
      }

      const isUpdate = existingItem !== null;
      setMessage({
        type: "success",
        text: `${type === "word" ? "Word" : "Sentence"} ${isUpdate ? "updated" : "added"} successfully!`,
      });

      // Reset form
      setChinese("");
      setPinyin("");
      setEnglish("");
      setSelectedTags([]);
      setExistingItem(null);
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

      {existingItem && (
        <div className="p-3 rounded-lg bg-yellow-50 text-yellow-700">
          {existingItem.type === "word" ? "Word" : "Sentence"} already exists. Editing existing entry.
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-gray-700">
            Chinese
          </label>
          {chinese.trim() && (
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              contentType === "word"
                ? "bg-blue-100 text-blue-700"
                : "bg-green-100 text-green-700"
            }`}>
              {contentType === "word" ? "Word" : "Sentence"}
            </span>
          )}
        </div>
        <textarea
          value={chinese}
          onChange={(e) => setChinese(e.target.value)}
          onBlur={() => {
            checkExisting();
            if (!pinyin) generatePinyin();
          }}
          rows={2}
          className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none resize-none"
          placeholder="e.g. 你好 or 我今天很高兴。"
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
            className="flex-1 px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none"
            placeholder="e.g. nǐ hǎo"
          />
          <button
            type="button"
            onClick={generatePinyin}
            disabled={generatingPinyin || !chinese.trim()}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 disabled:opacity-50"
          >
            {generatingPinyin ? "..." : "Generate"}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          English
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={english}
            onChange={(e) => setEnglish(e.target.value)}
            className="flex-1 px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none"
            placeholder="e.g. hello"
          />
          <button
            type="button"
            onClick={generateEnglish}
            disabled={generatingEnglish || !chinese.trim()}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 disabled:opacity-50"
          >
            {generatingEnglish ? "..." : "Generate"}
          </button>
        </div>
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
        {loading ? "Saving..." : existingItem ? `Update ${contentType === "word" ? "Word" : "Sentence"}` : `Add ${contentType === "word" ? "Word" : "Sentence"}`}
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
                      className="w-full px-3 py-1.5 text-sm text-gray-900 border border-gray-300 rounded focus:ring-1 focus:ring-red-400 focus:border-red-400 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">English</label>
                    <input
                      type="text"
                      value={sentence.english}
                      onChange={(e) => updateSentence(index, "english", e.target.value)}
                      className="w-full px-3 py-1.5 text-sm text-gray-900 border border-gray-300 rounded focus:ring-1 focus:ring-red-400 focus:border-red-400 outline-none"
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
