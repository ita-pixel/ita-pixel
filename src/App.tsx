import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ActivityType, ActivityResult } from './types';
import { Header } from './components/Header';
import { MainMenu } from './components/MainMenu';
import { LearnNumbers } from './components/LearnNumbers';
import { CountingActivity } from './components/CountingActivity';
import { SequenceActivity } from './components/SequenceActivity';
import { GuessQuantityActivity } from './components/GuessQuantityActivity';
import { CompletionScreen } from './components/CompletionScreen';
import { sound } from './utils/audio';

export default function App() {
  const [currentActivity, setCurrentActivity] = useState<ActivityType>('menu');
  const [lastActivity, setLastActivity] = useState<ActivityType>('count');
  const [activityResult, setActivityResult] = useState<ActivityResult | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [restartKey, setRestartKey] = useState<number>(0);

  const handleSelectActivity = (activity: ActivityType) => {
    setCurrentActivity(activity);
    if (activity !== 'menu' && activity !== 'finished') {
      setLastActivity(activity);
    }
  };

  const handleCompleteActivity = (result: ActivityResult) => {
    setActivityResult(result);
    setCurrentActivity('finished');
  };

  const handleRestart = () => {
    setRestartKey((prev) => prev + 1);
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    sound.soundEnabled = !nextMuted;
    sound.speechEnabled = !nextMuted;
    if (!nextMuted) {
      sound.playPop();
    }
  };

  const handlePlayAgain = () => {
    setCurrentActivity(lastActivity);
    setRestartKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#FFFBEB] flex flex-col font-sans text-[#5D4037] selection:bg-[#FFD54F]">
      {/* Top Navigation */}
      <Header
        currentActivity={currentActivity}
        onNavigateHome={() => setCurrentActivity('menu')}
        onRestart={handleRestart}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Main Content View with Smooth Page Transitions */}
      <main className="flex-1 flex flex-col justify-center items-center py-4">
        <AnimatePresence mode="wait">
          {currentActivity === 'menu' && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <MainMenu onSelectActivity={handleSelectActivity} />
            </motion.div>
          )}

          {currentActivity === 'learn' && (
            <motion.div
              key={`learn-${restartKey}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <LearnNumbers onGoToCount={() => handleSelectActivity('count')} />
            </motion.div>
          )}

          {currentActivity === 'count' && (
            <motion.div
              key={`count-${restartKey}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <CountingActivity onComplete={handleCompleteActivity} />
            </motion.div>
          )}

          {currentActivity === 'sequence' && (
            <motion.div
              key={`sequence-${restartKey}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <SequenceActivity onComplete={handleCompleteActivity} />
            </motion.div>
          )}

          {currentActivity === 'guess' && (
            <motion.div
              key={`guess-${restartKey}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <GuessQuantityActivity onComplete={handleCompleteActivity} />
            </motion.div>
          )}

          {currentActivity === 'finished' && (
            <motion.div
              key="finished"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <CompletionScreen
                result={activityResult}
                onPlayAgain={handlePlayAgain}
                onGoHome={() => setCurrentActivity('menu')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer in theme style */}
      <footer className="h-16 px-8 flex items-center justify-between bg-white border-t-2 border-[#FFECB3]">
        <div className="flex gap-3 items-center">
          <div className="flex -space-x-2">
            <div className="w-7 h-7 rounded-full bg-[#FFCDD2] border-2 border-white"></div>
            <div className="w-7 h-7 rounded-full bg-[#C8E6C9] border-2 border-white"></div>
            <div className="w-7 h-7 rounded-full bg-[#BBDEFB] border-2 border-white"></div>
          </div>
          <span className="text-xs sm:text-sm font-bold text-[#795548]">
            Belajar Membilang Angka 1–10 • TK A (Usia 4–6 Tahun)
          </span>
        </div>
        <div className="text-xs font-black text-[#FFB300] uppercase tracking-wider hidden sm:inline">
          🌟 Sangat Bagus & Menyenangkan!
        </div>
      </footer>
    </div>
  );
}
