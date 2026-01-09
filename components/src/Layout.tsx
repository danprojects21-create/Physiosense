
import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-[100] bg-slate-950/50 backdrop-blur-xl border-b border-white/5 py-5 px-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 group">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-500">
              <span className="text-white font-serif text-2xl italic font-bold">P</span>
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tighter leading-none">PhysioSense AI</h1>
              <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mt-1">Evolución Consciente</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-10">
            <a href="#" className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors">Ciencia</a>
            <a href="#" className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors">Metodología</a>
            <button className="bg-violet-600/10 hover:bg-violet-600/20 text-violet-400 border border-violet-500/30 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
              Comunidad
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 relative z-10">
        {children}
      </main>

      <footer className="bg-slate-950/80 border-t border-white/5 py-12 px-10 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h3 className="font-black text-white text-xl mb-2">PhysioSense AI</h3>
            <p className="text-xs text-slate-500 uppercase tracking-widest">© {new Date().getFullYear()} MorphoLabs Global</p>
          </div>
          <div className="flex gap-8">
            <div className="w-2 h-2 rounded-full bg-violet-500"></div>
            <div className="w-2 h-2 rounded-full bg-pink-500"></div>
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          </div>
        </div>
      </footer>
    </div>
  );
};
