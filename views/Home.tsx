
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface HomeProps {
  onGetStarted: () => void;
}

const Home: React.FC<HomeProps> = ({ onGetStarted }) => {
  const { t } = useLanguage();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    { q: "How accurate are the AI estimates?", a: "Our FieldBot AI uses real-time Google Search grounding to fetch current local material rates, typically reaching 92-95% accuracy compared to final market quotes." },
    { q: "Can I reduce the 6-month timeline?", a: "Yes, we offer fast-track deployment options as low as 3 months, though these usually incur a 15% urgency surcharge for labor and logistics." },
    { q: "Is my engineer verified?", a: "Every engineer on our platform undergoes a rigorous 3-step verification process of their credentials, experience, and past project deliveries." }
  ];

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-slate-950">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen flex flex-col justify-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=2070" 
            alt="Construction Site Professional Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/70 to-transparent"></div>
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
                Build <strong>Faster</strong>. Plan <strong>Smarter</strong>. Execute <strong>Better</strong>. The only AI-powered platform delivering certified site blueprints in hours.
              </p>
              
              <div className="flex flex-wrap gap-6 pt-4">
                <button 
                  onClick={onGetStarted}
                  className="bg-construction-yellow hover:bg-construction-yellowDark text-construction-slate px-10 py-5 rounded-2xl font-black text-xl uppercase tracking-widest shadow-[6px_6px_0px_0px_rgba(30,41,59,1)] transform hover:-translate-y-1 active:translate-y-0 active:shadow-none transition-all flex items-center gap-4"
                >
                  {t('hero_cta')}
                  <i className="fas fa-arrow-right"></i>
                </button>
                <a href="#fast-track" className="bg-white/10 backdrop-blur-md border-2 border-white/20 hover:bg-white/20 text-white px-10 py-5 rounded-2xl font-black text-xl uppercase tracking-widest transition-all flex items-center gap-3">
                  <i className="fas fa-bolt text-construction-yellow"></i>
                  Fast Track
                </a>
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
        </div>
      </section>

      {/* 2. CORE ADVANTAGES */}
      <section className="bg-white py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black text-construction-slate uppercase italic tracking-tighter">Engineered for <span className="text-construction-caution">Velocity</span></h2>
            <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-xs mt-4">Breaking the limits of traditional construction planning</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: 'fa-bolt', title: '6-Month Baseline', desc: 'Standard 1-floor deployments initialized in record-breaking 6-month cycles, optimized for speed without sacrificing safety.' },
              { icon: 'fa-microchip', title: 'FieldBot Intelligence', desc: 'Our proprietary AI scans real-time market data to provide estimates that reflect today\'s steel, cement, and labor costs.' },
              { icon: 'fa-file-signature', title: 'Certified Registry', desc: 'Access an elite network of structural engineers, each vetted for multi-level architectural expertise.' }
            ].map((feat, idx) => (
              <div key={idx} className="flex flex-col items-center text-center space-y-6 p-10 rounded-[3rem] bg-slate-50 border-2 border-slate-100 hover:border-construction-yellow transition-all group">
                <div className="w-20 h-20 bg-construction-slate text-construction-yellow rounded-3xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-xl">
                  <i className={`fas ${feat.icon}`}></i>
                </div>
                <h3 className="text-2xl font-black text-construction-slate uppercase italic">{feat.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. PROCESS TIMELINE */}
      <section className="bg-construction-slate py-32 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
          <i className="fas fa-drafting-compass text-[40rem] text-white"></i>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-24">
            <div>
              <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter">Deployment <span className="text-construction-yellow">Workflow</span></h2>
              <p className="text-construction-yellow/60 font-black uppercase tracking-[0.2em] text-xs mt-2">From raw plot to structural blueprint in 4 phases</p>
            </div>
            <button onClick={onGetStarted} className="bg-white text-construction-slate px-8 py-4 rounded-xl font-black uppercase tracking-widest text-sm shadow-xl hover:bg-construction-yellow transition-all">Start Your Project</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            <div className="hidden md:block absolute top-12 left-0 right-0 h-1 bg-white/10 z-0"></div>
            {[
              { step: '01', title: 'Plan Site', desc: 'Configure floors, rooms, and budget ceilings.' },
              { step: '02', title: 'AI Synthesis', desc: 'FieldBot calculates real-time local cost audits.' },
              { step: '03', title: 'Verification', desc: 'Top-tier engineers verify structural integrity.' },
              { step: '04', title: 'Deploy', desc: 'Receive finalized technical blueprints & costs.' }
            ].map((s, idx) => (
              <div key={idx} className="relative z-10 flex flex-col p-8 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 group hover:bg-white/10 transition-all">
                <span className="text-4xl font-black text-construction-yellow italic mb-6 group-hover:scale-110 transition-transform origin-left">{s.step}</span>
                <h4 className="text-xl font-black text-white uppercase italic mb-2 tracking-tight">{s.title}</h4>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FAST-TRACK SPOTLIGHT */}
      <section id="fast-track" className="bg-slate-50 py-32 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20 items-center">
          <div className="flex-1 space-y-8">
            <div className="bg-construction-caution/10 text-construction-caution px-4 py-2 rounded-lg inline-flex items-center gap-2 border border-construction-caution/20">
              <i className="fas fa-clock animate-pulse"></i>
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">High Priority Delivery</span>
            </div>
            <h2 className="text-6xl font-black text-construction-slate uppercase italic leading-[0.9] tracking-tighter">
              Build <span className="text-construction-caution italic">Faster</span>, <br/>
              Stay Accurate.
            </h2>
            <p className="text-slate-500 font-medium text-lg leading-relaxed">
              Why wait 12 months? Our platform specializes in compressed timelines. With our <strong>Fast-Track Protocol</strong>, we prioritize your project in the engineering queue, ensuring structural approvals in under 48 hours.
            </p>
            <ul className="space-y-4">
              {['Accelerated structural analysis', 'Priority engineer matching', 'Real-time supply chain updates', 'Reduced paperwork overhead'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 font-black text-construction-slate uppercase italic text-sm">
                  <div className="w-6 h-6 rounded-full bg-construction-yellow flex items-center justify-center text-[10px]">
                    <i className="fas fa-check"></i>
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1">
            <div className="relative">
              <div className="absolute -inset-4 bg-construction-slate/10 rounded-[3rem] -rotate-3"></div>
              <img 
                src="https://images.unsplash.com/photo-1503387762-592dee58c460?auto=format&fit=crop&q=80&w=2000" 
                className="relative rounded-[2.5rem] shadow-2xl grayscale hover:grayscale-0 transition-all duration-700" 
                alt="Construction Management"
              />
              <div className="absolute -bottom-10 -right-10 bg-white p-10 rounded-[2rem] shadow-2xl border-4 border-construction-yellow hidden sm:block">
                 <p className="text-4xl font-black text-construction-slate italic">-45%</p>
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Reduction in planning time</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FIELDBOT AI SHOWCASE */}
      <section className="py-32 px-6 bg-white border-y-8 border-slate-100">
        <div className="max-w-4xl mx-auto text-center space-y-12">
           <div className="w-24 h-24 bg-construction-slate text-construction-yellow rounded-[2rem] flex items-center justify-center text-4xl mx-auto shadow-2xl mb-8">
              <i className="fas fa-robot animate-bounce"></i>
           </div>
           <h2 className="text-5xl font-black text-construction-slate uppercase italic tracking-tighter">Powered by <span className="text-construction-caution">FieldBot AI</span></h2>
           <p className="text-xl text-slate-500 font-medium leading-relaxed italic px-6">
             "I process millions of regional data points to ensure your estimate isn't just a guess—it's a calculated site strategy using real-time market grounding."
           </p>
           <div className="flex flex-wrap justify-center gap-4">
              <span className="bg-slate-100 px-6 py-2 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest border border-slate-200">Real-time Steel Rates</span>
              <span className="bg-slate-100 px-6 py-2 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest border border-slate-200">Local Labor Wage Scans</span>
              <span className="bg-slate-100 px-6 py-2 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest border border-slate-200">Cement Market Indexing</span>
           </div>
        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section className="bg-slate-50 py-32 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-black text-construction-slate uppercase italic tracking-tighter text-center mb-16">Intelligence <span className="text-construction-yellow">Registry FAQ</span></h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border-2 border-slate-100 overflow-hidden transition-all">
                <button 
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full p-6 text-left flex justify-between items-center group"
                >
                  <span className="font-black text-construction-slate uppercase italic text-sm tracking-tight">{faq.q}</span>
                  <i className={`fas fa-chevron-down transition-transform ${activeFaq === i ? 'rotate-180 text-construction-yellow' : 'text-slate-300'}`}></i>
                </button>
                {activeFaq === i && (
                  <div className="p-6 pt-0 text-slate-500 text-sm font-medium leading-relaxed animate-in slide-in-from-top-2 duration-300">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FINAL CALL TO ACTION */}
      <section className="relative py-40 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-construction-slate">
           <img src="https://images.unsplash.com/photo-1531834685032-c34bf0d84c77?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover opacity-20 grayscale" alt="Final construction background" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-12">
           <h2 className="text-6xl md:text-8xl font-black text-white uppercase italic leading-[0.8] tracking-tighter">
             Ready to <br/> 
             <span className="text-construction-yellow italic">Initialize</span>?
           </h2>
           <p className="text-xl text-slate-300 font-medium max-w-2xl mx-auto">
             Join thousands of homeowners who secured their budgets before the first brick was laid.
           </p>
           <div className="flex flex-col sm:flex-row justify-center gap-6">
             <button 
               onClick={onGetStarted}
               className="bg-construction-yellow hover:bg-white text-construction-slate px-12 py-6 rounded-2xl font-black text-2xl uppercase tracking-widest shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)] transition-all transform hover:-translate-y-1 active:translate-y-1 active:shadow-none"
             >
               Launch Project
             </button>
             <button className="bg-transparent border-2 border-white/30 hover:border-white text-white px-12 py-6 rounded-2xl font-black text-2xl uppercase tracking-widest transition-all">
               View Showcase
             </button>
           </div>
           <div className="pt-10 flex items-center justify-center gap-8 opacity-40 grayscale contrast-125">
             <i className="fas fa-hammer text-3xl text-white"></i>
             <i className="fas fa-screwdriver-wrench text-3xl text-white"></i>
             <i className="fas fa-helmet-safety text-3xl text-white"></i>
             <i className="fas fa-ruler-combined text-3xl text-white"></i>
           </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
