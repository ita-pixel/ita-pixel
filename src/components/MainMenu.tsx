import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Hand, Train, Target, Sparkles, Smile } from 'lucide-react';
import { ActivityType, NUMBER_DATA } from '../types';
import { sound } from '../utils/audio';

interface MainMenuProps {
  onSelectActivity: (activity: ActivityType) => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onSelectActivity }) => {
  const activities = [
    {
      id: 'learn' as ActivityType,
      title: '1. BELAJAR ANGKA',
      subtitle: 'Mengenal simbol angka 1-10 & hitung benda',
      icon: BookOpen,
      badge: 'Mulai di Sini',
      btnColor: 'bg-[#4FC3F7] border-b-6 sm:border-b-8 border-[#0288D1]',
      cardBorder: 'border-[#4FC3F7]',
      accentBg: 'bg-[#E1F5FE]',
      textColor: 'text-[#0277BD]',
      accentEmoji: '📖',
      description: 'Lihat angka besar dan sentuh benda untuk berhitung!',
    },
    {
      id: 'count' as ActivityType,
      title: '2. AKTIVITAS MEMBILANG',
      subtitle: 'Sentuh setiap benda dan pilih angkanya',
      icon: Hand,
      badge: 'Latihan Hitung',
      btnColor: 'bg-[#81C784] border-b-6 sm:border-b-8 border-[#2E7D32]',
      cardBorder: 'border-[#81C784]',
      accentBg: 'bg-[#E8F5E9]',
      textColor: 'text-[#2E7D32]',
      accentEmoji: '🖐️',
      description: 'Hitung benda 1 sampai 10 satu per satu!',
    },
    {
      id: 'sequence' as ActivityType,
      title: '3. URUTKAN ANGKA',
      subtitle: 'Lengkapi gerbong kereta angka yang hilang',
      icon: Train,
      badge: 'Kereta Angka',
      btnColor: 'bg-[#9575CD] border-b-6 sm:border-b-8 border-[#512DA8]',
      cardBorder: 'border-[#9575CD]',
      accentBg: 'bg-[#EDE7F6]',
      textColor: 'text-[#512DA8]',
      accentEmoji: '🚂',
      description: 'Tebak angka berikutnya untuk menjalankan kereta!',
    },
    {
      id: 'guess' as ActivityType,
      title: '4. TEBAK JUMLAH',
      subtitle: 'Lihat kelompok benda dan tebak jumlahnya',
      icon: Target,
      badge: 'Tantangan Ceria',
      btnColor: 'bg-[#FF8A65] border-b-6 sm:border-b-8 border-[#E64A19]',
      cardBorder: 'border-[#FF8A65]',
      accentBg: 'bg-[#FBE9E7]',
      textColor: 'text-[#D84315]',
      accentEmoji: '🎯',
      description: 'Berapa banyak bendanya? Pilih angka yang tepat!',
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-4 sm:px-8">
      {/* Hero Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-[#FFF9C4] border-2 border-[#FFD54F] text-[#5D4037] font-black text-sm sm:text-base mb-3 shadow-xs">
          <Sparkles className="w-4 h-4 text-[#FBC02D] fill-[#FBC02D]" />
          <span>TK A (USIA 4–6 TAHUN)</span>
          <Sparkles className="w-4 h-4 text-[#FBC02D] fill-[#FBC02D]" />
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-[#5D4037] tracking-tight mb-2 uppercase">
          Belajar Membilang Angka 1–10
        </h1>
        <p className="text-base sm:text-lg text-[#795548] font-bold max-w-xl mx-auto">
          Ayo bermain sambil mengenal dan membilang angka bersama-sama! Pilih aktivitas di bawah ini:
        </p>

        {/* 1 to 10 Tactile Strip */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mt-5">
          {NUMBER_DATA.map((item) => (
            <button
              key={item.num}
              id={`btn-number-strip-${item.num}`}
              onClick={() => {
                sound.unlockAudio();
                sound.speakNumber(item.num, item.word);
                onSelectActivity('learn');
              }}
              className={`w-10 h-12 sm:w-12 sm:h-14 ${item.btnBg} border-b-4 ${item.btnBorderBottom} rounded-2xl active:translate-y-1 active:border-b-0 text-white font-black text-xl sm:text-2xl flex items-center justify-center shadow-md transition-all cursor-pointer hover:scale-105`}
              title={`Belajar angka ${item.num}`}
            >
              {item.num}
            </button>
          ))}
        </div>
      </motion.div>

      {/* 4 Big Activity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
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
              className={`group text-left p-6 sm:p-7 rounded-[36px] bg-white border-4 ${act.cardBorder} shadow-xl hover:shadow-2xl transition-all duration-200 hover:-translate-y-1 active:translate-y-0 active:scale-[0.99] cursor-pointer flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className={`w-14 h-14 rounded-2xl ${act.btnColor} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}>
                    <Icon className="w-7 h-7 stroke-[3]" />
                  </div>
                  <span className="px-3.5 py-1 rounded-full text-xs sm:text-sm font-black bg-[#FFF9C4] border-2 border-[#FFD54F] text-[#5D4037] uppercase tracking-wider">
                    {act.badge}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{act.accentEmoji}</span>
                  <h2 className={`text-xl sm:text-2xl font-black ${act.textColor} tracking-tight`}>
                    {act.title}
                  </h2>
                </div>

                <p className="text-sm sm:text-base font-bold text-[#5D4037] mb-2">
                  {act.subtitle}
                </p>

                <p className="text-xs sm:text-sm font-semibold text-[#795548]/90">
                  {act.description}
                </p>
              </div>

              {/* 3D Action Button inside card */}
              <div className="mt-5 pt-4 border-t-2 border-[#FFECB3] flex items-center justify-between">
                <span className="text-xs sm:text-sm font-bold text-[#795548] flex items-center gap-1.5">
                  <span className="text-base">⭐</span> Seru & Mudah
                </span>
                <div className={`px-5 py-2.5 rounded-2xl ${act.btnColor} text-white font-black text-sm active:translate-y-1 active:border-b-2 shadow-sm transition-all flex items-center gap-1.5`}>
                  <span>MULAI</span>
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
        transition={{ delay: 0.4 }}
        className="mt-8 p-5 rounded-[28px] bg-[#FFECB3] border-2 border-[#FFD54F] flex items-start gap-4 text-[#5D4037] shadow-sm"
      >
        <Smile className="w-7 h-7 text-[#FF7043] shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm font-bold leading-relaxed">
          <span className="font-black text-[#5D4037] uppercase">Tips untuk Guru & Orang Tua: </span>
          Ajak anak menyebutkan nama angka dengan lantang dan menyentuh setiap benda di layar saat menghitung untuk melatih koordinasi mata, tangan, dan pemahaman konsep jumlah 1–10.
        </div>
      </motion.div>
    </div>
  );
};
