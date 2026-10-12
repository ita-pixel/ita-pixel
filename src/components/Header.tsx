import React, { useState } from 'react';
import { ArrowLeft, RotateCcw, Volume2, VolumeX, Sparkles, Globe, UserCheck } from 'lucide-react';
import { ActivityType, Language, AgeGroup } from '../types';
import { sound } from '../utils/audio';
import { t, getAgeTitleColor } from '../utils/translations';

interface HeaderProps {
  currentActivity: ActivityType;
  onNavigateHome: () => void;
  onRestart?: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  language: Language;
  onToggleLanguage: (lang: Language) => void;
  ageGroup: AgeGroup;
  onToggleAgeGroup: (age: AgeGroup) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentActivity,
  onNavigateHome,
  onRestart,
  isMuted,
  onToggleMute,
  language,
  onToggleLanguage,
  ageGroup,
  onToggleAgeGroup,
}) => {
  const [justTestedSound, setJustTestedSound] = useState(false);
  const text = t[language];

  const getTitleText = () => {
    switch (currentActivity) {
      case 'learn':
        return text.learnTitle;
      case 'count':
        return text.countTitle;
      case 'sequence':
        return text.sequenceTitle;
      case 'guess':
        return text.guessTitle;
      case 'finished':
        return text.finishTitle;
      default:
        return language === 'id' ? 'ayo berhitung!' : 'let\'s count!';
    }
  };

  const handleTestSoundDirectly = () => {
    sound.unlockAudio();
    if (isMuted) {
      onToggleMute();
    }
    setJustTestedSound(true);
    sound.testAudio(language);
    setTimeout(() => setJustTestedSound(false), 2000);
  };

  const handleSoundToggleClick = () => {
    sound.unlockAudio();
    onToggleMute();
  };

  const titleColor = getAgeTitleColor(ageGroup);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FFD54F] border-b-4 border-[#FBC02D] shadow-xs px-3 sm:px-6 py-2.5">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
        {/* Left: Back / Home & Title */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            {currentActivity !== 'menu' ? (
              <button
                id="btn-back-to-menu"
                onClick={() => {
                  sound.unlockAudio();
                  sound.playPop();
                  onNavigateHome();
                }}
                className="h-11 px-3.5 sm:h-12 bg-[#FF7043] rounded-2xl flex items-center justify-center gap-1.5 border-b-4 border-[#D84315] active:translate-y-1 active:border-b-0 cursor-pointer shadow-xs transition-all text-white font-black text-sm lowercase"
                title={text.backToMenu}
              >
                <ArrowLeft className="w-5 h-5 stroke-[3]" />
                <span>{text.backToMenu}</span>
              </button>
            ) : (
              <div className="w-11 h-11 sm:w-12 sm:h-12 bg-[#FF7043] rounded-2xl flex items-center justify-center border-b-4 border-[#D84315] shadow-xs text-white text-xl">
                🌈
              </div>
            )}

            <h1 className={`text-lg sm:text-2xl font-black tracking-tight flex items-center gap-1.5 lowercase ${titleColor}`}>
              <span>{getTitleText()}</span>
            </h1>
          </div>

          {/* Mobile Restart button if not in menu */}
          {onRestart && currentActivity !== 'menu' && currentActivity !== 'finished' && (
            <button
              id="btn-restart-mobile"
              onClick={() => {
                sound.unlockAudio();
                sound.playPop();
                onRestart();
              }}
              className="md:hidden h-10 px-2.5 rounded-xl bg-white border-b-3 border-[#BDBDBD] text-[#5D4037] font-bold text-xs flex items-center gap-1 active:translate-y-1 active:border-b-0 cursor-pointer lowercase"
              title={text.restartButton}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{text.restartButton}</span>
            </button>
          )}
        </div>

        {/* Right Toolbar: Age Group Toggle, Language Switcher, Sound Test & Mute */}
        <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 w-full md:w-auto justify-end">
          {/* Age Group Toggle: 4-5 thn (Merah) vs 5-6 thn (Hitam) */}
          <div className="flex items-center bg-white/90 p-1 rounded-2xl border-2 border-[#FBC02D] shadow-xs">
            <button
              id="btn-age-4-5"
              onClick={() => {
                sound.unlockAudio();
                sound.playPop();
                onToggleAgeGroup('4-5');
              }}
              className={`px-2.5 py-1 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 lowercase ${
                ageGroup === '4-5'
                  ? 'bg-[#EF4444] text-white shadow-xs'
                  : 'text-[#DC2626] hover:bg-red-50'
              }`}
              title="usia 4–5 tahun (font merah)"
            >
              <span className="w-2 h-2 rounded-full bg-current"></span>
              <span>4–5 th</span>
            </button>

            <button
              id="btn-age-5-6"
              onClick={() => {
                sound.unlockAudio();
                sound.playPop();
                onToggleAgeGroup('5-6');
              }}
              className={`px-2.5 py-1 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 lowercase ${
                ageGroup === '5-6'
                  ? 'bg-[#111827] text-white shadow-xs'
                  : 'text-[#111827] hover:bg-neutral-100'
              }`}
              title="usia 5–6 tahun (font hitam)"
            >
              <span className="w-2 h-2 rounded-full bg-current"></span>
              <span>5–6 th</span>
            </button>
          </div>

          {/* Bilingual Language Selector: ID / EN */}
          <div className="flex items-center bg-white/90 p-1 rounded-2xl border-2 border-[#FBC02D] shadow-xs">
            <button
              id="btn-lang-id"
              onClick={() => {
                sound.unlockAudio();
                sound.playPop();
                onToggleLanguage('id');
              }}
              className={`px-2 py-1 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 lowercase ${
                language === 'id'
                  ? 'bg-[#FF7043] text-white shadow-xs'
                  : 'text-[#5D4037] hover:bg-amber-50'
              }`}
              title="bahasa indonesia"
            >
              <span>🇮🇩</span>
              <span>id</span>
            </button>

            <button
              id="btn-lang-en"
              onClick={() => {
                sound.unlockAudio();
                sound.playPop();
                onToggleLanguage('en');
              }}
              className={`px-2 py-1 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 lowercase ${
                language === 'en'
                  ? 'bg-[#0288D1] text-white shadow-xs'
                  : 'text-[#5D4037] hover:bg-amber-50'
              }`}
              title="english"
            >
              <span>🇬🇧</span>
              <span>en</span>
            </button>
          </div>

          {/* Desktop Restart Button */}
          {onRestart && currentActivity !== 'menu' && currentActivity !== 'finished' && (
            <button
              id="btn-restart-desktop"
              onClick={() => {
                sound.unlockAudio();
                sound.playPop();
                onRestart();
              }}
              className="hidden md:flex h-10 px-3 rounded-xl bg-white border-b-3 border-[#BDBDBD] text-[#5D4037] font-bold text-xs items-center gap-1 active:translate-y-1 active:border-b-0 transition-all cursor-pointer lowercase shadow-xs"
              title={text.restartButton}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{text.restartButton}</span>
            </button>
          )}

          {/* Quick Sound Test (Child voice) */}
          <button
            id="btn-test-sound"
            onClick={handleTestSoundDirectly}
            className={`h-10 px-2.5 sm:px-3 rounded-xl border-b-3 text-xs font-black flex items-center gap-1 active:translate-y-1 active:border-b-0 transition-all cursor-pointer lowercase shadow-xs ${
              justTestedSound
                ? 'bg-[#FFEB3B] border-[#FBC02D] text-[#5D4037] scale-105'
                : 'bg-white/90 hover:bg-white border-[#E0E0E0] text-[#5D4037]'
            }`}
            title={text.testSound}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FF7043]" />
            <span>{text.testSound}</span>
          </button>

          {/* Sound Mute / Unmute Toggle */}
          <button
            id="btn-toggle-sound"
            onClick={handleSoundToggleClick}
            className={`h-10 px-3 rounded-xl border-b-3 flex items-center justify-center gap-1.5 active:translate-y-1 active:border-b-0 transition-all cursor-pointer shadow-xs text-white font-black text-xs lowercase ${
              isMuted
                ? 'bg-[#FF8A65] border-[#E64A19]'
                : 'bg-[#81C784] border-[#388E3C]'
            }`}
            title={isMuted ? text.soundMuted : text.soundActive}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-4 h-4 stroke-[2.5]" />
                <span className="hidden sm:inline">{text.soundMuted}</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 stroke-[2.5]" />
                <span className="hidden sm:inline">{text.soundActive}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
