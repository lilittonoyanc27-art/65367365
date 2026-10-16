import type { LyricLine } from './types.ts';

/**
 * Finds the index of the currently active lyric line based on video playback time.
 */
export function findActiveLineIndex(lines: LyricLine[], currentTime: number): number {
  if (!lines || lines.length === 0 || currentTime < 0) return -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startTime !== null) {
      const nextLineWithStart = lines.slice(i + 1).find((l) => l.startTime !== null);
      const effectiveEnd = line.endTime ?? nextLineWithStart?.startTime ?? (line.startTime + 6);

      if (currentTime >= line.startTime && currentTime < effectiveEnd) {
        return i;
      }
    }
  }

  // If before first timestamp
  const firstWithStart = lines.find((l) => l.startTime !== null);
  if (firstWithStart && firstWithStart.startTime !== null && currentTime < firstWithStart.startTime) {
    return -1;
  }

  return -1;
}

/**
 * Formats seconds into mm:ss.s or mm:ss
 */
export function formatTimestamp(seconds: number | null, includeDecimals = true): string {
  if (seconds === null || isNaN(seconds) || seconds < 0) {
    return '--:--';
  }
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const tenths = Math.floor((Math.round(seconds * 10) % 10));

  const minsStr = mins.toString().padStart(2, '0');
  const secsStr = secs.toString().padStart(2, '0');

  if (includeDecimals) {
    return `${minsStr}:${secsStr}.${tenths}`;
  }
  return `${minsStr}:${secsStr}`;
}

/**
 * Parses timestamp string (mm:ss, mm:ss.s, or raw seconds) into seconds number
 */
export function parseTimestamp(input: string): number | null {
  if (!input) return null;
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Pattern mm:ss or mm:ss.s
  if (trimmed.includes(':')) {
    const parts = trimmed.split(':');
    if (parts.length === 2) {
      const mins = parseFloat(parts[0]);
      const secs = parseFloat(parts[1]);
      if (!isNaN(mins) && !isNaN(secs)) {
        return Math.max(0, mins * 60 + secs);
      }
    }
  }

  const num = parseFloat(trimmed);
  return isNaN(num) || num < 0 ? null : num;
}

/**
 * Cleans word from punctuation for dictionary lookup
 */
export function cleanWord(word: string): string {
  if (!word) return '';
  return word.replace(/[¡!¿?,.:;"()\[\]]/g, '').trim();
}

/**
 * Checks if selected words match target sentence words
 */
export function checkSentenceOrder(placedWords: string[], targetWords: string[]): boolean {
  if (placedWords.length !== targetWords.length) return false;
  return placedWords.every((w, idx) => cleanWord(w).toLowerCase() === cleanWord(targetWords[idx]).toLowerCase());
}

/**
 * Calculates progress percentage safely between 0 and 100
 */
export function calculateProgress(completedCount: number, totalCount: number): number {
  if (totalCount <= 0) return 0;
  const pct = Math.round((completedCount / totalCount) * 100);
  return Math.min(100, Math.max(0, pct));
}
