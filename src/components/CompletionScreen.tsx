import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Home, Sparkles, Star } from 'lucide-react';
import { ActivityResult, Language, AgeGroup } from '../types';
import { sound } from '../utils/audio';
import { triggerGrandCelebration } from '../utils/confetti';
import { t, getAgeTitleColor, getAgeInstructionColor } from '../utils/translations';

interface CompletionScreenProps {
  result: ActivityResult | null;
  onPlayAgain: () => void;
  onGoHome: () => void;
  language: Language;
  ageGroup: AgeGroup;
}

export const CompletionScreen: React.FC<CompletionScreenProps> = ({
  result,
  onPlayAgain,
  onGoHome,
  language,
  ageGroup,
}) => {
  const text = t[language];
  const titleColor = getAgeTitleColor(ageGroup);
  const instructionColor = getAgeInstructionColor(ageGroup);

  useEffect(() => {
    sound.playSuccess();
    const celebrationMsg =
      language === 'id'
        ? 'luar biasa! kamu hebat sekali! selamat sudah menyelesaikan permainan!'
        : 'awesome! you did great! congratulations on finishing the game!';
    sound.speak(celebrationMsg, language);
    triggerGrandCelebration();
  }, [language]);

  const total = result?.totalQuestions || 5;
  const correct = result?.correctAnswers || total;

  return (
    <div className="w-full max-w-2xl mx-auto py-6 px-4 sm:px-8 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 15 }}
        className="bg-white rounded-[36px] sm:rounded-[44px] border-4 border-[#FFD54F] shadow-2xl p-6 sm:p-10 relative overflow-hidden"
      >
        {/* Decorative 3D Trophy Badge */}
        <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-[#FFD54F] border-b-8 border-[#FBC02D] text-white flex items-center justify-center shadow-xl mb-5 animate-bounce">
          <span className="text-5xl sm:text-6xl">🏆</span>
          <div className="absolute -top-2 -right-2 p-1.5 rounded-2xl bg-[#FF7043] border-b-4 border-[#D84315] text-white shadow-md">
            <Sparkles className="w-5 h-5 fill-white" />
          </div>
        </div>

        {/* Celebratory Title Badge */}
        <div className={`inline-block px-4 py-1.5 rounded-full bg-[#FFF9C4] border-2 border-[#FFD54F] font-black text-sm sm:text-base mb-2.5 shadow-2xs lowercase ${titleColor}`}>
          {language === 'id' ? 'hore! kamu bintang berhitung! 🌟' : 'hooray! you are a counting star! 🌟'}
        </div>

        <h1 className={`text-2xl sm:text-4xl font-black mb-2 tracking-tight lowercase ${titleColor}`}>
          {text.allDoneCelebration}
        </h1>

        <p className={`text-sm sm:text-base font-bold max-w-md mx-auto mb-6 lowercase ${instructionColor}`}>
          {text.starScore(correct, total)}
        </p>

        {/* Stars Achievement Section */}
        <div className="p-5 rounded-[28px] bg-[#FFECB3] border-2 border-[#FFD54F] mb-6 max-w-sm mx-auto shadow-inner">
          <div className="text-xs font-black text-[#5D4037] lowercase mb-2.5">
            {language === 'id' ? 'bintang prestasimu' : 'your reward stars'}
          </div>
          <div className="flex items-center justify-center gap-2">
            {Array.from({ length: total }).map((_, idx) => (
              <motion.div
                key={idx}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
              >
                <Star
                  className={`w-8 h-8 sm:w-9 sm:h-9 ${
                    idx < correct
                      ? 'text-[#FBC02D] fill-[#FBC02D] filter drop-shadow-md'
                      : 'text-[#FFE082] fill-[#FFE082]'
                  }`}
                />
              </motion.div>
            ))}
          </div>
          <p className="text-xs sm:text-sm font-black text-[#2E7D32] mt-3 lowercase">
            ✨ {language === 'id' ? 'kamu berhasil membilang angka 1 sampai 10!' : 'you mastered counting numbers 1 to 10!'} ✨
          </p>
        </div>

        {/* 3D Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4">
          <button
            id="btn-play-again"
            onClick={() => {
              sound.playPop();
              onPlayAgain();
            }}
            className="w-full sm:w-auto h-13 px-8 rounded-2xl bg-[#4CAF50] border-b-6 border-[#2E7D32] hover:bg-[#43A047] active:translate-y-1 active:border-b-2 text-white font-black text-base shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-102 lowercase"
          >
            <RotateCcw className="w-5 h-5 stroke-[3]" />
            <span>{text.playAgain}</span>
          </button>

          <button
            id="btn-completion-home"
            onClick={() => {
              sound.playPop();
              onGoHome();
            }}
            className="w-full sm:w-auto h-13 px-8 rounded-2xl bg-[#FF7043] border-b-6 border-[#D84315] hover:bg-[#F4511E] active:translate-y-1 active:border-b-2 text-white font-black text-base shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-102 lowercase"
          >
            <Home className="w-5 h-5 stroke-[3]" />
            <span>{language === 'id' ? 'pilih menu lain' : 'choose other activity'}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
