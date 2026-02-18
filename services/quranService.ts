import { Surah, Ayah } from '../types';

const BASE_URL = 'https://api.alquran.cloud/v1';

export const getAllSurahs = async (): Promise<Surah[]> => {
  try {
    const response = await fetch(`${BASE_URL}/surah`);
    const data = await response.json();
    if (data.code === 200) {
      return data.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching surahs:", error);
    return [];
  }
};

export const getSurahDetails = async (surahNumber: number, audioEdition: string = 'ar.alafasy'): Promise<Ayah[]> => {
  try {
    // Fetch text (quran-uthmani) and audio (variable)
    const response = await fetch(`${BASE_URL}/surah/${surahNumber}/editions/quran-uthmani,${audioEdition}`);
    const data = await response.json();
    if (data.code === 200 && data.data.length >= 2) {
      const textData = data.data[0];
      const audioData = data.data[1];
      
      return textData.ayahs.map((ayah: any, index: number) => {
        // Ensure HTTPS for audio to prevent mixed content errors
        let audioUrl = audioData.ayahs[index].audio;
        if (audioUrl && audioUrl.startsWith('http:')) {
          audioUrl = audioUrl.replace('http:', 'https:');
        }

        return {
          ...ayah,
          audio: audioUrl,
          audioSecondary: audioData.ayahs[index].audioSecondary
        };
      });
    }
    return [];
  } catch (error) {
    console.error("Error fetching surah details:", error);
    return [];
  }
};