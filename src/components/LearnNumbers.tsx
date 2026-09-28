import React, { useState, useEffect, useId } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Volume2, Sparkles, Hand, CheckCircle2 } from 'lucide-react';
import { NUMBER_DATA } from '../types';
import { sound } from '../utils/audio';

interface LearnNumbersProps {
  initialNumber?: number;
  onGoToCount: () => void;
}

export const LearnNumbers: React.FC<LearnNumbersProps> = ({
  initialNumber = 1,
  onGoToCount,
}) => {
  const [currentNum, setCurrentNum] = useState<number>(initialNumber);
  const [countedObjects, setCountedObjects] = useState<number[]>([]);
  const currentItem = NUMBER_DATA.find((item) => item.num === currentNum) || NUMBER_DATA[0];
  const countPromptId = useId();

  useEffect(() => {
    setCountedObjects([]);
    sound.speakNumber(currentItem.num, currentItem.word);
  }, [currentNum, currentItem]);

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
      const countWords = ['Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh'];
      sound.speak(countWords[countSoFar - 1] || `${countSoFar}`);
    }
  };

  const isAllCounted = countedObjects.length === currentItem.num;

  return (
    <div className="w-full max-w-5xl mx-auto py-4 px-4 sm:px-8">
      {/* 1-10 Tactile Number Strip */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6 overflow-x-auto py-2">
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
          className="bg-white rounded-[36px] sm:rounded-[44px] border-4 border-[#FFD54F] shadow-xl p-6 sm:p-10"
        >
          {/* Top Row: Giant 3D Number, Words, Pronounce */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b-2 border-[#FFECB3]">
            <div className="flex items-center gap-6">
              {/* Giant 3D Number Block */}
              <button
                type="button"
                onClick={() => {
                  sound.unlockAudio();
                  sound.speakNumber(currentItem.num, currentItem.word);
                }}
                title="Klik untuk mendengarkan angka ini"
                className={`w-28 h-28 sm:w-36 sm:h-36 rounded-3xl ${currentItem.btnBg} border-b-8 ${currentItem.btnBorderBottom} text-white font-black text-6xl sm:text-8xl flex items-center justify-center shadow-lg cursor-pointer active:translate-y-1 transition-transform`}
              >
                {currentItem.num}
              </button>

              {/* Number Words */}
              <div>
                <div className="inline-block px-3.5 py-1 rounded-full bg-[#FFF9C4] border-2 border-[#FFD54F] text-[#5D4037] text-xs sm:text-sm font-black uppercase tracking-wider mb-1">
                  ANGKA {currentItem.num}
                </div>
                <div className={`text-4xl sm:text-6xl font-black ${currentItem.textColor} tracking-tight`}>
                  {currentItem.word.toUpperCase()}
                </div>
                <div className="text-lg sm:text-xl font-bold text-[#5D4037] mt-1">
                  {currentItem.pluralIndo}
                </div>
              </div>
            </div>

            {/* Pronounce Button */}
            <button
              id="btn-pronounce-number"
              onClick={() => {
                sound.unlockAudio();
                sound.speakNumber(currentItem.num, currentItem.word);
              }}
              className="px-6 py-4 rounded-2xl bg-[#FF7043] border-b-4 border-[#D84315] active:translate-y-1 active:border-b-0 text-white font-black text-base sm:text-lg flex items-center gap-2.5 shadow-md transition-all cursor-pointer hover:scale-102"
            >
              <Volume2 className="w-6 h-6 stroke-[3]" />
              <span>DENGARKAN SUARA</span>
            </button>
          </div>

          {/* Interactive Objects Area */}
          <div className="my-6">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span id={countPromptId} className="text-base sm:text-lg font-black text-[#5D4037] flex items-center gap-2">
                <Hand className="w-5 h-5 text-[#FF7043]" />
                Sentuh benda untuk berhitung ({countedObjects.length}/{currentItem.num}):
              </span>
              {isAllCounted && (
                <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#C8E6C9] border-2 border-[#81C784] text-[#2E7D32] font-black text-sm shadow-xs">
                  <CheckCircle2 className="w-5 h-5 text-[#2E7D32] stroke-[3]" />
                  SELESAI DIHITUNG!
                </span>
              )}
            </div>

            {/* Grid of items */}
            <div 
              role="region"
              aria-labelledby={countPromptId}
              className="min-h-[170px] sm:min-h-[200px] p-5 sm:p-7 rounded-[32px] bg-[#FFFBEB] border-4 border-dashed border-[#FFD54F] flex flex-wrap items-center justify-center gap-4 sm:gap-6"
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
                    className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex items-center justify-center text-4xl sm:text-5xl shadow-md transition-all cursor-pointer ${
                      isTapped
                        ? `${currentItem.cardItemBg} border-4 ${currentItem.cardItemBorder} ring-4 ring-[#FFD54F]`
                        : 'bg-white border-4 border-[#FFECB3] hover:border-[#FFD54F]'
                    }`}
                  >
                    <span>{currentItem.emoji}</span>
                    {isTapped && (
                      <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#4CAF50] text-white border-2 border-white text-xs sm:text-sm font-black flex items-center justify-center shadow-md">
                        {countedObjects.indexOf(idx) + 1}
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Ten-Frame Visualizer */}
          <div className="p-4 sm:p-5 rounded-[28px] bg-[#FFECB3] border-2 border-[#FFD54F]">
            <div className="text-xs sm:text-sm font-black text-[#5D4037] uppercase tracking-wide mb-3 flex items-center gap-2">
              <span>🔲 Bingkai 10 Kotak ({currentItem.num} dari 10 kotak terisi):</span>
            </div>
            <div className="grid grid-cols-5 gap-2.5 max-w-md mx-auto">
              {Array.from({ length: 10 }).map((_, idx) => {
                const isFilled = idx < currentItem.num;
                return (
                  <div
                    key={idx}
                    className={`h-12 sm:h-14 rounded-2xl border-3 flex items-center justify-center font-black text-lg transition-all shadow-xs ${
                      isFilled
                        ? `${currentItem.btnBg} border-b-4 ${currentItem.btnBorderBottom} text-white`
                        : 'bg-white border-dashed border-[#FBC02D] text-[#FBC02D]/60'
                    }`}
                  >
                    {isFilled ? '●' : idx + 1}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="mt-8 pt-6 border-t-2 border-[#FFECB3] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                id="btn-learn-prev"
                onClick={handlePrev}
                disabled={currentNum <= 1}
                className="flex-1 sm:flex-none h-14 px-6 rounded-2xl bg-[#E0E0E0] border-b-4 border-[#BDBDBD] active:translate-y-1 active:border-b-0 disabled:opacity-40 disabled:cursor-not-allowed font-black text-[#5D4037] text-base flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6 stroke-[3]" />
                <span>SEBELUMNYA</span>
              </button>

              <button
                id="btn-learn-next"
                onClick={handleNext}
                disabled={currentNum >= 10}
                className="flex-1 sm:flex-none h-14 px-8 rounded-2xl bg-[#4FC3F7] border-b-4 border-[#0288D1] active:translate-y-1 active:border-b-0 disabled:opacity-40 disabled:cursor-not-allowed font-black text-white text-base flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer hover:scale-102"
              >
                <span>BERIKUTNYA</span>
                <ChevronRight className="w-6 h-6 stroke-[3]" />
              </button>
            </div>

            <button
              id="btn-switch-to-counting"
              onClick={() => {
                sound.unlockAudio();
                sound.playPop();
                onGoToCount();
              }}
              className="w-full sm:w-auto h-14 px-8 rounded-2xl bg-[#4CAF50] border-b-4 border-[#2E7D32] active:translate-y-1 active:border-b-0 text-white font-black text-base shadow-md flex items-center justify-center gap-2.5 cursor-pointer hover:scale-102 transition-all"
            >
              <Sparkles className="w-5 h-5 fill-white" />
              <span>AYO LATIHAN MEMBILANG!</span>
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
