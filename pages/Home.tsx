import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, BookOpen, CheckSquare, ChevronLeft, ArrowUpRight, Flag } from 'lucide-react';
import { usePrayer } from '../contexts/PrayerContext';

const Home: React.FC = () => {
  const { nextPrayer, loading } = usePrayer();
  const [offset, setOffset] = useState(0);
  const [quranProgress, setQuranProgress] = useState(0);
  const [lastRead, setLastRead] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Load Quran Progress
    const savedProgress = localStorage.getItem('quran_progress');
    if (savedProgress) setQuranProgress(parseFloat(savedProgress));

    const savedLastRead = localStorage.getItem('quran_last_read');
    if (savedLastRead) setLastRead(JSON.parse(savedLastRead));

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="space-y-6 md:space-y-10 animate-slide-up pb-4">
      {/* Hero Section */}
      <section className="relative w-full h-[40vh] min-h-[350px] md:h-[500px] rounded-[2rem] overflow-hidden shadow-2xl border border-slate-700/30 group">
        <div 
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80')] bg-cover bg-center will-change-transform scale-105"
          style={{ transform: `translateY(${offset * 0.4}px)` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#020617]/40 via-transparent to-transparent"></div>
        
        <div className="absolute bottom-0 w-full p-6 md:p-12 flex flex-col items-center text-center h-full justify-end pb-10 md:pb-16 z-10">
          <div className="animate-fade-in delay-100">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold-500/10 text-gold-300 rounded-full text-xs md:text-sm font-bold mb-6 border border-gold-500/20 backdrop-blur-md shadow-lg shadow-gold-900/20">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse"></span>
              رمضان 1446
            </span>
            <h1 className="text-4xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-6 drop-shadow-2xl leading-tight tracking-tight">
              أهلاً بـ <span className="text-transparent bg-clip-text bg-gradient-to-b from-gold-300 to-gold-600">شهر الخير</span>
            </h1>
            <p className="text-base md:text-xl text-slate-200 mb-8 max-w-2xl mx-auto font-light opacity-90 leading-relaxed hidden sm:block">
              دليلك المتكامل للعبادة والصيام في هذا الشهر الفضيل. 
              <br className="hidden md:block"/>
              نسأل الله أن يتقبل منا ومنكم صالح الأعمال.
            </p>
          </div>
          
          <Link to="/tracker" className="group relative overflow-hidden bg-white text-navy-950 font-bold py-4 px-10 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-105 flex items-center gap-3">
            <span className="relative z-10">ابدأ رحلتك اليوم</span>
            <ChevronLeft size={20} className="transition-transform group-hover:-translate-x-1 relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-gold-200 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
        </div>
      </section>

      {/* Quick Actions Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* Next Prayer */}
        <div className="glass-panel p-6 rounded-[1.5rem] flex items-center justify-between border border-white/5 hover:border-gold-500/30 transition-all duration-300 hover:bg-slate-800/40 group relative overflow-hidden">
           <div className="absolute top-0 right-0 w-24 h-24 bg-gold-500/5 rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:bg-gold-500/10"></div>
           <div className="flex-1 relative z-10">
             <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gold-500"></div>
                <h3 className="text-slate-400 text-sm font-medium">الصلاة القادمة</h3>
             </div>
             {loading ? (
               <div className="h-10 w-32 bg-slate-700/50 animate-pulse rounded-lg"></div>
             ) : (
               <div className="flex flex-col">
                 <div className="flex items-baseline gap-3">
                   <span className="text-3xl font-bold text-white tracking-tight">{nextPrayer?.name}</span>
                   <span className="text-xl text-gold-400 font-mono font-medium">{nextPrayer?.time}</span>
                 </div>
                 {nextPrayer?.timeLeft && (
                   <span className="text-xs text-slate-500 mt-2 font-medium bg-slate-800/80 px-2.5 py-1 rounded-md w-fit border border-slate-700/50">
                     المتبقي: <span className="text-gold-400">{nextPrayer.timeLeft}</span>
                   </span>
                 )}
               </div>
             )}
           </div>
           <div className="w-14 h-14 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center text-gold-400 border border-slate-700 shadow-lg group-hover:scale-110 transition-transform duration-300">
             <Clock size={26} strokeWidth={1.5} />
           </div>
        </div>

        {/* Daily Verse / Quran Progress */}
        <Link to="/quran" className="glass-panel p-6 rounded-[1.5rem] flex items-center justify-between border border-white/5 hover:border-blue-500/30 transition-all duration-300 hover:bg-slate-800/40 group relative overflow-hidden">
           <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:bg-blue-500/10"></div>
           <div className="relative z-10 w-full">
             <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                <h3 className="text-slate-400 text-sm font-medium">{quranProgress > 0 ? "متابعة الختمة" : "ورد اليوم"}</h3>
             </div>
             
             {quranProgress > 0 && lastRead ? (
               <div className="space-y-3">
                  <div className="flex items-baseline justify-between w-full">
                     <span className="text-xl font-bold text-white tracking-tight truncate ml-2">{lastRead.surahName}</span>
                     <span className="text-sm text-blue-400 font-mono">آية {lastRead.ayahNumber}</span>
                  </div>
                  <div className="w-full bg-slate-700/50 h-1.5 rounded-full overflow-hidden">
                     <div className="h-full bg-blue-500 rounded-full" style={{ width: `${quranProgress}%` }}></div>
                  </div>
                  <p className="text-[10px] text-slate-400 flex justify-between">
                    <span>مكتمل: {quranProgress.toFixed(1)}%</span>
                  </p>
               </div>
             ) : (
               <>
                 <span className="text-3xl font-bold text-white block mb-2 tracking-tight">سورة البقرة</span>
                 <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                   تابع القراءة <ArrowUpRight size={12} />
                 </p>
               </>
             )}
           </div>
           {!quranProgress && (
             <div className="w-14 h-14 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center text-blue-400 border border-slate-700 shadow-lg group-hover:scale-110 transition-transform duration-300 shrink-0 mr-4">
               <BookOpen size={26} strokeWidth={1.5} />
             </div>
           )}
        </Link>

        {/* Fasting Status */}
        <Link to="/tracker" className="glass-panel p-6 rounded-[1.5rem] flex items-center justify-between border border-white/5 hover:border-green-500/30 transition-all duration-300 hover:bg-slate-800/40 group relative overflow-hidden">
           <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:bg-green-500/10"></div>
           <div className="relative z-10">
             <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                <h3 className="text-slate-400 text-sm font-medium">تتبع الصيام</h3>
             </div>
             <span className="text-3xl font-bold text-white block mb-2 tracking-tight">اليوم 1</span>
             <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
               سجل حالتك <CheckSquare size={12} />
             </p>
           </div>
           <div className="w-14 h-14 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center text-green-400 border border-slate-700 shadow-lg group-hover:scale-110 transition-transform duration-300">
             <CheckSquare size={26} strokeWidth={1.5} />
           </div>
        </Link>
      </section>

      {/* Featured Quote */}
      <section className="glass-panel p-8 md:p-12 rounded-[2rem] text-center relative overflow-hidden border-t border-slate-700/30 bg-gradient-to-b from-slate-800/20 to-slate-900/40">
        <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
          <BookOpen size={250} />
        </div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-1 bg-gold-500/30 rounded-full mb-8"></div>
          <p className="text-2xl md:text-4xl font-serif leading-loose md:leading-[2.2] text-slate-100 max-w-4xl mx-auto drop-shadow-lg">
            "شَهْرُ رَمَضَانَ الَّذِي أُنزِلَ فِيهِ الْقُرْآنُ هُدًى لِّلنَّاسِ وَبَيِّنَاتٍ مِّنَ الْهُدَىٰ وَالْفُرْقَانِ"
          </p>
          <div className="mt-8 flex items-center justify-center gap-4 opacity-80">
             <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold-500/50"></div>
             <p className="text-gold-400 font-bold text-sm md:text-base tracking-wide uppercase">سورة البقرة - 185</p>
             <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold-500/50"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;