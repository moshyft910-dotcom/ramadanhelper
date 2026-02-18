import React, { useState } from 'react';
import { MOCK_STORIES } from '../constants';
import { ChevronDown, ChevronUp, Book, Search } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Story } from '../types';

const Stories: React.FC = () => {
  const [stories, setStories] = useState<Story[]>(MOCK_STORIES);
  const [openId, setOpenId] = useState<number | null>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const { language, t } = useLanguage();

  const filteredStories = stories.filter(story => 
    story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    story.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          <Book className="text-gold-400" />
          {t('stories')}
        </h2>

        <div className="relative w-full md:w-72">
           <Search className={`absolute top-1/2 transform -translate-y-1/2 text-slate-400 ${language === 'ar' ? 'right-3' : 'left-3'}`} size={20} />
           <input 
             type="text" 
             placeholder={language === 'ar' ? "بحث في القصص..." : "Search stories..."}
             className={`w-full bg-slate-800/50 border border-slate-700 rounded-full py-2 text-white focus:outline-none focus:border-gold-500 transition-colors ${language === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
           />
        </div>
      </div>

      {/* Stories List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredStories.length > 0 ? (
          filteredStories.map(story => (
            <div 
              key={story.id} 
              className={`glass-panel rounded-2xl overflow-hidden border transition-all duration-300 ${openId === story.id ? 'border-gold-500/50 bg-slate-800/80' : 'border-slate-700 hover:border-slate-600'}`}
            >
              <button 
                onClick={() => setOpenId(openId === story.id ? null : story.id)}
                className="w-full flex items-center justify-between p-6 text-start hover:bg-slate-700/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                   <div className={`w-2 h-10 rounded-full ${story.isAiGenerated ? 'bg-purple-500' : 'bg-gold-500'}`}></div>
                   <div>
                     <h3 className="text-xl font-bold text-white">{story.title}</h3>
                     {story.isAiGenerated && <span className="text-xs text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">AI Generated</span>}
                   </div>
                </div>
                {openId === story.id ? <ChevronUp className="text-gold-400" /> : <ChevronDown className="text-slate-400" />}
              </button>
              
              {openId === story.id && (
                <div className="px-8 pb-8 pt-2 animate-fade-in">
                  <div className="w-full h-px bg-slate-700/50 mb-6"></div>
                  <p className="text-lg leading-[2] text-slate-200 font-serif whitespace-pre-line">
                    {story.content}
                  </p>
                  {story.source && (
                    <div className="mt-6 pt-4 border-t border-slate-800 text-sm text-slate-500 flex justify-between items-center">
                      <span>المصدر: {story.source}</span>
                      <button className="text-gold-400 hover:underline">مشاركة القصة</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-slate-500 glass-panel rounded-2xl border-dashed border-slate-700">
            <Book className="mx-auto mb-3 opacity-20" size={48} />
            <p>{language === 'ar' ? "لا توجد قصص تطابق بحثك" : "No stories found matching your search"}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stories;