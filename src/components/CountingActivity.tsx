import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, RotateCcw, ArrowRight, Sparkles, Lightbulb, Hand } from 'lucide-react';
import { NUMBER_DATA, ActivityResult } from '../types';
import { sound } from '../utils/audio';
import { triggerConfetti } from '../utils/confetti';

interface CountingActivityProps {
  onComplete: (result: ActivityResult) => void;
}

interface Question {
  targetNumber: number;
  emoji: string;
  itemName: string;
  options: number[];
}

export const CountingActivity: React.FC<CountingActivityProps> = ({ onComplete }) => {
  const TOTAL_QUESTIONS = 5;
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [countedIndices, setCountedIndices] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [score, setScore] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);

  const generateQuestion = (qIndex: number): Question => {
    // Generate target number 1 to 10
    const target = Math.floor(Math.random() * 10) + 1;
    const itemData = NUMBER_DATA.find((n) => n.num === target) || NUMBER_DATA[0];

    // Generate 3 unique distractors
    const pool = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter((n) => n !== target);
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const distractors = shuffled.slice(0, 3);
    const options = [target, ...distractors].sort(() => Math.random() - 0.5);

    return {
      targetNumber: target,
      emoji: itemData.emoji,
      itemName: itemData.nameIndo,
      options,
    };
  };

  useEffect(() => {
    loadNewQuestion(0);
  }, []);

  const loadNewQuestion = (qIndex: number) => {
    const q = generateQuestion(qIndex);
    setCurrentQuestion(q);
    setCountedIndices([]);
    setSelectedAnswer(null);
    setFeedback(null);
    setShowHint(false);
  };

  const handleObjectTap = (idx: number) => {
    sound.unlockAudio();
    sound.playPop(idx);
    let nextCounted: number[];
    if (countedIndices.includes(idx)) {
      // Toggle off if tapped again
      nextCounted = countedIndices.filter((i) => i !== idx);
    } else {
      nextCounted = [...countedIndices, idx];
    }
    setCountedIndices(nextCounted);

    if (nextCounted.length > 0) {
      const countWords = ['Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh'];
      sound.speak(countWords[nextCounted.length - 1] || `${nextCounted.length}`);
    }
  };

  const handleOptionClick = (option: number) => {
    sound.unlockAudio();
    setSelectedAnswer(option);

    if (currentQuestion && option === currentQuestion.targetNumber) {
      setFeedback('correct');
      setScore((prev) => prev + 1);
      sound.playSuccess();
      sound.speak(`Hebat sekali! Benar, ada ${option} ${currentQuestion.itemName}!`);
      triggerConfetti();
    } else {
      setFeedback('incorrect');
      sound.playTryAgain();
      sound.speak('Jumlahnya belum pas, coba hitung lagi ya!');
    }
  };

  const handleCountAll = () => {
    sound.unlockAudio();
    if (!currentQuestion) return;
    const all = Array.from({ length: currentQuestion.targetNumber }, (_, i) => i);
    setCountedIndices(all);
    setShowHint(true);
    sound.playNumberTone(currentQuestion.targetNumber);
    sound.speak(`Ada ${currentQuestion.targetNumber} ${currentQuestion.itemName}. Sekarang pilih angka ${currentQuestion.targetNumber}!`);
  };

  const handleNextQuestion = () => {
    if (questionIndex + 1 >= TOTAL_QUESTIONS) {
      onComplete({
        activity: 'count',
        title: 'Aktivitas Membilang',
        totalQuestions: TOTAL_QUESTIONS,
        correctAnswers: score + (feedback === 'correct' ? 1 : 0),
      });
    } else {
      setQuestionIndex((prev) => prev + 1);
      loadNewQuestion(questionIndex + 1);
    }
  };

  const buttonThemes = [
    { bg: 'bg-[#4FC3F7]', border: 'border-[#0288D1]', text: 'text-white' },
    { bg: 'bg-[#9575CD]', border: 'border-[#512DA8]', text: 'text-white' },
    { bg: 'bg-[#FF8A65]', border: 'border-[#E64A19]', text: 'text-white' },
    { bg: 'bg-[#DCE775]', border: 'border-[#AFB42B]', text: 'text-[#558B2F]' },
  ];

  if (!currentQuestion) return null;

  return (
    <div className="w-full max-w-5xl mx-auto py-4 px-4 sm:px-8">
      {/* Progress Header with Vibrant Palette Circles */}
      <div className="flex items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-2">
          <span className="text-base sm:text-lg font-black text-[#5D4037]">
            SOAL {questionIndex + 1} DARI {TOTAL_QUESTIONS}
          </span>
        </div>

        {/* Tactile Progress Indicator Circles */}
        <div className="flex items-center gap-2">
          {Array.from({ length: TOTAL_QUESTIONS }).map((_, idx) => {
            const isCompleted = idx < questionIndex || (idx === questionIndex && feedback === 'correct');
            const isCurrent = idx === questionIndex;
            return (
              <div
                key={idx}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm shadow-xs transition-all ${
                  isCompleted
                    ? 'bg-[#81C784] border-2 border-white text-white shadow-sm'
                    : isCurrent
                    ? 'bg-white border-2 border-[#FF7043] text-[#FF7043] scale-110'
                    : 'bg-white/60 border-2 border-dashed border-[#FBC02D] text-[#FBC02D]'
                }`}
              >
                {isCompleted ? '✓' : idx + 1}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Counting Box in Vibrant Palette */}
      <motion.div
        key={questionIndex}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[36px] sm:rounded-[44px] border-4 border-[#FFD54F] shadow-xl p-6 sm:p-10"
      >
        {/* Instruction Badge */}
        <div className="text-center mb-6">
          <div className="inline-block px-5 py-2 rounded-full bg-[#FFF9C4] border-2 border-[#FFD54F] text-[#5D4037] font-black text-lg sm:text-xl mb-2 shadow-xs">
            Berapa jumlah {currentQuestion.itemName}?
          </div>
          <p className="text-xs sm:text-sm font-bold text-[#795548]">
            Sentuh benda di bawah untuk menghitung, lalu klik angka yang sesuai!
          </p>
        </div>

        {/* Objects Area */}
        <div 
          role="region"
          aria-label="Area benda untuk dihitung"
          tabIndex={0}
          className="min-h-[200px] sm:min-h-[240px] p-6 sm:p-8 rounded-[32px] bg-[#FFFBEB] border-4 border-dashed border-[#FFD54F] flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-4 focus:outline-hidden focus:ring-2 focus:ring-[#FFD54F]"
        >
          {Array.from({ length: currentQuestion.targetNumber }).map((_, idx) => {
            const isTapped = countedIndices.includes(idx);
            const badgeNumber = countedIndices.indexOf(idx) + 1;
            return (
              <motion.button
                key={idx}
                id={`btn-count-item-${idx}`}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => handleObjectTap(idx)}
                className={`relative w-20 h-20 sm:w-26 sm:h-26 rounded-3xl flex items-center justify-center text-4xl sm:text-5xl shadow-md transition-all cursor-pointer select-none ${
                  isTapped
                    ? 'bg-[#FFEBEE] border-4 border-[#FFCDD2] ring-4 ring-[#FFD54F]'
                    : 'bg-white border-4 border-[#FFECB3] hover:border-[#FFD54F]'
                }`}
                title={`Sentuh untuk menghitung benda ke-${idx + 1}`}
              >
                <span>{currentQuestion.emoji}</span>
                {isTapped && (
                  <span className="absolute -top-3 -right-3 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#4CAF50] text-white border-2 border-white text-sm sm:text-base font-black flex items-center justify-center shadow-md">
                    {badgeNumber}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Helper bar: Count status & Auto-help button */}
        <div className="flex items-center justify-between gap-3 mb-6 px-2">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-[#5D4037]">
            <Hand className="w-4 h-4 text-[#FF7043]" />
            <span>Sudah disentuh: <strong>{countedIndices.length}</strong> dari <strong>{currentQuestion.targetNumber}</strong></span>
          </div>

          <button
            id="btn-help-count"
            onClick={handleCountAll}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFF9C4] border-2 border-[#FFD54F] text-[#5D4037] hover:bg-[#FFECB3] active:scale-95 text-xs sm:text-sm font-black transition-transform cursor-pointer shadow-xs"
            title="Bantu hitung otomatis semua benda"
          >
            <Lightbulb className="w-4 h-4 text-[#FFB300] fill-[#FFB300]" />
            <span>Bantu Hitung</span>
          </button>
        </div>

        {/* 3D Tactile Number Options */}
        <div className="mb-4">
          <div className="text-center font-black text-[#5D4037] text-lg sm:text-xl mb-4">
            👇 KLIK ANGKA YANG SESUAI JUMLAHNYA:
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5 max-w-2xl mx-auto">
            {currentQuestion.options.map((opt, optIdx) => {
              const isSelected = selectedAnswer === opt;
              const theme = buttonThemes[optIdx % buttonThemes.length];
              const isHinted = showHint && opt === currentQuestion.targetNumber;

              let customStyle = `${theme.bg} border-b-6 sm:border-b-8 ${theme.border} ${theme.text}`;

              if (isSelected) {
                if (feedback === 'correct') {
                  customStyle = 'bg-[#4CAF50] border-b-6 sm:border-b-8 border-[#2E7D32] text-white ring-4 ring-[#81C784] scale-105 shadow-xl';
                } else if (feedback === 'incorrect') {
                  customStyle = 'bg-[#FF8A65] border-b-6 sm:border-b-8 border-[#E64A19] text-white ring-4 ring-rose-300';
                }
              } else if (isHinted) {
                customStyle += ' ring-4 ring-[#FFD54F] animate-bounce';
              }

              return (
                <button
                  key={opt}
                  id={`btn-count-opt-${opt}`}
                  onClick={() => handleOptionClick(opt)}
                  className={`h-22 sm:h-26 rounded-3xl font-black text-5xl sm:text-6xl shadow-md transition-all active:translate-y-1 active:border-b-4 cursor-pointer flex items-center justify-center hover:scale-105 select-none ${customStyle}`}
                  title={`Pilih angka ${opt}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback Bar */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`mt-6 p-5 sm:p-6 rounded-[28px] border-3 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left ${
                feedback === 'correct'
                  ? 'bg-[#E8F5E9] border-[#81C784] text-[#1B5E20]'
                  : 'bg-[#FFF8E1] border-[#FFD54F] text-[#5D4037]'
              }`}
            >
              <div className="flex items-center gap-4">
                {feedback === 'correct' ? (
                  <div className="w-14 h-14 rounded-2xl bg-[#4CAF50] text-white flex items-center justify-center shadow-md shrink-0">
                    <CheckCircle2 className="w-8 h-8 stroke-[3]" />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-[#FF8A65] text-white flex items-center justify-center shadow-md shrink-0">
                    <RotateCcw className="w-8 h-8 stroke-[3]" />
                  </div>
                )}
                <div>
                  <div className="font-black text-xl sm:text-2xl">
                    {feedback === 'correct' ? 'HEBAT SEKALI! BENAR! 🎉' : 'YUK COBA LAGI! 😊'}
                  </div>
                  <div className="text-sm sm:text-base font-bold opacity-90">
                    {feedback === 'correct'
                      ? `Jumlah ${currentQuestion.itemName} ada tepat ${currentQuestion.targetNumber}.`
                      : `Jumlahnya ada ${currentQuestion.targetNumber}. Ayo klik tombol angka ${currentQuestion.targetNumber}!`}
                  </div>
                </div>
              </div>

              {feedback === 'correct' ? (
                <button
                  id="btn-count-next-q"
                  onClick={handleNextQuestion}
                  className="h-16 px-10 rounded-2xl bg-[#4CAF50] border-b-6 border-[#2E7D32] active:translate-y-1 active:border-b-2 text-white font-black text-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-transform shrink-0 hover:scale-105"
                >
                  <span>LANJUT</span>
                  <ArrowRight className="w-7 h-7 stroke-[3]" />
                </button>
              ) : (
                <button
                  id="btn-count-retry"
                  onClick={handleCountAll}
                  className="h-12 px-6 rounded-2xl bg-[#FFD54F] border-b-4 border-[#FBC02D] text-[#5D4037] font-black text-sm active:translate-y-1 active:border-b-0 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs shrink-0"
                >
                  <Lightbulb className="w-4 h-4 text-[#5D4037]" />
                  <span>Lihat Bantuan</span>
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
