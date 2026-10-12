import { Language, AgeGroup } from '../types';

export interface Translations {
  appTitle: string;
  appSubtitle: string;
  targetBadge: string;
  backToMenu: string;
  testSound: string;
  soundActive: string;
  soundMuted: string;
  helpCount: string;
  countTitle: string;
  learnTitle: string;
  sequenceTitle: string;
  guessTitle: string;
  finishTitle: string;
  playAgain: string;
  tipTitle: string;
  tipText: string;
  startBtn: string;
  correctPraise: string;
  tryAgainEncouragement: string;
  howManyQuestion: (itemName: string) => string;
  sequenceQuestion: string;
  nextNumberInstruction: string;
  nextButton: string;
  restartButton: string;
  allDoneCelebration: string;
  starScore: (score: number, total: number) => string;
  voiceReadyMsg: string;
  age4to5Label: string;
  age5to6Label: string;
  touchEveryItem: string;
  itemsLabel: string;
}

export const t: Record<Language, Translations> = {
  id: {
    appTitle: 'belajar membilang angka 1–10',
    appSubtitle: 'ayo bermain sambil mengenal dan membilang angka bersama-sama!',
    targetBadge: 'tk a (usia 4–6 tahun)',
    backToMenu: 'menu',
    testSound: 'tes suara',
    soundActive: 'suara aktif',
    soundMuted: 'suara mati',
    helpCount: 'bantu hitung',
    countTitle: 'aktivitas membilang',
    learnTitle: 'belajar angka',
    sequenceTitle: 'urutkan angka',
    guessTitle: 'tebak jumlah',
    finishTitle: 'selesai bermain!',
    playAgain: 'main lagi',
    tipTitle: 'tips untuk pendamping: ',
    tipText: 'ajak anak menyebutkan nama angka dengan lantang dan menyentuh setiap benda di layar saat menghitung.',
    startBtn: 'mulai',
    correctPraise: 'hebat sekali! jawabanmu benar!',
    tryAgainEncouragement: 'coba lagi ya, kamu pasti bisa!',
    howManyQuestion: (itemName: string) => `berapa jumlah ${itemName}?`,
    sequenceQuestion: 'angka berapa yang hilang di kereta?',
    nextNumberInstruction: 'pilih angka berikutnya untuk melanjutkan urutan:',
    nextButton: 'lanjut',
    restartButton: 'ulang',
    allDoneCelebration: 'luar biasa! kamu pintar sekali berhitung!',
    starScore: (score: number, total: number) => `kamu berhasil menjawab ${score} dari ${total} soal!`,
    voiceReadyMsg: 'halo! suara anak sudah aktif dan siap belajar!',
    age4to5Label: 'usia 4–5 tahun',
    age5to6Label: 'usia 5–6 tahun',
    touchEveryItem: 'sentuh benda untuk menghitung:',
    itemsLabel: 'benda',
  },
  en: {
    appTitle: 'learn counting numbers 1–10',
    appSubtitle: 'let\'s play and count numbers together!',
    targetBadge: 'kindergarten (ages 4–6)',
    backToMenu: 'menu',
    testSound: 'sound test',
    soundActive: 'sound on',
    soundMuted: 'sound off',
    helpCount: 'help count',
    countTitle: 'counting activity',
    learnTitle: 'learn numbers',
    sequenceTitle: 'order numbers',
    guessTitle: 'guess quantity',
    finishTitle: 'all done!',
    playAgain: 'play again',
    tipTitle: 'tips for parents & teachers: ',
    tipText: 'encourage the child to say the number aloud and tap each item on the screen while counting.',
    startBtn: 'start',
    correctPraise: 'great job! that is correct!',
    tryAgainEncouragement: 'try again, you can do it!',
    howManyQuestion: (itemName: string) => `how many ${itemName} are there?`,
    sequenceQuestion: 'which number is missing in the train?',
    nextNumberInstruction: 'pick the next number to continue the line:',
    nextButton: 'next',
    restartButton: 'restart',
    allDoneCelebration: 'awesome! you are super good at counting!',
    starScore: (score: number, total: number) => `you got ${score} out of ${total} right!`,
    voiceReadyMsg: 'hello! kid voice is ready and excited to play!',
    age4to5Label: 'ages 4–5',
    age5to6Label: 'ages 5–6',
    touchEveryItem: 'tap each item to count:',
    itemsLabel: 'items',
  },
};

/**
 * Return style classes based on AgeGroup requirements:
 * 4-5 years: red text for titles & instructions
 * 5-6 years: black text for titles & instructions
 */
export function getAgeTitleColor(ageGroup: AgeGroup): string {
  return ageGroup === '4-5' ? 'text-[#DC2626]' : 'text-[#111827]';
}

export function getAgeInstructionColor(ageGroup: AgeGroup): string {
  return ageGroup === '4-5' ? 'text-[#B91C1C]' : 'text-[#374151]';
}

export function getAgeBorderColor(ageGroup: AgeGroup): string {
  return ageGroup === '4-5' ? 'border-[#EF4444]' : 'border-[#111827]';
}
