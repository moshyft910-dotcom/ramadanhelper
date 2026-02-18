import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { usePrayer } from '../contexts/PrayerContext';
import { Globe, Bell, MapPin, Moon, Volume2, Save, Settings as SettingsIcon } from 'lucide-react';
import { Language } from '../types';

const Settings: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { adhanEnabled, setAdhanEnabled } = usePrayer();
  const [notifications, setNotifications] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  
  const languages: {code: Language, name: string, flag: string}[] = [
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'ur', name: 'اردو', flag: '🇵🇰' },
    { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">{t('settings')}</h2>
        <p className="text-slate-400">تخصيص تجربة التطبيق حسب تفضيلاتك</p>
      </div>

      {/* Language Section */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-700">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Globe className="text-gold-400" />
          {t('language')}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`p-4 rounded-xl border flex items-center justify-center gap-3 transition-all ${
                language === lang.code 
                  ? 'bg-gold-500/20 border-gold-500 text-white' 
                  : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <span className="text-2xl">{lang.flag}</span>
              <span className="font-bold">{lang.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Preferences */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-700 space-y-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <SettingsIcon className="text-gold-400" />
          التفضيلات العامة
        </h3>

        {/* Notifications */}
        <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg"><Bell size={20} /></div>
            <div>
              <div className="font-bold text-white">الإشعارات</div>
              <div className="text-xs text-slate-400">تنبيهات مواقيت الصلاة والأذكار</div>
            </div>
          </div>
          <button 
            onClick={() => setNotifications(!notifications)}
            className={`w-12 h-6 rounded-full transition-colors relative ${notifications ? 'bg-gold-500' : 'bg-slate-600'}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${notifications ? 'left-1' : 'right-1'}`}></div>
          </button>
        </div>

         {/* Location */}
         <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 text-green-400 rounded-lg"><MapPin size={20} /></div>
            <div>
              <div className="font-bold text-white">تحديد الموقع التلقائي</div>
              <div className="text-xs text-slate-400">لحساب مواقيت الصلاة بدقة</div>
            </div>
          </div>
          <button 
            onClick={() => setLocationEnabled(!locationEnabled)}
            className={`w-12 h-6 rounded-full transition-colors relative ${locationEnabled ? 'bg-gold-500' : 'bg-slate-600'}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${locationEnabled ? 'left-1' : 'right-1'}`}></div>
          </button>
        </div>

        {/* Audio */}
        <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
           <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 text-purple-400 rounded-lg"><Volume2 size={20} /></div>
            <div>
              <div className="font-bold text-white">صوت الأذان</div>
              <div className="text-xs text-slate-400">تشغيل الصوت عند دخول الوقت</div>
            </div>
          </div>
          <button 
            onClick={() => setAdhanEnabled(!adhanEnabled)}
            className={`w-12 h-6 rounded-full transition-colors relative ${adhanEnabled ? 'bg-gold-500' : 'bg-slate-600'}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${adhanEnabled ? 'left-1' : 'right-1'}`}></div>
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="flex items-center gap-2 bg-gold-500 text-navy-900 px-6 py-3 rounded-xl font-bold hover:bg-gold-400 transition-colors">
          <Save size={20} />
          حفظ التغييرات
        </button>
      </div>
    </div>
  );
};

export default Settings;