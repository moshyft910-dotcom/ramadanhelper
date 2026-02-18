import React, { useState, useEffect, useRef } from 'react';
import { 
  PlayCircle, PauseCircle, Bookmark, Search, Trash2, 
  ArrowRight, Loader2, StopCircle, SkipForward, SkipBack,
  Settings, Type, User, X, Repeat1, Flag
} from 'lucide-react';
import { BookmarkedAyah, Surah, Ayah } from '../types';
import { getAllSurahs, getSurahDetails } from '../services/quranService';
import { AVAILABLE_RECITERS } from '../constants';

interface LastRead {
  surahNumber: number;
  surahName: string;
  ayahNumber: number; // The Ayah number within the Surah (1-based)
  timestamp: number;
}

const Quran: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSurah, setActiveSurah] = useState<number | null>(null);
  const [bookmarks, setBookmarks] = useState<BookmarkedAyah[]>([]);
  const [lastRead, setLastRead] = useState<LastRead | null>(null);
  const [showBookmarksView, setShowBookmarksView] = useState(false);
  const [selectedReciter, setSelectedReciter] = useState('ar.alafasy');
  const [fontSize, setFontSize] = useState(2); // 1 = small, 2 = medium, 3 = large

  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingContent, setLoadingContent] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [totalAyahsInQuran, setTotalAyahsInQuran] = useState(6236);

  // Audio State
  const [currentAyahIndex, setCurrentAyahIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRepeatEnabled, setIsRepeatEnabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const activeAyahRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const isRepeatEnabledRef = useRef(false);

  useEffect(() => {
    isRepeatEnabledRef.current = isRepeatEnabled;
  }, [isRepeatEnabled]);

  useEffect(() => {
    // Load saved data
    const savedBookmarks = localStorage.getItem('quran_bookmarks');
    if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));

    const savedReciter = localStorage.getItem('quran_reciter');
    if (savedReciter) setSelectedReciter(savedReciter);

    const savedLastRead = localStorage.getItem('quran_last_read');
    if (savedLastRead) setLastRead(JSON.parse(savedLastRead));

    const fetchList = async () => {
      setLoadingList(true);
      const data = await getAllSurahs();
      setSurahs(data);
      
      // Calculate total Ayahs
      const total = data.reduce((acc, s) => acc + s.numberOfAyahs, 0);
      setTotalAyahsInQuran(total || 6236);
      
      setLoadingList(false);
    };
    fetchList();
  }, []);

  useEffect(() => {
    if (activeSurah) {
      stopAudio();
      const fetchContent = async () => {
        setLoadingContent(true);
        const data = await getSurahDetails(activeSurah, selectedReciter);
        setAyahs(data);
        setLoadingContent(false);
      };
      fetchContent();
    } else {
      setAyahs([]);
      stopAudio();
    }
  }, [activeSurah, selectedReciter]);

  // Scroll to active Ayah when it changes or when opening a Surah from Last Read
  useEffect(() => {
    if ((currentAyahIndex !== null || (activeSurah && lastRead?.surahNumber === activeSurah)) && activeAyahRef.current) {
      const timer = setTimeout(() => {
        activeAyahRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'nearest'
        });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentAyahIndex, ayahs, activeSurah]); // Added dependencies to trigger on load

  useEffect(() => {
    return () => stopAudio();
  }, []);

  // Progress Calculation and Persistence
  useEffect(() => {
    if (!lastRead || surahs.length === 0) return;
    
    let totalRead = 0;
    for (let i = 0; i < lastRead.surahNumber - 1; i++) {
      totalRead += surahs[i].numberOfAyahs;
    }
    totalRead += lastRead.ayahNumber;
    
    const progress = Math.min(100, (totalRead / totalAyahsInQuran) * 100);
    localStorage.setItem('quran_progress', progress.toString());
  }, [lastRead, surahs, totalAyahsInQuran]);

  const changeReciter = (reciterId: string) => {
    setSelectedReciter(reciterId);
    localStorage.setItem('quran_reciter', reciterId);
    setShowSettings(false);
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    setIsPlaying(false);
    setCurrentAyahIndex(null);
  };

  const playAyah = (index: number) => {
    if (index >= ayahs.length || index < 0) {
      stopAudio();
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audioUrl = ayahs[index].audio;
    if (!audioUrl) return;

    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    
    audio.onended = () => {
      if (isRepeatEnabledRef.current) {
        playAyah(index);
      } else {
        playAyah(index + 1);
      }
    };

    audio.onerror = (e) => {
      console.error("Audio playback error", e);
      setIsPlaying(false);
    };

    audio.play().then(() => {
      setIsPlaying(true);
      setCurrentAyahIndex(index);
    }).catch(err => {
      console.error("Playback failed", err);
      setIsPlaying(false);
    });
  };

  const togglePlayPause = () => {
    if (currentAyahIndex !== null && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    } else {
      playAyah(0);
    }
  };

  const toggleBookmark = (surahNum: number, surahName: string, ayahNum: number, text: string) => {
    const id = `${surahNum}:${ayahNum}`;
    const exists = bookmarks.find(b => b.id === id);

    let newBookmarks;
    if (exists) {
      newBookmarks = bookmarks.filter(b => b.id !== id);
    } else {
      newBookmarks = [...bookmarks, {
        id,
        surahNumber: surahNum,
        surahName,
        ayahNumber: ayahNum,
        text,
        timestamp: Date.now()
      }];
    }
    setBookmarks(newBookmarks);
    localStorage.setItem('quran_bookmarks', JSON.stringify(newBookmarks));
  };

  const updateLastRead = (surahNum: number, surahName: string, ayahNum: number) => {
    const newLastRead = {
      surahNumber: surahNum,
      surahName: surahName,
      ayahNumber: ayahNum,
      timestamp: Date.now()
    };
    setLastRead(newLastRead);
    localStorage.setItem('quran_last_read', JSON.stringify(newLastRead));
  };

  const isBookmarked = (surahNum: number, ayahNum: number) => {
    return bookmarks.some(b => b.id === `${surahNum}:${ayahNum}`);
  };

  const filteredSurahs = surahs.filter(s => 
    s.name.includes(searchTerm) || s.englishName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeSurahData = activeSurah ? surahs.find(s => s.number === activeSurah) : null;

  const getFontSizeClass = () => {
    switch(fontSize) {
      case 1: return 'text-xl md:text-2xl leading-[2.2]';
      case 3: return 'text-3xl md:text-5xl leading-[2.8]';
      default: return 'text-2xl md:text-3xl leading-[2.5]';
    }
  };

  // Progress Calculation Helper
  const calculateProgress = () => {
    if (!lastRead || surahs.length === 0) return 0;
    
    let totalRead = 0;
    for (let i = 0; i < lastRead.surahNumber - 1; i++) {
      totalRead += surahs[i].numberOfAyahs;
    }
    totalRead += lastRead.ayahNumber;
    
    return Math.min(100, (totalRead / totalAyahsInQuran) * 100);
  };

  const progressPercentage = calculateProgress();

  return (
    <div className="h-full flex flex-col relative animate-fade-in pb-safe">
      {/* Top Controls */}
      <div className="flex flex-col gap-6 mb-6">
         {/* Header & Search */}
         <div className="flex flex-col md:flex-row justify-between items-center gap-4 sticky top-0 z-20">
            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
              <h2 className="text-3xl font-bold text-white">القرآن الكريم</h2>
              
              <div className="bg-slate-800 p-1 rounded-xl flex border border-slate-700">
                <button 
                  onClick={() => setShowBookmarksView(false)}
                  className={`px-4 py-2 rounded-lg text-sm transition-all ${!showBookmarksView ? 'bg-gold-500 text-navy-950 font-bold shadow-sm' : 'text-slate-400 hover:text-white'}`}
                >
                  السور
                </button>
                <button 
                  onClick={() => setShowBookmarksView(true)}
                  className={`px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${showBookmarksView ? 'bg-gold-500 text-navy-950 font-bold shadow-sm' : 'text-slate-400 hover:text-white'}`}
                >
                  <Bookmark size={14} />
                  <span className="hidden sm:inline">المحفوظات</span>
                </button>
              </div>
            </div>

            {!showBookmarksView && (
              <div className="relative w-full md:w-80">
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="بحث عن سورة..." 
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-3 pr-11 pl-4 text-white focus:outline-none focus:border-gold-500 transition-colors text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            )}
         </div>

         {/* Progress & Last Read Card */}
         {!showBookmarksView && lastRead && (
           <div className="glass-panel p-6 rounded-3xl border border-gold-500/20 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
             
             <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
               <div className="w-full md:w-auto flex-1">
                 <div className="flex justify-between items-center mb-2">
                   <h3 className="text-gold-400 font-bold flex items-center gap-2">
                     <Flag size={18} />
                     متابعة الختمة
                   </h3>
                   <span className="text-2xl font-bold text-white">{progressPercentage.toFixed(1)}%</span>
                 </div>
                 <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                   <div 
                     className="h-full bg-gradient-to-r from-gold-600 to-gold-400 rounded-full transition-all duration-1000 ease-out relative"
                     style={{ width: `${progressPercentage}%` }}
                   >
                     <div className="absolute top-0 left-0 w-full h-full bg-white/20 animate-pulse"></div>
                   </div>
                 </div>
                 <p className="text-xs text-slate-400 mt-2 text-right">
                   بناءً على آخر موضع توقفت عنده
                 </p>
               </div>

               <div className="w-full md:w-auto border-t md:border-t-0 md:border-r border-slate-700 pt-4 md:pt-0 md:pr-6 flex flex-col items-center md:items-start gap-2">
                 <p className="text-slate-400 text-sm">توقفت عند:</p>
                 <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-white">{lastRead.surahName}</span>
                    <span className="text-gold-500 font-mono">آية {lastRead.ayahNumber}</span>
                 </div>
                 <button 
                   onClick={() => {
                     setActiveSurah(lastRead.surahNumber);
                     // We rely on the useEffect for scrolling to lastRead position
                   }}
                   className="mt-1 px-6 py-2 bg-slate-800 hover:bg-gold-500/10 hover:text-gold-400 text-white rounded-full text-sm transition-all border border-slate-600 hover:border-gold-500/50 flex items-center gap-2"
                 >
                   متابعة القراءة <ArrowRight size={14} className="rotate-180" />
                 </button>
               </div>
             </div>
           </div>
         )}
      </div>

      {showBookmarksView ? (
        <div className="grid grid-cols-1 gap-4 overflow-y-auto pb-24 custom-scrollbar">
          {bookmarks.length === 0 ? (
            <div className="text-center py-20 text-slate-500 bg-slate-800/20 rounded-3xl border border-dashed border-slate-700">
              <Bookmark size={48} className="mx-auto mb-4 opacity-20" />
              <p>لا توجد آيات محفوظة حتى الآن</p>
              <button onClick={() => setShowBookmarksView(false)} className="text-gold-400 mt-2 hover:underline">تصفح السور</button>
            </div>
          ) : (
            bookmarks.sort((a,b) => b.timestamp - a.timestamp).map((b) => (
              <div key={b.id} className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-gold-500/30 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                     <span className="bg-gold-500/10 text-gold-400 text-xs px-2.5 py-1 rounded-md border border-gold-500/20 font-bold">
                       {b.surahName} - آية {b.ayahNumber}
                     </span>
                  </div>
                  <button 
                    onClick={() => toggleBookmark(b.surahNumber, b.surahName, b.ayahNumber, b.text)}
                    className="text-slate-500 hover:text-red-400 transition-colors p-1"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <p className="text-xl md:text-2xl font-serif leading-loose text-white text-right mb-6">
                  {b.text}
                </p>
                <button 
                  onClick={() => {
                    setActiveSurah(b.surahNumber);
                    setShowBookmarksView(false);
                  }}
                  className="text-sm text-slate-400 hover:text-gold-400 flex items-center gap-1 transition-colors"
                >
                  الذهاب للسورة <ArrowRight size={14} className="rotate-180" />
                </button>
              </div>
            ))
          )}
        </div>
      ) : (
        <>
          {loadingList ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-10 h-10 text-gold-400 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 overflow-y-auto pb-24 custom-scrollbar">
              {filteredSurahs.map((surah) => (
                <div 
                  key={surah.number}
                  onClick={() => setActiveSurah(surah.number)}
                  className="glass-panel p-5 rounded-2xl hover:bg-slate-800/60 transition-all cursor-pointer group border border-slate-800 hover:border-gold-500/30 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-slate-800 flex items-center justify-center font-bold text-lg text-gold-500 relative border border-slate-700 shadow-inner">
                       {surah.number}
                     </div>
                     <div>
                       <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-gold-400 transition-colors">{surah.name}</h3>
                       <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                         <span className={`w-1.5 h-1.5 rounded-full ${surah.revelationType === 'Meccan' ? 'bg-gold-500' : 'bg-green-500'}`}></span>
                         {surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'} • {surah.numberOfAyahs} آية
                       </span>
                     </div>
                  </div>
                  <div className="opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                      <PlayCircle size={28} className="text-gold-500" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Surah Detail View Overlay */}
      {activeSurah && activeSurahData && (
        <div className="fixed inset-0 z-50 bg-[#020617] md:bg-black/80 flex items-center justify-center p-0 md:p-6 backdrop-blur-md animate-fade-in">
           <div className="bg-[#020617] md:bg-slate-900 w-full md:max-w-4xl h-full md:h-[90vh] md:rounded-[2rem] overflow-hidden relative border-0 md:border border-slate-700 flex flex-col shadow-2xl">
             
             {/* Header */}
             <div className="bg-navy-950/90 p-4 md:p-5 border-b border-slate-800 flex justify-between items-center z-20 sticky top-0 backdrop-blur-xl">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      setActiveSurah(null);
                      setAyahs([]);
                    }}
                    className="p-2.5 bg-slate-800 rounded-full text-white hover:bg-slate-700 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="text-center absolute left-1/2 transform -translate-x-1/2">
                  <h2 className="text-xl md:text-2xl font-serif text-gold-400 font-bold drop-shadow-sm">
                    {activeSurahData.name}
                  </h2>
                </div>
                
                <div className="flex items-center gap-2 relative">
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className={`p-2.5 rounded-full transition-colors ${showSettings ? 'bg-gold-500 text-navy-900' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                  >
                    <Settings size={20} />
                  </button>
                  
                  {/* Settings Dropdown */}
                  {showSettings && (
                    <div className="absolute top-14 left-0 w-72 bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-2xl z-50 animate-fade-in">
                      <h3 className="text-gold-400 font-bold mb-3 flex items-center gap-2 text-sm">
                        <User size={16} /> القارئ
                      </h3>
                      <div className="space-y-1 mb-5 max-h-48 overflow-y-auto custom-scrollbar bg-slate-900/50 rounded-xl p-1">
                        {AVAILABLE_RECITERS.map(reciter => (
                          <button
                            key={reciter.id}
                            onClick={() => changeReciter(reciter.id)}
                            className={`w-full text-right px-3 py-2.5 rounded-lg text-sm transition-colors ${selectedReciter === reciter.id ? 'bg-gold-500 text-navy-900 font-bold' : 'text-slate-300 hover:bg-slate-800'}`}
                          >
                            {reciter.name}
                          </button>
                        ))}
                      </div>
                      
                      <div className="h-px bg-slate-700 mb-4"></div>
                      
                      <h3 className="text-gold-400 font-bold mb-3 flex items-center gap-2 text-sm">
                        <Type size={16} /> حجم الخط
                      </h3>
                      <div className="flex gap-2 bg-slate-900 p-1.5 rounded-xl">
                        {[1, 2, 3].map(size => (
                           <button
                             key={size}
                             onClick={() => setFontSize(size)}
                             className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${fontSize === size ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                           >
                             {size === 1 ? 'صغير' : size === 2 ? 'متوسط' : 'كبير'}
                           </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
             </div>

             {/* Content */}
             <div 
               ref={scrollContainerRef}
               className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar pb-40 md:pb-32 bg-slate-900/30 scroll-smooth"
             >
                {loadingContent ? (
                   <div className="flex justify-center items-center h-full">
                     <div className="text-center">
                       <Loader2 className="w-12 h-12 text-gold-400 animate-spin mx-auto mb-4" />
                       <p className="text-slate-400">جاري تحميل الآيات...</p>
                     </div>
                   </div>
                ) : (
                  <>
                    {activeSurah !== 1 && activeSurah !== 9 && (
                      <div className="text-center mb-16 mt-8 relative">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-24 bg-gold-500/5 blur-3xl rounded-full"></div>
                        <span className="relative font-serif text-2xl md:text-4xl text-gold-500 drop-shadow-md">
                          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                        </span>
                      </div>
                    )}
                    
                    <div className="space-y-6 md:space-y-8 max-w-3xl mx-auto">
                      {ayahs.map((ayah, index) => {
                        const ayahNum = ayah.numberInSurah;
                        const bookmarked = isBookmarked(activeSurah, ayahNum);
                        const isCurrent = currentAyahIndex === index;
                        const isLastRead = lastRead?.surahNumber === activeSurah && lastRead?.ayahNumber === ayahNum;
                        
                        return (
                          <div 
                            key={index}
                            ref={(isCurrent || isLastRead) ? activeAyahRef : null}
                            className={`
                              group relative p-5 md:p-8 rounded-3xl transition-all duration-500 border
                              ${isCurrent 
                                ? 'bg-slate-800/80 border-gold-500/40 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-xl scale-[1.01] z-10' 
                                : isLastRead
                                  ? 'bg-gold-900/20 border-gold-500/20 shadow-lg'
                                  : 'hover:bg-slate-800/30 border-transparent hover:border-slate-700/50'}
                            `}
                          >
                            {/* Last Read Marker */}
                            {isLastRead && (
                              <div className="absolute -top-3 right-4 bg-gold-500 text-navy-900 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                                <Flag size={10} fill="currentColor" /> توقفت هنا
                              </div>
                            )}

                            <div className="flex flex-col gap-6">
                              <div className="flex justify-between items-center">
                                  {/* Actions */}
                                  <div className="flex gap-1 md:gap-2">
                                    <button 
                                      onClick={() => updateLastRead(activeSurah, activeSurahData?.name || '', ayahNum)}
                                      className={`p-2 rounded-full transition-colors ${isLastRead ? 'text-gold-400' : 'text-slate-500 hover:text-gold-400 opacity-50 group-hover:opacity-100'}`}
                                      title="حفظ مكان التوقف"
                                    >
                                      <Flag size={18} fill={isLastRead ? "currentColor" : "none"} />
                                    </button>
                                    
                                    <button 
                                      onClick={() => toggleBookmark(activeSurah, activeSurahData?.name || '', ayahNum, ayah.text)}
                                      className={`p-2 rounded-full transition-colors ${bookmarked ? 'text-blue-400' : 'text-slate-500 hover:text-blue-400 opacity-50 group-hover:opacity-100'}`}
                                      title="حفظ في المفضلة"
                                    >
                                      <Bookmark size={18} fill={bookmarked ? "currentColor" : "none"} />
                                    </button>

                                    <button 
                                      onClick={() => playAyah(index)}
                                      className="md:hidden p-2 text-slate-500 hover:text-gold-400 opacity-50 hover:opacity-100"
                                    >
                                       <PlayCircle size={20} />
                                    </button>
                                  </div>

                                  {/* Number Badge */}
                                  <div className={`
                                    w-10 h-10 rounded-full border flex items-center justify-center text-sm font-bold font-mono shrink-0 transition-all duration-500
                                    ${isCurrent 
                                      ? 'border-gold-500 bg-gold-500 text-navy-900 shadow-lg shadow-gold-500/30 scale-110' 
                                      : 'border-slate-700 text-slate-500 bg-slate-800/50'}
                                  `}>
                                    {ayahNum}
                                  </div>
                              </div>
                              
                              {/* Text */}
                              <p 
                                onClick={() => playAyah(index)}
                                className={`
                                  font-serif text-right dir-rtl transition-all duration-500 cursor-pointer
                                  ${getFontSizeClass()}
                                  ${isCurrent ? 'text-gold-100 drop-shadow-sm' : 'text-slate-200 hover:text-slate-100'}
                                `}
                              >
                                {ayah.text}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
             </div>

             {/* Sticky Bottom Player - Safe Area Aware */}
             <div className="absolute bottom-0 left-0 w-full bg-navy-950/90 backdrop-blur-xl border-t border-slate-800/60 pb-safe pt-4 px-4 z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                <div className="max-w-3xl mx-auto flex items-center justify-between gap-3 md:gap-4 mb-2">
                   <div className="hidden md:block w-1/4">
                      <p className="text-xs text-slate-500 mb-1">القارئ الحالي</p>
                      <p className="text-sm font-bold text-gold-400 truncate">
                        {AVAILABLE_RECITERS.find(r => r.id === selectedReciter)?.name}
                      </p>
                   </div>

                   <div className="flex items-center justify-center gap-4 md:gap-8 flex-1">
                      {/* Repeat Button */}
                      <button
                        onClick={() => setIsRepeatEnabled(!isRepeatEnabled)}
                        className={`transition-colors p-2 rounded-full ${isRepeatEnabled ? 'text-gold-400 bg-gold-500/10 relative' : 'text-slate-500 hover:text-white'}`}
                        title="تكرار الآية"
                      >
                        <Repeat1 size={20} />
                        {isRepeatEnabled && <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-gold-400 rounded-full shadow-[0_0_5px_rgba(234,179,8,1)]"></span>}
                      </button>

                      <button 
                        onClick={() => playAyah((currentAyahIndex || 0) - 1)}
                        className="text-slate-400 hover:text-white transition-colors p-2 active:scale-95"
                        disabled={!currentAyahIndex || currentAyahIndex === 0}
                      >
                        <SkipForward size={26} className="rotate-180" />
                      </button>

                      <button 
                        onClick={togglePlayPause}
                        className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center text-navy-950 hover:shadow-lg hover:shadow-gold-500/30 hover:scale-105 transition-all active:scale-95 shadow-md border-2 border-navy-900/20"
                      >
                        {isPlaying ? <PauseCircle size={30} fill="currentColor" className="opacity-90" /> : <PlayCircle size={30} fill="currentColor" className="ml-1 opacity-90" />}
                      </button>
                      
                      <button 
                        onClick={() => playAyah((currentAyahIndex || 0) + 1)}
                        className="text-slate-400 hover:text-white transition-colors p-2 active:scale-95"
                      >
                         <SkipBack size={26} className="rotate-180" />
                      </button>
                   </div>

                   <div className="w-16 md:w-1/4 text-left pl-2">
                      {currentAyahIndex !== null && (
                        <div>
                          <p className="text-[10px] md:text-xs text-slate-500">الآية</p>
                          <p className="text-lg md:text-xl font-bold text-white font-mono">{ayahs[currentAyahIndex]?.numberInSurah}</p>
                        </div>
                      )}
                   </div>
                </div>
             </div>

           </div>
        </div>
      )}
    </div>
  );
};

export default Quran;