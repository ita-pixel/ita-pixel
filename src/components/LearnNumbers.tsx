import React, { useState, useEffect, useId } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Volume2, Sparkles, Hand, CheckCircle2 } from 'lucide-react';
import { NUMBER_DATA, Language, AgeGroup } from '../types';
import { sound } from '../utils/audio';
import { t, getAgeTitleColor, getAgeInstructionColor } from '../utils/translations';

interface LearnNumbersProps {
  initialNumber?: number;
  onGoToCount: () => void;
  language: Language;
  ageGroup: AgeGroup;
}

export const LearnNumbers: React.FC<LearnNumbersProps> = ({
  initialNumber = 1,
  onGoToCount,
  language,
  ageGroup,
}) => {
  const [currentNum, setCurrentNum] = useState<number>(initialNumber);
  const [countedObjects, setCountedObjects] = useState<number[]>([]);
  const currentItem = NUMBER_DATA.find((item) => item.num === currentNum) || NUMBER_DATA[0];
  const countPromptId = useId();
  const text = t[language];
  const titleColor = getAgeTitleColor(ageGroup);
  const instructionColor = getAgeInstructionColor(ageGroup);

  const currentWord = language === 'id' ? currentItem.wordId : currentItem.wordEn;
  const currentItemName = language === 'id' ? currentItem.pluralId : currentItem.pluralEn;

  useEffect(() => {
    setCountedObjects([]);
    const word = language === 'id' ? currentItem.wordId : currentItem.wordEn;
    sound.speakNumber(currentItem.num, word, language);
  }, [currentNum, currentItem, language]);

  const handleSelectNum = (num: number) => {
    sound.unlockAudio();
    setCurrentNum(num);
  };

  const handlePrev = () => {
    sound.unlockAudio();
    if (currentNum > 1) {
      setCurrentNum((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    sound.unlockAudio();
    if (currentNum < 10) {
      setCurrentNum((prev) => prev + 1);
    }
  };

  const handleObjectTap = (index: number) => {
    sound.unlockAudio();
    sound.playPop(index);
    if (!countedObjects.includes(index)) {
      const updated = [...countedObjects, index];
      setCountedObjects(updated);
      const countSoFar = updated.length;
      const countWordsId = ['satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh'];
      const countWordsEn = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
      const wordToSpeak = language === 'id' ? countWordsId[countSoFar - 1] : countWordsEn[countSoFar - 1];
      sound.speak(wordToSpeak || `${countSoFar}`, language);
    }
  };

  const isAllCounted = countedObjects.length === currentItem.num;

  return (
    <div className="w-full max-w-5xl mx-auto py-3 px-4 sm:px-8">
      {/* 1-10 Tactile Number Strip */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 mb-5 overflow-x-auto py-2">
        {NUMBER_DATA.map((item) => {
          const isActive = item.num === currentNum;
          return (
            <button
              key={item.num}
              id={`btn-learn-num-${item.num}`}
              onClick={() => handleSelectNum(item.num)}
              className={`w-11 h-13 sm:w-13 sm:h-15 rounded-2xl font-black text-xl sm:text-2xl transition-all cursor-pointer flex items-center justify-center active:translate-y-1 ${
                isActive
                  ? `${item.btnBg} border-b-6 ${item.btnBorderBottom} text-white scale-110 shadow-lg ring-4 ring-[#FFD54F]`
                  : 'bg-white border-b-4 border-[#E0E0E0] text-[#5D4037] hover:border-[#FFD54F] shadow-xs'
              }`}
            >
              {item.num}
            </button>
          );
        })}
      </div>

      {/* Main Learning Card in Vibrant Palette */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentItem.num}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-[32px] sm:rounded-[40px] border-4 border-[#FFD54F] shadow-xl p-5 sm:p-8"
        >
          {/* Top Row: Giant 3D Number, Words, Pronounce */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 pb-5 border-b-2 border-[#FFECB3]">
            <div className="flex items-center gap-5">
              {/* Giant 3D Number Block */}
              <button
                type="button"
                onClick={() => {
                  sound.unlockAudio();
                  sound.speakNumber(currentItem.num, currentWord, language);
                }}
                title={language === 'id' ? 'klik untuk mendengarkan suara anak' : 'click to hear kid voice'}
                className={`w-24 h-24 sm:w-32 sm:h-32 rounded-3xl ${currentItem.btnBg} border-b-8 ${currentItem.btnBorderBottom} text-white font-black text-6xl sm:text-7xl flex items-center justify-center shadow-lg cursor-pointer active:translate-y-1 transition-transform`}
              >
                {currentItem.num}
              </button>

              {/* Number Words strictly lowercase */}
              <div>
                <div className="inline-block px-3 py-1 rounded-full bg-[#FFF9C4] border-2 border-[#FFD54F] text-[#5D4037] text-xs font-black lowercase mb-1">
                  {language === 'id' ? `angka ${currentItem.num}` : `number ${currentItem.num}`}
                </div>
                <div className={`text-4xl sm:text-5xl font-black lowercase tracking-tight ${titleColor}`}>
                  {currentWord}
                </div>
                <div className={`text-base sm:text-lg font-bold lowercase mt-1 ${instructionColor}`}>
                  {currentItemName}
                </div>
              </div>
            </div>

            {/* Pronounce Button */}
            <button
              id="btn-pronounce-number"
              onClick={() => {
                sound.unlockAudio();
                sound.speakNumber(currentItem.num, currentWord, language);
              }}
              className="px-5 py-3.5 rounded-2xl bg-[#FF7043] border-b-4 border-[#D84315] active:translate-y-1 active:border-b-0 text-white font-black text-sm sm:text-base flex items-center gap-2 shadow-md transition-all cursor-pointer hover:scale-102 lowercase"
            >
              <Volume2 className="w-5 h-5 stroke-[3]" />
              <span>{language === 'id' ? 'suara anak' : 'child voice'}</span>
            </button>
          </div>

          {/* Interactive Objects Area */}
          <div className="my-5">
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <span id={countPromptId} className={`text-sm sm:text-base font-black flex items-center gap-2 lowercase ${instructionColor}`}>
                <Hand className="w-5 h-5 text-[#FF7043]" />
                <span>
                  {text.touchEveryItem} ({countedObjects.length}/{currentItem.num})
                </span>
              </span>
              {isAllCounted && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C8E6C9] border-2 border-[#81C784] text-[#2E7D32] font-black text-xs sm:text-sm shadow-2xs lowercase">
                  <CheckCircle2 className="w-4 h-4 text-[#2E7D32] stroke-[3]" />
                  <span>{language === 'id' ? 'selesai dihitung!' : 'all counted!'}</span>
                </span>
              )}
            </div>

            {/* Grid of items */}
            <div
              role="region"
              aria-labelledby={countPromptId}
              className="min-h-[160px] sm:min-h-[190px] p-4 sm:p-6 rounded-[28px] bg-[#FFFBEB] border-4 border-dashed border-[#FFD54F] flex flex-wrap items-center justify-center gap-3.5 sm:gap-5"
            >
              {Array.from({ length: currentItem.num }).map((_, idx) => {
                const isTapped = countedObjects.includes(idx);
                return (
                  <motion.button
                    key={idx}
                    id={`btn-learn-obj-${idx}`}
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => handleObjectTap(idx)}
                    className={`relative w-18 h-18 sm:w-22 sm:h-22 rounded-2xl flex items-center justify-center text-4xl sm:text-5xl shadow-md transition-all cursor-pointer ${
                      isTapped
                        ? `${currentItem.cardItemBg} border-4 ${currentItem.cardItemBorder} ring-4 ring-[#FFD54F]`
                        : 'bg-white border-4 border-[#FFECB3] hover:border-[#FFD54F]'
                    }`}
                  >
                    <span>{currentItem.emoji}</span>
                    {isTapped && (
                      <span className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full bg-[#4CAF50] text-white border-2 border-white text-xs font-black flex items-center justify-center shadow-md">
                        {countedObjects.indexOf(idx) + 1}
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Ten-Frame Visualizer */}
          <div className="p-3.5 sm:p-4 rounded-[24px] bg-[#FFECB3] border-2 border-[#FFD54F]">
            <div className={`text-xs sm:text-sm font-black lowercase mb-2.5 flex items-center gap-1.5 ${instructionColor}`}>
              <span>🔲 {language === 'id' ? `bingkai 10 kotak (${currentItem.num} dari 10 kotak terisi):` : `ten-frame (${currentItem.num} of 10 filled):`}</span>
            </div>
            <div className="grid grid-cols-5 gap-2 max-w-sm mx-auto">
              {Array.from({ length: 10 }).map((_, idx) => {
                const isFilled = idx < currentItem.num;
                return (
                  <div
                    key={idx}
                    className={`h-10 sm:h-12 rounded-xl border-2 flex items-center justify-center font-black text-base transition-all shadow-2xs ${
                      isFilled
                        ? `${currentItem.btnBg} border-b-3 ${currentItem.btnBorderBottom} text-white`
                        : 'bg-white border-dashed border-[#FBC02D] text-[#FBC02D]/60'
                    }`}
                  >
                    {isFilled ? '●' : idx + 1}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls strictly lowercase */}
          <div className="mt-6 pt-5 border-t-2 border-[#FFECB3] flex flex-col sm:flex-row items-center justify-between gap-3.5">
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                id="btn-learn-prev"
                onClick={handlePrev}
                disabled={currentNum <= 1}
                className="flex-1 sm:flex-none h-12 px-5 rounded-2xl bg-[#E0E0E0] border-b-4 border-[#BDBDBD] active:translate-y-1 active:border-b-0 disabled:opacity-40 disabled:cursor-not-allowed font-black text-[#5D4037] text-sm sm:text-base flex items-center justify-center gap-1.5 transition-all cursor-pointer lowercase"
              >
                <ChevronLeft className="w-5 h-5 stroke-[3]" />
                <span>{language === 'id' ? 'sebelumnya' : 'previous'}</span>
              </button>

              <button
                id="btn-learn-next"
                onClick={handleNext}
                disabled={currentNum >= 10}
                className="flex-1 sm:flex-none h-12 px-6 rounded-2xl bg-[#4FC3F7] border-b-4 border-[#0288D1] active:translate-y-1 active:border-b-0 disabled:opacity-40 disabled:cursor-not-allowed font-black text-white text-sm sm:text-base flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer hover:scale-102 lowercase"
              >
                <span>{language === 'id' ? 'berikutnya' : 'next'}</span>
                <ChevronRight className="w-5 h-5 stroke-[3]" />
              </button>
            </div>

            <button
              id="btn-switch-to-counting"
              onClick={() => {
                sound.unlockAudio();
                sound.playPop();
                onGoToCount();
              }}
              className="w-full sm:w-auto h-12 px-6 rounded-2xl bg-[#4CAF50] border-b-4 border-[#2E7D32] active:translate-y-1 active:border-b-0 text-white font-black text-sm sm:text-base shadow-md flex items-center justify-center gap-2 cursor-pointer hover:scale-102 transition-all lowercase"
            >
              <Sparkles className="w-4 h-4 fill-white" />
              <span>{language === 'id' ? 'ayo latihan membilang!' : 'let\'s count items!'}</span>
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
