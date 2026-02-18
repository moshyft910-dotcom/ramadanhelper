import React, { useState, useRef, useEffect } from 'react';
import { askIslamicAssistant } from '../services/geminiService';
import { Send, Bot, User, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const Assistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'السلام عليكم ورحمة الله وبركاته. أنا مساعدك الذكي في رمضان. كيف يمكنني مساعدتك اليوم بخصوص الصيام، الصلاة، أو القرآن؟' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const responseText = await askIslamicAssistant(input);
    
    setMessages(prev => [...prev, {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: responseText
    }]);
    setLoading(false);
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col max-w-4xl mx-auto glass-panel rounded-3xl border border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-700 bg-navy-900/50 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400">
          <Bot size={24} />
        </div>
        <div>
          <h2 className="font-bold text-white">المساعد الرمضاني</h2>
          <p className="text-xs text-green-400 flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            متصل الآن
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
            <div className={`
              max-w-[80%] rounded-2xl p-4 flex gap-3
              ${msg.role === 'user' 
                ? 'bg-slate-700/50 text-white rounded-br-none' 
                : 'bg-gold-500/10 border border-gold-500/20 text-slate-100 rounded-bl-none'}
            `}>
              {msg.role === 'assistant' && <Bot size={20} className="text-gold-400 mt-1 shrink-0" />}
              <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              {msg.role === 'user' && <User size={20} className="text-slate-400 mt-1 shrink-0" />}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-end">
            <div className="bg-gold-500/10 border border-gold-500/20 rounded-2xl p-4 flex items-center gap-2 rounded-bl-none">
              <Bot size={20} className="text-gold-400" />
              <Loader2 className="animate-spin w-4 h-4 text-gold-400" />
              <span className="text-sm text-slate-400">يكتب الآن...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-700 bg-navy-900/30">
        <form onSubmit={handleSend} className="relative">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اسأل عن حكم شرعي، وقت صلاة، أو نصيحة..." 
            className="w-full bg-slate-800 border border-slate-600 rounded-full py-4 pr-12 pl-6 text-white focus:outline-none focus:border-gold-500 transition-colors"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || loading}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-gold-500 rounded-full text-navy-900 hover:bg-gold-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Assistant;