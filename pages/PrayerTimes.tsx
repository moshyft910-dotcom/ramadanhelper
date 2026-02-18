import React from 'react';
import { usePrayer } from '../contexts/PrayerContext';
import { MapPin, Calendar, Loader2, Volume2, VolumeX } from 'lucide-react';

const PrayerTimes: React.FC = () => {
  const { prayerTimes, dateInfo, loading, error, locationName, adhanEnabled, setAdhanEnabled, nextPrayer } = usePrayer();

  if (loading) return <div className="flex h-full min-h-[50vh] items-center justify-center text-gold-400"><Loader2 className="animate-spin w-10 h-10" /></div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-6">
        <div>
           <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">مواقيت الصلاة</h2>
           <div className="flex items-center text-slate-400 gap-2 bg-slate-800/40 border border-slate-700/50 px-4 py-1.5 rounded-full w-fit backdrop-blur-sm">
             <MapPin size={16} className="text-gold-500" />
             <span className="text-sm font-medium">{locationName}</span>
           </div>
        </div>
        
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <button 
            onClick={() => setAdhanEnabled(!adhanEnabled)}
            className={`flex-1 md:flex-none px-5 py-3 rounded-xl flex items-center justify-center gap-2 border transition-all duration-300 ${adhanEnabled ? 'bg-gold-500/10 border-gold-500/40 text-gold-400 shadow-[0_0_15px_-5px_rgba(234,179,8,0.2)]' : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:bg-slate-800'}`}
          >
            {adhanEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            <span className="text-sm font-bold">{adhanEnabled ? 'الأذان مفعل' : 'صامت'}</span>
          </button>

          {dateInfo && (
            <div className="flex-1 md:flex-none glass-panel px-6 py-3 rounded-xl flex items-center justify-center gap-4 text-center min-w-[200px] border-slate-700/50">
               <Calendar className="text-gold-400 w-5 h-5" />
               <div className="text-right border-r border-slate-700 pr-4 mr-1">
                 <div className="font-bold text-white text-sm">{dateInfo.hijri.day} {dateInfo.hijri.month.ar} {dateInfo.hijri.year}</div>
                 <div className="text-[10px] text-slate-400 mt-0.5 font-mono">{dateInfo.gregorian.date}</div>
               </div>
            </div>
          )}
        </div>
      </div>

      {error && !prayerTimes && (
         <div className="bg-red-500/10 text-red-200 p-6 rounded-2xl border border-red-500/20 text-center backdrop-blur-sm">
           <p className="font-medium">{error}</p>
         </div>
      )}

      {/* Grid Layout */}
      {prayerTimes && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {[
            { name: 'الفجر', key: 'Fajr', time: prayerTimes.Fajr, icon: '🌅' },
            { name: 'الشروق', key: 'Sunrise', time: prayerTimes.Sunrise, icon: '☀️' },
            { name: 'الظهر', key: 'Dhuhr', time: prayerTimes.Dhuhr, icon: '🕛' },
            { name: 'العصر', key: 'Asr', time: prayerTimes.Asr, icon: '🌤️' },
            { name: 'المغرب', key: 'Maghrib', time: prayerTimes.Maghrib, icon: '🌇' },
            { name: 'العشاء', key: 'Isha', time: prayerTimes.Isha, icon: '🌙' },
          ].map((prayer, idx) => {
             const isNext = nextPrayer?.name === prayer.name;
             return (
               <div 
                key={idx} 
                className={`
                  glass-panel p-5 rounded-2xl flex flex-col items-center justify-between
                  hover:bg-slate-800/40 transition-all duration-300 cursor-default 
                  border hover:border-gold-500/40 group relative overflow-hidden h-36 md:h-44
                  ${isNext ? 'border-gold-500 bg-gold-500/5 shadow-[0_0_20px_-5px_rgba(234,179,8,0.15)] ring-1 ring-gold-500/20' : 'border-transparent'}
                `}
               >
                  <div className={`absolute top-0 left-0 w-full h-1 ${isNext ? 'bg-gold-500' : 'bg-transparent group-hover:bg-gold-500/30'} transition-colors`}></div>
                  
                  <span className="text-3xl mb-2 opacity-60 grayscale group-hover:grayscale-0 transition-all transform group-hover:scale-110 filter drop-shadow-lg">{prayer.icon}</span>
                  
                  <div className="text-center z-10">
                    <span className={`text-sm mb-1 block font-medium ${isNext ? 'text-gold-400' : 'text-slate-400'}`}>{prayer.name}</span>
                    <span className={`text-2xl md:text-3xl font-bold font-mono tracking-wider ${isNext ? 'text-white' : 'text-slate-200'}`}>{prayer.time}</span>
                  </div>

                  {isNext && (
                    <div className="mt-2 px-2 py-0.5 bg-gold-500/20 rounded text-[10px] text-gold-300 font-bold border border-gold-500/10">
                      القادمة
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
               </div>
             );
          })}
        </div>
      )}
      
      <div className="glass-panel p-8 md:p-12 rounded-[2rem] mt-8 border border-slate-700/30 bg-gradient-to-br from-slate-800/30 via-slate-900/40 to-black/20 text-center shadow-xl">
          <div className="w-12 h-1 bg-gold-500/30 rounded-full mb-6 mx-auto"></div>
          <h3 className="text-xl font-bold text-gold-400 mb-6 font-serif tracking-wide">دعاء دخول شهر رمضان</h3>
          <p className="text-xl md:text-2xl leading-loose font-serif text-slate-200 max-w-3xl mx-auto">
            "اللهم هذا شهر رمضان الذي أنزلت فيه القرآن، شهر الرحمة والمغفرة والعتق من النيران، اللهم اجعله لنا شهر خير وبركة، واغسل قلوبنا من الذنوب، وبلغنا ليلة القدر، واكتبنا من عتقائك من النار، واجعلنا فيه من الصائمين القائمين المقبولين."
          </p>
      </div>
    </div>
  );
};

export default PrayerTimes;