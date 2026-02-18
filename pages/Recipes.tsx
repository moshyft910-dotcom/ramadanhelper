import React, { useState } from 'react';
import { MOCK_RECIPES } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { Recipe } from '../types';
import { Utensils, Sparkles } from 'lucide-react';

const Recipes: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>(MOCK_RECIPES);
  const [filter, setFilter] = useState<'all' | 'iftar' | 'suhoor' | 'dessert'>('all');
  const { language, t } = useLanguage();

  const filtered = filter === 'all' ? recipes : recipes.filter(r => r.category === filter);

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
        <Utensils className="text-gold-400" />
        {t('recipes')}
      </h2>
      
      {/* Filter Chips */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {[
          { id: 'all', label: 'الكل' },
          { id: 'iftar', label: 'إفطار' },
          { id: 'suhoor', label: 'سحور' },
          { id: 'dessert', label: 'حلويات' },
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id as any)}
            className={`px-6 py-2 rounded-full whitespace-nowrap transition-colors ${
              filter === cat.id 
              ? 'bg-gold-500 text-navy-950 font-bold' 
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(recipe => (
          <div key={recipe.id} className="glass-panel rounded-2xl overflow-hidden group hover:bg-slate-800/80 transition-all border border-slate-700 hover:border-gold-500/50 flex flex-col h-full">
            <div className="h-48 overflow-hidden relative shrink-0">
              <img 
                src={recipe.image || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80'} 
                alt={recipe.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60"></div>
              
              <div className="absolute top-2 right-2 flex gap-2">
                 <div className="px-3 py-1 bg-black/60 backdrop-blur rounded-full text-xs text-white border border-white/10">
                   {recipe.category === 'iftar' ? 'إفطار' : recipe.category === 'suhoor' ? 'سحور' : 'حلى'}
                 </div>
                 {recipe.isAiGenerated && (
                    <div className="px-3 py-1 bg-purple-500/80 backdrop-blur rounded-full text-xs text-white flex items-center gap-1 border border-purple-400/30">
                      <Sparkles size={10} /> AI
                    </div>
                 )}
              </div>
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gold-400 transition-colors">{recipe.title}</h3>
              <p className="text-slate-400 text-sm mb-4 line-clamp-3 leading-relaxed flex-1">{recipe.description}</p>
              
              <div className="mt-4 pt-4 border-t border-slate-700/50">
                 <p className="text-xs text-slate-500 mb-2 font-bold">المكونات:</p>
                 <div className="flex flex-wrap gap-2">
                    {recipe.ingredients.slice(0, 3).map((ing, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-slate-700/50 rounded text-slate-300">{ing}</span>
                    ))}
                    {recipe.ingredients.length > 3 && (
                       <span className="text-xs px-2 py-1 bg-slate-700/50 rounded text-slate-300">+{recipe.ingredients.length - 3}</span>
                    )}
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recipes;