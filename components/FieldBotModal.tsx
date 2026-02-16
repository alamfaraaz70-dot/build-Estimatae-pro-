
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

interface Message {
  role: 'user' | 'bot';
  text: string;
  sources?: { uri: string; title: string }[];
}

interface FieldBotModalProps {
  onClose: () => void;
}

const FieldBotModal: React.FC<FieldBotModalProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: 'Operational! I am FieldBot, your AI Site Supervisor. Provide a location (Village, City, Pincode) and I will calculate a professional construction estimate for you. I can also fetch real-time market data for materials and labor.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          tools: [{ googleSearch: {} }],
          systemInstruction: `You are FieldBot, a world-class structural and civil engineering AI for the BuildEstimate Pro platform. 
          When a user provides a location (village/city/state/pincode), estimate house construction cost based on that area's economics.
          
          REAL-TIME DATA:
          - You have access to Google Search. Use it to find up-to-date material prices (cement, steel, etc.) and labor rates for specific regions if the user asks for current data or if the query relates to specific market trends.
          
          RULES:
          - Use Indian construction standards (2024–2025 realistic pricing).
          - Adjust cost according to location category (Metro / Tier 2 / Rural).
          - Labour rate must depend on local wages.
          - Always respond in INR ₹.
          - Never refuse — always estimate logically like a professional contractor.
          - If exact data is unavailable, intelligently approximate using the nearest major city economy.
          
          STRICT OUTPUT FORMAT (Always use this exact template):
          
          Location Type: <Metro / Tier2 / Rural>

          COST PER SQ FT
          Material: ₹____
          Labour: ₹____
          Total: ₹____

          MATERIAL COST BREAKDOWN (per sq ft)
          Cement: ₹__
          Steel: ₹__
          Sand: ₹__
          Aggregate: ₹__
          Bricks/Blocks: ₹__
          Flooring/Tiles: ₹__
          Electrical: ₹__
          Plumbing: ₹__
          Paint/Putty: ₹__
          Doors/Windows: ₹__
          Miscellaneous: ₹__

          HOUSE ESTIMATE
          500 sq ft → ₹____
          1000 sq ft → ₹____
          1500 sq ft → ₹____

          QUALITY RANGE
          Basic: ₹____/sq ft
          Standard: ₹____/sq ft
          Premium: ₹____/sq ft

          KEY FACTORS
          - Wage level
          - Transport cost
          - Material availability

          Summary in Hindi:
          [Simple Hindi explanation in 3-4 lines here]`
        }
      });

      const botText = response.text || "Connection lag detected. Please restate the query.";
      
      // Extract grounding metadata for source URLs
      const sources: { uri: string; title: string }[] = [];
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        chunks.forEach((chunk: any) => {
          if (chunk.web && chunk.web.uri) {
            sources.push({
              uri: chunk.web.uri,
              title: chunk.web.title || 'Source'
            });
          }
        });
      }

      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: botText,
        sources: sources.length > 0 ? Array.from(new Set(sources.map(s => s.uri))).map(uri => sources.find(s => s.uri === uri)!) : undefined
      }]);
    } catch (error) {
      console.error("FieldBot Error:", error);
      setMessages(prev => [...prev, { role: 'bot', text: "Error: AI Logic Core offline. Check your network connection." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-construction-slate/90 backdrop-blur-md">
      <div className="bg-white w-full max-w-2xl h-[90vh] sm:h-[80vh] rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl border-x-4 border-t-4 sm:border-4 border-construction-yellow flex flex-col animate-in slide-in-from-bottom-10 duration-300">
        <div className="bg-construction-slate p-6 flex justify-between items-center flex-shrink-0 border-b-4 border-construction-yellow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-construction-yellow text-construction-slate rounded-lg flex items-center justify-center animate-pulse">
              <i className="fas fa-robot text-xl"></i>
            </div>
            <div>
              <h3 className="text-white font-black uppercase italic tracking-tighter">FieldBot AI</h3>
              <p className="text-construction-yellow text-[9px] font-black uppercase tracking-[0.2em]">Live Engineering Intelligence</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <i className="fas fa-times-circle text-2xl"></i>
          </button>
        </div>

        <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-4 construction-grid bg-slate-50">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm text-sm font-medium whitespace-pre-wrap ${
                m.role === 'user' 
                  ? 'bg-construction-yellow text-construction-slate rounded-tr-none border-2 border-construction-slate font-black' 
                  : 'bg-white text-slate-800 rounded-tl-none border-2 border-slate-200 leading-relaxed font-mono text-[13px]'
              }`}>
                {m.text}
                
                {m.sources && m.sources.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Verified Sources:</p>
                    <div className="flex flex-wrap gap-2">
                      {m.sources.map((source, idx) => (
                        <a 
                          key={idx} 
                          href={source.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-slate-50 hover:bg-construction-yellow/20 text-blue-600 hover:text-blue-800 px-2 py-1 rounded text-[10px] font-bold border border-slate-200 transition-colors flex items-center gap-1"
                        >
                          <i className="fas fa-external-link-alt text-[8px]"></i>
                          {source.title.length > 25 ? source.title.substring(0, 25) + '...' : source.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white p-4 rounded-2xl rounded-tl-none border-2 border-slate-200 flex gap-2 shadow-sm">
                <div className="w-2 h-2 bg-construction-yellow rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-construction-yellow rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-construction-yellow rounded-full animate-bounce [animation-delay:0.4s]"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Consulting Web Registry...</span>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSend} className="p-4 bg-white border-t-4 border-construction-yellow flex gap-3">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about location rates or real-time steel prices..." 
            className="flex-grow p-4 bg-slate-100 border-2 border-slate-200 rounded-xl outline-none focus:border-construction-yellow transition-all font-bold text-sm"
          />
          <button 
            type="submit"
            disabled={loading}
            className="w-14 h-14 bg-construction-slate text-construction-yellow rounded-xl hover:bg-black transition-all flex items-center justify-center shadow-lg active:scale-95 disabled:opacity-50"
          >
            <i className="fas fa-bolt text-lg"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default FieldBotModal;
