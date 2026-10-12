import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, RotateCcw, ArrowRight } from 'lucide-react';
import { ActivityResult, Language, AgeGroup } from '../types';
import { sound } from '../utils/audio';
import { triggerConfetti } from '../utils/confetti';
import { t, getAgeTitleColor, getAgeInstructionColor } from '../utils/translations';

interface SequenceActivityProps {
  onComplete: (result: ActivityResult) => void;
  language: Language;
  ageGroup: AgeGroup;
}

interface SequenceQuestion {
  sequence: (number | null)[];
  missingIndex: number;
  correctAnswer: number;
  options: number[];
}

export const SequenceActivity: React.FC<SequenceActivityProps> = ({
  onComplete,
  language,
  ageGroup,
}) => {
  const TOTAL_QUESTIONS = 5;
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<SequenceQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [score, setScore] = useState<number>(0);

  const text = t[language];
  const titleColor = getAgeTitleColor(ageGroup);
  const instructionColor = getAgeInstructionColor(ageGroup);

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
      const praise =
        language === 'id'
          ? `hebat! angka ${option} tepat sekali!`
          : `great job! number ${option} is right!`;
      sound.speak(praise, language);
      triggerConfetti();
    } else {
      setFeedback('incorrect');
      sound.playTryAgain();
      const tryMsg =
        language === 'id'
          ? 'coba urutkan lagi ya!'
          : 'let\'s order the train cars again!';
      sound.speak(tryMsg, language);
    }
  };

  const handleNextQuestion = () => {
    if (questionIndex + 1 >= TOTAL_QUESTIONS) {
      onComplete({
        activity: 'sequence',
        title: language === 'id' ? 'urutkan angka' : 'order numbers',
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
    <div className="w-full max-w-5xl mx-auto py-3 px-4 sm:px-8">
      {/* Progress */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <span className={`text-sm sm:text-base font-black lowercase ${instructionColor}`}>
            {language === 'id'
              ? `soal ${questionIndex + 1} dari ${TOTAL_QUESTIONS}`
              : `question ${questionIndex + 1} of ${TOTAL_QUESTIONS}`}
          </span>
        </div>

        {/* Progress circles */}
        <div className="flex items-center gap-2">
          {Array.from({ length: TOTAL_QUESTIONS }).map((_, idx) => {
            const isCompleted = idx < questionIndex || (idx === questionIndex && feedback === 'correct');
            const isCurrent = idx === questionIndex;
            return (
              <div
                key={idx}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-black text-xs sm:text-sm shadow-xs transition-all ${
                  isCompleted
                    ? 'bg-[#81C784] border-2 border-white text-white shadow-xs'
                    : isCurrent
                    ? 'bg-white border-2 border-[#FF7043] text-[#FF7043] scale-105'
                    : 'bg-white/60 border-2 border-dashed border-[#FBC02D] text-[#FBC02D]'
                }`}
              >
                {isCompleted ? '✓' : idx + 1}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Sequence Card */}
      <motion.div
        key={questionIndex}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[32px] sm:rounded-[40px] border-4 border-[#FFD54F] shadow-xl p-5 sm:p-8"
      >
        {/* Instruction */}
        <div className="text-center mb-5">
          <div className={`inline-block px-4 py-1.5 rounded-full bg-[#FFF9C4] border-2 border-[#FFD54F] font-black text-base sm:text-lg mb-1.5 shadow-2xs lowercase ${titleColor}`}>
            {text.sequenceQuestion}
          </div>
          <p className={`text-xs sm:text-sm font-bold lowercase ${instructionColor}`}>
            {language === 'id'
              ? 'lihat urutan angka dari kiri ke kanan lalu pilih angka yang sesuai'
              : 'look at the numbers from left to right and pick the missing number'}
          </p>
        </div>

        {/* Train Visual Track */}
        <div className="min-h-[170px] sm:min-h-[200px] p-5 sm:p-7 rounded-[28px] bg-[#FFFBEB] border-4 border-dashed border-[#FFD54F] flex items-center justify-center overflow-x-auto gap-2.5 sm:gap-4 mb-6">
          {/* Locomotive Head */}
          <div className="w-18 h-22 sm:w-22 sm:h-26 rounded-2xl sm:rounded-3xl bg-[#FF7043] border-b-6 border-[#D84315] flex flex-col items-center justify-center text-white shadow-md shrink-0">
            <span className="text-3xl sm:text-4xl">🚂</span>
            <span className="text-[10px] sm:text-xs font-black lowercase mt-1">
              {language === 'id' ? 'loko' : 'train'}
            </span>
          </div>

          {/* Wagons */}
          {currentQuestion.sequence.map((num, idx) => {
            const isMissing = num === null;
            const isAnswerFilled = isMissing && feedback === 'correct';

            return (
              <div key={idx} className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
                <span className="text-lg font-black text-[#FBC02D]">🔗</span>
                <div
                  className={`w-18 h-22 sm:w-22 sm:h-26 rounded-2xl sm:rounded-3xl border-b-6 flex flex-col items-center justify-center shadow-md transition-all ${
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
                  <span className="text-[9px] sm:text-[11px] font-black lowercase opacity-85 mt-1">
                    {language === 'id' ? `gerbong ${idx + 1}` : `car ${idx + 1}`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3 Large 3D Answer Options */}
        <div className="mb-3">
          <div className={`text-center font-black text-sm sm:text-base mb-3 lowercase ${instructionColor}`}>
            👇 {language === 'id' ? 'pilih angka untuk melengkapi gerbong:' : 'pick the number to complete the car:'}
          </div>

          <div className="grid grid-cols-3 gap-3.5 sm:gap-5 max-w-md mx-auto">
            {currentQuestion.options.map((opt, optIdx) => {
              const isSelected = selectedAnswer === opt;
              const theme = buttonThemes[optIdx % buttonThemes.length];

              let customStyle = `${theme.bg} border-b-6 ${theme.border} ${theme.text}`;

              if (isSelected) {
                if (feedback === 'correct') {
                  customStyle = 'bg-[#4CAF50] border-b-6 border-[#2E7D32] text-white ring-4 ring-[#81C784] scale-105 shadow-xl';
                } else if (feedback === 'incorrect') {
                  customStyle = 'bg-[#FF8A65] border-b-6 border-[#E64A19] text-white';
                }
              }

              return (
                <button
                  key={opt}
                  id={`btn-seq-opt-${opt}`}
                  onClick={() => handleOptionClick(opt)}
                  disabled={feedback === 'correct'}
                  className={`h-20 sm:h-24 rounded-2xl sm:rounded-3xl font-black text-4xl sm:text-5xl shadow-md transition-all active:translate-y-1 active:border-b-4 cursor-pointer flex items-center justify-center hover:scale-102 ${customStyle}`}
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
              className={`mt-5 p-4 sm:p-5 rounded-[24px] border-3 flex flex-col sm:flex-row items-center justify-between gap-3.5 text-center sm:text-left ${
                feedback === 'correct'
                  ? 'bg-[#E8F5E9] border-[#81C784] text-[#1B5E20]'
                  : 'bg-[#FFF8E1] border-[#FFD54F] text-[#5D4037]'
              }`}
            >
              <div className="flex items-center gap-3.5">
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
                  <div className="font-black text-lg sm:text-xl lowercase">
                    {feedback === 'correct'
                      ? (language === 'id' ? 'kereta siap berjalan! 🚂' : 'the train is ready to go! 🚂')
                      : (language === 'id' ? 'yuk coba lagi! 😊' : 'let\'s try again! 😊')}
                  </div>
                  <div className="text-xs sm:text-sm font-bold opacity-90 lowercase">
                    {feedback === 'correct'
                      ? (language === 'id'
                        ? 'urutan angkanya sekarang sudah lengkap dan benar!'
                        : 'the number line is now complete and correct!')
                      : (language === 'id'
                        ? 'coba baca urutan angkanya dari depan pelan-pelan ya!'
                        : 'try reading the numbers from the front slowly!')}
                  </div>
                </div>
              </div>

              {feedback === 'correct' && (
                <button
                  id="btn-seq-next-q"
                  onClick={handleNextQuestion}
                  className="h-13 px-8 rounded-2xl bg-[#4CAF50] border-b-4 border-[#2E7D32] active:translate-y-1 active:border-b-0 text-white font-black text-base shadow-md flex items-center gap-2 cursor-pointer transition-transform shrink-0 hover:scale-102 lowercase"
                >
                  <span>{text.nextButton}</span>
                  <ArrowRight className="w-5 h-5 stroke-[3]" />
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
