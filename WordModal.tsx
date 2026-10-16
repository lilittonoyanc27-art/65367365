import React from 'react';
import { Volume2, Bookmark, BookmarkCheck, X, Sparkles, BookOpen } from 'lucide-react';
import { speakSpanish } from './speechHelper';
import { QUICK_WORD_LOOKUP, SONG_VOCABULARY } from './vocabularyData';
import { cleanWord } from './pureLogic';
import { SavedWord } from './types';

interface WordModalProps {
  selectedWord: string | null;
  onClose: () => void;
  savedWords: SavedWord[];
  onToggleSaveWord: (word: SavedWord) => void;
}

export const WordModal: React.FC<WordModalProps> = ({
  selectedWord,
  onClose,
  savedWords,
  onToggleSaveWord,
}) => {
  if (!selectedWord) return null;

  const rawClean = cleanWord(selectedWord);
  const lower = rawClean.toLowerCase();

  // Find info from quick lookup or full vocabulary
  const quickEntry = QUICK_WORD_LOOKUP[lower];
  const fullEntry = SONG_VOCABULARY.find(
    (v) =>
      cleanWord(v.spanish).toLowerCase().includes(lower) ||
      lower.includes(cleanWord(v.spanish).toLowerCase())
  );

  const displayEs = quickEntry?.es || fullEntry?.spanish || rawClean;
  const displayRu = quickEntry?.ru || fullEntry?.russian || 'Нажмите, чтобы изучить в контексте песни';
  const displayPos = quickEntry?.pos || fullEntry?.partOfSpeech || 'испанское слово';
  const displayDef = fullEntry?.explanation || quickEntry?.def || 'Слово из песни Наталии Орейро «Río de la Plata».';
  const displayExample = fullEntry?.example;
  const displayExampleRu = fullEntry?.exampleRu;

  const isSaved = savedWords.some((w) => cleanWord(w.spanish).toLowerCase() === lower);

  const handleSaveToggle = () => {
    onToggleSaveWord({
      id: `word_${lower}`,
      spanish: displayEs,
      russian: displayRu,
      context: fullEntry?.context,
      dateAdded: Date.now(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#25050f] border border-rose-900/60 rounded-2xl shadow-2xl p-6 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative corner glow */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-gradient-to-br from-orange-500/20 to-rose-600/30 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 text-[11px] font-semibold tracking-wider uppercase bg-orange-500/20 text-orange-300 rounded-md border border-orange-500/30">
                {displayPos}
              </span>
              {fullEntry && (
                <span className="px-2 py-0.5 text-[11px] font-medium bg-[#380816] text-rose-200 rounded-md border border-rose-800/40">
                  Ключевая лексика
                </span>
              )}
            </div>
            <h3 className="text-2xl font-black text-white font-display flex items-center gap-2">
              {displayEs}
            </h3>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => speakSpanish(rawClean)}
              className="p-2.5 text-rose-200/80 hover:text-orange-400 hover:bg-rose-950/60 rounded-xl transition-colors"
              title="Прослушать произношение"
              aria-label="Прослушать произношение"
            >
              <Volume2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2.5 text-rose-300/70 hover:text-white hover:bg-rose-950/60 rounded-xl transition-colors"
              aria-label="Закрыть"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Translation card */}
        <div className="bg-[#180308]/90 border border-rose-900/50 rounded-xl p-4 mb-4 shadow-inner">
          <div className="text-xs text-rose-300/70 uppercase tracking-wider mb-1 font-semibold">
            Русский перевод
          </div>
          <div className="text-lg font-bold text-orange-300">{displayRu}</div>
        </div>

        {/* Explanation / Cultural Note */}
        <div className="text-sm text-rose-100/90 leading-relaxed mb-4 space-y-2">
          <p>{displayDef}</p>
          {displayExample && (
            <div className="mt-3 p-3 bg-[#1e040c] rounded-xl border-l-2 border-orange-500 text-xs">
              <div className="font-semibold text-rose-100 mb-0.5">{displayExample}</div>
              <div className="text-rose-300/70">{displayExampleRu}</div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center gap-3 pt-2 border-t border-rose-900/40">
          <button
            onClick={handleSaveToggle}
            className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              isSaved
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-900/80'
                : 'bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-400 hover:to-rose-500 text-white shadow-lg shadow-orange-500/25'
            }`}
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="w-4 h-4" />
                <span>В вашем словаре</span>
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4" />
                <span>Добавить в Мой словарь</span>
              </>
            )}
          </button>

          <button
            onClick={() => speakSpanish(rawClean)}
            className="py-2.5 px-3 bg-[#300713] hover:bg-[#420a1c] text-rose-200 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-colors border border-rose-800/40"
          >
            <Volume2 className="w-4 h-4 text-orange-400" />
            <span>Озвучить</span>
          </button>
        </div>
      </div>
    </div>
  );
};
