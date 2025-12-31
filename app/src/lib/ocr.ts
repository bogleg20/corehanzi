import Tesseract from "tesseract.js";

export interface OCRProgress {
  status: string;
  progress: number;
}

export async function extractChineseText(
  imageFile: File,
  onProgress?: (progress: OCRProgress) => void
): Promise<string> {
  const result = await Tesseract.recognize(imageFile, "chi_sim", {
    logger: (m) => {
      if (onProgress && m.status) {
        onProgress({
          status: m.status,
          progress: m.progress || 0,
        });
      }
    },
  });

  return result.data.text;
}

export function parseSentences(text: string): string[] {
  // Split by Chinese punctuation marks that end sentences
  const sentenceEnders = /[。！？\n]/g;
  const parts = text.split(sentenceEnders);

  return parts
    .map((s) => s.trim())
    .filter((s) => {
      // Only keep non-empty strings with Chinese characters
      return s.length > 0 && /[\u4e00-\u9fff]/.test(s);
    });
}

export function cleanChineseText(text: string): string {
  // Remove non-Chinese characters except punctuation
  return text
    .replace(/[^\u4e00-\u9fff\u3000-\u303f\uff00-\uffef\s]/g, "")
    .trim();
}
