import { PrayerTimes } from "../types";

export const getPrayerTimes = async (lat: number, lng: number): Promise<{ timings: PrayerTimes; date: any } | null> => {
  try {
    const date = new Date();
    const timestamp = Math.floor(date.getTime() / 1000);
    
    const response = await fetch(
      `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${lat}&longitude=${lng}&method=4` // Method 4 is Umm al-Qura
    );
    
    const data = await response.json();
    if (data.code === 200) {
      return {
        timings: data.data.timings,
        date: data.data.date
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching prayer times:", error);
    return null;
  }
};