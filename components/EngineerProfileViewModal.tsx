
import React from 'react';
import { User } from '../types';

interface EngineerProfileViewModalProps {
  engineer: User;
  onClose: () => void;
}

const EngineerProfileViewModal: React.FC<EngineerProfileViewModalProps> = ({ engineer, onClose }) => {
  return (
    <div className="fixed inset-0 z-[170] bg-construction-slate/95 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in duration-200 border-4 border-construction-yellow flex flex-col">
        <div className="bg-construction-slate text-white p-6 flex justify-between items-center flex-shrink-0">
          <h3 className="text-lg font-black uppercase tracking-widest italic">Engineer Credentials</h3>
          <button onClick={onClose} className="text-construction-yellow hover:scale-110 transition-transform">
            <i className="fas fa-times-circle text-2xl"></i>
          </button>
        </div>

        <div className="p-8 space-y-8 construction-grid flex-grow">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-construction-yellow text-construction-slate rounded-2xl flex items-center justify-center text-4xl font-black mb-4 shadow-[6px_6px_0px_0px_rgba(30,41,59,1)]">
              {engineer.name.charAt(0)}
            </div>
            <h4 className="text-2xl font-black text-construction-slate uppercase italic text-center leading-tight">
              {engineer.name}
            </h4>
            <p className="text-[10px] font-black uppercase text-construction-caution tracking-[0.2em] mt-2 bg-construction-slate/5 px-3 py-1 rounded-full">
              Certified Specialist
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-50 p-5 rounded-xl border-2 border-slate-100 text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Company / Firm</p>
              <p className="font-black text-construction-slate text-lg uppercase italic">
                {engineer.companyName || 'Independent Practice'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border-2 border-slate-100 flex flex-col items-center justify-center">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Experience</p>
                <p className="text-xl font-black text-construction-slate italic">{engineer.experience || 0} YRS</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border-2 border-slate-100 flex flex-col items-center justify-center">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Deliveries</p>
                <p className="text-xl font-black text-construction-slate italic">{engineer.projectsDone || 0} UNITS</p>
              </div>
            </div>

            {engineer.address && (
              <div className="bg-slate-50 p-4 rounded-xl border-2 border-slate-100">
                <div className="flex items-center gap-3 mb-2">
                  <i className="fas fa-map-marker-alt text-construction-slate/40"></i>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">HQ / Operation Base</p>
                </div>
                <p className="text-sm font-bold text-slate-700 leading-relaxed">
                  {engineer.address}
                </p>
              </div>
            )}
          </div>

          <div className="p-4 bg-amber-50 rounded-xl border-2 border-amber-200">
            <div className="flex items-center gap-3">
              <i className="fas fa-shield-check text-amber-600"></i>
              <p className="text-[10px] font-black uppercase text-amber-800 tracking-tighter">
                IDENTITY & CREDENTIALS VERIFIED BY BUILDESTIMATE REGISTRY
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t-4 border-construction-yellow text-center">
          <button 
            onClick={onClose}
            className="w-full bg-construction-slate text-construction-yellow py-4 rounded font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(255,215,0,1)] transition-all hover:bg-black active:shadow-none active:translate-y-1"
          >
            Acknowledge Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default EngineerProfileViewModal;
