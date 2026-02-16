
import React from 'react';

interface SuccessTickProps {
  message: string;
  subMessage?: string;
}

const SuccessTick: React.FC<SuccessTickProps> = ({ message, subMessage }) => {
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-construction-slate/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white p-12 rounded-[3rem] shadow-2xl border-b-8 border-construction-slate flex flex-col items-center animate-in zoom-in duration-500 scale-110">
        <div className="w-24 h-24 bg-construction-yellow text-construction-slate rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(255,215,0,0.6)] border-4 border-white">
          <i className="fas fa-check text-5xl animate-bounce"></i>
        </div>
        <h2 className="text-3xl font-black text-construction-slate uppercase italic text-center leading-tight max-w-xs">
          {message}
        </h2>
        {subMessage && (
          <div className="mt-6 flex flex-col items-center gap-2">
            <div className="h-1 w-12 bg-construction-yellow rounded-full"></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-center">
              {subMessage}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuccessTick;
