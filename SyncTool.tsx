import React, { useState } from 'react';
import {
  Clock,
  Play,
  RotateCcw,
  Save,
  Trash2,
  Download,
  Upload,
  Check,
  Sparkles,
  AlertCircle,
  HelpCircle,
  Plus,
  Minus,
} from 'lucide-react';
import { LyricLine } from './types';
import { formatTimestamp, parseTimestamp } from './pureLogic';
import { INITIAL_RAW_LYRICS } from './lyricsData';

interface SyncToolProps {
  lines: LyricLine[];
  onUpdateLines: (lines: LyricLine[]) => void;
  currentVideoTime: number;
  onSeekTo: (time: number) => void;
}

export const SyncTool: React.FC<SyncToolProps> = ({
  lines,
  onUpdateLines,
  currentVideoTime,
  onSeekTo,
}) => {
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [jsonModalOpen, setJsonModalOpen] = useState(false);
  const [jsonText, setJsonText] = useState('');
  const [selectedLineId, setSelectedLineId] = useState<string>(lines[0]?.id || '');

  const setLineStart = (id: string) => {
    const time = Math.round(currentVideoTime * 10) / 10;
    const updated = lines.map((l) => (l.id === id ? { ...l, startTime: time } : l));
    onUpdateLines(updated);
  };

  const setLineEnd = (id: string) => {
    const time = Math.round(currentVideoTime * 10) / 10;
    const updated = lines.map((l) => (l.id === id ? { ...l, endTime: time } : l));
    onUpdateLines(updated);
  };

  const nudgeStart = (id: string, delta: number) => {
    const updated = lines.map((l) => {
      if (l.id === id && l.startTime !== null) {
        return { ...l, startTime: Math.max(0, Math.round((l.startTime + delta) * 10) / 10) };
      }
      return l;
    });
    onUpdateLines(updated);
  };

  const nudgeEnd = (id: string, delta: number) => {
    const updated = lines.map((l) => {
      if (l.id === id && l.endTime !== null) {
        return { ...l, endTime: Math.max(0, Math.round((l.endTime + delta) * 10) / 10) };
      }
      return l;
    });
    onUpdateLines(updated);
  };

  const clearLineTiming = (id: string) => {
    const updated = lines.map((l) =>
      l.id === id ? { ...l, startTime: null, endTime: null } : l
    );
    onUpdateLines(updated);
  };

  const clearAllTimings = () => {
    if (confirm('Сбросить таймкоды всех строк в null?')) {
      const updated = lines.map((l) => ({ ...l, startTime: null, endTime: null }));
      onUpdateLines(updated);
    }
  };

  const restoreDefaultTimings = () => {
    if (confirm('Восстановить базовые откалиброванные таймкоды песни?')) {
      onUpdateLines(INITIAL_RAW_LYRICS);
    }
  };

  const handleSave = () => {
    try {
      localStorage.setItem('espanol_interactivo_rio_plata_lyrics_v1', JSON.stringify(lines));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (e) {
      alert('Ошибка при сохранении в браузер: ' + e);
    }
  };

  const openExportModal = () => {
    setJsonText(JSON.stringify(lines, null, 2));
    setJsonModalOpen(true);
  };

  const handleApplyJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (Array.isArray(parsed) && parsed.length > 0) {
        onUpdateLines(parsed);
        setJsonModalOpen(false);
      } else {
        alert('Некорректный формат JSON (должен быть массив строк)');
      }
    } catch (e) {
      alert('Ошибка разбора JSON: ' + e);
    }
  };

  return (
    <div className="w-full bg-[#20040c]/90 border border-rose-900/50 rounded-2xl shadow-2xl overflow-hidden mt-6 backdrop-blur">
      {/* Tool Header */}
      <div className="p-5 bg-gradient-to-r from-[#26050f] via-[#3d0818] to-[#1d030b] border-b border-rose-900/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/20 text-orange-300 border border-orange-500/35 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              РЕЖИМ ПРЕПОДАВАТЕЛЯ / СИНХРОНИЗАЦИЯ
            </span>
          </div>
          <h2 className="text-xl font-bold text-white font-display">
            Настройка точных таймкодов строк
          </h2>
          <p className="text-xs text-rose-300/70 mt-1 max-w-2xl">
            Запустите воспроизведение видеоклипа. В нужный момент нажимайте «Старт» и «Конец», чтобы зафиксировать точные границы звучания каждой фразы. Таймкоды сохраняются в localStorage.
          </p>
        </div>

        {/* Global Controls & Current Time HUD */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-4 py-2 bg-[#180308] border border-rose-900/50 rounded-xl flex items-center gap-2">
            <span className="text-xs text-rose-300/70 uppercase font-semibold">Текущее время:</span>
            <span className="text-lg font-mono font-bold text-orange-400">
              {formatTimestamp(currentVideoTime)}
            </span>
          </div>

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-400 hover:to-rose-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-orange-500/25 transition-all"
          >
            {saveSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Сохранено!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Сохранить в браузере</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Toolbar actions */}
      <div className="p-3 bg-[#180308]/80 border-b border-rose-900/40 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={restoreDefaultTimings}
            className="px-3 py-1.5 bg-[#2d0714] hover:bg-[#41091c] text-rose-200 rounded-lg transition-colors flex items-center gap-1 border border-rose-800/40"
            title="Восстановить базовые откалиброванные таймкоды"
          >
            <RotateCcw className="w-3.5 h-3.5 text-orange-400" />
            <span>Базовые таймкоды</span>
          </button>

          <button
            onClick={clearAllTimings}
            className="px-3 py-1.5 bg-[#2d0714] hover:bg-red-950/80 hover:text-red-300 text-rose-400/80 rounded-lg transition-colors flex items-center gap-1 border border-rose-800/40"
            title="Сбросить все таймкоды в null (сырой текст)"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Сбросить всё в null</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={openExportModal}
            className="px-3 py-1.5 bg-[#2d0714] hover:bg-[#41091c] text-rose-200 rounded-lg transition-colors flex items-center gap-1 border border-rose-800/40"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Импорт / Экспорт JSON</span>
          </button>
        </div>
      </div>

      {/* Sync Lines Table / List */}
      <div className="p-4 max-h-[600px] overflow-y-auto space-y-3">
        {lines.map((line, idx) => {
          const isSelected = line.id === selectedLineId;
          const isCurrentlyActive =
            line.startTime !== null &&
            currentVideoTime >= line.startTime &&
            (line.endTime === null || currentVideoTime < line.endTime);

          return (
            <div
              key={line.id}
              onClick={() => setSelectedLineId(line.id)}
              className={`p-3.5 rounded-xl border transition-all ${
                isSelected
                  ? 'bg-[#280612] border-orange-500/80 ring-1 ring-orange-500/40 shadow-lg'
                  : isCurrentlyActive
                  ? 'bg-orange-950/25 border-orange-500/50'
                  : 'bg-[#180308]/70 border-rose-950/80 hover:border-rose-800'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                {/* Line details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#320715] text-orange-400 font-bold border border-rose-800/40">
                      #{idx + 1}
                    </span>
                    <span className="text-[11px] text-rose-300/70 uppercase tracking-wider font-semibold">
                      {line.section}
                    </span>
                    {isCurrentlyActive && (
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-orange-500/30 text-orange-300 rounded-full animate-pulse border border-orange-500/40">
                        Звучит сейчас
                      </span>
                    )}
                  </div>
                  <div className="text-base font-bold text-stone-100">{line.spanish}</div>
                  <div className="text-xs text-rose-300/80 mt-0.5">{line.russian}</div>
                </div>

                {/* Timestamps & Capture Controls */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {/* Start time capture & nudge */}
                  <div className="flex items-center gap-1 bg-[#150206] px-2 py-1 rounded-lg border border-rose-900/40">
                    <button
                      onClick={() => setLineStart(line.id)}
                      className="px-2 py-1 bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-400 hover:to-rose-500 text-white text-xs font-bold rounded flex items-center gap-1 transition-colors shadow-sm"
                      title="Записать текущее время видео как начало строки"
                    >
                      <Clock className="w-3 h-3" />
                      <span>Старт:</span>
                    </button>
                    <span className="font-mono text-xs font-bold text-orange-300 min-w-14 text-center">
                      {formatTimestamp(line.startTime)}
                    </span>
                    <button
                      onClick={() => nudgeStart(line.id, -0.2)}
                      disabled={line.startTime === null}
                      className="p-1 text-rose-400/80 hover:text-white disabled:opacity-30"
                      title="-0.2с"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => nudgeStart(line.id, 0.2)}
                      disabled={line.startTime === null}
                      className="p-1 text-rose-400/80 hover:text-white disabled:opacity-30"
                      title="+0.2с"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* End time capture & nudge */}
                  <div className="flex items-center gap-1 bg-[#150206] px-2 py-1 rounded-lg border border-rose-900/40">
                    <button
                      onClick={() => setLineEnd(line.id)}
                      className="px-2 py-1 bg-[#330816] hover:bg-[#480c21] text-rose-100 text-xs font-bold rounded flex items-center gap-1 transition-colors border border-rose-800/50"
                      title="Записать текущее время видео как конец строки"
                    >
                      <Clock className="w-3 h-3" />
                      <span>Конец:</span>
                    </button>
                    <span className="font-mono text-xs font-bold text-rose-200 min-w-14 text-center">
                      {formatTimestamp(line.endTime)}
                    </span>
                    <button
                      onClick={() => nudgeEnd(line.id, -0.2)}
                      disabled={line.endTime === null}
                      className="p-1 text-rose-400/80 hover:text-white disabled:opacity-30"
                      title="-0.2с"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => nudgeEnd(line.id, 0.2)}
                      disabled={line.endTime === null}
                      className="p-1 text-rose-400/80 hover:text-white disabled:opacity-30"
                      title="+0.2с"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Test play button */}
                  <button
                    onClick={() => {
                      if (line.startTime !== null) {
                        onSeekTo(line.startTime);
                      }
                    }}
                    disabled={line.startTime === null}
                    className="p-2 bg-[#2d0714] hover:bg-orange-500 hover:text-stone-950 text-rose-200 rounded-lg transition-colors disabled:opacity-30 border border-rose-800/40"
                    title="Прослушать эту строку"
                  >
                    <Play className="w-4 h-4 fill-current" />
                  </button>

                  {/* Clear button */}
                  <button
                    onClick={() => clearLineTiming(line.id)}
                    className="p-2 text-rose-500/70 hover:text-red-400 rounded-lg transition-colors"
                    title="Очистить таймкоды этой строки"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* JSON Import/Export Modal */}
      {jsonModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl p-6 flex flex-col max-h-[85vh]">
            <h3 className="text-xl font-bold text-white mb-2 font-display">
              Импорт / Экспорт таймкодов JSON
            </h3>
            <p className="text-xs text-stone-400 mb-4">
              Вы можете скопировать этот массив строк для сохранения на компьютере или вставить свои настроенные данные.
            </p>

            <textarea
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              className="w-full flex-1 min-h-[300px] bg-stone-950 border border-stone-800 rounded-xl p-4 font-mono text-xs text-amber-300 focus:outline-none focus:border-amber-500"
            />

            <div className="flex items-center justify-end gap-3 mt-4 pt-3 border-t border-stone-800">
              <button
                onClick={() => setJsonModalOpen(false)}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold rounded-xl transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleApplyJson}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl shadow-md transition-colors"
              >
                Применить JSON
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
