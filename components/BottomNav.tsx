
import React from 'react';

interface BottomNavProps {
  onProfile: () => void;
  onFieldBot: () => void;
  onOrders: () => void;
  isActive?: 'profile' | 'fieldbot' | 'orders' | null;
}

const BottomNav: React.FC<BottomNavProps> = ({ onProfile, onFieldBot, onOrders, isActive }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[140] bg-construction-slate border-t-4 border-construction-yellow px-4 pb-safe shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.3)]">
      <div className="max-w-md mx-auto flex justify-around items-center py-3">
        {/* Profile Button with Enhanced Design */}
        <button 
          onClick={onProfile}
          className={`flex flex-col items-center gap-1 transition-all group ${isActive === 'profile' ? 'text-construction-yellow scale-110' : 'text-white/60 hover:text-white'}`}
        >
          <div className={`relative w-11 h-11 rounded-xl flex items-center justify-center transition-all border-2 ${
            isActive === 'profile' 
            ? 'bg-construction-yellow/10 border-construction-yellow shadow-[0_0_15px_rgba(255,215,0,0.3)]' 
            : 'bg-white/5 border-white/10 hover:border-white/30'
          }`}>
            <i className={`fas fa-user-hard-hat text-xl ${isActive === 'profile' ? 'text-construction-yellow' : ''}`}></i>
            {/* Status Indicator/Design Element */}
            <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-construction-slate transition-colors ${
              isActive === 'profile' ? 'bg-construction-yellow animate-pulse' : 'bg-slate-500'
            }`}></div>
            {/* Corner Accent Design */}
            <div className="absolute bottom-1 right-1 w-1.5 h-1.5 border-r-2 border-b-2 border-white/20 rounded-br-sm"></div>
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest">Profile</span>
        </button>

        {/* FieldBot Button (Center) */}
        <button 
          onClick={onFieldBot}
          className={`flex flex-col items-center gap-1 -mt-8 transition-all group ${isActive === 'fieldbot' ? 'scale-110' : 'hover:scale-105'}`}
        >
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl transition-all border-4 ${isActive === 'fieldbot' ? 'bg-construction-yellow text-construction-slate border-white' : 'bg-construction-yellow text-construction-slate border-construction-slate'}`}>
            <i className={`fas fa-robot text-2xl ${isActive === 'fieldbot' ? 'animate-bounce' : 'group-hover:animate-pulse'}`}></i>
          </div>
          <span className={`text-[10px] font-black uppercase tracking-widest mt-1 ${isActive === 'fieldbot' ? 'text-construction-yellow' : 'text-white'}`}>FieldBot</span>
        </button>

        {/* Orders Button */}
        <button 
          onClick={onOrders}
          className={`flex flex-col items-center gap-1 transition-all ${isActive === 'orders' ? 'text-construction-yellow scale-110' : 'text-white/60 hover:text-white'}`}
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 hover:border-white/30">
            <i className="fas fa-clipboard-list text-lg"></i>
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest">Orders</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNav;
