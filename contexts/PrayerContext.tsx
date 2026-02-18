import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { PrayerTimes } from '../types';
import { getPrayerTimes } from '../services/prayerService';

interface PrayerContextType {
  prayerTimes: PrayerTimes | null;
  dateInfo: any;
  nextPrayer: { name: string; time: string; timeLeft: string } | null;
  loading: boolean;
  error: string | null;
  adhanEnabled: boolean;
  setAdhanEnabled: (enabled: boolean) => void;
  locationName: string;
}

const PrayerContext = createContext<PrayerContextType | undefined>(undefined);

export const PrayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [dateInfo, setDateInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adhanEnabled, setAdhanEnabled] = useState(true);
  const [locationName, setLocationName] = useState('جاري تحديد الموقع...');
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string; timeLeft: string } | null>(null);
  const [playedPrayers, setPlayedPrayers] = useState<string[]>([]);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize Audio - Using a reliable HTTPS CDN for Adhan (Makkah Adhan)
    audioRef.current = new Audio('https://cdn.aladhan.com/audio/adhans/mv.mp3');
    // Preload to check for errors early
    audioRef.current.load();
  }, []);

  const playAdhan = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Audio play failed:", error);
          // Auto-play policy might block audio without user interaction
        });
      }
      
      // Show desktop notification if available
      if (Notification.permission === 'granted') {
        new Notification('حان الآن موعد الصلاة', {
          body: 'حي على الصلاة، حي على الفلاح',
          icon: '/icon.png'
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
    }
  }, []);

  useEffect(() => {
    const fetchTimes = async () => {
      let lat = 21.3891; // Mecca default
      let lng = 39.8579;
      let locName = 'مكة المكرمة';
      
      if ("geolocation" in navigator) {
         try {
           const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
             navigator.geolocation.getCurrentPosition(resolve, reject);
           });
           lat = pos.coords.latitude;
           lng = pos.coords.longitude;
           locName = 'موقعك الحالي';
         } catch (e) {
           console.log("Geolocation blocked or failed");
           setError("تعذر تحديد الموقع، يتم عرض توقيت مكة المكرمة");
         }
      } else {
        setError("المتصفح لا يدعم تحديد الموقع");
      }
      
      setLocationName(locName);
      const data = await getPrayerTimes(lat, lng);
      
      if (data) {
        // Clean up time strings to ensure HH:MM format (remove timezone if present)
        const cleanTimings = Object.entries(data.timings).reduce((acc, [key, val]) => {
          acc[key] = (val as string).split(' ')[0];
          return acc;
        }, {} as any);

        setPrayerTimes(cleanTimings);
        setDateInfo(data.date);
      } else {
        setError("فشل في الاتصال بخدمة المواقيت");
      }
      setLoading(false);
    };

    fetchTimes();
  }, []);

  // Timer for Adhan and Next Prayer
  useEffect(() => {
    if (!prayerTimes) return;

    const checkTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const currentTime = `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;

      // Check for Adhan
      if (adhanEnabled) {
        const prayersToCheck = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
        
        prayersToCheck.forEach((prayerKey) => {
            const time = prayerTimes[prayerKey];
            if (time === currentTime) {
               // Create a unique key for today+prayer to avoid repeating
               const todayStr = now.toDateString();
               const playKey = `${todayStr}-${prayerKey}`;
               
               if (!playedPrayers.includes(playKey)) {
                  playAdhan();
                  setPlayedPrayers(prev => [...prev, playKey]);
               }
            }
        });
      }

      updateNextPrayer(prayerTimes);
    };

    const interval = setInterval(checkTime, 1000);
    checkTime(); // Initial run

    return () => clearInterval(interval);
  }, [prayerTimes, adhanEnabled, playedPrayers, playAdhan]);

  const updateNextPrayer = (timings: PrayerTimes) => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      
      const prayers = [
        { name: 'الفجر', key: 'Fajr', time: timings.Fajr },
        { name: 'الشروق', key: 'Sunrise', time: timings.Sunrise },
        { name: 'الظهر', key: 'Dhuhr', time: timings.Dhuhr },
        { name: 'العصر', key: 'Asr', time: timings.Asr },
        { name: 'المغرب', key: 'Maghrib', time: timings.Maghrib },
        { name: 'العشاء', key: 'Isha', time: timings.Isha },
      ];

      let found = null;
      
      for(let p of prayers) {
         const [h, m] = p.time.split(':').map(Number);
         const pMinutes = h * 60 + m;
         
         if (pMinutes > currentMinutes) {
            const diff = pMinutes - currentMinutes;
            const hLeft = Math.floor(diff / 60);
            const mLeft = diff % 60;
            
            let timeLeftStr = '';
            if (hLeft > 0) timeLeftStr += `${hLeft} ساعة `;
            if (mLeft > 0) timeLeftStr += `${mLeft} دقيقة`;
            if (hLeft === 0 && mLeft === 0) timeLeftStr = 'الآن';

            found = {
                name: p.name,
                time: p.time,
                timeLeft: timeLeftStr
            };
            break;
         }
      }
      
      if (!found) {
         // Next is Fajr tomorrow
         found = { name: 'الفجر', time: timings.Fajr, timeLeft: 'غداً' };
      }
      setNextPrayer(found);
  };

  return (
    <PrayerContext.Provider value={{ 
      prayerTimes, 
      dateInfo,
      nextPrayer, 
      loading, 
      error,
      adhanEnabled, 
      setAdhanEnabled, 
      locationName 
    }}>
      {children}
    </PrayerContext.Provider>
  );
};

export const usePrayer = () => {
  const context = useContext(PrayerContext);
  if (!context) throw new Error("usePrayer must be used within PrayerProvider");
  return context;
};