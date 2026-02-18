import React, { useState } from 'react';
import { Calculator } from 'lucide-react';

const Zakat: React.FC = () => {
  const [savings, setSavings] = useState<string>('');
  const [gold, setGold] = useState<string>('');
  const [goldPrice, setGoldPrice] = useState<string>('230'); // Approximate default
  const [totalZakat, setTotalZakat] = useState<number | null>(null);

  const calculate = () => {
    const cash = parseFloat(savings) || 0;
    const goldWeight = parseFloat(gold) || 0;
    const gPrice = parseFloat(goldPrice) || 0;

    const goldValue = goldWeight * gPrice;
    const totalWealth = cash + goldValue;

    // Nisab is roughly 85g of gold
    const nisabValue = 85 * gPrice;

    if (totalWealth >= nisabValue) {
      setTotalZakat(totalWealth * 0.025);
    } else {
      setTotalZakat(0);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-gold-500/20 text-gold-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calculator size={32} />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">حاسبة الزكاة</h2>
        <p className="text-slate-400">احسب زكاة مالك بسهولة ودقة</p>
      </div>

      <div className="glass-panel p-8 rounded-3xl border border-slate-700 space-y-6">
        <div>
          <label className="block text-slate-300 mb-2">النقد والمدخرات البنكية (ريال)</label>
          <input 
            type="number" 
            value={savings}
            onChange={(e) => setSavings(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white focus:border-gold-500 focus:outline-none"
            placeholder="0"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 mb-2">وزن الذهب (جرام)</label>
            <input 
              type="number" 
              value={gold}
              onChange={(e) => setGold(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white focus:border-gold-500 focus:outline-none"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-slate-300 mb-2">سعر جرام الذهب الحالي</label>
            <input 
              type="number" 
              value={goldPrice}
              onChange={(e) => setGoldPrice(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white focus:border-gold-500 focus:outline-none"
            />
          </div>
        </div>

        <button 
          onClick={calculate}
          className="w-full bg-gradient-to-r from-gold-600 to-gold-400 text-navy-950 font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-gold-500/20 transition-all transform hover:-translate-y-1"
        >
          احسب الزكاة
        </button>

        {totalZakat !== null && (
          <div className={`mt-8 p-6 rounded-xl text-center border animate-fade-in ${totalZakat > 0 ? 'bg-green-900/20 border-green-500/30' : 'bg-slate-800 border-slate-700'}`}>
            <h3 className="text-slate-400 mb-2">مبلغ الزكاة المستحق</h3>
            <div className="text-4xl font-bold text-white mb-2">
              {totalZakat.toLocaleString('en-US', { minimumFractionDigits: 2 })} <span className="text-sm font-normal text-slate-400">ريال</span>
            </div>
            {totalZakat === 0 && (
              <p className="text-sm text-yellow-500 mt-2">لم يبلغ المال النصاب (قيمة 85 جرام ذهب)</p>
            )}
          </div>
        )}
      </div>

      <div className="mt-8 text-center text-sm text-slate-500">
        <p>ملاحظة: هذه الحاسبة تقديرية. يرجى مراجعة أهل العلم للتفاصيل الدقيقة في الحالات المعقدة.</p>
      </div>
    </div>
  );
};

export default Zakat;