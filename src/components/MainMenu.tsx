import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Hand, Train, Target, Sparkles, Smile } from 'lucide-react';
import { ActivityType, NUMBER_DATA, Language, AgeGroup } from '../types';
import { sound } from '../utils/audio';
import { t, getAgeTitleColor, getAgeInstructionColor } from '../utils/translations';

interface MainMenuProps {
  onSelectActivity: (activity: ActivityType) => void;
  language: Language;
  ageGroup: AgeGroup;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onSelectActivity,
  language,
  ageGroup,
}) => {
  const text = t[language];
  const titleColor = getAgeTitleColor(ageGroup);
  const instructionColor = getAgeInstructionColor(ageGroup);

  const activities = [
    {
      id: 'learn' as ActivityType,
      title: language === 'id' ? '1. belajar angka' : '1. learn numbers',
      subtitle:
        language === 'id'
          ? 'mengenal simbol angka 1–10 & hitung benda'
          : 'recognize numbers 1–10 & count items',
      icon: BookOpen,
      badge: language === 'id' ? 'mulai di sini' : 'start here',
      btnColor: 'bg-[#4FC3F7] border-b-6 border-[#0288D1]',
      cardBorder: 'border-[#4FC3F7]',
      accentEmoji: '📖',
      description:
        language === 'id'
          ? 'lihat angka besar dan sentuh benda untuk berhitung!'
          : 'see big numbers and tap items to count!',
    },
    {
      id: 'count' as ActivityType,
      title: language === 'id' ? '2. aktivitas membilang' : '2. counting activity',
      subtitle:
        language === 'id'
          ? 'sentuh setiap benda dan pilih angkanya'
          : 'touch every item and pick the number',
      icon: Hand,
      badge: language === 'id' ? 'latihan hitung' : 'counting drill',
      btnColor: 'bg-[#81C784] border-b-6 border-[#2E7D32]',
      cardBorder: 'border-[#81C784]',
      accentEmoji: '🖐️',
      description:
        language === 'id'
          ? 'hitung benda 1 sampai 10 satu per satu!'
          : 'count items 1 through 10 one by one!',
    },
    {
      id: 'sequence' as ActivityType,
      title: language === 'id' ? '3. urutkan angka' : '3. order numbers',
      subtitle:
        language === 'id'
          ? 'lengkapi gerbong kereta angka yang hilang'
          : 'complete the missing number on the train',
      icon: Train,
      badge: language === 'id' ? 'kereta angka' : 'number train',
      btnColor: 'bg-[#9575CD] border-b-6 border-[#512DA8]',
      cardBorder: 'border-[#9575CD]',
      accentEmoji: '🚂',
      description:
        language === 'id'
          ? 'tebak angka berikutnya untuk menjalankan kereta!'
          : 'guess the next number to get the train rolling!',
    },
    {
      id: 'guess' as ActivityType,
      title: language === 'id' ? '4. tebak jumlah' : '4. guess quantity',
      subtitle:
        language === 'id'
          ? 'lihat kelompok benda dan tebak jumlahnya'
          : 'look at the group of items and guess how many',
      icon: Target,
      badge: language === 'id' ? 'tantangan ceria' : 'fun challenge',
      btnColor: 'bg-[#FF8A65] border-b-6 border-[#E64A19]',
      cardBorder: 'border-[#FF8A65]',
      accentEmoji: '🎯',
      description:
        language === 'id'
          ? 'berapa banyak bendanya? pilih angka yang tepat!'
          : 'how many items are there? pick the right number!',
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto py-5 px-4 sm:px-8">
      {/* Hero Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-7"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF9C4] border-2 border-[#FFD54F] text-[#5D4037] font-bold text-xs sm:text-sm mb-3 shadow-2xs lowercase">
          <Sparkles className="w-4 h-4 text-[#FBC02D]" />
          <span>{text.targetBadge}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-white font-black text-[#5D4037]">
            {ageGroup === '4-5' ? (language === 'id' ? 'mode font merah' : 'red font mode') : (language === 'id' ? 'mode font hitam' : 'black font mode')}
          </span>
        </div>

        <h1 className={`text-2xl sm:text-4xl md:text-5xl font-black tracking-tight mb-2 lowercase ${titleColor}`}>
          {text.appTitle}
        </h1>
        <p className={`text-sm sm:text-base font-bold max-w-xl mx-auto lowercase ${instructionColor}`}>
          {text.appSubtitle}
        </p>

        {/* 1 to 10 Tactile Strip */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mt-5">
          {NUMBER_DATA.map((item) => (
            <button
              key={item.num}
              id={`btn-number-strip-${item.num}`}
              onClick={() => {
                sound.unlockAudio();
                const word = language === 'id' ? item.wordId : item.wordEn;
                sound.speakNumber(item.num, word, language);
                onSelectActivity('learn');
              }}
              className={`w-10 h-12 sm:w-12 sm:h-14 ${item.btnBg} border-b-4 ${item.btnBorderBottom} rounded-2xl active:translate-y-1 active:border-b-0 text-white font-black text-xl sm:text-2xl flex items-center justify-center shadow-md transition-all cursor-pointer hover:scale-105`}
              title={`${language === 'id' ? 'belajar angka' : 'learn number'} ${item.num}`}
            >
              {item.num}
            </button>
          ))}
        </div>
      </motion.div>

      {/* 4 Big Activity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-7">
        {activities.map((act, index) => {
          const Icon = act.icon;
          return (
            <motion.button
              key={act.id}
              id={`btn-menu-${act.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              onClick={() => {
                sound.unlockAudio();
                sound.playPop(index);
                onSelectActivity(act.id);
              }}
              className={`group text-left p-5 sm:p-7 rounded-[32px] bg-white border-4 ${act.cardBorder} shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1 active:translate-y-0 active:scale-[0.99] cursor-pointer flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-3.5">
                  <div className={`w-13 h-13 rounded-2xl ${act.btnColor} text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}>
                    <Icon className="w-6 h-6 stroke-[3]" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FFF9C4] border-2 border-[#FFD54F] text-[#5D4037] lowercase">
                    {act.badge}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-2xl">{act.accentEmoji}</span>
                  <h2 className={`text-xl sm:text-2xl font-black tracking-tight lowercase ${titleColor}`}>
                    {act.title}
                  </h2>
                </div>

                <p className={`text-sm sm:text-base font-bold mb-1.5 lowercase ${instructionColor}`}>
                  {act.subtitle}
                </p>

                <p className="text-xs sm:text-sm font-semibold text-[#795548]/90 lowercase">
                  {act.description}
                </p>
              </div>

              {/* Action Button inside card */}
              <div className="mt-4 pt-3.5 border-t-2 border-[#FFECB3] flex items-center justify-between">
                <span className="text-xs font-bold text-[#795548] flex items-center gap-1.5 lowercase">
                  <span>⭐</span> {language === 'id' ? 'seru & mudah' : 'fun & easy'}
                </span>
                <div className={`px-4 py-2 rounded-xl ${act.btnColor} text-white font-black text-xs active:translate-y-1 active:border-b-2 shadow-xs transition-all flex items-center gap-1.5 lowercase`}>
                  <span>{text.startBtn}</span>
                  <span>➜</span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Guide Card */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-7 p-4 sm:p-5 rounded-[24px] bg-[#FFECB3] border-2 border-[#FFD54F] flex items-start gap-3.5 text-[#5D4037] shadow-xs"
      >
        <Smile className="w-6 h-6 text-[#FF7043] shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm font-bold leading-relaxed lowercase">
          <span className={`font-black ${titleColor}`}>{text.tipTitle}</span>
          <span>{text.tipText}</span>
        </div>
      </motion.div>
    </div>
  );
};
