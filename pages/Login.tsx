import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Moon, ArrowRight, Star } from 'lucide-react';

const Login: React.FC = () => {
  const [name, setName] = useState('');
  const { login } = useAuth();
  const { t, dir } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      login(name);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden" dir={dir}>
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-gold-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <div className="glass-panel p-8 md:p-12 rounded-3xl border border-slate-700 shadow-2xl backdrop-blur-xl">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-gradient-to-br from-gold-400 to-gold-600 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-gold-500/20 rotate-3 transform hover:rotate-6 transition-transform">
              <Moon size={40} className="text-navy-950" fill="currentColor" />
              <Star size={16} className="text-navy-950 absolute top-4 right-4 animate-pulse" fill="currentColor" />
            </div>
            <h1 className="text-3xl font-bold text-white font-serif mb-2">Ramadan Helper</h1>
            <p className="text-slate-400">{t('subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                {dir === 'rtl' ? 'الاسم الكريم' : 'Your Name'}
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-4 text-white placeholder-slate-600 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all text-lg"
                placeholder={dir === 'rtl' ? 'أدخل اسمك هنا...' : 'Enter your name...'}
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={!name.trim()}
              className="w-full bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-bold py-4 rounded-xl shadow-lg shadow-gold-500/20 hover:shadow-gold-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              <span>{dir === 'rtl' ? 'دخول التطبيق' : 'Enter App'}</span>
              <ArrowRight size={20} className={`transform transition-transform ${dir === 'rtl' ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-slate-500 font-serif">
              "رمضان كريم - تقبل الله منا ومنكم صالح الأعمال"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;