export type SongSection = 'VERSO 1' | 'ESTRIBILLO 1' | 'VERSO 2' | 'ESTRIBILLO 2';

export interface LyricLine {
  id: string;
  section: SongSection;
  sectionTitle: string;
  startTime: number | null;
  endTime: number | null;
  spanish: string;
  russian: string;
  notes?: string;
  keywords?: string[];
}

export interface VocabularyItem {
  id: string;
  spanish: string;
  russian: string;
  partOfSpeech: string;
  context: string;
  explanation: string;
  example: string;
  exampleRu: string;
  category: 'candombe' | 'emociones' | 'expresiones' | 'verbos' | 'cultura';
}

export interface GrammarItem {
  id: string;
  title: string;
  subtitle: string;
  level: string;
  explanation: string;
  rule: string;
  examples: Array<{
    es: string;
    ru: string;
    highlight: string;
    explanation?: string;
  }>;
}

export interface FillBlankExercise {
  id: string;
  lineId: string;
  spanishBefore: string;
  missingWord: string;
  spanishAfter: string;
  russianTranslation: string;
  options: string[];
  hint: string;
}

export interface ScrambleExercise {
  id: string;
  lineId: string;
  targetSentence: string;
  russianTranslation: string;
  scrambledWords: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: 'vocabulario' | 'cultura' | 'gramatica';
}

export interface SavedWord {
  id: string;
  spanish: string;
  russian: string;
  context?: string;
  dateAdded: number;
}
