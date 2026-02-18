import React, { useState } from 'react';
import { MOCK_ADHKAR } from '../constants';
import { AdhkarItem } from '../types';
import { RotateCcw } from 'lucide-react';

const Adhkar: React.FC = () => {
  const [adhkarList, setAdhkarList] = useState<AdhkarItem[]>(MOCK_ADHKAR);
  const [activeTab, setActiveTab] = useState<'morning' | 'evening' | 'prayer'>('morning');

  const handleIncrement = (id: number) => {
    setAdhkarList(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, count: item.count < item.repeat ? item.count + 1 : item.count };
      }
      return item;
    }));
  };

  const handleReset = (id: number) => {
    setAdhkarList(prev => prev.map(item => item.id === id ? { ...item, count: 0 } : item));
  };

  const filteredAdhkar = adhkarList.filter(item => item.category === activeTab);

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-6">الأذكار</h2>

      {/* Tabs */}
      <div className="flex bg-slate-900/50 p-1 rounded-xl mb-8 border border-slate-800">
        {(['morning', 'evening', 'prayer'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 rounded-lg font-medium transition-all duration-300 ${
              activeTab === tab 
              ? 'bg-slate-700 text-gold-400 shadow-lg' 
              : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab === 'morning' && 'أذكار الصباح'}
            {tab === 'evening' && 'أذكار المساء'}
            {tab === 'prayer' && 'أذكار الصلاة'}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredAdhkar.map((item) => {
          const progress = (item.count / item.repeat) * 100;
          const isCompleted = item.count === item.repeat;

          return (
            <div 
              key={item.id} 
              className={`glass-panel p-6 rounded-2xl border transition-all duration-300 ${
                isCompleted ? 'border-green-500/50 bg-green-900/10' : 'border-slate-800'
              }`}
            >
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                 <p className="text-xl md:text-2xl font-serif text-center md:text-right leading-relaxed text-slate-100 flex-1">
                   {item.text}
                 </p>
                 
                 <div className="flex items-center gap-4">
                    <button 
                      onClick={() => handleReset(item.id)}
                      className="p-3 rounded-full text-slate-500 hover:bg-slate-800 hover:text-red-400 transition-colors"
                      title="إعادة تعيين"
                    >
                      <RotateCcw size={20} />
                    </button>
                    
                    <button
                      onClick={() => handleIncrement(item.id)}
                      disabled={isCompleted}
                      className={`
                        w-24 h-24 rounded-full flex flex-col items-center justify-center border-4 
                        transition-all duration-200 active:scale-95
                        ${isCompleted 
                          ? 'border-green-500 text-green-400 cursor-default' 
                          : 'border-gold-500 text-gold-400 hover:bg-gold-500/10'}
                      `}
                    >
                      <span className="text-3xl font-bold">{item.count}</span>
                      <span className="text-xs text-slate-400">من {item.repeat}</span>
                    </button>
                 </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-slate-800 h-2 rounded-full mt-6 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${isCompleted ? 'bg-green-500' : 'bg-gold-500'}`} 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Adhkar;