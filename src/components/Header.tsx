import React, { useState } from 'react';
import { ArrowLeft, RotateCcw, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { ActivityType } from '../types';
import { sound } from '../utils/audio';

interface HeaderProps {
  currentActivity: ActivityType;
  onNavigateHome: () => void;
  onRestart?: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentActivity,
  onNavigateHome,
  onRestart,
  isMuted,
  onToggleMute,
}) => {
  const [justTestedSound, setJustTestedSound] = useState(false);

  const getTitle = () => {
    switch (currentActivity) {
      case 'learn':
        return { text: 'BELAJAR ANGKA 1-10', icon: '📖' };
      case 'count':
        return { text: 'AKTIVITAS MEMBILANG', icon: '🖐️' };
      case 'sequence':
        return { text: 'URUTKAN ANGKA', icon: '🚂' };
      case 'guess':
        return { text: 'TEBAK JUMLAH', icon: '🎯' };
      case 'finished':
        return { text: 'SELESAI BERMAIN', icon: '🌟' };
      default:
        return { text: 'AYO BERHITUNG!', icon: '🌈' };
    }
  };

  const titleInfo = getTitle();

  const handleSoundButtonClick = () => {
    sound.unlockAudio();
    if (isMuted) {
      // Unmute & test
      onToggleMute();
      setJustTestedSound(true);
      setTimeout(() => {
        sound.testAudio();
        setJustTestedSound(false);
      }, 100);
    } else {
      // If already unmuted, clicking it can toggle or test sound
      onToggleMute();
    }
  };

  const handleTestSoundDirectly = () => {
    sound.unlockAudio();
    if (isMuted) {
      onToggleMute();
    }
    setJustTestedSound(true);
    sound.testAudio();
    setTimeout(() => setJustTestedSound(false), 2000);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FFD54F] border-b-4 border-[#FBC02D] shadow-sm px-4 sm:px-8 py-3.5">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Back / Brand Button */}
        <div className="flex items-center gap-3">
          {currentActivity !== 'menu' ? (
            <button
              id="btn-back-to-menu"
              onClick={() => {
                sound.unlockAudio();
                sound.playPop();
                onNavigateHome();
              }}
              className="h-12 px-4 sm:h-13 bg-[#FF7043] rounded-2xl flex items-center justify-center gap-2 border-b-4 border-[#D84315] active:translate-y-1 active:border-b-0 cursor-pointer shadow-xs transition-all text-white font-black text-base"
              title="Kembali ke Menu Utama"
            >
              <ArrowLeft className="w-6 h-6 stroke-[3]" />
              <span className="hidden sm:inline tracking-wide">MENU</span>
            </button>
          ) : (
            <div className="w-12 h-12 sm:w-13 sm:h-13 bg-[#FF7043] rounded-2xl flex items-center justify-center border-b-4 border-[#D84315] shadow-xs text-white text-2xl">
              🌈
            </div>
          )}

          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#5D4037] tracking-tight flex items-center gap-2">
            <span>{titleInfo.text}</span>
          </h1>
        </div>

        {/* Right: Actions (Restart, Test Sound & Audio toggle) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {onRestart && currentActivity !== 'menu' && currentActivity !== 'finished' && (
            <button
              id="btn-restart-activity"
              onClick={() => {
                sound.unlockAudio();
                sound.playPop();
                onRestart();
              }}
              className="h-12 px-3.5 sm:px-4 rounded-2xl bg-[#E0E0E0] border-b-4 border-[#BDBDBD] text-[#5D4037] font-black text-xs sm:text-base flex items-center gap-1.5 active:translate-y-1 active:border-b-0 transition-all cursor-pointer shadow-xs"
              title="Ulangi Aktivitas"
            >
              <RotateCcw className="w-4 h-4 stroke-[3]" />
              <span className="hidden sm:inline">ULANGI</span>
            </button>
          )}

          {/* Quick Sound Test Button */}
          <button
            id="btn-test-sound"
            onClick={handleTestSoundDirectly}
            className={`h-12 px-3 sm:px-4 rounded-2xl border-b-4 text-xs sm:text-sm font-black flex items-center gap-1.5 active:translate-y-1 active:border-b-0 transition-all cursor-pointer shadow-xs ${
              justTestedSound
                ? 'bg-[#FFEB3B] border-[#FBC02D] text-[#5D4037] scale-105'
                : 'bg-white/90 hover:bg-white border-[#E0E0E0] text-[#5D4037]'
            }`}
            title="Klik untuk mencoba suara audio"
          >
            <Sparkles className="w-4 h-4 text-[#FF7043]" />
            <span className="hidden md:inline">Tes Suara</span>
            <span className="md:hidden">🔊 Tes</span>
          </button>

          {/* Sound Mute / Unmute Toggle */}
          <button
            id="btn-toggle-sound"
            onClick={handleSoundButtonClick}
            className={`h-12 px-3.5 sm:px-4 rounded-2xl border-b-4 flex items-center justify-center gap-2 active:translate-y-1 active:border-b-0 transition-all cursor-pointer shadow-xs text-white font-black text-xs sm:text-sm ${
              isMuted
                ? 'bg-[#FF8A65] border-[#E64A19]'
                : 'bg-[#81C784] border-[#388E3C]'
            }`}
            title={isMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
            aria-label={isMuted ? 'Suara Mati' : 'Suara Nyala'}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-5 h-5 stroke-[2.5]" />
                <span className="hidden sm:inline">MUTE</span>
              </>
            ) : (
              <>
                <Volume2 className="w-5 h-5 stroke-[2.5]" />
                <span className="hidden sm:inline">AKTIF</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
