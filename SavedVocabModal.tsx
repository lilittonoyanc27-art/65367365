import React, { useState } from 'react';
import { Bookmark, Volume2, Trash2, X, Search, BookOpen, Sparkles } from 'lucide-react';
import { SavedWord } from './types';
import { speakSpanish } from './speechHelper';

interface SavedVocabModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedWords: SavedWord[];
  onRemoveWord: (id: string) => void;
}

export const SavedVocabModal: React.FC<SavedVocabModalProps> = ({
  isOpen,
  onClose,
  savedWords,
  onRemoveWord,
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = savedWords.filter(
    (w) =>
      w.spanish.toLowerCase().includes(search.toLowerCase()) ||
      w.russian.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-[#24050f] border border-rose-900/60 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-rose-900/40 flex items-center justify-between bg-[#1f040d]/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-orange-500/20 text-orange-400 rounded-xl border border-orange-500/35">
              <Bookmark className="w-5 h-5 fill-orange-500/30" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white font-display">Мой словарь</h3>
              <p className="text-xs text-rose-300/70">
                Сохранённые слова из песни: {savedWords.length}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-rose-300/70 hover:text-white hover:bg-rose-950/60 rounded-xl transition-colors"
            aria-label="Закрыть словарь"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-rose-900/40 bg-[#190308]/60">
          <div className="relative">
            <Search className="w-4 h-4 text-rose-400/80 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Поиск по испанскому или русскому..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#180308] border border-rose-900/50 rounded-xl pl-10 pr-4 py-2 text-sm text-stone-100 placeholder-rose-400/50 focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>
        </div>

        {/* Word list */}
        <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
          {savedWords.length === 0 ? (
            <div className="text-center py-12 px-4">
              <BookOpen className="w-12 h-12 text-rose-900/80 mx-auto mb-3" />
              <h4 className="text-base font-semibold text-rose-200 mb-1">
                Ваш словарь пока пуст
              </h4>
              <p className="text-xs text-rose-400/70 max-w-sm mx-auto">
                Нажимайте на любые испанские слова в тексте песни, чтобы посмотреть их перевод и добавить сюда для запоминания!
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8 text-rose-400/70 text-sm">
              Ничего не найдено по запросу «{search}»
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className="p-3.5 bg-[#1a0309]/80 border border-rose-950/80 rounded-xl flex items-center justify-between gap-3 hover:border-rose-800 transition-all group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-bold text-white text-base">{item.spanish}</span>
                    <button
                      onClick={() => speakSpanish(item.spanish)}
                      className="p-1 text-rose-300/70 hover:text-orange-400 transition-colors"
                      title="Озвучить"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-xs text-orange-300 font-medium truncate">
                    {item.russian}
                  </div>
                  {item.context && (
                    <div className="text-[11px] text-rose-300/60 italic mt-0.5 truncate">
                      Строка: {item.context}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => onRemoveWord(item.id)}
                  className="p-2 text-rose-500/70 hover:text-red-400 hover:bg-rose-950/80 rounded-lg transition-colors opacity-70 group-hover:opacity-100"
                  title="Удалить из словаря"
                  aria-label={`Удалить ${item.spanish}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-rose-900/40 bg-[#1f040d]/90 flex items-center justify-between">
          <span className="text-xs text-rose-300/70">
            Сохраняется автоматически в браузере
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#310714] hover:bg-[#440a1c] text-rose-200 text-xs font-semibold rounded-xl transition-colors border border-rose-800/40"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
