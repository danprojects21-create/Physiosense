
import React, { useRef, useState, useEffect } from 'react';

interface CaptureUIProps {
  title: string;
  description: string;
  onCaptured: (imageData: string) => void;
  onAnalyzeNow?: (imageData: string) => void;
  onBack: () => void;
  overlayType: 'front' | 'profile';
}

export const CaptureUI: React.FC<CaptureUIProps> = ({ title, description, onCaptured, onAnalyzeNow, onBack, overlayType }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tempImage, setTempImage] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsCameraActive(true);
      setError(null);
    } catch (err) {
      setError("Permisos de cámara denegados.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsCameraActive(false);
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, [stream]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg');
        setTempImage(dataUrl);
        stopCamera();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setTempImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-2xl mx-auto glass-panel rounded-[3rem] overflow-hidden border-white/10">
      <div className="p-10">
        <button onClick={onBack} className="text-slate-500 hover:text-white mb-6 flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-colors">
          ← Volver
        </button>

        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">{title}</h2>
        <p className="text-slate-400 mb-8 text-sm">{description}</p>

        <div className="relative aspect-[4/3] bg-slate-950 rounded-[2.5rem] overflow-hidden border border-white/5">
          {tempImage ? (
            <div className="relative w-full h-full">
              <img src={tempImage} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-4 p-10 text-center">
                <button 
                  onClick={() => onCaptured(tempImage)}
                  className="w-full bg-white text-slate-950 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl transition-transform active:scale-95"
                >
                  Continuar al siguiente paso
                </button>
                {onAnalyzeNow && (
                  <button 
                    onClick={() => onAnalyzeNow(tempImage)}
                    className="w-full bg-violet-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl transition-transform active:scale-95"
                  >
                    Analizar ahora con esta foto
                  </button>
                )}
                <button 
                  onClick={() => setTempImage(null)}
                  className="text-white/60 hover:text-white text-[10px] font-black uppercase tracking-widest"
                >
                  Repetir foto
                </button>
              </div>
            </div>
          ) : isCameraActive ? (
            <>
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className={`border-2 border-dashed border-violet-500/40 ${overlayType === 'front' ? 'w-64 h-80 rounded-[100px]' : 'w-48 h-80 rounded-[40px] translate-x-10'}`} />
              </div>
              <button 
                onClick={handleCapture}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white text-slate-950 w-20 h-20 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-90 transition-all"
              >
                <div className="w-16 h-16 border-4 border-slate-950 rounded-full" />
              </button>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-6">
              <button 
                onClick={startCamera}
                className="bg-violet-600 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-violet-500 shadow-2xl shadow-violet-900/40 transition-all flex items-center gap-3"
              >
                Activar Cámara
              </button>
              <label className="cursor-pointer text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest border border-white/10 px-6 py-3 rounded-xl transition-colors">
                Subir Archivo
                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
              </label>
            </div>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};
