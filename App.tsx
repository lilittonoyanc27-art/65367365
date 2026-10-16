import React, { useState, useEffect, useCallback } from 'react';
import {
  Music,
  BookOpen,
  Gamepad2,
  Clock,
  Compass,
  Bookmark,
  Sparkles,
  ExternalLink,
  HelpCircle,
  Headphones,
  CheckCircle,
} from 'lucide-react';
import { LyricLine, SavedWord } from './types';
import { loadSavedLyrics, saveLyricsToStorage, INITIAL_RAW_LYRICS } from './lyricsData';
import { findActiveLineIndex } from './pureLogic';
import { YouTubePlayer } from './YouTubePlayer';
import { LyricsSection } from './LyricsSection';
import { SyncTool } from './SyncTool';
import { PracticeGames } from './PracticeGames';
import { GrammarSection } from './GrammarSection';
import { CultureSection } from './CultureSection';
import { WordModal } from './WordModal';
import { SavedVocabModal } from './SavedVocabModal';

const SAVED_WORDS_STORAGE_KEY = 'espanol_interactivo_saved_words_v1';

export default function App() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'letra' | 'vocab' | 'grammar' | 'practice' | 'sync'>('letra');

  // Video & Playback state
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(230);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [seekRequestedTime, setSeekRequestedTime] = useState<number | null>(null);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);

  // Lyrics & Sync state
  const [lines, setLines] = useState<LyricLine[]>(() => loadSavedLyrics());
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const [loopCurrentLine, setLoopCurrentLine] = useState<boolean>(false);

  // Saved words & Modals
  const [savedWords, setSavedWords] = useState<SavedWord[]>(() => {
    try {
      const raw = localStorage.getItem(SAVED_WORDS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [isSavedVocabOpen, setIsSavedVocabOpen] = useState<boolean>(false);

  // Persist saved words to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SAVED_WORDS_STORAGE_KEY, JSON.stringify(savedWords));
    } catch (e) {
      console.warn(e);
    }
  }, [savedWords]);

  // Compute active line index
  const activeLineIndex = findActiveLineIndex(lines, currentTime);

  // Handle loop current line
  useEffect(() => {
    if (loopCurrentLine && activeLineIndex >= 0 && isPlaying) {
      const activeLine = lines[activeLineIndex];
      if (
        activeLine &&
        activeLine.startTime !== null &&
        activeLine.endTime !== null &&
        currentTime >= activeLine.endTime
      ) {
        setSeekRequestedTime(activeLine.startTime);
      }
    }
  }, [currentTime, loopCurrentLine, activeLineIndex, isPlaying, lines]);

  const handleTimeUpdate = useCallback((time: number, dur: number) => {
    setCurrentTime(time);
    if (dur > 0) setDuration(dur);
  }, []);

  const handleJumpToLine = (line: LyricLine) => {
    if (line.startTime !== null) {
      setSeekRequestedTime(line.startTime);
    }
  };

  const handleUpdateLines = (newLines: LyricLine[]) => {
    setLines(newLines);
    saveLyricsToStorage(newLines);
  };

  const handleToggleSaveWord = (word: SavedWord) => {
    setSavedWords((prev) => {
      const exists = prev.some((w) => w.spanish.toLowerCase() === word.spanish.toLowerCase());
      if (exists) {
        return prev.filter((w) => w.spanish.toLowerCase() !== word.spanish.toLowerCase());
      }
      return [...prev, word];
    });
  };

  const handleRemoveSavedWord = (id: string) => {
    setSavedWords((prev) => prev.filter((w) => w.id !== id));
  };

  return (
    <div className="min-h-screen text-stone-100 flex flex-col font-sans selection:bg-orange-500 selection:text-stone-950">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#1e040b]/90 backdrop-blur-md border-b border-rose-900/40 px-4 sm:px-6 py-3.5 shadow-xl shadow-black/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & App Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 via-rose-600 to-amber-500 p-0.5 shadow-lg shadow-orange-500/25 flex items-center justify-center">
              <div className="w-full h-full bg-[#1b0308] rounded-[10px] flex items-center justify-center">
                <Music className="w-5 h-5 text-orange-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-widest uppercase bg-gradient-to-r from-orange-400 via-amber-300 to-rose-400 bg-clip-text text-transparent">
                  Español Interactivo
                </span>
                <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-rose-700" />
                <span className="hidden sm:inline-block text-xs text-rose-300/80">
                  Музыкальный урок
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-black text-white font-display tracking-tight leading-tight">
                Natalia Oreiro — Río de la Plata
              </h1>
            </div>
          </div>

          {/* Top Actions: Saved Words Button */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsSavedVocabOpen(true)}
              className="px-3.5 py-2 bg-[#2d0712] hover:bg-[#3d0918] text-stone-200 rounded-xl border border-rose-800/60 text-xs font-bold flex items-center gap-2 transition-all hover:border-orange-500/60 shadow-md"
              aria-label="Открыть сохранённый словарь"
            >
              <Bookmark className="w-4 h-4 text-orange-400 fill-orange-500/30" />
              <span>Мой словарь</span>
              <span className="px-1.5 py-0.2 rounded-full bg-orange-500/25 text-orange-300 border border-orange-500/30 text-[11px] font-mono font-bold">
                {savedWords.length}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Learning Principle Ribbon in Burgundy, Red and Orange */}
      <div className="bg-gradient-to-r from-[#20040c] via-[#450a19] to-[#24050d] border-b border-rose-900/40 px-4 py-2.5 shadow-inner">
        <div className="max-w-7xl mx-auto flex items-center justify-center sm:justify-start gap-2.5 overflow-x-auto text-[11px] sm:text-xs font-bold tracking-wider uppercase text-rose-200/80 py-0.5">
          <span className="text-orange-400 font-extrabold flex items-center gap-1">
            <Headphones className="w-3.5 h-3.5" />
            СЛУШАЙ
          </span>
          <span className="text-rose-700">→</span>
          <span className="text-stone-200">ЧИТАЙ</span>
          <span className="text-rose-700">→</span>
          <span className="text-orange-400 font-extrabold">НАЖИМАЙ</span>
          <span className="text-rose-700">→</span>
          <span className="text-stone-200">ПЕРЕВОДИ</span>
          <span className="text-rose-700">→</span>
          <span className="text-rose-300 font-extrabold">ПОНИМАЙ</span>
          <span className="text-rose-700">→</span>
          <span className="text-orange-400 font-extrabold flex items-center gap-1">
            <Gamepad2 className="w-3.5 h-3.5" />
            ИГРАЙ
          </span>
        </div>
      </div>

      {/* Navigation Tab Bar */}
      <div className="bg-[#1b0409]/80 backdrop-blur border-b border-rose-900/30 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 sm:gap-2.5 overflow-x-auto py-2.5">
          <button
            onClick={() => setActiveTab('letra')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'letra'
                ? 'bg-gradient-to-r from-orange-500 to-rose-600 text-white shadow-lg shadow-orange-500/25 ring-1 ring-orange-400/50'
                : 'text-rose-200/70 hover:text-white hover:bg-rose-950/60'
            }`}
          >
            <Music className="w-4 h-4" />
            <span>Текст и Клип</span>
          </button>

          <button
            onClick={() => setActiveTab('vocab')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'vocab'
                ? 'bg-gradient-to-r from-orange-500 to-rose-600 text-white shadow-lg shadow-orange-500/25 ring-1 ring-orange-400/50'
                : 'text-rose-200/70 hover:text-white hover:bg-rose-950/60'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Словарь и Культура</span>
          </button>

          <button
            onClick={() => setActiveTab('grammar')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'grammar'
                ? 'bg-gradient-to-r from-orange-500 to-rose-600 text-white shadow-lg shadow-orange-500/25 ring-1 ring-orange-400/50'
                : 'text-rose-200/70 hover:text-white hover:bg-rose-950/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Грамматика</span>
          </button>

          <button
            onClick={() => setActiveTab('practice')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'practice'
                ? 'bg-gradient-to-r from-orange-500 to-rose-600 text-white shadow-lg shadow-orange-500/25 ring-1 ring-orange-400/50'
                : 'text-rose-200/70 hover:text-white hover:bg-rose-950/60'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Тренажёр и Игры</span>
          </button>

          <button
            onClick={() => setActiveTab('sync')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'sync'
                ? 'bg-gradient-to-r from-orange-500 to-rose-600 text-white shadow-lg shadow-orange-500/25 ring-1 ring-orange-400/50'
                : 'text-rose-200/70 hover:text-white hover:bg-rose-950/60'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Синхронизация</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full">
        {/* TAB 1: Текст и Клип */}
        {activeTab === 'letra' && (
          <div className="space-y-6">
            {/* Embedded YouTube Player */}
            <YouTubePlayer
              videoId="OIduoax-RJ4"
              onTimeUpdate={handleTimeUpdate}
              onPlayStateChange={setIsPlaying}
              seekRequestedTime={seekRequestedTime}
              onSeekHandled={() => setSeekRequestedTime(null)}
              playbackRate={playbackRate}
              onPlaybackRateChange={setPlaybackRate}
            />

            {/* Interactive Lyrics Component right below video */}
            <LyricsSection
              lines={lines}
              activeLineIndex={activeLineIndex}
              onJumpToLine={handleJumpToLine}
              onWordClick={setSelectedWord}
              loopCurrentLine={loopCurrentLine}
              onToggleLoopCurrentLine={() => setLoopCurrentLine(!loopCurrentLine)}
              autoScroll={autoScroll}
              onToggleAutoScroll={() => setAutoScroll(!autoScroll)}
            />
          </div>
        )}

        {/* TAB 2: Словарь и Культура */}
        {activeTab === 'vocab' && (
          <CultureSection
            savedWords={savedWords}
            onToggleSaveWord={handleToggleSaveWord}
          />
        )}

        {/* TAB 3: Грамматика */}
        {activeTab === 'grammar' && <GrammarSection />}

        {/* TAB 4: Тренажёр и Игры */}
        {activeTab === 'practice' && <PracticeGames />}

        {/* TAB 5: Синхронизация (Режим преподавателя) */}
        {activeTab === 'sync' && (
          <div className="space-y-6">
            {/* Player mini-view to observe video while syncing */}
            <YouTubePlayer
              videoId="OIduoax-RJ4"
              onTimeUpdate={handleTimeUpdate}
              onPlayStateChange={setIsPlaying}
              seekRequestedTime={seekRequestedTime}
              onSeekHandled={() => setSeekRequestedTime(null)}
              playbackRate={playbackRate}
              onPlaybackRateChange={setPlaybackRate}
            />

            <SyncTool
              lines={lines}
              onUpdateLines={handleUpdateLines}
              currentVideoTime={currentTime}
              onSeekTo={(t) => setSeekRequestedTime(t)}
            />
          </div>
        )}
      </main>

      {/* Interactive Word Inspector Modal */}
      <WordModal
        selectedWord={selectedWord}
        onClose={() => setSelectedWord(null)}
        savedWords={savedWords}
        onToggleSaveWord={handleToggleSaveWord}
      />

      {/* Saved Words Drawer / Modal */}
      <SavedVocabModal
        isOpen={isSavedVocabOpen}
        onClose={() => setIsSavedVocabOpen(false)}
        savedWords={savedWords}
        onRemoveWord={handleRemoveSavedWord}
      />

      {/* Footer */}
      <footer className="bg-[#190308]/90 border-t border-rose-900/40 px-4 py-6 mt-12 text-center text-xs text-rose-300/60 space-y-2">
        <p className="font-semibold text-rose-200">
          Español Interactivo — Музыкальный обучающий модуль по песне Наталии Орейро «Río de la Plata»
        </p>
        <p className="text-orange-400/90 font-mono text-[11px] font-bold">
          СЛУШАЙ → ЧИТАЙ → НАЖИМАЙ → ПЕРЕВОДИ → ПОНИМАЙ → ИГРАЙ
        </p>
      </footer>
    </div>
  );
}
