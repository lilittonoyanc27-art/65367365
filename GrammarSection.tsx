import React from 'react';
import { BookOpen, Volume2, Sparkles, CheckCircle2, Lightbulb } from 'lucide-react';
import { GRAMMAR_LESSONS } from './grammarData';
import { speakSpanish } from './speechHelper';

export const GrammarSection: React.FC = () => {
  return (
    <div className="w-full bg-[#20040c]/90 border border-rose-900/50 rounded-2xl shadow-2xl overflow-hidden mt-6 backdrop-blur">
      {/* Header */}
      <div className="p-5 bg-gradient-to-r from-[#26050f] via-[#3d0818] to-[#1d030b] border-b border-rose-900/40">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/20 text-orange-300 border border-orange-500/35 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            ГРАММАТИЧЕСКИЙ РАЗБОР
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white font-display">
          Грамматика и языковые тонкости песни
        </h2>
        <p className="text-xs sm:text-sm text-rose-300/70 mt-1 max-w-3xl">
          Живые грамматические структуры из текста «Río de la Plata»: герундий с местоимениями, прошедшие времена, субхунтив и золотые фразеологизмы.
        </p>
      </div>

      {/* Lessons List */}
      <div className="p-6 space-y-8">
        {GRAMMAR_LESSONS.map((lesson) => (
          <div
            key={lesson.id}
            className="bg-[#180308]/90 border border-rose-900/50 rounded-2xl p-6 shadow-lg hover:border-orange-500/40 transition-all space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-rose-900/40">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/35 mr-2">
                  Уровень: {lesson.level}
                </span>
                <h3 className="text-xl font-bold text-white mt-1.5 font-display">
                  {lesson.title}
                </h3>
                <p className="text-xs text-rose-300/70 mt-0.5">{lesson.subtitle}</p>
              </div>
            </div>

            {/* Rule Box */}
            <div className="p-4 bg-[#260510] border-l-4 border-orange-500 rounded-r-xl shadow-inner">
              <div className="text-xs font-bold uppercase tracking-wider text-orange-400 mb-1 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4" />
                <span>Правило:</span>
              </div>
              <p className="text-sm text-rose-100 leading-relaxed font-medium">
                {lesson.rule}
              </p>
            </div>

            {/* Detailed Explanation */}
            <div className="text-sm text-rose-200/90 leading-relaxed space-y-2">
              <p>{lesson.explanation}</p>
            </div>

            {/* Context Examples */}
            <div className="space-y-2 pt-2">
              <div className="text-xs font-bold uppercase tracking-wider text-rose-300/70 mb-2">
                Примеры из песни и живой речи:
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {lesson.examples.map((ex, exIdx) => (
                  <div
                    key={exIdx}
                    className="p-3.5 bg-[#20040d]/70 border border-rose-950/80 rounded-xl flex items-start justify-between gap-3 group hover:border-rose-800"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="text-sm font-bold text-stone-100">
                        {ex.es}
                      </div>
                      <div className="text-xs text-orange-300/90 font-medium">
                        {ex.ru}
                      </div>
                      {ex.explanation && (
                        <div className="text-[11px] text-rose-300/60 italic pt-1 border-t border-rose-900/40">
                          {ex.explanation}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => speakSpanish(ex.es)}
                      className="p-1.5 text-rose-300/70 hover:text-orange-400 hover:bg-rose-950/60 rounded-lg transition-colors shrink-0"
                      title="Озвучить пример"
                      aria-label={`Озвучить пример: ${ex.es}`}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
