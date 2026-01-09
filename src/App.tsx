
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { CaptureUI } from './components/CaptureUI';
import { ReportView } from './components/ReportView';
import { BulkUpload } from './components/BulkUpload';
import { AnalysisStep, MorphoAnalysis } from './types';
import { ETHICS_DISCLAIMER } from './constants';
import { analyzeFace } from './services/geminiService';

export default function App() {
  const [step, setStep] = useState<AnalysisStep>(AnalysisStep.LANDING);
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<MorphoAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFrontCaptured = (img: string) => {
    setFrontImage(img);
    setStep(AnalysisStep.CAPTURE_PROFILE);
  };

  const handleProfileCaptured = (img: string) => {
    setProfileImage(img);
    setStep(AnalysisStep.ANALYZING);
    runAnalysis(frontImage, img);
  };

  const handleAnalyzeNow = (img: string, type: 'front' | 'profile') => {
    if (type === 'front') {
      setFrontImage(img);
      setStep(AnalysisStep.ANALYZING);
      runAnalysis(img, null);
    } else {
      setProfileImage(img);
      setStep(AnalysisStep.ANALYZING);
      runAnalysis(frontImage, img);
    }
  };

  const runAnalysis = async (front: string | null, profile: string | null) => {
    try {
      const result = await analyzeFace(front, profile);
      setAnalysis(result);
      setStep(AnalysisStep.RESULTS);
    } catch (err) {
      console.error(err);
      setError("Error de conexión. Asegúrate de que las fotos sean nítidas.");
      setStep(AnalysisStep.LANDING);
    }
  };

  const restart = () => {
    setFrontImage(null);
    setProfileImage(null);
    setAnalysis(null);
    setError(null);
    setStep(AnalysisStep.LANDING);
  };

  return (
    <Layout>
      {step === AnalysisStep.LANDING && (
        <div className="max-w-5xl mx-auto py-12 px-6">
          <div className="text-center mb-20 animate-float">
            <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 text-[10px] font-black uppercase tracking-[0.3em]">
              Neuro-Morfopsicología Flexible
            </div>
            <h1 className="text-6xl md:text-8xl font-serif text-white mb-6 leading-tight">
              Tu rostro, <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-pink-400 to-emerald-400">tu historia</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Analiza tu estructura facial desde cualquier ángulo para descubrir tu potencial evolutivo.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
            <button 
              onClick={() => setStep(AnalysisStep.CAPTURE_FRONT)}
              className="glass-panel group p-10 rounded-[2.5rem] hover:border-violet-500/50 transition-all duration-500 hover:shadow-[0_0_50px_-12px_rgba(139,92,246,0.3)]"
            >
              <div className="w-16 h-16 bg-violet-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-violet-900/40 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /></svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Usar Cámara</h3>
              <p className="text-slate-500 text-sm">Escaneo rápido de frente o perfil.</p>
            </button>

            <button 
              onClick={() => setStep(AnalysisStep.UPLOAD_BOTH)}
              className="glass-panel group p-10 rounded-[2.5rem] hover:border-emerald-500/50 transition-all duration-500 hover:shadow-[0_0_50px_-12px_rgba(16,185,129,0.3)]"
            >
              <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-900/40 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Subir Foto</h3>
              <p className="text-slate-500 text-sm">Analiza una imagen de tu galería.</p>
            </button>
          </div>
          
          <div className="glass-panel p-8 rounded-[2rem] text-center border-white/5">
            <p className="text-sm text-slate-500 italic max-w-2xl mx-auto">"{ETHICS_DISCLAIMER}"</p>
          </div>
        </div>
      )}

      {step === AnalysisStep.CAPTURE_FRONT && (
        <CaptureUI 
          title="Foto de Frente"
          description="Mira a la cámara. Puedes analizar solo esta foto o añadir el perfil después."
          overlayType="front"
          onCaptured={handleFrontCaptured}
          onAnalyzeNow={(img) => handleAnalyzeNow(img, 'front')}
          onBack={restart}
        />
      )}

      {step === AnalysisStep.CAPTURE_PROFILE && (
        <CaptureUI 
          title="Foto de Perfil"
          description="Gira 90° para completar el análisis o pulsa 'Analizar ahora'."
          overlayType="profile"
          onCaptured={handleProfileCaptured}
          onAnalyzeNow={(img) => handleAnalyzeNow(img, 'profile')}
          onBack={() => setStep(AnalysisStep.CAPTURE_FRONT)}
        />
      )}

      {step === AnalysisStep.UPLOAD_BOTH && (
        <BulkUpload 
          onImagesSelected={(f, p) => { setFrontImage(f); setProfileImage(p); setStep(AnalysisStep.ANALYZING); runAnalysis(f, p); }}
          onBack={restart}
        />
      )}

      {step === AnalysisStep.ANALYZING && (
        <div className="flex flex-col items-center justify-center py-40 gap-8">
          <div className="relative">
            <div className="w-24 h-24 border-2 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
          </div>
          <div className="text-center">
            <h2 className="text-3xl font-black text-white mb-2 tracking-tighter uppercase">Generando Diagnóstico</h2>
            <p className="text-violet-400 font-bold uppercase text-[10px] tracking-[0.4em]">Sincronizando con Morfo-IA...</p>
          </div>
        </div>
      )}

      {step === AnalysisStep.RESULTS && analysis && (
        <ReportView analysis={analysis} onRestart={restart} frontImage={frontImage || profileImage} />
      )}

      {error && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 glass-panel px-8 py-4 rounded-full border-red-500/30 text-red-200 flex items-center gap-3 z-[200] animate-bounce">
          <span className="font-bold text-sm uppercase tracking-widest">{error}</span>
          <button onClick={() => setError(null)} className="ml-4">✕</button>
        </div>
      )}
    </Layout>
  );
}
