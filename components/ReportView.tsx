
import React, { useState } from 'react';
import { MorphoAnalysis, ChatMessage } from '../types';
import { generateAudioSummary, chatWithProfile } from '../services/geminiService';

interface ReportViewProps {
  analysis: MorphoAnalysis;
  onRestart: () => void;
  frontImage: string | null;
}

export const ReportView: React.FC<ReportViewProps> = ({ analysis, onRestart, frontImage }) => {
  const [activeTab, setActiveTab] = useState<'personality' | 'strengths' | 'evolution'>('personality');
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  const handleAudioSummary = async () => {
    setIsAudioLoading(true);
    try {
      const base64Audio = await generateAudioSummary(analysis.summary);
      if (base64Audio) {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const binaryString = atob(base64Audio);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
        
        const dataInt16 = new Int16Array(bytes.buffer);
        const buffer = audioCtx.createBuffer(1, dataInt16.length, 24000);
        const channelData = buffer.getChannelData(0);
        for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;
        
        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(audioCtx.destination);
        source.start();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAudioLoading(false);
    }
  };

  const handleChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsChatLoading(true);

    try {
      const response = await chatWithProfile([], userMsg, analysis.summary);
      setChatHistory(prev => [...prev, { role: 'model', text: response || 'No se pudo generar respuesta.' }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { role: 'model', text: 'Error de conexión.' }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-32 animate-in fade-in slide-in-from-bottom-10 duration-1000">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        <div className="lg:col-span-4 space-y-8">
          <div className="glass-card rounded-[4rem] p-6 shadow-2xl relative overflow-hidden group border-indigo-500/20">
            <div className="aspect-[3/4] rounded-[3.5rem] overflow-hidden border-4 border-white/10 shadow-inner">
              {frontImage ? (
                <img src={frontImage} alt="Perfil" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
              ) : (
                <div className="w-full h-full bg-slate-900/50 flex items-center justify-center text-slate-700 font-black">IMAGEN</div>
              )}
            </div>
            <div className="absolute top-10 right-10 flex flex-col gap-2">
               <div className="glass-card px-6 py-2 rounded-full text-[10px] font-black uppercase text-pink-400 tracking-widest border-pink-500/30">Tipo: {analysis.generalCharacteristics.morphologicalType}</div>
            </div>
          </div>

          <div className="glass-card rounded-[3rem] p-10 space-y-6">
             <div className="space-y-2">
                <span className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">Estructura Base</span>
                <p className="text-xl font-bold text-white">{analysis.generalCharacteristics.facialStructure}</p>
             </div>
             <div className="h-[1px] bg-white/10 w-full"></div>
             <div className="space-y-2">
                <span className="text-[10px] font-black uppercase text-emerald-400 tracking-widest">Energía Vital</span>
                <p className="text-xl font-bold text-white">{analysis.generalCharacteristics.vitalEnergy}</p>
             </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-10">
          <div className="glass-card rounded-[4rem] p-12 shadow-2xl relative overflow-hidden border-t border-indigo-500/30">
            <div className="absolute top-0 right-0 p-10 opacity-5">
               <svg className="w-40 h-40" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C14.9124 8 14.017 7.10457 14.017 6V3L14.017 3H21.017V15C21.017 18.3137 18.3307 21 15.017 21H14.017ZM3.0166 21V18C3.0166 16.8954 3.91203 16 5.0166 16H8.0166C8.56888 16 9.0166 15.5523 9.0166 15V9C9.0166 8.44772 8.56888 8 8.0166 8H5.0166C3.91203 8 3.0166 7.10457 3.0166 6V3L3.0166 3H10.0166V15C10.0166 18.3137 7.3303 21 4.0166 21H3.0166Z" /></svg>
            </div>
            
            <h3 className="text-4xl font-serif italic text-white mb-8 border-l-4 border-indigo-500 pl-8">Diagnóstico de Evolución</h3>
            
            <p className="text-2xl text-slate-300 leading-relaxed font-light italic opacity-90 mb-12">
              {analysis.summary}
            </p>

            <div className="pt-10 border-t border-white/10 flex items-center justify-between">
               <button 
                onClick={handleAudioSummary}
                className="group flex items-center gap-5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white px-12 py-6 rounded-[2.5rem] font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-indigo-500/20 active:scale-95"
               >
                 {isAudioLoading ? (
                   <span className="animate-spin h-5 w-5 border-2 border-white/20 border-t-white rounded-full" />
                 ) : (
                   <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                 )}
                 Voz de Conciencia
               </button>
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">Deep Mind Audio</span>
            </div>
          </div>

          <div className="glass-card rounded-[4rem] overflow-hidden shadow-2xl border-white/5">
            <div className="flex bg-white/2 p-3 gap-3 border-b border-white/5">
              {(['personality', 'strengths', 'evolution'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-5 text-[10px] font-black uppercase tracking-[0.4em] rounded-[2rem] transition-all ${activeTab === tab ? 'bg-white text-slate-950 shadow-2xl' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                >
                  {tab === 'personality' && 'Personalidad'}
                  {tab === 'strengths' && 'Talentos'}
                  {tab === 'evolution' && 'Tu Génesis'}
                </button>
              ))}
            </div>

            <div className="p-16 min-h-[500px]">
               {activeTab === 'personality' && (
                 <div className="grid md:grid-cols-2 gap-16 animate-in slide-in-from-bottom-8 duration-700">
                    <div className="space-y-8">
                      <h4 className="text-xs font-black uppercase text-indigo-400 tracking-widest flex items-center gap-3">
                         <div className="w-8 h-[2px] bg-indigo-500/30"></div> Rasgos Estrella
                      </h4>
                      <div className="flex flex-wrap gap-4">
                        {analysis.personality.dominantTraits.map((t, i) => (
                          <span key={i} className="px-6 py-4 bg-white/5 border border-white/10 text-white rounded-[1.5rem] font-bold text-sm hover:border-indigo-500/50 transition-colors">{t}</span>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-8">
                       <div className="p-10 bg-indigo-500/5 rounded-[3rem] border border-indigo-500/10">
                          <h4 className="font-black text-pink-400 text-xs uppercase tracking-widest mb-6">Equilibrio Emocional</h4>
                          <p className="text-slate-400 text-lg leading-relaxed font-light">{analysis.personality.emotionalStyle}</p>
                       </div>
                    </div>
                 </div>
               )}

               {activeTab === 'strengths' && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-8 duration-700">
                    {analysis.positives.talents.map((t, i) => (
                      <div key={i} className="flex items-center gap-8 bg-white/2 p-10 rounded-[3.5rem] border border-white/5 group hover:bg-indigo-600/10 transition-all hover:scale-[1.02]">
                         <div className="w-20 h-20 bg-gradient-to-tr from-emerald-600 to-teal-400 rounded-3xl flex items-center justify-center text-white font-black text-3xl shadow-xl transition-transform group-hover:rotate-6">{i+1}</div>
                         <span className="text-white font-bold text-2xl tracking-tighter">{t}</span>
                      </div>
                    ))}
                 </div>
               )}

               {activeTab === 'evolution' && (
                 <div className="space-y-12 animate-in slide-in-from-bottom-8 duration-700">
                    <h4 className="text-4xl font-black text-white tracking-tighter">Pasos para tu Excelencia</h4>
                    <div className="grid gap-8">
                      {analysis.selfKnowledge.recommendations.map((r, i) => (
                        <div key={i} className="flex gap-10 p-10 bg-gradient-to-br from-white/5 to-transparent rounded-[4rem] border border-white/10 group hover:border-emerald-500/30 transition-all">
                           <div className="mt-2 w-10 h-10 bg-emerald-500 rounded-full flex-shrink-0 animate-pulse flex items-center justify-center text-[10px] font-black text-slate-950">ACT</div>
                           <p className="text-emerald-50 font-medium text-2xl leading-snug tracking-tight">{r}</p>
                        </div>
                      ))}
                    </div>
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto glass-card rounded-[4rem] shadow-2xl overflow-hidden flex flex-col h-[700px] border-white/10">
        <div className="p-10 bg-indigo-600 flex items-center justify-between shadow-xl">
           <div className="flex items-center gap-6 text-white">
              <div className="w-16 h-16 bg-white/20 rounded-[1.5rem] flex items-center justify-center">
                 <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
              </div>
              <div>
                 <h4 className="font-black text-2xl tracking-tighter leading-none">Consultor de Vida</h4>
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70 mt-2">Dudas sobre tu Morfología</p>
              </div>
           </div>
           <div className="px-6 py-2 bg-emerald-400/20 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/30">CONECTADO</div>
        </div>

        <div className="flex-1 overflow-y-auto p-12 space-y-10 bg-slate-950/40">
           {chatHistory.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in zoom-in-95 duration-500`}>
                 <div className={`max-w-[85%] p-8 rounded-[3.5rem] text-lg font-medium shadow-2xl ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none border border-indigo-500/50' : 'bg-white/5 text-slate-200 rounded-tl-none border border-white/5'}`}>
                    {msg.text}
                 </div>
              </div>
           ))}
           {isChatLoading && (
              <div className="flex justify-start">
                 <div className="bg-white/5 p-8 rounded-[3.5rem] rounded-tl-none border border-white/5 flex gap-3">
                    <div className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-3 h-3 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                 </div>
              </div>
           )}
        </div>

        <div className="p-10 bg-black/20 border-t border-white/5">
           <div className="flex gap-6">
              <input 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleChat()}
                placeholder="Profundiza en un rasgo específico..."
                className="flex-1 bg-white/5 border border-white/10 rounded-[2.5rem] px-10 py-6 text-white text-lg focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all placeholder:text-slate-700 font-medium"
              />
              <button 
                onClick={handleChat}
                disabled={isChatLoading}
                className="bg-white text-slate-950 p-6 rounded-[2.5rem] hover:bg-indigo-500 hover:text-white transition-all shadow-2xl active:scale-95 disabled:opacity-30 flex items-center justify-center"
              >
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
           </div>
        </div>
      </div>

      <div className="flex justify-center pt-24">
         <button onClick={onRestart} className="group flex items-center gap-6 bg-white/5 border border-white/10 text-slate-400 px-16 py-8 rounded-[3rem] font-black text-xs uppercase tracking-[0.5em] hover:text-white hover:bg-white/10 transition-all active:scale-95 shadow-xl">
            <svg className="w-6 h-6 transition-transform group-hover:rotate-180 duration-1000" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Reiniciar Ciclo
         </button>
      </div>

    </div>
  );
};
