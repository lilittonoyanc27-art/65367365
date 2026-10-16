import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  Play,
  RotateCcw,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Info,
  Radio,
  Repeat,
  Compass,
} from 'lucide-react';
import { LyricLine, SongSection } from './types';
import { speakSpanish } from './speechHelper';
import { cleanWord } from './pureLogic';

interface LyricsSectionProps {
  lines: LyricLine[];
  activeLineIndex: number;
  onJumpToLine: (line: LyricLine) => void;
  onWordClick: (word: string) => void;
  loopCurrentLine: boolean;
  onToggleLoopCurrentLine: () => void;
  autoScroll: boolean;
  onToggleAutoScroll: () => void;
}

export const LyricsSection: React.FC<LyricsSectionProps> = ({
  lines,
  activeLineIndex,
  onJumpToLine,
  onWordClick,
  loopCurrentLine,
  onToggleLoopCurrentLine,
  autoScroll,
  onToggleAutoScroll,
}) => {
  // Set of opened translation line IDs
  const [openTranslations, setOpenTranslations] = useState<Record<string, boolean>>({});
  // Set of opened line notes
  const [openNotes, setOpenNotes] = useState<Record<string, boolean>>({});

  const activeLineRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to active line when changed
  useEffect(() => {
    if (autoScroll && activeLineRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeLineIndex, autoScroll]);

  const toggleTranslation = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setOpenTranslations((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleNote = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setOpenNotes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const showAllTranslations = () => {
    const allOpen: Record<string, boolean> = {};
    lines.forEach((l) => {
      allOpen[l.id] = true;
    });
    setOpenTranslations(allOpen);
  };

  const hideAllTranslations = () => {
    setOpenTranslations({});
  };

  // Group lines by sections
  const sections: { section: SongSection; title: string; lines: LyricLine[] }[] = [
    {
      section: 'VERSO 1',
      title: 'Куплет 1 (Verso 1) — Воспоминания о Монтевидео',
      lines: lines.filter((l) => l.section === 'VERSO 1'),
    },
    {
      section: 'ESTRIBILLO 1',
      title: 'Припев 1 (Estribillo 1) — Гордость корнями и ритм кандомбе',
      lines: lines.filter((l) => l.section === 'ESTRIBILLO 1'),
    },
    {
      section: 'VERSO 2',
      title: 'Куплет 2 (Verso 2) — Путь к успеху и преодоление',
      lines: lines.filter((l) => l.section === 'VERSO 2'),
    },
    {
      section: 'ESTRIBILLO 2',
      title: 'Припев 2 (Estribillo 2) — Финальный гимн мечте',
      lines: lines.filter((l) => l.section === 'ESTRIBILLO 2'),
    },
  ];

  return (
    <div className="w-full bg-[#20040c]/90 border border-rose-900/50 rounded-2xl shadow-2xl overflow-hidden mt-6 backdrop-blur">
      {/* Top Banner & Control Bar */}
      <div className="p-5 bg-gradient-to-r from-[#26050f] via-[#3d0818] to-[#1d030b] border-b border-rose-900/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide uppercase bg-gradient-to-r from-orange-500/20 to-rose-500/20 text-orange-300 border border-orange-500/35">
              <Sparkles className="w-3 h-3 text-orange-400" />
              LETRA INTERACTIVA
            </span>
            <span className="text-xs text-rose-300/70 font-medium">
              Интерактивный текст песни
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-display">
            Natalia Oreiro — Río de la Plata
          </h2>
          <p className="text-xs sm:text-sm text-rose-200/70 mt-0.5">
            Нажимайте на строку для показа перевода, или на любое отдельное слово для словаря.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={showAllTranslations}
            className="px-3 py-1.5 bg-[#2e0714] hover:bg-[#420a1d] hover:text-orange-300 text-rose-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors border border-rose-800/60 shadow-sm"
            title="Открыть русский перевод всех строк"
          >
            <Eye className="w-3.5 h-3.5 text-orange-400" />
            <span>Показать все переводы</span>
          </button>

          <button
            onClick={hideAllTranslations}
            className="px-3 py-1.5 bg-[#2e0714] hover:bg-[#420a1d] hover:text-stone-100 text-rose-300/70 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors border border-rose-800/60 shadow-sm"
            title="Скрыть русский перевод всех строк"
          >
            <EyeOff className="w-3.5 h-3.5" />
            <span>Скрыть все переводы</span>
          </button>

          <button
            onClick={onToggleAutoScroll}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all border ${
              autoScroll
                ? 'bg-gradient-to-r from-orange-500/25 to-rose-600/25 text-orange-300 border-orange-500/50 shadow-sm'
                : 'bg-[#2e0714] text-rose-300/70 border-rose-800/60 hover:text-stone-200'
            }`}
            title="Автоматически прокручивать список к поющей строке"
          >
            <Radio className={`w-3.5 h-3.5 ${autoScroll ? 'animate-pulse text-orange-400' : ''}`} />
            <span>Автопрокрутка</span>
          </button>

          <button
            onClick={onToggleLoopCurrentLine}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all border ${
              loopCurrentLine
                ? 'bg-gradient-to-r from-orange-500 to-rose-600 text-white font-bold border-orange-400 shadow-sm'
                : 'bg-[#2e0714] text-rose-300/70 border-rose-800/60 hover:text-stone-200'
            }`}
            title="Повторять текущую строку по кругу для тренировки слуха"
          >
            <Repeat className="w-3.5 h-3.5" />
            <span>Зациклить строку</span>
          </button>
        </div>
      </div>

      {/* Lyrics Content Body */}
      <div className="p-4 sm:p-6 space-y-8 max-h-[700px] overflow-y-auto">
        {sections.map((sectionGroup) => (
          <div key={sectionGroup.section} className="space-y-3">
            {/* Section Header Banner */}
            <div className="flex items-center gap-3 pb-2 border-b border-rose-900/40">
              <span className="text-xs font-black tracking-widest uppercase text-orange-400 font-display">
                {sectionGroup.section}
              </span>
              <span className="text-xs font-semibold text-rose-200/80">
                — {sectionGroup.title}
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-rose-900/40 via-orange-500/20 to-transparent" />
            </div>

            {/* Song lines in this section */}
            <div className="space-y-2.5">
              {sectionGroup.lines.map((line) => {
                const globalIndex = lines.findIndex((l) => l.id === line.id);
                const isActive = globalIndex === activeLineIndex;
                const isTranslationOpen = !!openTranslations[line.id];
                const isNoteOpen = !!openNotes[line.id];

                // Split words for interactive click
                const words = line.spanish.split(' ');

                return (
                  <div
                    key={line.id}
                    ref={isActive ? activeLineRef : null}
                    className={`group relative rounded-xl transition-all duration-200 border ${
                      isActive
                        ? 'bg-gradient-to-r from-orange-500/25 via-rose-600/20 to-transparent border-orange-500/60 shadow-lg shadow-orange-500/15 ring-1 ring-orange-500/40'
                        : 'bg-[#180308]/60 hover:bg-[#280510] border-rose-950/60 hover:border-rose-800/70'
                    }`}
                  >
                    <div className="p-3 sm:p-4">
                      {/* Top line row: Active indicator + Spanish lyrics words + action controls */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          {/* Active pulsing dot or line index */}
                          <div className="mt-1 flex items-center justify-center">
                            {isActive ? (
                              <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-gradient-to-r from-orange-500 to-rose-500 shadow-sm"></span>
                              </span>
                            ) : (
                              <span className="text-[11px] font-mono text-rose-900/80 group-hover:text-rose-400 transition-colors w-4 text-center font-bold">
                                {globalIndex + 1}
                              </span>
                            )}
                          </div>

                          {/* Spanish text with clickable words */}
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-base sm:text-lg font-bold leading-relaxed">
                              {words.map((rawWord, wIdx) => {
                                return (
                                  <button
                                    key={wIdx}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onWordClick(rawWord);
                                    }}
                                    className={`rounded px-1 -mx-0.5 transition-colors cursor-pointer text-left ${
                                      isActive
                                        ? 'text-orange-200 hover:text-white hover:bg-orange-500/30 font-extrabold'
                                        : 'text-stone-100 hover:text-orange-300 hover:bg-rose-950/70'
                                    }`}
                                    title={`Нажмите, чтобы перевести «${rawWord}»`}
                                  >
                                    {rawWord}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Russian translation underneath with smooth toggle */}
                            {isTranslationOpen && (
                              <div className="mt-2 text-sm sm:text-base font-semibold text-orange-300/95 pl-1.5 border-l-2 border-orange-500 py-0.5 animate-in fade-in slide-in-from-top-1 duration-200">
                                {line.russian}
                              </div>
                            )}

                            {/* Cultural / Grammar Note toggle */}
                            {line.notes && isNoteOpen && (
                              <div className="mt-2.5 p-3 rounded-lg bg-[#280510]/95 border border-rose-800/60 text-xs text-rose-200/90 space-y-1 animate-in fade-in duration-150">
                                <div className="flex items-center gap-1.5 font-bold text-orange-400">
                                  <Info className="w-3.5 h-3.5" />
                                  <span>Языковой комментарий:</span>
                                </div>
                                <p className="leading-relaxed">{line.notes}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Line quick action buttons */}
                        <div className="flex items-center gap-1 shrink-0 pt-0.5">
                          {/* Play / Jump to line */}
                          <button
                            onClick={() => onJumpToLine(line)}
                            className={`p-2 rounded-lg transition-all ${
                              isActive
                                ? 'bg-gradient-to-r from-orange-500 to-rose-600 text-white font-bold shadow-md shadow-orange-500/25'
                                : 'text-rose-300/70 hover:text-orange-400 hover:bg-rose-950/60'
                            }`}
                            title={
                              line.startTime !== null
                                ? `Слушать с ${Math.floor(line.startTime / 60)}:${Math.floor(
                                    line.startTime % 60
                                  ).toString().padStart(2, '0')}`
                                : 'Таймкод пока не установлен'
                            }
                            aria-label={`Воспроизвести строку ${globalIndex + 1}`}
                          >
                            <Play className="w-4 h-4 fill-current" />
                          </button>

                          {/* Speech pronunciation button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              speakSpanish(line.spanish);
                            }}
                            className="p-2 text-rose-300/70 hover:text-orange-400 hover:bg-rose-950/60 rounded-lg transition-colors"
                            title="Озвучить строку через синтез речи"
                            aria-label={`Озвучить строку ${globalIndex + 1}`}
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>

                          {/* Note icon if note exists */}
                          {line.notes && (
                            <button
                              onClick={(e) => toggleNote(line.id, e)}
                              className={`p-2 rounded-lg transition-colors ${
                                isNoteOpen
                                  ? 'text-orange-400 bg-rose-950'
                                  : 'text-rose-300/70 hover:text-orange-300 hover:bg-rose-950/60'
                              }`}
                              title="Пояснение грамматики и культуры"
                              aria-label="Грамматическое пояснение"
                            >
                              <Info className="w-4 h-4" />
                            </button>
                          )}

                          {/* Toggle translation button */}
                          <button
                            onClick={(e) => toggleTranslation(line.id, e)}
                            className={`p-2 rounded-lg transition-colors flex items-center gap-1 ${
                              isTranslationOpen
                                ? 'text-orange-400 bg-orange-500/20'
                                : 'text-rose-300/70 hover:text-stone-100 hover:bg-rose-950/60'
                            }`}
                            title={isTranslationOpen ? 'Скрыть русский перевод' : 'Показать русский перевод'}
                            aria-label={isTranslationOpen ? 'Скрыть перевод' : 'Показать перевод'}
                          >
                            {isTranslationOpen ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
