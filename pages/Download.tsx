import React, { useEffect, useState } from 'react';
import { Download, Monitor, Smartphone, Share, PlusSquare, Apple } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const DownloadPage: React.FC = () => {
  const { t } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    // Check Platform
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));
    setIsAndroid(/android/.test(userAgent));

    // Listen for PWA install prompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 font-serif">
          حمل التطبيق الآن
        </h2>
        <p className="text-slate-400 text-lg">
          استمتع بتجربة إيمانية متكاملة على جميع أجهزتك
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Windows */}
        <div className="glass-panel p-8 rounded-3xl border border-slate-700 hover:border-gold-500/50 transition-all group text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
          
          <div className="w-20 h-20 bg-slate-800 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
            <Monitor size={40} className="text-blue-400" />
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-2">Windows</h3>
          <p className="text-sm text-slate-400 mb-8">نسخة سطح المكتب الكاملة مع ميزة الأذان التلقائي</p>
          
          <button className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20">
            <Download size={20} />
            <span>تحميل .EXE</span>
          </button>
          <p className="text-[10px] text-slate-500 mt-3">الإصدار 1.0.0 (64-bit)</p>
        </div>

        {/* Android */}
        <div className={`glass-panel p-8 rounded-3xl border transition-all group text-center relative overflow-hidden ${isAndroid ? 'border-gold-500 ring-1 ring-gold-500/20' : 'border-slate-700 hover:border-green-500/50'}`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>

          <div className="w-20 h-20 bg-slate-800 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
            <Smartphone size={40} className="text-green-400" />
          </div>

          <h3 className="text-2xl font-bold text-white mb-2">Android</h3>
          <p className="text-sm text-slate-400 mb-8">تثبيت مباشر بدون متجر تطبيقات (PWA)</p>

          {deferredPrompt ? (
            <button 
              onClick={handleInstallClick}
              className="w-full py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-600/20"
            >
              <Download size={20} />
              <span>تثبيت التطبيق</span>
            </button>
          ) : (
            <div className="bg-slate-800/50 p-3 rounded-xl text-sm text-slate-300 border border-slate-700">
               اضغط على خيارات المتصفح (⋮) ثم اختر "Install App" أو "Add to Home Screen"
            </div>
          )}
        </div>

        {/* iOS */}
        <div className={`glass-panel p-8 rounded-3xl border transition-all group text-center relative overflow-hidden ${isIOS ? 'border-gold-500 ring-1 ring-gold-500/20' : 'border-slate-700 hover:border-gray-500/50'}`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gray-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>

          <div className="w-20 h-20 bg-slate-800 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
            <Apple size={40} className="text-gray-200" />
          </div>

          <h3 className="text-2xl font-bold text-white mb-2">iOS</h3>
          <p className="text-sm text-slate-400 mb-6">iPhone & iPad</p>

          <div className="text-right space-y-3 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
             <div className="flex items-center gap-3 text-sm text-slate-200">
               <span className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">1</span>
               <span>اضغط على أيقونة المشاركة</span>
               <Share size={16} className="text-blue-400" />
             </div>
             <div className="flex items-center gap-3 text-sm text-slate-200">
               <span className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">2</span>
               <span>اختر "إضافة إلى الشاشة الرئيسية"</span>
               <PlusSquare size={16} className="text-slate-400" />
             </div>
             <div className="flex items-center gap-3 text-sm text-slate-200">
               <span className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">3</span>
               <span>اضغط "إضافة" في الأعلى</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadPage;