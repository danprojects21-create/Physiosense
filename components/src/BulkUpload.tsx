
import React, { useState } from 'react';

interface BulkUploadProps {
  onImagesSelected: (front: string | null, profile: string | null) => void;
  onBack: () => void;
}

export const BulkUpload: React.FC<BulkUploadProps> = ({ onImagesSelected, onBack }) => {
  const [front, setFront] = useState<string | null>(null);
  const [profile, setProfile] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'front' | 'profile') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          if (type === 'front') setFront(event.target.result as string);
          else setProfile(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const isReady = front || profile;

  return (
    <div className="max-w-4xl mx-auto glass-panel rounded-[3rem] border-white/10 p-12">
      <button onClick={onBack} className="text-slate-500 hover:text-white mb-8 flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-colors">
        ← Volver
      </button>

      <div className="text-center mb-12">
        <h2 className="text-4xl font-black text-white mb-2 tracking-tighter">Tu Galería</h2>
        <p className="text-slate-400 text-sm">Sube una de frente, una de perfil, ¡o ambas!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className={`relative aspect-[3/4] rounded-[2.5rem] border-2 border-dashed transition-all flex flex-col items-center justify-center p-4 ${front ? 'border-violet-500 bg-violet-500/5' : 'border-white/10 bg-slate-950/50'}`}>
          {front ? (
            <>
              <img src={front} className="w-full h-full object-cover rounded-[2rem]" />
              <button onClick={() => setFront(null)} className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full">✕</button>
            </>
          ) : (
            <label className="cursor-pointer text-center group">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Foto de Frente</span>
              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'front')} />
            </label>
          )}
        </div>

        <div className={`relative aspect-[3/4] rounded-[2.5rem] border-2 border-dashed transition-all flex flex-col items-center justify-center p-4 ${profile ? 'border-emerald-500 bg-emerald-500/5' : 'border-white/10 bg-slate-950/50'}`}>
          {profile ? (
            <>
              <img src={profile} className="w-full h-full object-cover rounded-[2rem]" />
              <button onClick={() => setProfile(null)} className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full">✕</button>
            </>
          ) : (
            <label className="cursor-pointer text-center group">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Foto de Perfil</span>
              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'profile')} />
            </label>
          )}
        </div>
      </div>

      <button
        disabled={!isReady}
        onClick={() => isReady && onImagesSelected(front, profile)}
        className="w-full bg-white text-slate-950 py-6 rounded-3xl font-black text-xs uppercase tracking-[0.3em] hover:bg-violet-400 transition-all shadow-2xl disabled:opacity-20 disabled:cursor-not-allowed active:scale-[0.98]"
      >
        Lanzar Análisis
      </button>
    </div>
  );
};
