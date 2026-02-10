
import React, { useState, useEffect } from 'react';
import { User, Project, ProjectStatus, ConstructionDetails, FloorConfig, Estimate, ChatMessage } from '../types';
import ChatRoom from '../components/ChatRoom';
import { generateTripleLayouts } from '../services/geminiService';
import EngineerProfileViewModal from '../components/EngineerProfileViewModal';

interface CustomerDashboardProps {
  user: User;
  projects: Project[];
  onAddProject: (p: Project) => void;
  onUpdateProject: (p: Project) => void;
  allUsers: User[];
}

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(val);
};

const BUDGET_RANGES = [
  "Below ₹15 Lakhs",
  "₹15 - ₹30 Lakhs",
  "₹30 - ₹50 Lakhs",
  "₹50 - ₹80 Lakhs",
  "₹80 Lakhs - ₹1.5 Crore",
  "Above ₹1.5 Crore"
];

const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ user, projects, onAddProject, onUpdateProject, allUsers }) => {
  const [showWizard, setShowWizard] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [generatingLayout, setGeneratingLayout] = useState(false);
  const [aiLayoutOptions, setAiLayoutOptions] = useState<{url: string, style: string}[]>([]);
  const [selectedLayoutIndex, setSelectedLayoutIndex] = useState<number | null>(null);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [viewingEngineer, setViewingEngineer] = useState<User | null>(null);
  
  const [details, setDetails] = useState<ConstructionDetails>({
    plotArea: 1000,
    floors: 1,
    floorConfigs: [{ floorNumber: 1, rooms: 2, bathrooms: 1, kitchenType: 'Without Chimney' }],
    parking: false,
    budgetRange: BUDGET_RANGES[1],
    notes: ''
  });

  useEffect(() => {
    if (details.floors !== details.floorConfigs.length) {
      const newConfigs: FloorConfig[] = [];
      for (let i = 1; i <= details.floors; i++) {
        const existing = details.floorConfigs.find(f => f.floorNumber === i);
        if (existing) {
          newConfigs.push(existing);
        } else {
          newConfigs.push({ 
            floorNumber: i, 
            rooms: 2, 
            bathrooms: 1, 
            kitchenType: 'Without Chimney' 
          });
        }
      }
      setDetails(prev => ({ ...prev, floorConfigs: newConfigs }));
    }
  }, [details.floors]);

  const inputClasses = "w-full p-4 rounded-lg border-2 border-slate-200 bg-white text-slate-950 focus:border-construction-yellow outline-none transition-all font-bold";

  const handleNext = async () => {
    if (step === 3) {
      setStep(4);
      handleGenerateLayouts();
    } else {
      setStep(prev => prev + 1);
    }
  };
  
  const handleBack = () => setStep(prev => prev - 1);

  const handleGenerateLayouts = async () => {
    setGeneratingLayout(true);
    setSelectedLayoutIndex(null);
    const options = await generateTripleLayouts(details);
    setAiLayoutOptions(options);
    setGeneratingLayout(false);
  };

  const updateFloorConfig = (floorNum: number, field: keyof FloorConfig, value: any) => {
    setDetails(prev => ({
      ...prev,
      floorConfigs: prev.floorConfigs.map(f => 
        f.floorNumber === floorNum ? { ...f, [field]: value } : f
      )
    }));
  };

  const handleFinalSubmit = () => {
    if (selectedLayoutIndex === null) return;

    setLoading(true);
    const newProject: Project = {
      id: 'p' + Math.random().toString(36).substr(2, 5),
      customerId: user.id,
      customerName: user.name,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobile_number: user.phone,
      status: ProjectStatus.SUBMITTED,
      createdAt: new Date().toISOString(),
      details,
      estimates: [],
      messages: [],
      selectedLayoutUrl: aiLayoutOptions[selectedLayoutIndex].url
    };

    setTimeout(() => {
      onAddProject(newProject);
      setShowWizard(false);
      setStep(1);
      setLoading(false);
      setAiLayoutOptions([]);
      setSelectedLayoutIndex(null);
    }, 800);
  };

  const handleFinalizeProject = (project: Project) => {
    const updated: Project = {
      ...project,
      status: ProjectStatus.FINALIZED
    };
    onUpdateProject(updated);
  };

  const handleSendMessage = (projectId: string, msgData: Partial<ChatMessage>) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const newMessage: ChatMessage = {
      id: 'm' + Math.random().toString(36).substr(2, 5),
      senderId: user.id,
      senderName: user.name,
      role: user.role,
      ...msgData,
      timestamp: msgData.timestamp || new Date().toISOString(),
    };

    const updated: Project = {
      ...project,
      messages: [...(project.messages || []), newMessage]
    };
    onUpdateProject(updated);
  };

  const handleViewEngineer = (engineerId: string) => {
    const eng = allUsers.find(u => u.id === engineerId);
    if (eng) {
      setViewingEngineer(eng);
    }
  };

  const activeProjectForChat = projects.find(p => p.id === activeChatId);

  return (
    <div className="relative min-h-screen">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=2070" 
          alt="Construction Site Home" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-900/75 backdrop-blur-[3px]"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto p-6 md:p-10">
        <div className="flex flex-col gap-10">
          <div className="flex-grow">
            {activeProjectForChat ? (
              <div className="h-[600px] mb-10">
                <ChatRoom 
                  project={activeProjectForChat} 
                  currentUser={user} 
                  onSendMessage={handleSendMessage}
                  onClose={() => setActiveChatId(null)}
                />
              </div>
            ) : (
              <>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-2xl">
                  <div>
                    <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">
                      Customer <span className="text-construction-yellow">Terminal</span>
                    </h2>
                    <p className="text-slate-300 font-bold text-xs uppercase tracking-[0.2em] mt-2">Authenticated Site Owner: {user.name}</p>
                  </div>
                  <button 
                    onClick={() => setShowWizard(true)}
                    className="bg-construction-yellow hover:bg-construction-yellowDark text-construction-slate px-10 py-5 rounded-xl font-black uppercase tracking-widest shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] transition-all hover:-translate-y-1 active:translate-y-0 active:shadow-none flex items-center gap-3"
                  >
                    <i className="fas fa-plus-circle text-xl"></i>
                    Initialize New Site
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {projects.length === 0 ? (
                    <div className="col-span-full bg-white/5 backdrop-blur-sm border-4 border-dashed border-white/10 rounded-3xl p-24 text-center">
                      <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8">
                        <i className="fas fa-hammer text-5xl text-construction-yellow/40"></i>
                      </div>
                      <h3 className="text-3xl font-black text-white/50 uppercase italic">No Active Deployments</h3>
                      <p className="text-white/30 mt-4 font-bold text-sm uppercase tracking-widest">Your construction history starts here</p>
                    </div>
                  ) : (
                    projects.map(p => (
                      <div key={p.id} className="bg-white rounded-3xl overflow-hidden shadow-2xl border-b-8 border-construction-slate flex flex-col group hover:-translate-y-2 transition-all duration-300">
                        {p.selectedLayoutUrl && (
                          <div className="h-56 overflow-hidden relative border-b-2 border-slate-100 bg-slate-900">
                            <img src={p.selectedLayoutUrl} alt="Selected Design" className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute top-4 right-4 bg-construction-slate text-construction-yellow text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">Site Plan ID: {p.id.toUpperCase()}</div>
                          </div>
                        )}
                        <div className="p-8 flex-grow">
                          <div className="flex justify-between items-start mb-8">
                            <div>
                              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.1em] ${
                                p.status === ProjectStatus.FINALIZED ? 'bg-green-600 text-white shadow-lg' : 
                                p.status === ProjectStatus.APPROVED ? 'bg-amber-400 text-construction-slate shadow-lg' : 'bg-slate-800 text-white shadow-lg'
                              }`}>
                                {p.status}
                              </span>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Budget Ceiling</p>
                              <p className="text-sm font-black text-construction-caution">{p.details.budgetRange}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-100 flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-construction-slate/5 flex items-center justify-center">
                                <i className="fas fa-expand-arrows-alt text-construction-slate/60 text-lg"></i>
                              </div>
                              <div>
                                 <p className="text-[9px] text-slate-400 font-black uppercase leading-none mb-1">Area</p>
                                 <p className="text-lg font-black italic">{p.details.plotArea} SQFT</p>
                              </div>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-100 flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-construction-slate/5 flex items-center justify-center">
                                <i className="fas fa-layer-group text-construction-slate/60 text-lg"></i>
                              </div>
                              <div>
                                 <p className="text-[9px] text-slate-400 font-black uppercase leading-none mb-1">Levels</p>
                                 <p className="text-lg font-black italic">{p.details.floors} STORY</p>
                              </div>
                            </div>
                          </div>

                          {p.status === ProjectStatus.APPROVED && p.estimates.length > 0 && (
                            <div className="bg-amber-50 border-4 border-amber-200 p-6 rounded-2xl mb-6 shadow-inner">
                              <div className="flex items-center justify-between mb-4 border-b-2 border-amber-200 pb-3">
                                <div className="flex items-center gap-3">
                                  <i className="fas fa-file-invoice-dollar text-amber-600 text-xl"></i>
                                  <p className="text-xs font-black uppercase text-amber-800 tracking-widest">Engineer's Official Quote</p>
                                </div>
                                <button 
                                  onClick={() => handleViewEngineer(p.estimates[0].engineerId)}
                                  className="text-[10px] font-black uppercase text-amber-700 underline decoration-amber-400 underline-offset-4 hover:text-amber-900 transition-colors"
                                >
                                  View Specialist Profile
                                </button>
                              </div>
                              <div className="space-y-2 text-sm font-bold text-slate-700">
                                <div className="flex justify-between"><span>Materials:</span> <span className="text-slate-900">{formatCurrency(p.estimates[0].materialCost)}</span></div>
                                <div className="flex justify-between pb-2"><span>Labor Force:</span> <span className="text-slate-900">{formatCurrency(p.estimates[0].laborCost)}</span></div>
                                
                                {p.estimates[0].tokenAmount && (
                                  <div className="p-3 bg-white rounded-lg border-2 border-amber-100 mt-2">
                                    <div className="flex justify-between items-center">
                                      <span className="text-[10px] font-black uppercase text-amber-600">Required Booking Token ({p.estimates[0].tokenPercentage}%)</span>
                                      <span className="text-sm font-black text-construction-slate">{formatCurrency(p.estimates[0].tokenAmount)}</span>
                                    </div>
                                    <p className="mt-2 text-[8px] font-black uppercase text-amber-700 leading-tight tracking-tighter">
                                      "THE REQUIRED BOOKING AMOUNT IS THE AMOUNT THAT ENGINEER WILL TAKE AS ADVANCE MONEY AFTER VISITING THE SITE"
                                    </p>
                                  </div>
                                )}

                                <div className="flex justify-between pt-4 text-xl text-construction-slate font-black border-t-2 border-amber-200">
                                  <span>TOTAL</span> 
                                  <span className="text-amber-700">{formatCurrency(p.estimates[0].materialCost + p.estimates[0].laborCost)}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col">
                          {p.status === ProjectStatus.APPROVED && (
                            <button 
                              onClick={() => handleFinalizeProject(p)}
                              className="w-full bg-green-600 hover:bg-green-700 text-white py-5 font-black uppercase tracking-widest transition-all shadow-[inset_0_-6px_0_0_rgba(20,83,45,1)] flex flex-col items-center leading-tight"
                            >
                              <span>Finalize & Deploy Construction</span>
                              {p.estimates[0]?.tokenAmount && (
                                <span className="text-[9px] font-bold opacity-80 uppercase tracking-widest mt-1">Pay Token: {formatCurrency(p.estimates[0].tokenAmount)} to Start</span>
                              )}
                            </button>
                          )}
                          {p.status === ProjectStatus.FINALIZED && (
                            <button 
                              onClick={() => setActiveChatId(p.id)}
                              className="w-full bg-construction-slate text-construction-yellow py-5 font-black uppercase tracking-widest transition-all hover:bg-black flex items-center justify-center gap-3 group/btn"
                            >
                              <i className="fas fa-hard-hat group-hover/btn:animate-bounce"></i>
                              Operational Terminal
                            </button>
                          )}
                          {p.status === ProjectStatus.SUBMITTED && (
                            <div className="bg-slate-900 text-white/40 p-5 text-center text-[11px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3">
                              <i className="fas fa-cog fa-spin"></i>
                              Awaiting Site Verification
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {showWizard && (
        <div className="fixed inset-0 z-[160] bg-construction-slate/95 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in duration-200 border-4 border-construction-yellow flex flex-col max-h-[90vh]">
            <div className="bg-construction-slate text-white p-6 flex justify-between items-center flex-shrink-0">
              <h3 className="text-xl font-black uppercase tracking-widest italic">Phase {step}: Architectural Specs</h3>
              <button onClick={() => {setShowWizard(false); setStep(1); setAiLayoutOptions([]); setSelectedLayoutIndex(null);}} className="text-construction-yellow hover:scale-110 transition-transform">
                <i className="fas fa-times-circle text-2xl"></i>
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto construction-grid flex-grow">
              {step === 1 && (
                <div className="space-y-6 max-w-2xl mx-auto">
                  <h4 className="text-2xl font-black text-construction-slate uppercase italic">Site Dimensions</h4>
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase mb-2">Total Build Area (SQ FT)</label>
                    <input type="number" className={inputClasses} value={details.plotArea || ''} onChange={e => setDetails({...details, plotArea: Number(e.target.value)})} />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase mb-2">Vertical Floor Count</label>
                    <div className="grid grid-cols-5 gap-3">
                      {[1, 2, 3, 4, 5].map(n => (
                        <button key={n} onClick={() => setDetails({...details, floors: n})} className={`py-4 rounded font-black border-2 transition-all ${details.floors === n ? 'bg-construction-yellow border-construction-slate text-construction-slate shadow-md' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 max-w-3xl mx-auto">
                  <h4 className="text-2xl font-black text-construction-slate uppercase italic">Internal Loadout</h4>
                  {details.floorConfigs.map(f => (
                    <div key={f.floorNumber} className="p-5 bg-white border-4 border-slate-100 rounded-lg space-y-4 shadow-sm">
                      <p className="font-black text-construction-slate uppercase text-[10px] tracking-widest bg-construction-yellow px-2 py-1 inline-block rounded">LEVEL {f.floorNumber}</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-black uppercase text-slate-500">Rooms/Halls</label>
                          <input type="number" className={inputClasses + " p-3 text-sm"} value={f.rooms || ''} onChange={e => updateFloorConfig(f.floorNumber, 'rooms', Number(e.target.value))} />
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase text-slate-500">Bathrooms</label>
                          <input type="number" className={inputClasses + " p-3 text-sm"} value={f.bathrooms || ''} onChange={e => updateFloorConfig(f.floorNumber, 'bathrooms', Number(e.target.value))} />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase text-slate-500">Kitchen Ventilation</label>
                        <div className="flex gap-2">
                          {['Without Chimney', 'With Chimney'].map(type => (
                            <button key={type} onClick={() => updateFloorConfig(f.floorNumber, 'kitchenType', type)} className={`flex-1 py-3 rounded text-[10px] font-black uppercase transition-all border-2 ${f.kitchenType === type ? 'bg-construction-slate border-construction-slate text-white' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 max-w-2xl mx-auto">
                  <h4 className="text-2xl font-black text-construction-slate uppercase italic">Logistics & Budget</h4>
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase mb-2">Maximum Budget Ceiling</label>
                    <select 
                      className={inputClasses}
                      value={details.budgetRange}
                      onChange={e => setDetails({...details, budgetRange: e.target.value})}
                    >
                      {BUDGET_RANGES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="flex items-center justify-between p-5 bg-construction-slate text-white rounded-lg border-b-4 border-construction-yellow">
                    <div>
                      <p className="font-black uppercase tracking-widest text-xs italic">Structural Parking Area</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Include garage reinforcement</p>
                    </div>
                    <button onClick={() => setDetails({...details, parking: !details.parking})} className={`w-14 h-8 rounded-full relative transition-colors ${details.parking ? 'bg-construction-yellow' : 'bg-slate-600'}`}>
                      <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${details.parking ? 'left-7' : 'left-1'}`}></div>
                    </button>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase mb-2">Additional Site Intelligence</label>
                    <textarea className={inputClasses + " h-32 resize-none font-medium text-sm"} placeholder="Soil type, elevation details, neighboring wall constraints..." value={details.notes} onChange={e => setDetails({...details, notes: e.target.value})} />
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-8">
                  <div className="text-center">
                    <h4 className="text-3xl font-black text-construction-slate uppercase italic">Select Your Blueprint Design</h4>
                    <p className="text-slate-500 font-bold text-xs uppercase mt-1">Our AI Architect has prepared 3 conceptual layouts based on your specs.</p>
                  </div>
                  
                  {generatingLayout ? (
                    <div className="py-24 text-center">
                      <div className="relative inline-block">
                         <i className="fas fa-drafting-compass fa-spin text-7xl text-construction-yellow"></i>
                         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full w-8 h-8 flex items-center justify-center">
                           <i className="fas fa-microchip text-slate-900 text-xs"></i>
                         </div>
                      </div>
                      <p className="text-sm font-black uppercase tracking-[0.3em] text-slate-600 mt-8 animate-pulse italic">Synthesizing Triple-Design Array...</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {aiLayoutOptions.map((opt, idx) => (
                        <div 
                          key={idx}
                          onClick={() => setSelectedLayoutIndex(idx)}
                          className={`relative cursor-pointer group rounded-xl overflow-hidden border-4 transition-all ${
                            selectedLayoutIndex === idx 
                            ? 'border-construction-yellow shadow-2xl scale-[1.02] z-10' 
                            : 'border-slate-100 opacity-60 hover:opacity-100 hover:border-slate-300'
                          }`}
                        >
                          <div className="aspect-square bg-white relative">
                            <img src={opt.url} alt={opt.style} className="w-full h-full object-contain" />
                            {selectedLayoutIndex === idx && (
                              <div className="absolute inset-0 bg-construction-yellow/10 pointer-events-none"></div>
                            )}
                          </div>
                          <div className={`p-4 ${selectedLayoutIndex === idx ? 'bg-construction-yellow text-construction-slate' : 'bg-slate-50 text-slate-500'}`}>
                             <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">Architecture Style</p>
                             <p className="font-black uppercase italic">{opt.style}</p>
                          </div>
                          {selectedLayoutIndex === idx && (
                            <div className="absolute top-3 right-3 bg-construction-slate text-construction-yellow w-8 h-8 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in">
                              <i className="fas fa-check font-black"></i>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {aiLayoutOptions.length === 0 && !generatingLayout && (
                    <div className="text-center py-20 bg-slate-50 rounded-xl border-4 border-dashed border-slate-200">
                      <p className="text-slate-400 font-black uppercase italic">Error generating layouts. Click re-generate below.</p>
                      <button onClick={handleGenerateLayouts} className="mt-4 text-xs font-black text-construction-slate underline">Try Again</button>
                    </div>
                  )}
                  
                  <div className="bg-slate-900 text-white p-6 rounded-xl border-l-8 border-construction-yellow flex flex-col md:flex-row justify-between items-center gap-4">
                     <div>
                        <p className="text-xs font-black uppercase text-construction-yellow tracking-widest italic">Site Logic Engine Status</p>
                        <p className="text-[10px] opacity-60 uppercase font-bold mt-1">Calculations based on {details.plotArea} sq ft & {details.floors} floors</p>
                     </div>
                     {!generatingLayout && (
                       <button 
                        onClick={handleGenerateLayouts}
                        className="text-[10px] font-black bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded uppercase tracking-widest transition-all"
                       >
                         <i className="fas fa-redo-alt mr-2"></i>
                         Discard & Regenerate
                       </button>
                     )}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 bg-slate-50 flex gap-4 border-t-4 border-construction-yellow flex-shrink-0">
              {step > 1 && (
                <button onClick={handleBack} className="px-8 py-4 rounded font-black uppercase text-xs text-slate-500 border-2 border-slate-300 hover:bg-slate-100 transition-colors">Previous</button>
              )}
              <button 
                onClick={step === 4 ? handleFinalSubmit : handleNext}
                disabled={loading || generatingLayout || (step === 4 && selectedLayoutIndex === null)}
                className="flex-1 bg-construction-yellow text-construction-slate py-4 rounded font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(30,41,59,1)] transition-all flex items-center justify-center gap-2 active:shadow-none active:translate-y-1 disabled:opacity-30"
              >
                {loading ? <i className="fas fa-spinner fa-spin"></i> : (step === 4 ? (selectedLayoutIndex === null ? 'Select a Design' : 'Confirm & Deploy') : 'Advance Stage')}
              </button>
            </div>
          </div>
        </div>
      )}

      {viewingEngineer && (
        <EngineerProfileViewModal 
          engineer={viewingEngineer} 
          onClose={() => setViewingEngineer(null)} 
        />
      )}
    </div>
  );
};

export default CustomerDashboard;
