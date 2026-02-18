export interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  [key: string]: string;
}

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  number: number;
  text: string;
  audio: string;
  audioSecondary?: string[];
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean | any;
}

export interface Reciter {
  id: string;
  name: string;
  englishName: string;
}

export interface AdhkarItem {
  id: number;
  category: 'morning' | 'evening' | 'prayer';
  text: string;
  count: number;
  repeat: number;
}

export interface FastingDay {
  day: number; // 1-30
  status: 'completed' | 'missed' | 'pending';
  note?: string;
}

export interface Recipe {
  id: number;
  title: string;
  category: 'iftar' | 'suhoor' | 'dessert';
  image?: string;
  description: string;
  ingredients: string[];
  isAiGenerated?: boolean;
}

export interface Story {
  id: number;
  title: string;
  content: string;
  source?: string;
  isAiGenerated?: boolean;
}

export interface BookmarkedAyah {
  id: string; // Format: "surahNum:ayahNum"
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  text: string;
  timestamp: number;
}

export enum ThemeMode {
  DARK = 'dark',
  LIGHT = 'light'
}

export type Language = 'ar' | 'en' | 'tr' | 'ur' | 'id' | 'fr';

export interface AppSettings {
  language: Language;
  enableNotifications: boolean;
  manualLocation: {
    lat: number;
    lng: number;
    enabled: boolean;
  };
  theme: ThemeMode;
}