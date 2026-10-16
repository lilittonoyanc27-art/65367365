import React, { useState } from 'react';
import {
  Compass,
  Music,
  MapPin,
  Heart,
  Volume2,
  Bookmark,
  BookmarkCheck,
  Search,
  Sparkles,
} from 'lucide-react';
import { SONG_VOCABULARY } from './vocabularyData';
import { speakSpanish } from './speechHelper';
import { SavedWord } from './types';
import { cleanWord } from './pureLogic';

interface CultureSectionProps {
  savedWords: SavedWord[];
  onToggleSaveWord: (word: SavedWord) => void;
}

export const CultureSection: React.FC<CultureSectionProps> = ({
  savedWords,
  onToggleSaveWord,
}) => {
  const [activeTab, setActiveTab] = useState<'culture' | 'vocab'>('culture');
  const [vocabSearch, setVocabSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredVocab = SONG_VOCABULARY.filter((item) => {
    const matchesSearch =
      item.spanish.toLowerCase().includes(vocabSearch.toLowerCase()) ||
      item.russian.toLowerCase().includes(vocabSearch.toLowerCase()) ||
      item.explanation.toLowerCase().includes(vocabSearch.toLowerCase());
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="w-full bg-[#20040c]/90 border border-rose-900/50 rounded-2xl shadow-2xl overflow-hidden mt-6 backdrop-blur">
      {/* Header */}
      <div className="p-5 bg-gradient-to-r from-[#26050f] via-[#3d0818] to-[#1d030b] border-b border-rose-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/20 text-orange-300 border border-orange-500/35 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              КУЛЬТУРА И СЛОВАРЬ
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-display">
            Мир песни «Río de la Plata»
          </h2>
          <p className="text-xs sm:text-sm text-rose-300/70 mt-1">
            Уругвай, барабаны кандомбе и путь Наталии Орейро к мировой мечте
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex gap-1.5 bg-[#170308] p-1.5 rounded-xl border border-rose-900/40">
          <button
            onClick={() => setActiveTab('culture')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'culture'
                ? 'bg-gradient-to-r from-orange-500 to-rose-600 text-white shadow-md shadow-orange-500/20'
                : 'text-rose-300/70 hover:text-white'
            }`}
          >
            Культурный контекст
          </button>
          <button
            onClick={() => setActiveTab('vocab')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'vocab'
                ? 'bg-gradient-to-r from-orange-500 to-rose-600 text-white shadow-md shadow-orange-500/20'
                : 'text-rose-300/70 hover:text-white'
            }`}
          >
            Тематический словарь
          </button>
        </div>
      </div>

      {/* Cultural Articles Tab */}
      {activeTab === 'culture' && (
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Candombe */}
            <div className="bg-[#180308]/90 border border-rose-900/50 rounded-2xl p-6 shadow-lg space-y-3 relative overflow-hidden">
              <div className="p-3 bg-orange-500/15 text-orange-400 rounded-xl w-fit border border-orange-500/30">
                <Music className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white font-display">
                Что такое Кандомбе (El Candombe)?
              </h3>
              <p className="text-xs text-rose-200/80 leading-relaxed">
                Кандомбе — это сердце уругвайской идентичности. Этот ритм зародился среди африканских рабов, прибывших в порт Монтевидео в XVIII веке. Они собирались по воскресеньям у костров, чтобы нагреть на огне кожу барабанов и играть полиритмические композиции.
              </p>
              <div className="p-3 bg-[#24050f] rounded-xl text-[11px] text-rose-200/90 space-y-1 border border-rose-900/40">
                <div className="font-bold text-orange-400">Три священных барабана:</div>
                <ul className="list-disc list-inside space-y-0.5 text-rose-300/70">
                  <li><strong className="text-stone-200">Chico</strong> — быстрый пульсирующий метроном</li>
                  <li><strong className="text-stone-200">Repique</strong> — импровизация и соло</li>
                  <li><strong className="text-stone-200">Piano</strong> — глубокий басовый фундамент</li>
                </ul>
              </div>
            </div>

            {/* Card 2: Rio de la Plata */}
            <div className="bg-[#180308]/90 border border-rose-900/50 rounded-2xl p-6 shadow-lg space-y-3 relative overflow-hidden">
              <div className="p-3 bg-rose-500/15 text-rose-400 rounded-xl w-fit border border-rose-500/30">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white font-display">
                Река Ла-Плата (Río de la Plata)
              </h3>
              <p className="text-xs text-rose-200/80 leading-relaxed">
                Самая широкая река в мире (до 220 км в устье). С одной стороны расположен Монтевидео (Уругвай), с другой — Буэнос-Айрес (Аргентина). Жителей этого региона называют <em className="text-orange-300 font-medium">rioplatenses</em>.
              </p>
              <p className="text-xs text-rose-300/70 leading-relaxed">
                В этой реке переплелись испанские колониальные корни, африканские ритмы и итальянская эмиграция XIX века, создав уникальный диалект испанского языка — <strong className="text-stone-200">Español Rioplatense</strong> (с использованием формы <em>vos</em> вместо <em>tú</em> и особым произношением).
              </p>
            </div>

            {/* Card 3: Natalia Oreiro story */}
            <div className="bg-[#180308]/90 border border-rose-900/50 rounded-2xl p-6 shadow-lg space-y-3 relative overflow-hidden">
              <div className="p-3 bg-red-500/15 text-red-400 rounded-xl w-fit border border-red-500/30">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white font-display">
                История песни Наталии Орейро
              </h3>
              <p className="text-xs text-rose-200/80 leading-relaxed">
                Наталия родилась в Монтевидео в 1977 году в скромном районе. В 16 лет она села на паром через Ла-Плату в Буэнос-Айрес совершенно одна («marcharme sola de mi tierra un día»), чтобы ходить на кастинги.
              </p>
              <p className="text-xs text-rose-200/80 leading-relaxed">
                Песня «Río de la Plata» (альбом <em>Tu Veneno</em>, 2000 год) стала её личным манифестом верности корням, благодарности родным людям и гимном смелости идти за своей мечтой вопреки любым преградам.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Vocabulary Dictionary Tab */}
      {activeTab === 'vocab' && (
        <div className="p-6 space-y-6">
          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#180308]/80 p-4 rounded-xl border border-rose-900/40">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-rose-400/70 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Поиск по словарю..."
                value={vocabSearch}
                onChange={(e) => setVocabSearch(e.target.value)}
                className="w-full bg-[#150206] border border-rose-900/50 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-100 placeholder-rose-400/50 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
              {[
                { id: 'all', label: 'Все слова' },
                { id: 'candombe', label: 'Кандомбе' },
                { id: 'expresiones', label: 'Идиомы' },
                { id: 'verbos', label: 'Глаголы' },
                { id: 'emociones', label: 'Эмоции' },
                { id: 'cultura', label: 'Культура' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-gradient-to-r from-orange-500 to-rose-600 text-white shadow-sm'
                      : 'bg-[#290612] text-rose-300/70 hover:text-white border border-rose-900/30'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVocab.map((item) => {
              const isSaved = savedWords.some(
                (w) => cleanWord(w.spanish).toLowerCase() === cleanWord(item.spanish).toLowerCase()
              );

              return (
                <div
                  key={item.id}
                  className="bg-[#180308]/90 border border-rose-900/50 rounded-2xl p-5 shadow-lg flex flex-col justify-between hover:border-orange-500/40 transition-all space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/35">
                        {item.partOfSpeech}
                      </span>
                      <button
                        onClick={() => speakSpanish(item.spanish)}
                        className="p-1.5 text-rose-300/70 hover:text-orange-400 hover:bg-rose-950/60 rounded-lg transition-colors"
                        title="Озвучить"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h4 className="text-lg font-bold text-white font-display">
                      {item.spanish}
                    </h4>
                    <div className="text-xs font-bold text-orange-300 mt-0.5">
                      {item.russian}
                    </div>

                    <p className="text-xs text-rose-200/90 leading-relaxed mt-2.5">
                      {item.explanation}
                    </p>

                    {item.example && (
                      <div className="mt-3 p-2.5 bg-[#22040d] rounded-xl text-[11px] border-l-2 border-orange-500">
                        <div className="font-semibold text-rose-100">{item.example}</div>
                        <div className="text-rose-300/70 mt-0.5">{item.exampleRu}</div>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-rose-900/40 flex items-center justify-between">
                    <span className="text-[10px] text-rose-400/60 italic truncate max-w-[170px]">
                      {item.context}
                    </span>
                    <button
                      onClick={() =>
                        onToggleSaveWord({
                          id: item.id,
                          spanish: item.spanish,
                          russian: item.russian,
                          context: item.context,
                          dateAdded: Date.now(),
                        })
                      }
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                        isSaved
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                          : 'bg-[#2f0714] hover:bg-gradient-to-r hover:from-orange-500 hover:to-rose-600 hover:text-white text-rose-200 border border-rose-800/40'
                      }`}
                    >
                      {isSaved ? (
                        <>
                          <BookmarkCheck className="w-3.5 h-3.5" />
                          <span>Сохранено</span>
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-3.5 h-3.5" />
                          <span>В словарь</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
