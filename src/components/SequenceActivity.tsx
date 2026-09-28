import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, RotateCcw, ArrowRight } from 'lucide-react';
import { ActivityResult } from '../types';
import { sound } from '../utils/audio';
import { triggerConfetti } from '../utils/confetti';

interface SequenceActivityProps {
  onComplete: (result: ActivityResult) => void;
}

interface SequenceQuestion {
  sequence: (number | null)[];
  missingIndex: number;
  correctAnswer: number;
  options: number[];
}

export const SequenceActivity: React.FC<SequenceActivityProps> = ({ onComplete }) => {
  const TOTAL_QUESTIONS = 5;
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<SequenceQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [score, setScore] = useState<number>(0);

  const generateQuestion = (qIndex: number): SequenceQuestion => {
    const startNum = Math.floor(Math.random() * 7) + 1; // 1 to 7 so 4 numbers stay <= 10
    const sequenceNumbers: number[] = [startNum, startNum + 1, startNum + 2, startNum + 3];

    const missingPos = qIndex % 2 === 0 ? 3 : Math.floor(Math.random() * 3) + 1;
    const correctAnswer = sequenceNumbers[missingPos];

    const displaySequence = sequenceNumbers.map((num, idx) => (idx === missingPos ? null : num));

    const pool = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter((n) => n !== correctAnswer);
    const shuffled = pool.sort(() => Math.random() - 0.5);
    const options = [correctAnswer, shuffled[0], shuffled[1]].sort(() => Math.random() - 0.5);

    return {
      sequence: displaySequence,
      missingIndex: missingPos,
      correctAnswer,
      options,
    };
  };

  useEffect(() => {
    loadNewQuestion(0);
  }, []);

  const loadNewQuestion = (qIndex: number) => {
    const q = generateQuestion(qIndex);
    setCurrentQuestion(q);
    setSelectedAnswer(null);
    setFeedback(null);
  };

  const handleOptionClick = (option: number) => {
    if (feedback === 'correct') return;
    sound.unlockAudio();

    setSelectedAnswer(option);

    if (currentQuestion && option === currentQuestion.correctAnswer) {
      setFeedback('correct');
      setScore((prev) => prev + 1);
      sound.playSuccess();
      sound.speak(`Hebat! Angka ${option} tepat sekali!`);
      triggerConfetti();
    } else {
      setFeedback('incorrect');
      sound.playTryAgain();
      sound.speak('Coba urutkan lagi ya!');
    }
  };

  const handleNextQuestion = () => {
    if (questionIndex + 1 >= TOTAL_QUESTIONS) {
      onComplete({
        activity: 'sequence',
        title: 'Urutkan Angka',
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
  ];

  if (!currentQuestion) return null;

  return (
    <div className="w-full max-w-5xl mx-auto py-4 px-4 sm:px-8">
      {/* Progress */}
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

      {/* Main Sequence Card in Vibrant Palette */}
      <motion.div
        key={questionIndex}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[36px] sm:rounded-[44px] border-4 border-[#FFD54F] shadow-xl p-6 sm:p-10"
      >
        {/* Instruction */}
        <div className="text-center mb-6">
          <div className="inline-block px-5 py-1.5 rounded-full bg-[#FFF9C4] border-2 border-[#FFD54F] text-[#5D4037] font-black text-base sm:text-lg mb-2 shadow-xs">
            Angka berapa yang hilang di gerbong tanda tanya [ ? ]?
          </div>
          <p className="text-xs sm:text-sm font-bold text-[#795548]">
            Lihat urutan angka dari kiri ke kanan lalu pilih angka yang sesuai
          </p>
        </div>

        {/* Train Visual Track */}
        <div className="min-h-[190px] sm:min-h-[220px] p-6 sm:p-8 rounded-[32px] bg-[#FFFBEB] border-4 border-dashed border-[#FFD54F] flex items-center justify-center overflow-x-auto gap-3 sm:gap-5 mb-8">
          {/* Locomotive Head */}
          <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-3xl bg-[#FF7043] border-b-6 border-[#D84315] flex flex-col items-center justify-center text-white shadow-md shrink-0">
            <span className="text-3xl sm:text-4xl">🚂</span>
            <span className="text-[11px] font-black uppercase tracking-wider mt-1">LOKO</span>
          </div>

          {/* Wagons */}
          {currentQuestion.sequence.map((num, idx) => {
            const isMissing = num === null;
            const isAnswerFilled = isMissing && feedback === 'correct';

            return (
              <div key={idx} className="flex items-center gap-2 sm:gap-3 shrink-0">
                <span className="text-xl font-black text-[#FBC02D]">🔗</span>
                <div
                  className={`w-20 h-24 sm:w-24 sm:h-28 rounded-3xl border-b-6 flex flex-col items-center justify-center shadow-md transition-all ${
                    isMissing
                      ? isAnswerFilled
                        ? 'bg-[#4CAF50] border-[#2E7D32] text-white scale-105 shadow-xl'
                        : 'bg-white border-dashed border-4 border-[#FF7043] text-[#FF7043] animate-pulse ring-4 ring-[#FFE0B2]'
                      : 'bg-[#4FC3F7] border-[#0288D1] text-white'
                  }`}
                >
                  <span className="text-3xl sm:text-5xl font-black">
                    {isMissing ? (isAnswerFilled ? currentQuestion.correctAnswer : '?') : num}
                  </span>
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider opacity-80 mt-1">
                    GERBONG {idx + 1}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3 Large 3D Answer Options */}
        <div className="mb-4">
          <div className="text-center font-black text-[#5D4037] text-lg mb-4">
            PILIH ANGKA UNTUK MELENGKAPI GERBONG:
          </div>

          <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-lg mx-auto">
            {currentQuestion.options.map((opt, optIdx) => {
              const isSelected = selectedAnswer === opt;
              const theme = buttonThemes[optIdx % buttonThemes.length];

              let customStyle = `${theme.bg} border-b-6 sm:border-b-8 ${theme.border} ${theme.text}`;

              if (isSelected) {
                if (feedback === 'correct') {
                  customStyle = 'bg-[#4CAF50] border-b-6 sm:border-b-8 border-[#2E7D32] text-white ring-4 ring-[#81C784] scale-105 shadow-xl';
                } else if (feedback === 'incorrect') {
                  customStyle = 'bg-[#FF8A65] border-b-6 sm:border-b-8 border-[#E64A19] text-white';
                }
              }

              return (
                <button
                  key={opt}
                  id={`btn-seq-opt-${opt}`}
                  onClick={() => handleOptionClick(opt)}
                  disabled={feedback === 'correct'}
                  className={`h-20 sm:h-24 rounded-3xl font-black text-5xl sm:text-6xl shadow-md transition-all active:translate-y-1 active:border-b-4 cursor-pointer flex items-center justify-center hover:scale-102 ${customStyle}`}
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
                  <div className="w-12 h-12 rounded-2xl bg-[#4CAF50] text-white flex items-center justify-center shadow-xs">
                    <CheckCircle2 className="w-7 h-7 stroke-[3]" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-[#FF8A65] text-white flex items-center justify-center shadow-xs">
                    <RotateCcw className="w-7 h-7 stroke-[3]" />
                  </div>
                )}
                <div>
                  <div className="font-black text-xl">
                    {feedback === 'correct' ? 'KERETA SIAP BERJALAN! 🚂' : 'YUK COBA LAGI! 😊'}
                  </div>
                  <div className="text-sm font-bold opacity-90">
                    {feedback === 'correct'
                      ? `Urutan angkanya sekarang sudah lengkap dan benar!`
                      : 'Coba baca urutan angkanya dari depan pelan-pelan ya!'}
                  </div>
                </div>
              </div>

              {feedback === 'correct' && (
                <button
                  id="btn-seq-next-q"
                  onClick={handleNextQuestion}
                  className="h-14 px-10 rounded-2xl bg-[#4CAF50] border-b-4 border-[#2E7D32] active:translate-y-1 active:border-b-0 text-white font-black text-lg shadow-md flex items-center gap-2 cursor-pointer transition-transform shrink-0 hover:scale-102"
                >
                  <span>LANJUT</span>
                  <ArrowRight className="w-6 h-6 stroke-[3]" />
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
