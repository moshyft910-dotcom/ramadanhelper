import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, BookOpen, Clock, Moon, CheckSquare, 
  Coffee, Settings, Menu, X, LogOut, GripVertical
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const { t, dir } = useLanguage();
  const { user, logout } = useAuth();

  // Draggable Badge Logic
  const [badgePosition, setBadgePosition] = useState<{x: number, y: number} | null>(null);
  const isDraggingRef = useRef(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!isDraggingRef.current) return;
      
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
      
      setBadgePosition({
        x: clientX - dragOffsetRef.current.x,
        y: clientY - dragOffsetRef.current.y
      });
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleMouseMove);
    window.addEventListener('touchend', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    if (badgeRef.current) {
        const rect = badgeRef.current.getBoundingClientRect();
        dragOffsetRef.current = {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
        
        // Initialize position if it's the first drag to prevent jumping
        if (!badgePosition) {
            setBadgePosition({ x: rect.left, y: rect.top });
        }
        
        isDraggingRef.current = true;
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const navItems = [
    { path: '/', label: t('home'), icon: Home },
    { path: '/prayer-times', label: t('prayerTimes'), icon: Clock },
    { path: '/quran', label: t('quran'), icon: BookOpen },
    { path: '/adhkar', label: t('adhkar'), icon: Moon },
    { path: '/tracker', label: t('tracker'), icon: CheckSquare },
    { path: '/stories', label: t('stories'), icon: Coffee },
    { path: '/settings', label: t('settings'), icon: Settings },
  ];

  // Items to show in bottom nav (Mobile)
  const bottomNavItems = [
    { path: '/', label: t('home'), icon: Home },
    { path: '/prayer-times', label: 'الصلاة', icon: Clock },
    { path: '/quran', label: 'القرآن', icon: BookOpen },
    { path: '/tracker', label: 'تتبع', icon: CheckSquare },
  ];

  return (
    <div className="h-screen w-full bg-[#020617] text-white font-sans flex relative overflow-hidden selection:bg-gold-500/30" dir={dir}>
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-gold-500/05 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-80 h-80 bg-blue-600/05 rounded-full blur-[120px]"></div>
      </div>

      {/* Sidebar - Desktop: Static / Mobile: Drawer */}
      <aside className={`
        fixed inset-y-0 z-50 w-72 h-full
        bg-navy-950/95 backdrop-blur-2xl border-slate-800/60 shadow-2xl
        transform transition-transform duration-300 ease-in-out flex flex-col
        lg:static lg:transform-none lg:shadow-none lg:bg-navy-900/30 lg:border-r lg:border-slate-800/40
        ${dir === 'rtl' ? 'right-0 lg:border-l' : 'left-0 lg:border-r'}
        ${isSidebarOpen ? 'translate-x-0' : (dir === 'rtl' ? 'translate-x-full' : '-translate-x-full')}
      `}>
        <div className="p-6 text-center border-b border-slate-800/60 relative shrink-0">
          <h1 className="text-2xl font-bold font-serif text-gold-400 tracking-wider drop-shadow-sm">Ramadan Helper</h1>
          <p className="text-[10px] text-slate-500 mt-1 tracking-[0.2em] uppercase">Premium Edition</p>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden absolute top-6 right-4 p-2 text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 border-b border-slate-800/60 shrink-0">
           <div className="bg-slate-800/40 p-3.5 rounded-2xl flex items-center gap-3 border border-slate-700/40 shadow-inner">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-500/20 to-gold-600/10 flex items-center justify-center text-gold-400 font-bold text-lg border border-gold-500/20 shadow-sm">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs text-slate-500">رمضان كريم</p>
                <p className="text-sm font-bold text-white truncate">{user?.name}</p>
              </div>
           </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group
                  ${isActive 
                    ? 'bg-gold-500/10 text-gold-400 border border-gold-500/10 shadow-[0_0_15px_-3px_rgba(234,179,8,0.1)]' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40 border border-transparent'}
                `}
              >
                <Icon size={20} className={`transition-transform duration-300 ${isActive ? "text-gold-400 scale-110" : "opacity-70 group-hover:scale-110"}`} />
                <span className={`font-medium tracking-wide ${isActive ? "text-white" : ""}`}>{item.label}</span>
                {isActive && <div className="mr-auto w-1.5 h-1.5 rounded-full bg-gold-400 shadow-[0_0_8px_rgba(234,179,8,0.8)]"></div>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800/60 pb-8 lg:pb-4 shrink-0">
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 w-full transition-colors border border-transparent hover:border-red-500/10"
          >
            <LogOut size={20} />
            <span className="font-medium">تسجيل خروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 w-full h-full overflow-y-auto relative z-10 scroll-smooth">
         <div className="p-4 md:p-8 lg:p-10 pb-28 lg:pb-10 max-w-7xl mx-auto min-h-full">
            {children}
         </div>
      </main>

      {/* Dedication Badge (Draggable) */}
      <div 
        ref={badgeRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        style={badgePosition ? { 
          left: `${badgePosition.x}px`, 
          top: `${badgePosition.y}px`, 
          position: 'fixed',
          bottom: 'auto',
          right: 'auto',
          transform: 'none'
        } : undefined}
        className={`fixed z-50 group cursor-move select-none touch-none ${!badgePosition ? 'top-5 left-5 lg:bottom-8 lg:left-8 lg:top-auto' : ''}`}
      >
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-gold-500/30 px-5 py-3 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.3)] flex flex-col items-start gap-1 transition-all duration-300 hover:scale-105 hover:border-gold-500/50 hover:shadow-gold-500/10 hover:bg-slate-900 active:scale-95 active:cursor-grabbing">
          <div className="absolute inset-0 bg-gradient-to-tr from-gold-500/5 to-transparent opacity-50"></div>
          
          <div className="flex items-center gap-2 w-full">
            <div className="text-slate-500/50 mr-auto -ml-1">
              <GripVertical size={14} />
            </div>
            <div className="flex flex-col items-start">
               <span className="text-xs text-white/90 font-medium tracking-wide relative z-10">
                صدقة جارية عن روح
              </span>
              <span className="text-lg md:text-xl text-gold-400 font-bold font-serif tracking-wide relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] leading-tight">
                المرحوم الحاج عبدالله بكري
              </span>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-gold-500/0 via-gold-500/50 to-gold-500/0 opacity-50"></div>
        </div>
      </div>

      {/* Bottom Navigation Bar (Mobile Only) */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-[#020617]/80 backdrop-blur-xl border-t border-slate-800/60 z-40 pb-safe">
        <div className="flex justify-around items-center h-[65px] px-2">
          {bottomNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 relative group`}
              >
                <div className={`
                  p-1.5 rounded-xl transition-all duration-300 relative
                  ${isActive ? 'text-gold-400 -translate-y-1' : 'text-slate-500 group-hover:text-slate-300'}
                `}>
                  <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                  {isActive && <div className="absolute inset-0 bg-gold-500/20 blur-lg rounded-full opacity-50"></div>}
                </div>
                <span className={`text-[10px] font-medium tracking-wide transition-colors ${isActive ? 'text-gold-400' : 'text-slate-500'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
          <button
            onClick={toggleSidebar}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 relative group`}
          >
            <div className={`
              p-1.5 rounded-xl transition-all duration-300
              ${isSidebarOpen ? 'text-gold-400 -translate-y-1' : 'text-slate-500 group-hover:text-slate-300'}
            `}>
               <Menu size={24} strokeWidth={isSidebarOpen ? 2.5 : 2} />
            </div>
            <span className={`text-[10px] font-medium tracking-wide transition-colors ${isSidebarOpen ? 'text-gold-400' : 'text-slate-500'}`}>
              المزيد
            </span>
          </button>
        </div>
      </div>

      {/* Overlay for Mobile Sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-[2px] animate-fade-in"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;