
import React from 'react';

interface ImagePreviewModalProps {
  url: string;
  onClose: () => void;
  title?: string;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ url, onClose, title }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `Blueprint_${title?.replace(/\s+/g, '_') || 'Design'}_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div 
      className="fixed inset-0 z-[250] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-10 cursor-zoom-out"
      onClick={onClose}
    >
      <div 
        className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center cursor-default animate-in zoom-in duration-300"
        onClick={e => e.stopPropagation()}
      >
        <div className="absolute top-0 right-0 -mt-12 flex items-center gap-4">
          {title && <span className="text-white/60 text-xs font-black uppercase tracking-widest italic">{title}</span>}
          
          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-construction-yellow text-construction-slate font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all shadow-lg"
          >
            <i className="fas fa-download"></i>
            Save to Local System
          </button>

          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all border border-white/20"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <div className="bg-white rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(255,215,0,0.2)] p-2">
          <img 
            src={url} 
            alt="Blueprint Preview" 
            className="max-h-[80vh] w-auto object-contain rounded-2xl"
          />
        </div>

        <div className="mt-8 flex flex-col items-center gap-2">
          <div className="bg-construction-yellow text-construction-slate px-6 py-3 rounded-full font-black uppercase tracking-[0.2em] text-[10px] shadow-xl">
            <i className="fas fa-drafting-compass mr-2"></i>
            Proprietary Architectural Design Array
          </div>
          <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">
            Stored in cloud registry & accessible for local export
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImagePreviewModal;
