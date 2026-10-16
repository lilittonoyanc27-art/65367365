import React, { useState } from 'react';
import {
  Gamepad2,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Volume2,
  HelpCircle,
  Sparkles,
  Trophy,
  ArrowRight,
  Layers,
  Puzzle,
  Lightbulb,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  FILL_BLANK_EXERCISES,
  SCRAMBLE_EXERCISES,
  QUIZ_QUESTIONS,
} from './quizData';
import { SONG_VOCABULARY } from './vocabularyData';
import { speakSpanish } from './speechHelper';
import { checkSentenceOrder, cleanWord } from './pureLogic';

type GameMode = 'fillBlank' | 'scramble' | 'flashcards' | 'quiz';

export const PracticeGames: React.FC = () => {
  const [activeMode, setActiveMode] = useState<GameMode>('fillBlank');

  // Fill in blanks state
  const [fillIndex, setFillIndex] = useState(0);
  const [selectedFillOption, setSelectedFillOption] = useState<string | null>(null);
  const [fillScore, setFillScore] = useState(0);
  const [fillSubmitted, setFillSubmitted] = useState(false);
  const [showFillHint, setShowFillHint] = useState(false);

  // Scramble state
  const [scrambleIndex, setScrambleIndex] = useState(0);
  const [userWords, setUserWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>(
    SCRAMBLE_EXERCISES[0]?.scrambledWords || []
  );
  const [scrambleResult, setScrambleResult] = useState<'idle' | 'correct' | 'wrong'>('idle');

  // Flashcards state
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownWords, setKnownWords] = useState<Record<string, boolean>>({});

  // Quiz state
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // --- Fill in the blank handlers ---
  const currentFill = FILL_BLANK_EXERCISES[fillIndex];

  const handleSelectFill = (opt: string) => {
    if (fillSubmitted) return;
    setSelectedFillOption(opt);
    setFillSubmitted(true);
    const isCorrect = opt.toLowerCase() === currentFill.missingWord.toLowerCase();
    if (isCorrect) {
      setFillScore((prev) => prev + 1);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
    }
  };

  const nextFill = () => {
    if (fillIndex < FILL_BLANK_EXERCISES.length - 1) {
      setFillIndex((prev) => prev + 1);
      setSelectedFillOption(null);
      setFillSubmitted(false);
      setShowFillHint(false);
    } else {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    }
  };

  const restartFill = () => {
    setFillIndex(0);
    setSelectedFillOption(null);
    setFillSubmitted(false);
    setFillScore(0);
    setShowFillHint(false);
  };

  // --- Scramble handlers ---
  const currentScramble = SCRAMBLE_EXERCISES[scrambleIndex];

  const handleSelectWord = (word: string, indexInAvailable: number) => {
    if (scrambleResult === 'correct') return;
    setUserWords([...userWords, word]);
    const nextAvail = [...availableWords];
    nextAvail.splice(indexInAvailable, 1);
    setAvailableWords(nextAvail);
    setScrambleResult('idle');
  };

  const handleRemoveUserWord = (word: string, indexInUser: number) => {
    if (scrambleResult === 'correct') return;
    const nextUser = [...userWords];
    nextUser.splice(indexInUser, 1);
    setUserWords(nextUser);
    setAvailableWords([...availableWords, word]);
    setScrambleResult('idle');
  };

  const checkScramble = () => {
    const targetWords = currentScramble.targetSentence.split(' ');
    const isOk = checkSentenceOrder(userWords, targetWords);
    if (isOk) {
      setScrambleResult('correct');
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      speakSpanish(currentScramble.targetSentence);
    } else {
      setScrambleResult('wrong');
    }
  };

  const nextScramble = () => {
    if (scrambleIndex < SCRAMBLE_EXERCISES.length - 1) {
      const nextIdx = scrambleIndex + 1;
      setScrambleIndex(nextIdx);
      setUserWords([]);
      setAvailableWords(SCRAMBLE_EXERCISES[nextIdx].scrambledWords);
      setScrambleResult('idle');
    } else {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    }
  };

  const resetCurrentScramble = () => {
    setUserWords([]);
    setAvailableWords(currentScramble.scrambledWords);
    setScrambleResult('idle');
  };

  // --- Flashcard handlers ---
  const currentCard = SONG_VOCABULARY[cardIndex];

  const nextCard = () => {
    setIsFlipped(false);
    setCardIndex((prev) => (prev + 1) % SONG_VOCABULARY.length);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setCardIndex((prev) => (prev - 1 + SONG_VOCABULARY.length) % SONG_VOCABULARY.length);
  };

  const toggleKnown = (id: string) => {
    setKnownWords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // --- Quiz handlers ---
  const currentQuiz = QUIZ_QUESTIONS[quizIndex];

  const handleSelectQuiz = (idx: number) => {
    if (selectedQuizAnswer !== null) return;
    setSelectedQuizAnswer(idx);
    if (idx === currentQuiz.correctIndex) {
      setQuizScore((prev) => prev + 1);
      confetti({ particleCount: 40, spread: 50 });
    }
  };

  const nextQuiz = () => {
    if (quizIndex < QUIZ_QUESTIONS.length - 1) {
      setQuizIndex((prev) => prev + 1);
      setSelectedQuizAnswer(null);
    } else {
      setQuizFinished(true);
      confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
    }
  };

  const restartQuiz = () => {
    setQuizIndex(0);
    setSelectedQuizAnswer(null);
    setQuizScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="w-full bg-[#20040c]/90 border border-rose-900/50 rounded-2xl shadow-2xl overflow-hidden mt-6 backdrop-blur">
      {/* Header & Mode Switcher */}
      <div className="p-5 bg-gradient-to-r from-[#26050f] via-[#3d0818] to-[#1d030b] border-b border-rose-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/20 text-orange-300 border border-orange-500/35 flex items-center gap-1.5">
              <Gamepad2 className="w-3.5 h-3.5" />
              ИГРАЙ И ЗАКРЕПЛЯЙ
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-display">
            Тренажёр и игры по песне
          </h2>
          <p className="text-xs text-rose-300/70 mt-0.5">
            Закрепите слова, грамматику и понимание песни в интерактивной форме
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex flex-wrap gap-1.5 bg-[#170308] p-1.5 rounded-xl border border-rose-900/40">
          <button
            onClick={() => setActiveMode('fillBlank')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeMode === 'fillBlank'
                ? 'bg-gradient-to-r from-orange-500 to-rose-600 text-white shadow-md shadow-orange-500/20'
                : 'text-rose-300/70 hover:text-white'
            }`}
          >
            1. Заполни пропуск
          </button>
          <button
            onClick={() => setActiveMode('scramble')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeMode === 'scramble'
                ? 'bg-gradient-to-r from-orange-500 to-rose-600 text-white shadow-md shadow-orange-500/20'
                : 'text-rose-300/70 hover:text-white'
            }`}
          >
            2. Собери фразу
          </button>
          <button
            onClick={() => setActiveMode('flashcards')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeMode === 'flashcards'
                ? 'bg-gradient-to-r from-orange-500 to-rose-600 text-white shadow-md shadow-orange-500/20'
                : 'text-rose-300/70 hover:text-white'
            }`}
          >
            3. Карточки слов
          </button>
          <button
            onClick={() => setActiveMode('quiz')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeMode === 'quiz'
                ? 'bg-gradient-to-r from-orange-500 to-rose-600 text-white shadow-md shadow-orange-500/20'
                : 'text-rose-300/70 hover:text-white'
            }`}
          >
            4. Квиз
          </button>
        </div>
      </div>

      {/* GAME 1: Fill in the Blanks */}
      {activeMode === 'fillBlank' && (
        <div className="p-6 max-w-2xl mx-auto space-y-6">
          {fillIndex >= FILL_BLANK_EXERCISES.length ? (
            <div className="text-center py-12 space-y-4">
              <Trophy className="w-16 h-16 text-amber-400 mx-auto animate-bounce" />
              <h3 className="text-2xl font-black text-white font-display">
                Великолепно! Вы завершили все задания!
              </h3>
              <p className="text-stone-300">
                Ваш результат: <span className="text-amber-400 font-bold">{fillScore}</span> из{' '}
                {FILL_BLANK_EXERCISES.length}
              </p>
              <button
                onClick={restartFill}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl transition-all shadow-lg shadow-amber-500/20"
              >
                Пройти ещё раз
              </button>
            </div>
          ) : (
            <>
              {/* Progress & Header */}
              <div className="flex items-center justify-between text-xs text-stone-400">
                <span>
                  Вопрос {fillIndex + 1} из {FILL_BLANK_EXERCISES.length}
                </span>
                <span className="font-semibold text-amber-400">Счёт: {fillScore}</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full transition-all duration-300"
                  style={{
                    width: `${((fillIndex + 1) / FILL_BLANK_EXERCISES.length) * 100}%`,
                  }}
                />
              </div>

              {/* Lyric Card */}
              <div className="bg-[#180308]/90 border border-rose-900/50 rounded-2xl p-6 text-center shadow-lg relative">
                <button
                  onClick={() =>
                    speakSpanish(
                      `${currentFill.spanishBefore} ${currentFill.missingWord} ${currentFill.spanishAfter}`
                    )
                  }
                  className="absolute top-4 right-4 p-2 text-rose-300/70 hover:text-orange-400 rounded-lg hover:bg-rose-950/60 transition-colors"
                  title="Озвучить строку"
                >
                  <Volume2 className="w-5 h-5" />
                </button>

                <div className="text-xl sm:text-2xl font-bold text-stone-100 mb-3 leading-relaxed">
                  {currentFill.spanishBefore}{' '}
                  <span className="inline-block px-3 py-1 bg-orange-500/20 border-b-2 border-orange-400 text-orange-300 rounded font-black min-w-20">
                    {fillSubmitted ? currentFill.missingWord : '______'}
                  </span>{' '}
                  {currentFill.spanishAfter}
                </div>

                <div className="text-sm font-semibold text-rose-300/80 mt-2">
                  {currentFill.russianTranslation}
                </div>

                {showFillHint && (
                  <div className="mt-4 p-3 bg-[#26050f] border border-rose-800/60 rounded-xl text-xs text-orange-300 flex items-center justify-center gap-2">
                    <Lightbulb className="w-4 h-4 text-orange-400 shrink-0" />
                    <span>{currentFill.hint}</span>
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="grid grid-cols-2 gap-3">
                {currentFill.options.map((opt) => {
                  const isSelected = selectedFillOption === opt;
                  const isCorrect = opt.toLowerCase() === currentFill.missingWord.toLowerCase();

                  let btnStyle =
                    'bg-[#1a0309] border-rose-900/60 text-stone-200 hover:border-orange-500/60 hover:bg-[#2c0713]';

                  if (fillSubmitted) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold';
                    } else if (isSelected && !isCorrect) {
                      btnStyle = 'bg-red-950/80 border-red-500 text-red-200';
                    }
                  }

                  return (
                    <button
                      key={opt}
                      onClick={() => handleSelectFill(opt)}
                      disabled={fillSubmitted}
                      className={`p-4 rounded-xl border text-base font-bold transition-all ${btnStyle}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setShowFillHint(!showFillHint)}
                  className="text-xs text-rose-300/70 hover:text-orange-400 flex items-center gap-1.5 transition-colors"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>{showFillHint ? 'Скрыть подсказку' : 'Подсказка'}</span>
                </button>

                {fillSubmitted && (
                  <button
                    onClick={nextFill}
                    className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-400 hover:to-rose-500 text-white font-bold text-sm rounded-xl flex items-center gap-2 transition-all shadow-md shadow-orange-500/25"
                  >
                    <span>{fillIndex < FILL_BLANK_EXERCISES.length - 1 ? 'Дальше' : 'Завершить'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* GAME 2: Scramble Words */}
      {activeMode === 'scramble' && (
        <div className="p-6 max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span>
              Фраза {scrambleIndex + 1} из {SCRAMBLE_EXERCISES.length}
            </span>
            <span className="text-stone-400">Нажимайте на слова, чтобы собрать строку</span>
          </div>

          {/* Russian prompt */}
          <div className="bg-stone-950 border border-stone-800 rounded-2xl p-5 text-center">
            <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
              Соберите испанскую строку:
            </span>
            <div className="text-lg font-bold text-white mt-1">
              «{currentScramble.russianTranslation}»
            </div>
          </div>

          {/* User Assembled Words Tray */}
          <div
            className={`min-h-[70px] p-4 bg-stone-950/70 border-2 rounded-2xl flex flex-wrap items-center justify-center gap-2 transition-colors ${
              scrambleResult === 'correct'
                ? 'border-emerald-500 bg-emerald-950/20'
                : scrambleResult === 'wrong'
                ? 'border-red-500 bg-red-950/20'
                : 'border-dashed border-stone-700'
            }`}
          >
            {userWords.length === 0 ? (
              <span className="text-sm text-stone-500 italic">
                Слова будут появляться здесь...
              </span>
            ) : (
              userWords.map((word, idx) => (
                <button
                  key={idx}
                  onClick={() => handleRemoveUserWord(word, idx)}
                  className="px-3 py-1.5 bg-amber-500 text-stone-950 font-bold rounded-xl text-sm shadow hover:bg-amber-400 transition-transform active:scale-95"
                  title="Нажмите, чтобы вернуть слово назад"
                >
                  {word}
                </button>
              ))
            )}
          </div>

          {/* Available Words Pool */}
          <div className="flex flex-wrap items-center justify-center gap-2 py-2">
            {availableWords.map((word, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectWord(word, idx)}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-100 font-bold rounded-xl text-sm transition-all hover:scale-105 active:scale-95 shadow-sm"
              >
                {word}
              </button>
            ))}
          </div>

          {/* Result Alert */}
          {scrambleResult === 'correct' && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-xl text-emerald-300 text-sm font-bold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Правильно! Строка собрана идеально!</span>
            </div>
          )}

          {scrambleResult === 'wrong' && (
            <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-xl text-red-300 text-sm font-semibold flex items-center justify-center gap-2">
              <XCircle className="w-5 h-5 text-red-400" />
              <span>Пока не совсем так. Попробуйте переставить слова или сбросить.</span>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={resetCurrentScramble}
              className="px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Сбросить</span>
            </button>

            <div className="flex items-center gap-2">
              {scrambleResult !== 'correct' ? (
                <button
                  onClick={checkScramble}
                  disabled={userWords.length === 0}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-stone-950 font-bold text-sm rounded-xl transition-all shadow-md shadow-amber-500/20"
                >
                  Проверить
                </button>
              ) : (
                <button
                  onClick={nextScramble}
                  className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-sm rounded-xl flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20"
                >
                  <span>{scrambleIndex < SCRAMBLE_EXERCISES.length - 1 ? 'Следующая фраза' : 'Завершить'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* GAME 3: Flashcards */}
      {activeMode === 'flashcards' && (
        <div className="p-6 max-w-xl mx-auto space-y-6">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span>
              Карточка {cardIndex + 1} из {SONG_VOCABULARY.length}
            </span>
            <span>
              Усвоено: {Object.values(knownWords).filter(Boolean).length} из {SONG_VOCABULARY.length}
            </span>
          </div>

          {/* Card container with flip animation */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full min-h-[280px] bg-stone-950 border border-stone-800 hover:border-amber-500/50 rounded-2xl p-6 flex flex-col justify-between cursor-pointer transition-all shadow-2xl relative select-none"
          >
            <div className="flex items-start justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {currentCard.category}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  speakSpanish(currentCard.spanish);
                }}
                className="p-2 text-stone-400 hover:text-amber-400 hover:bg-stone-900 rounded-lg transition-colors"
                title="Озвучить"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center py-6">
              {!isFlipped ? (
                <>
                  <div className="text-3xl font-black text-white font-display mb-2">
                    {currentCard.spanish}
                  </div>
                  <div className="text-xs text-stone-500 font-mono">
                    {currentCard.partOfSpeech}
                  </div>
                  <div className="text-xs text-amber-400/80 mt-4">
                    Нажмите на карточку, чтобы перевернуть
                  </div>
                </>
              ) : (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="text-xl font-bold text-amber-300">
                    {currentCard.russian}
                  </div>
                  <div className="text-xs text-stone-300 leading-relaxed max-w-md mx-auto">
                    {currentCard.explanation}
                  </div>
                  {currentCard.example && (
                    <div className="mt-3 p-2.5 bg-stone-900 rounded-xl text-xs text-left">
                      <div className="font-semibold text-stone-200">{currentCard.example}</div>
                      <div className="text-stone-400 text-[11px]">{currentCard.exampleRu}</div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="text-center text-[11px] text-stone-500">
              {isFlipped ? 'Нажмите, чтобы вернуться к испанскому' : 'Строка из песни: ' + currentCard.context}
            </div>
          </div>

          {/* Navigation & Mark buttons */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={prevCard}
              className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold rounded-xl transition-colors"
            >
              Назад
            </button>

            <button
              onClick={() => toggleKnown(currentCard.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                knownWords[currentCard.id]
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                  : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
              }`}
            >
              {knownWords[currentCard.id] ? '✓ Выучено' : 'Пометить как выученное'}
            </button>

            <button
              onClick={nextCard}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-xl transition-colors"
            >
              Вперёд
            </button>
          </div>
        </div>
      )}

      {/* GAME 4: Quiz */}
      {activeMode === 'quiz' && (
        <div className="p-6 max-w-2xl mx-auto space-y-6">
          {quizFinished ? (
            <div className="text-center py-12 space-y-4">
              <Trophy className="w-16 h-16 text-amber-400 mx-auto animate-bounce" />
              <h3 className="text-2xl font-black text-white font-display">
                Поздравляем с прохождением квиза!
              </h3>
              <p className="text-stone-300">
                Ваш итоговый счёт: <span className="text-amber-400 font-bold">{quizScore}</span> из{' '}
                {QUIZ_QUESTIONS.length}
              </p>
              <button
                onClick={restartQuiz}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl transition-all shadow-lg shadow-amber-500/20"
              >
                Пройти квиз заново
              </button>
            </div>
          ) : (
            <>
              {/* Quiz progress */}
              <div className="flex items-center justify-between text-xs text-stone-400">
                <span>
                  Вопрос {quizIndex + 1} из {QUIZ_QUESTIONS.length}
                </span>
                <span className="font-semibold text-amber-400">Счёт: {quizScore}</span>
              </div>

              <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full transition-all duration-300"
                  style={{
                    width: `${((quizIndex + 1) / QUIZ_QUESTIONS.length) * 100}%`,
                  }}
                />
              </div>

              {/* Question */}
              <div className="bg-stone-950 border border-stone-800 rounded-2xl p-6 shadow-lg">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                  {currentQuiz.category === 'cultura'
                    ? 'Культура и история'
                    : currentQuiz.category === 'gramatica'
                    ? 'Грамматика'
                    : 'Лексика и идиомы'}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
                  {currentQuiz.question}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQuiz.options.map((opt, idx) => {
                  const isSelected = selectedQuizAnswer === idx;
                  const isCorrect = idx === currentQuiz.correctIndex;

                  let style =
                    'bg-stone-950 border-stone-800 text-stone-200 hover:border-stone-700 hover:bg-stone-850';

                  if (selectedQuizAnswer !== null) {
                    if (isCorrect) {
                      style = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold';
                    } else if (isSelected && !isCorrect) {
                      style = 'bg-red-950/80 border-red-500 text-red-200';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectQuiz(idx)}
                      disabled={selectedQuizAnswer !== null}
                      className={`w-full p-4 rounded-xl border text-left text-sm font-semibold transition-all flex items-center justify-between ${style}`}
                    >
                      <span>{opt}</span>
                      {selectedQuizAnswer !== null && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 ml-2" />
                      )}
                      {selectedQuizAnswer !== null && isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-red-400 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation upon answer */}
              {selectedQuizAnswer !== null && (
                <div className="p-4 bg-stone-900 border border-stone-800 rounded-xl text-xs text-stone-300 leading-relaxed animate-in fade-in duration-200">
                  <div className="font-bold text-amber-400 mb-1">Пояснение:</div>
                  <p>{currentQuiz.explanation}</p>
                </div>
              )}

              {/* Next button */}
              {selectedQuizAnswer !== null && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={nextQuiz}
                    className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm rounded-xl flex items-center gap-2 transition-all shadow-md shadow-amber-500/20"
                  >
                    <span>{quizIndex < QUIZ_QUESTIONS.length - 1 ? 'Следующий вопрос' : 'Итоги'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
