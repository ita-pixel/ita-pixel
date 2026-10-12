import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, RotateCcw, ArrowRight, Lightbulb, Hand } from 'lucide-react';
import { NUMBER_DATA, ActivityResult, Language, AgeGroup } from '../types';
import { sound } from '../utils/audio';
import { triggerConfetti } from '../utils/confetti';
import { t, getAgeTitleColor, getAgeInstructionColor } from '../utils/translations';

interface CountingActivityProps {
  onComplete: (result: ActivityResult) => void;
  language: Language;
  ageGroup: AgeGroup;
}

interface Question {
  targetNumber: number;
  emoji: string;
  nameId: string;
  nameEn: string;
  options: number[];
}

export const CountingActivity: React.FC<CountingActivityProps> = ({
  onComplete,
  language,
  ageGroup,
}) => {
  const TOTAL_QUESTIONS = 5;
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [countedIndices, setCountedIndices] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [score, setScore] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);

  const text = t[language];
  const titleColor = getAgeTitleColor(ageGroup);
  const instructionColor = getAgeInstructionColor(ageGroup);

  const generateQuestion = (): Question => {
    const target = Math.floor(Math.random() * 10) + 1;
    const itemData = NUMBER_DATA.find((n) => n.num === target) || NUMBER_DATA[0];

    const pool = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter((n) => n !== target);
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const distractors = shuffled.slice(0, 3);
    const options = [target, ...distractors].sort(() => Math.random() - 0.5);

    return {
      targetNumber: target,
      emoji: itemData.emoji,
      nameId: itemData.nameId,
      nameEn: itemData.nameEn,
      options,
    };
  };

  useEffect(() => {
    loadNewQuestion(0);
  }, []);

  const loadNewQuestion = (_qIndex: number) => {
    const q = generateQuestion();
    setCurrentQuestion(q);
    setCountedIndices([]);
    setSelectedAnswer(null);
    setFeedback(null);
    setShowHint(false);
  };

  const currentItemName = currentQuestion
    ? language === 'id'
      ? currentQuestion.nameId
      : currentQuestion.nameEn
    : '';

  const handleObjectTap = (idx: number) => {
    sound.unlockAudio();
    sound.playPop(idx);
    let nextCounted: number[];
    if (countedIndices.includes(idx)) {
      nextCounted = countedIndices.filter((i) => i !== idx);
    } else {
      nextCounted = [...countedIndices, idx];
    }
    setCountedIndices(nextCounted);

    if (nextCounted.length > 0) {
      const countWordsId = ['satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh'];
      const countWordsEn = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
      const word = language === 'id' ? countWordsId[nextCounted.length - 1] : countWordsEn[nextCounted.length - 1];
      sound.speak(word || `${nextCounted.length}`, language);
    }
  };

  const handleOptionClick = (option: number) => {
    sound.unlockAudio();
    setSelectedAnswer(option);

    if (currentQuestion && option === currentQuestion.targetNumber) {
      setFeedback('correct');
      setScore((prev) => prev + 1);
      sound.playSuccess();
      const praise =
        language === 'id'
          ? `hebat sekali! benar, ada ${option} ${currentItemName}!`
          : `great job! correct, there are ${option} ${currentItemName}!`;
      sound.speak(praise, language);
      triggerConfetti();
    } else {
      setFeedback('incorrect');
      sound.playTryAgain();
      const tryMsg =
        language === 'id'
          ? 'jumlahnya belum pas, coba hitung lagi ya!'
          : 'not quite, let\'s try counting again!';
      sound.speak(tryMsg, language);
    }
  };

  const handleCountAll = () => {
    sound.unlockAudio();
    if (!currentQuestion) return;
    const all = Array.from({ length: currentQuestion.targetNumber }, (_, i) => i);
    setCountedIndices(all);
    setShowHint(true);
    sound.playNumberTone(currentQuestion.targetNumber);
    const helpMsg =
      language === 'id'
        ? `ada ${currentQuestion.targetNumber} ${currentItemName}. sekarang pilih angka ${currentQuestion.targetNumber}!`
        : `there are ${currentQuestion.targetNumber} ${currentItemName}. now pick number ${currentQuestion.targetNumber}!`;
    sound.speak(helpMsg, language);
  };

  const handleNextQuestion = () => {
    if (questionIndex + 1 >= TOTAL_QUESTIONS) {
      onComplete({
        activity: 'count',
        title: language === 'id' ? 'aktivitas membilang' : 'counting activity',
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
    <div className="w-full max-w-5xl mx-auto py-3 px-4 sm:px-8">
      {/* Progress Header */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <span className={`text-sm sm:text-base font-black lowercase ${instructionColor}`}>
            {language === 'id'
              ? `soal ${questionIndex + 1} dari ${TOTAL_QUESTIONS}`
              : `question ${questionIndex + 1} of ${TOTAL_QUESTIONS}`}
          </span>
        </div>

        {/* Progress Circles */}
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

      {/* Main Counting Box */}
      <motion.div
        key={questionIndex}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[32px] sm:rounded-[40px] border-4 border-[#FFD54F] shadow-xl p-5 sm:p-8"
      >
        {/* Instruction Badge */}
        <div className="text-center mb-5">
          <div className={`inline-block px-4 py-1.5 rounded-full bg-[#FFF9C4] border-2 border-[#FFD54F] font-black text-base sm:text-xl mb-1.5 shadow-2xs lowercase ${titleColor}`}>
            {text.howManyQuestion(currentItemName)}
          </div>
          <p className={`text-xs sm:text-sm font-bold lowercase ${instructionColor}`}>
            {language === 'id'
              ? 'sentuh benda di bawah untuk menghitung, lalu klik angka yang sesuai!'
              : 'touch items below to count, then click the matching number!'}
          </p>
        </div>

        {/* Objects Area */}
        <div
          role="region"
          aria-label="area benda untuk dihitung"
          tabIndex={0}
          className="min-h-[180px] sm:min-h-[220px] p-5 sm:p-7 rounded-[28px] bg-[#FFFBEB] border-4 border-dashed border-[#FFD54F] flex flex-wrap items-center justify-center gap-3.5 sm:gap-5 mb-3.5 focus:outline-hidden"
        >
          {Array.from({ length: currentQuestion.targetNumber }).map((_, idx) => {
            const isTapped = countedIndices.includes(idx);
            const badgeNumber = countedIndices.indexOf(idx) + 1;
            return (
              <motion.button
                key={idx}
                id={`btn-count-item-${idx}`}
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => handleObjectTap(idx)}
                className={`relative w-18 h-18 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl flex items-center justify-center text-4xl sm:text-5xl shadow-md transition-all cursor-pointer select-none ${
                  isTapped
                    ? 'bg-[#FFEBEE] border-4 border-[#FFCDD2] ring-4 ring-[#FFD54F]'
                    : 'bg-white border-4 border-[#FFECB3] hover:border-[#FFD54F]'
                }`}
                title={`benda ke-${idx + 1}`}
              >
                <span>{currentQuestion.emoji}</span>
                {isTapped && (
                  <span className="absolute -top-2.5 -right-2.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#4CAF50] text-white border-2 border-white text-xs sm:text-sm font-black flex items-center justify-center shadow-md">
                    {badgeNumber}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Helper bar */}
        <div className="flex items-center justify-between gap-3 mb-5 px-1">
          <div className={`flex items-center gap-1.5 text-xs sm:text-sm font-black lowercase ${instructionColor}`}>
            <Hand className="w-4 h-4 text-[#FF7043]" />
            <span>
              {language === 'id' ? 'sudah disentuh: ' : 'tapped: '}
              <strong>{countedIndices.length}</strong> / <strong>{currentQuestion.targetNumber}</strong>
            </span>
          </div>

          <button
            id="btn-help-count"
            onClick={handleCountAll}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF9C4] border-2 border-[#FFD54F] text-[#5D4037] hover:bg-[#FFECB3] active:scale-95 text-xs font-black transition-transform cursor-pointer shadow-2xs lowercase"
            title={text.helpCount}
          >
            <Lightbulb className="w-3.5 h-3.5 text-[#FFB300] fill-[#FFB300]" />
            <span>{text.helpCount}</span>
          </button>
        </div>

        {/* Number Options strictly lowercase */}
        <div className="mb-3">
          <div className={`text-center font-black text-sm sm:text-base mb-3 lowercase ${instructionColor}`}>
            👇 {language === 'id' ? 'klik angka yang sesuai jumlahnya:' : 'click the number that matches:'}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4 max-w-xl mx-auto">
            {currentQuestion.options.map((opt, optIdx) => {
              const isSelected = selectedAnswer === opt;
              const theme = buttonThemes[optIdx % buttonThemes.length];
              const isHinted = showHint && opt === currentQuestion.targetNumber;

              let customStyle = `${theme.bg} border-b-6 ${theme.border} ${theme.text}`;

              if (isSelected) {
                if (feedback === 'correct') {
                  customStyle = 'bg-[#4CAF50] border-b-6 border-[#2E7D32] text-white ring-4 ring-[#81C784] scale-105 shadow-xl';
                } else if (feedback === 'incorrect') {
                  customStyle = 'bg-[#FF8A65] border-b-6 border-[#E64A19] text-white ring-4 ring-rose-300';
                }
              } else if (isHinted) {
                customStyle += ' ring-4 ring-[#FFD54F] animate-bounce';
              }

              return (
                <button
                  key={opt}
                  id={`btn-count-opt-${opt}`}
                  onClick={() => handleOptionClick(opt)}
                  className={`h-20 sm:h-24 rounded-2xl sm:rounded-3xl font-black text-4xl sm:text-5xl shadow-md transition-all active:translate-y-1 active:border-b-4 cursor-pointer flex items-center justify-center hover:scale-105 select-none ${customStyle}`}
                  title={`${opt}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback Bar strictly lowercase */}
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
                  <div className="w-12 h-12 rounded-2xl bg-[#4CAF50] text-white flex items-center justify-center shadow-md shrink-0">
                    <CheckCircle2 className="w-7 h-7 stroke-[3]" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-[#FF8A65] text-white flex items-center justify-center shadow-md shrink-0">
                    <RotateCcw className="w-7 h-7 stroke-[3]" />
                  </div>
                )}
                <div>
                  <div className="font-black text-lg sm:text-xl lowercase">
                    {feedback === 'correct'
                      ? (language === 'id' ? 'hebat sekali! benar! 🎉' : 'great job! correct! 🎉')
                      : (language === 'id' ? 'yuk coba lagi! 😊' : 'let\'s try again! 😊')}
                  </div>
                  <div className="text-xs sm:text-sm font-bold opacity-90 lowercase">
                    {feedback === 'correct'
                      ? (language === 'id'
                        ? `jumlah ${currentItemName} tepat ada ${currentQuestion.targetNumber}.`
                        : `there are exactly ${currentQuestion.targetNumber} ${currentItemName}.`)
                      : (language === 'id'
                        ? `jumlahnya ada ${currentQuestion.targetNumber}. ayo klik angka ${currentQuestion.targetNumber}!`
                        : `there are ${currentQuestion.targetNumber}. let's click number ${currentQuestion.targetNumber}!`)}
                  </div>
                </div>
              </div>

              {feedback === 'correct' ? (
                <button
                  id="btn-count-next-q"
                  onClick={handleNextQuestion}
                  className="h-14 px-8 rounded-2xl bg-[#4CAF50] border-b-6 border-[#2E7D32] active:translate-y-1 active:border-b-2 text-white font-black text-base shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-transform shrink-0 hover:scale-105 lowercase"
                >
                  <span>{text.nextButton}</span>
                  <ArrowRight className="w-5 h-5 stroke-[3]" />
                </button>
              ) : (
                <button
                  id="btn-count-retry"
                  onClick={handleCountAll}
                  className="h-11 px-5 rounded-2xl bg-[#FFD54F] border-b-4 border-[#FBC02D] text-[#5D4037] font-black text-xs sm:text-sm active:translate-y-1 active:border-b-0 flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs shrink-0 lowercase"
                >
                  <Lightbulb className="w-4 h-4 text-[#5D4037]" />
                  <span>{text.helpCount}</span>
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
