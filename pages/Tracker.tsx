import React, { useState, useEffect } from 'react';
import { FastingDay } from '../types';
import { Check, X } from 'lucide-react';

const Tracker: React.FC = () => {
  const [days, setDays] = useState<FastingDay[]>([]);

  // Initialize days
  useEffect(() => {
    const saved = localStorage.getItem('fasting_tracker');
    if (saved) {
      setDays(JSON.parse(saved) as FastingDay[]);
    } else {
      const initial: FastingDay[] = Array.from({ length: 30 }, (_, i) => ({
        day: i + 1,
        status: 'pending' as const
      }));
      setDays(initial);
    }
  }, []);

  const updateDay = (dayNum: number, status: 'completed' | 'missed') => {
    const newDays: FastingDay[] = days.map(d => {
      if (d.day === dayNum) {
        const newStatus = d.status === status ? 'pending' : status;
        return { ...d, status: newStatus };
      }
      return d;
    });
    setDays(newDays);
    localStorage.setItem('fasting_tracker', JSON.stringify(newDays));
  };

  const completedCount = days.filter(d => d.status === 'completed').length;
  const missedCount = days.filter(d => d.status === 'missed').length;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">تتبع الصيام</h2>
          <p className="text-slate-400">تابع تقدمك في صيام الشهر الفضيل</p>
        </div>
        <div className="flex gap-4">
          <div className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg border border-green-500/30">
            <span className="font-bold ml-2">{completedCount}</span>
             أيام مكتملة
          </div>
           <div className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg border border-red-500/30">
            <span className="font-bold ml-2">{missedCount}</span>
             أيام فائتة
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-3">
        {days.map((day) => (
          <div 
            key={day.day}
            className={`
              relative p-4 rounded-xl border aspect-square flex flex-col items-center justify-center gap-2 transition-all
              ${day.status === 'completed' 
                ? 'bg-green-500/10 border-green-500/50' 
                : day.status === 'missed' 
                  ? 'bg-red-500/10 border-red-500/50' 
                  : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'}
            `}
          >
            <span className="text-xl font-bold text-slate-300 mb-2">يوم {day.day}</span>
            
            <div className="flex gap-2">
              <button 
                onClick={() => updateDay(day.day, 'completed')}
                className={`p-2 rounded-full transition-colors ${day.status === 'completed' ? 'bg-green-500 text-white' : 'bg-slate-700 text-slate-400 hover:bg-green-500/50'}`}
              >
                <Check size={16} />
              </button>
              <button 
                 onClick={() => updateDay(day.day, 'missed')}
                 className={`p-2 rounded-full transition-colors ${day.status === 'missed' ? 'bg-red-500 text-white' : 'bg-slate-700 text-slate-400 hover:bg-red-500/50'}`}
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tracker;