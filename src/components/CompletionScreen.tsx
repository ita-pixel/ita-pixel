import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Home, Sparkles, Star } from 'lucide-react';
import { ActivityResult } from '../types';
import { sound } from '../utils/audio';
import { triggerGrandCelebration } from '../utils/confetti';

interface CompletionScreenProps {
  result: ActivityResult | null;
  onPlayAgain: () => void;
  onGoHome: () => void;
}

export const CompletionScreen: React.FC<CompletionScreenProps> = ({
  result,
  onPlayAgain,
  onGoHome,
}) => {
  useEffect(() => {
    sound.playSuccess();
    sound.speak('Luar biasa! Kamu hebat sekali! Selamat sudah menyelesaikan permainan!');
    triggerGrandCelebration();
  }, []);

  const total = result?.totalQuestions || 5;
  const correct = result?.correctAnswers || total;

  return (
    <div className="w-full max-w-3xl mx-auto py-8 px-4 sm:px-8 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 15 }}
        className="bg-white rounded-[44px] border-4 border-[#FFD54F] shadow-2xl p-8 sm:p-12 relative overflow-hidden"
      >
        {/* Decorative 3D Trophy Badge */}
        <div className="relative mx-auto w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-[#FFD54F] border-b-8 border-[#FBC02D] text-white flex items-center justify-center shadow-xl mb-6 animate-bounce">
          <span className="text-6xl sm:text-7xl">🏆</span>
          <div className="absolute -top-2 -right-2 p-2 rounded-2xl bg-[#FF7043] border-b-4 border-[#D84315] text-white shadow-md">
            <Sparkles className="w-6 h-6 fill-white" />
          </div>
        </div>

        {/* Celebratory Title Badge */}
        <div className="inline-block px-5 py-1.5 rounded-full bg-[#FFF9C4] border-2 border-[#FFD54F] text-[#5D4037] font-black text-base sm:text-lg mb-3 shadow-xs">
          HORE! KAMU BINTANG BERHITUNG! 🌟
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-[#5D4037] mb-2 tracking-tight">
          HEBAT SEKALI, KAMU PINTAR! 🎉
        </h1>

        <p className="text-base sm:text-lg text-[#795548] font-bold max-w-md mx-auto mb-8">
          Kamu sudah menyelesaikan <span className="text-[#E64A19] underline decoration-wavy decoration-[#FF8A65]">{result?.title || 'Aktivitas Membilang'}</span> dengan luar biasa!
        </p>

        {/* Stars Achievement Section */}
        <div className="p-6 rounded-[32px] bg-[#FFECB3] border-2 border-[#FFD54F] mb-8 max-w-md mx-auto shadow-inner">
          <div className="text-xs sm:text-sm font-black text-[#5D4037] uppercase tracking-wider mb-3">
            BINTANG PRESTASI KAMU
          </div>
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            {Array.from({ length: total }).map((_, idx) => (
              <motion.div
                key={idx}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
              >
                <Star
                  className={`w-9 h-9 sm:w-11 sm:h-11 ${
                    idx < correct
                      ? 'text-[#FBC02D] fill-[#FBC02D] filter drop-shadow-md'
                      : 'text-[#FFE082] fill-[#FFE082]'
                  }`}
                />
              </motion.div>
            ))}
          </div>
          <p className="text-sm font-black text-[#2E7D32] mt-4">
            ✨ Kamu berhasil membilang angka 1 sampai 10! ✨
          </p>
        </div>

        {/* 3D Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <button
            id="btn-play-again"
            onClick={() => {
              sound.playPop();
              onPlayAgain();
            }}
            className="w-full sm:w-auto h-16 px-10 rounded-2xl bg-[#4CAF50] border-b-6 border-[#2E7D32] hover:bg-[#43A047] active:translate-y-1 active:border-b-2 text-white font-black text-xl shadow-lg transition-all flex items-center justify-center gap-3 cursor-pointer hover:scale-102"
          >
            <RotateCcw className="w-6 h-6 stroke-[3]" />
            <span>MAIN LAGI</span>
          </button>

          <button
            id="btn-completion-home"
            onClick={() => {
              sound.playPop();
              onGoHome();
            }}
            className="w-full sm:w-auto h-16 px-10 rounded-2xl bg-[#FF7043] border-b-6 border-[#D84315] hover:bg-[#F4511E] active:translate-y-1 active:border-b-2 text-white font-black text-xl shadow-lg transition-all flex items-center justify-center gap-3 cursor-pointer hover:scale-102"
          >
            <Home className="w-6 h-6 stroke-[3]" />
            <span>PILIH MENU LAIN</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
