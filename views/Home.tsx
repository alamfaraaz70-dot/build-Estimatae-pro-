
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface HomeProps {
  onGetStarted: () => void;
}

const Home: React.FC<HomeProps> = ({ onGetStarted }) => {
  const { t } = useLanguage();

  return (
    <div className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Full-Screen Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=2070" 
          alt="Construction Site Professional Background" 
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlay for Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent"></div>
        <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-10 animate-in fade-in slide-in-from-left-10 duration-700">
            <div className="inline-block bg-construction-yellow/20 border border-construction-yellow/30 px-4 py-1.5 rounded-full mb-2">
              <p className="text-construction-yellow text-[10px] font-black uppercase tracking-[0.3em] leading-none">
                <i className="fas fa-shield-halved mr-2"></i>
                ISO 9001:2015 Certified Engineering
              </p>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black text-white leading-none tracking-tighter uppercase italic">
              {t('hero_title').split(' Confidence')[0]} <br/>
              <span className="text-construction-yellow drop-shadow-[0_5px_15px_rgba(255,215,0,0.3)]">Confidence</span>.
            </h1>
            
            <p className="text-xl text-slate-300 max-w-xl leading-relaxed font-medium border-l-4 border-construction-yellow pl-6">
              {t('hero_subtitle')}
            </p>
            
            <div className="flex flex-wrap gap-6 pt-4">
              <button 
                onClick={onGetStarted}
                className="bg-construction-yellow hover:bg-construction-yellowDark text-construction-slate px-10 py-5 rounded-2xl font-black text-xl uppercase tracking-widest shadow-[6px_6px_0px_0px_rgba(30,41,59,1)] transform hover:-translate-y-1 active:translate-y-0 active:shadow-none transition-all flex items-center gap-4"
              >
                {t('hero_cta')}
                <i className="fas fa-arrow-right"></i>
              </button>
              <button className="bg-white/10 backdrop-blur-md border-2 border-white/20 hover:bg-white/20 text-white px-10 py-5 rounded-2xl font-black text-xl uppercase tracking-widest transition-all">
                {t('hero_learn')}
              </button>
            </div>

            <div className="flex items-center gap-12 pt-10">
              <div className="flex flex-col">
                <span className="text-3xl font-black text-white italic tracking-tighter">500+</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Certified Specialists</span>
              </div>
              <div className="h-12 w-[2px] bg-white/10"></div>
              <div className="flex flex-col">
                <span className="text-3xl font-black text-white italic tracking-tighter">12K+</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Blueprints Delivered</span>
              </div>
            </div>
          </div>

          <div className="hidden lg:block flex-1 relative animate-in fade-in zoom-in duration-1000 delay-300">
            <div className="absolute -inset-10 bg-construction-yellow/20 rounded-full blur-[120px] -z-10 animate-pulse"></div>
            <div className="relative bg-white/5 backdrop-blur-xl border-4 border-white/10 p-2 rounded-[3rem] shadow-2xl overflow-hidden group">
              {/* Updated Image to match requested construction site with cranes */}
              <img 
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=2000" 
                alt="Architectural Excellence" 
                className="rounded-[2.5rem] w-full h-[500px] object-cover opacity-90 group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute bottom-10 left-10 right-10 bg-construction-slate text-white p-6 rounded-3xl border-l-8 border-construction-yellow shadow-2xl">
                <div className="flex items-center gap-4">
                  <div className="bg-construction-yellow text-construction-slate w-12 h-12 rounded-xl flex items-center justify-center">
                    <i className="fas fa-check-double text-xl"></i>
                  </div>
                  <div>
                    <p className="text-sm font-black uppercase tracking-widest leading-none mb-1">Status: Operational</p>
                    <p className="text-xs font-bold text-slate-400 uppercase italic">Site verification in progress...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 pb-10">
          {[
            { icon: 'fa-pencil-ruler', title: 'Plan Site', desc: 'Define your area, rooms, and structural requirements via AI-guided wizardry.' },
            { icon: 'fa-users-gear', title: 'Expert Match', desc: 'Auto-dispatch project briefs to top-tier structural engineers in your region.' },
            { icon: 'fa-file-invoice-dollar', title: 'Precision Quotes', desc: 'Eliminate hidden costs with comprehensive, itemized material and labor audits.' }
          ].map((feat, idx) => (
            <div key={idx} className="bg-white/5 backdrop-blur-xl p-8 rounded-[2rem] border-2 border-white/10 hover:border-construction-yellow/40 transition-all group hover:-translate-y-2">
              <div className="bg-construction-yellow/10 text-construction-yellow w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-inner border border-construction-yellow/20 group-hover:bg-construction-yellow group-hover:text-construction-slate transition-all">
                <i className={`fas ${feat.icon}`}></i>
              </div>
              <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-3">{feat.title}</h3>
              <p className="text-slate-400 font-medium leading-relaxed text-sm">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
