
import React, { useState, useEffect } from 'react';
import { User, Project, ProjectStatus, ConstructionDetails, FloorConfig, Estimate, ChatMessage, LayoutArchive } from '../types';
import ChatRoom from '../components/ChatRoom';
import { generateTripleLayouts } from '../services/geminiService';
import EngineerProfileViewModal from '../components/EngineerProfileViewModal';
import ImagePreviewModal from '../components/ImagePreviewModal';
import SuccessTick from '../components/SuccessTick';

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
  "₹30 - ₹50 Lakhs",
  "₹50 - ₹80 Lakhs",
  "₹80 Lakhs - ₹1.3 Crore",
  "₹1.5 Crore++"
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
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [viewingHistoryProject, setViewingHistoryProject] = useState<Project | null>(null);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [showAdvancedSpecs, setShowAdvancedSpecs] = useState(false);
  
  const [details, setDetails] = useState<ConstructionDetails>({
    plotArea: 1000,
    floors: 1,
    floorConfigs: [{ floorNumber: 1, rooms: 2, bathrooms: 1, kitchenType: 'Without Chimney' }],
    parking: false,
    budgetRange: BUDGET_RANGES[0],
    timelineMonths: 6,
    notes: '',
    length: 50,
    breadth: 20,
    location: ''
  });

  const getDefaultTimeForFloors = (f: number) => {
    return 6 + (f - 1) * 4;
  };

  useEffect(() => {
    const defaultMonths = getDefaultTimeForFloors(details.floors);
    setDetails(prev => ({ ...prev, timelineMonths: defaultMonths }));
    
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

  useEffect(() => {
    if (showAdvancedSpecs && details.length && details.breadth) {
      const area = details.length * details.breadth;
      if (area !== details.plotArea) {
        setDetails(prev => ({ ...prev, plotArea: area }));
      }
    }
  }, [details.length, details.breadth, showAdvancedSpecs]);

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
    
    const archive: LayoutArchive[] = aiLayoutOptions.map(opt => ({
      url: opt.url,
      style: opt.style,
      generatedAt: new Date().toISOString(),
      floorCount: details.floors
    }));

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
      selectedLayoutUrl: aiLayoutOptions[selectedLayoutIndex].url,
      layoutHistory: archive
    };

    setTimeout(() => {
      onAddProject(newProject);
      setShowWizard(false);
      setStep(1);
      setLoading(false);
      setAiLayoutOptions([]);
      setSelectedLayoutIndex(null);
      
      setShowSuccessOverlay(true);
      setTimeout(() => setShowSuccessOverlay(false), 3500);
    }, 800);
  };

  const handleFinalizeProject = (project: Project) => {
    const updated: Project = { ...project, status: ProjectStatus.FINALIZED };
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
    const updated: Project = { ...project, messages: [...(project.messages || []), newMessage] };
    onUpdateProject(updated);
  };

  const activeProjectForChat = projects.find(p => p.id === activeChatId);
  const isTimeReduced = details.timelineMonths < getDefaultTimeForFloors(details.floors);

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=2070" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-[3px]"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto p-6 md:p-10">
        <div className="flex flex-col gap-10">
          <div className="flex-grow">
            {activeProjectForChat ? (
              <div className="h-[600px] mb-10">
                <ChatRoom project={activeProjectForChat} currentUser={user} onSendMessage={handleSendMessage} onClose={() => setActiveChatId(null)} />
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
                  <button onClick={() => setShowWizard(true)} className="bg-construction-yellow hover:bg-construction-yellowDark text-construction-slate px-10 py-5 rounded-xl font-black uppercase tracking-widest shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] transition-all hover:-translate-y-1 active:translate-y-0 active:shadow-none flex items-center gap-3">
                    <i className="fas fa-plus-circle text-xl"></i> Initialize New Site
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {projects.length === 0 ? (
                    <div className="col-span-full bg-white/5 backdrop-blur-sm border-4 border-dashed border-white/10 rounded-3xl p-24 text-center">
                      <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8">
                        <i className="fas fa-hammer text-5xl text-construction-yellow/40"></i>
                      </div>
                      <h3 className="text-3xl font-black text-white/50 uppercase italic">No Active Deployments</h3>
                    </div>
                  ) : (
                    projects.map(p => (
                      <div key={p.id} className="bg-white rounded-3xl overflow-hidden shadow-2xl border-b-8 border-construction-slate flex flex-col group hover:-translate-y-2 transition-all duration-300">
                        {p.selectedLayoutUrl && (
                          <div className="h-56 overflow-hidden relative border-b-2 border-slate-100 bg-slate-900 cursor-zoom-in" onClick={() => setPreviewImageUrl(p.selectedLayoutUrl || null)}>
                            <img src={p.selectedLayoutUrl} alt="Selected Design" className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute top-4 right-4 bg-construction-slate text-construction-yellow text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">Site Plan ID: {p.id.toUpperCase()}</div>
                          </div>
                        )}
                        <div className="p-8 flex-grow">
                          <div className="flex justify-between items-start mb-8">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.1em] ${p.status === ProjectStatus.FINALIZED ? 'bg-green-600 text-white shadow-lg' : p.status === ProjectStatus.APPROVED ? 'bg-amber-400 text-construction-slate shadow-lg' : 'bg-slate-800 text-white shadow-lg'}`}>
                                {p.status}
                            </span>
                            <div className="text-right">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Budget Ceiling</p>
                              <p className="text-sm font-black text-construction-caution">{p.details.budgetRange}</p>
                            </div>
                          </div>
                          {p.details.location && (
                            <div className="mb-4 flex items-center gap-2">
                                <i className="fas fa-map-marker-alt text-construction-caution text-xs"></i>
                                <span className="text-[11px] font-black text-slate-600 uppercase tracking-wide truncate">{p.details.location}</span>
                            </div>
                          )}
                          <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-100 flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-construction-slate/5 flex items-center justify-center"><i className="fas fa-expand-arrows-alt text-construction-slate/60 text-lg"></i></div>
                              <div><p className="text-[9px] text-slate-400 font-black uppercase leading-none mb-1">Area</p><p className="text-lg font-black italic">{p.details.plotArea} SQFT</p></div>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-100 flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-construction-slate/5 flex items-center justify-center"><i className="fas fa-calendar-check text-construction-slate/60 text-lg"></i></div>
                              <div><p className="text-[9px] text-slate-400 font-black uppercase leading-none mb-1">Timeline</p><p className="text-lg font-black italic">{p.details.timelineMonths} Months</p></div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col">
                          {p.status === ProjectStatus.APPROVED && (
                            <button onClick={() => handleFinalizeProject(p)} className="w-full bg-green-600 hover:bg-green-700 text-white py-5 font-black uppercase tracking-widest transition-all">Finalize & Deploy</button>
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
            <div className="bg-construction-slate text-white p-6 flex justify-between items-center">
              <h3 className="text-xl font-black uppercase tracking-widest italic">Phase {step}: Site Configuration</h3>
              <button onClick={() => {setShowWizard(false); setStep(1); setAiLayoutOptions([]);}} className="text-construction-yellow hover:scale-110"><i className="fas fa-times-circle text-2xl"></i></button>
            </div>
            <div className="p-8 overflow-y-auto construction-grid flex-grow">
              {step === 1 && (
                <div className="space-y-6 max-w-2xl mx-auto">
                  <h4 className="text-2xl font-black text-construction-slate uppercase italic">Structural Scope</h4>
                  
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Build Area / Project Location</label>
                    <input 
                        type="text" 
                        className={inputClasses} 
                        value={details.location || ''} 
                        onChange={e => setDetails({...details, location: e.target.value})} 
                        placeholder="e.g. Village Name, City, Pincode" 
                    />
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">Total Plot Area (SQ FT)</label>
                    <button 
                      onClick={() => setShowAdvancedSpecs(!showAdvancedSpecs)}
                      className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border-2 ${showAdvancedSpecs ? 'bg-construction-yellow border-construction-slate text-construction-slate' : 'bg-slate-100 border-slate-200 text-slate-400'}`}
                    >
                      {showAdvancedSpecs ? 'Dimensions Enabled' : 'Add Dimensions'}
                    </button>
                  </div>

                  {!showAdvancedSpecs ? (
                    <input type="number" className={inputClasses} value={details.plotArea || ''} onChange={e => setDetails({...details, plotArea: Number(e.target.value)})} placeholder="e.g. 1500" />
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Length (FT)</label>
                        <input type="number" className={inputClasses} value={details.length || ''} onChange={e => setDetails({...details, length: Number(e.target.value)})} />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Breadth (FT)</label>
                        <input type="number" className={inputClasses} value={details.breadth || ''} onChange={e => setDetails({...details, breadth: Number(e.target.value)})} />
                      </div>
                    </div>
                  )}

                  <div className="pt-4">
                    <label className="block text-xs font-black text-slate-500 uppercase mb-2">Vertical Floor Count</label>
                    <div className="grid grid-cols-5 gap-3">
                      {[1, 2, 3, 4, 5].map(n => (
                        <button key={n} onClick={() => setDetails({...details, floors: n})} className={`py-4 rounded font-black border-2 transition-all ${details.floors === n ? 'bg-construction-yellow border-construction-slate text-construction-slate' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>{n}</button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {step === 2 && (
                <div className="space-y-6 max-w-3xl mx-auto">
                  <h4 className="text-2xl font-black text-construction-slate uppercase italic text-center mb-8 underline decoration-construction-yellow decoration-4 underline-offset-8">Floor Loadout Configuration</h4>
                  {details.floorConfigs.map(f => (
                    <div key={f.floorNumber} className="p-6 bg-slate-50 border-4 border-white rounded-3xl space-y-5 shadow-inner">
                      <p className="font-black text-construction-slate uppercase text-[10px] tracking-widest bg-construction-yellow px-3 py-1.5 inline-block rounded-full mb-2">LOADOUT: LEVEL {f.floorNumber}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="block text-xs font-black text-slate-600 uppercase tracking-widest ml-1 mb-1">Total Rooms</label>
                           <input type="number" className={inputClasses} placeholder="Number of Rooms" value={f.rooms || ''} onChange={e => updateFloorConfig(f.floorNumber, 'rooms', Number(e.target.value))} />
                        </div>
                        <div className="space-y-2">
                           <label className="block text-xs font-black text-slate-600 uppercase tracking-widest ml-1 mb-1">Bathrooms</label>
                           <input type="number" className={inputClasses} placeholder="Number of Baths" value={f.bathrooms || ''} onChange={e => updateFloorConfig(f.floorNumber, 'bathrooms', Number(e.target.value))} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {step === 3 && (
                <div className="space-y-6 max-w-2xl mx-auto">
                  <h4 className="text-2xl font-black text-construction-slate uppercase italic">Deployment Schedule</h4>
                  <div className="flex justify-between items-end mb-4">
                     <label className="text-xs font-black text-slate-500 uppercase">Duration (Months)</label>
                     <span className={`text-2xl font-black italic ${isTimeReduced ? 'text-red-600' : 'text-construction-slate'}`}>{details.timelineMonths} MONTHS</span>
                  </div>
                  <input type="range" min="3" max="60" className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-construction-slate" value={details.timelineMonths} onChange={e => setDetails({...details, timelineMonths: Number(e.target.value)})} />
                  
                  {isTimeReduced && (
                    <div className="p-6 bg-red-50 border-4 border-red-200 rounded-2xl animate-pulse text-red-700 text-[10px] font-black uppercase italic mt-4">
                      Urgency Surcharge Alert: Fast-track construction below {getDefaultTimeForFloors(details.floors)} months increases costs by 15%.
                    </div>
                  )}

                  <div className="pt-8">
                    <label className="block text-xs font-black text-slate-500 uppercase mb-4 tracking-widest">Planned Budget Ceiling</label>
                    <div className="grid grid-cols-2 gap-3">
                      {BUDGET_RANGES.map(r => (
                        <button 
                          key={r}
                          onClick={() => setDetails({...details, budgetRange: r})}
                          className={`p-4 rounded-xl font-black uppercase text-[10px] border-2 transition-all ${details.budgetRange === r ? 'bg-construction-slate text-construction-yellow border-construction-slate shadow-xl' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {step === 4 && (
                <div className="space-y-8">
                  <div className="text-center">
                    <h4 className="text-3xl font-black text-construction-slate uppercase italic">Architectural Site Strategy</h4>
                    <p className="text-slate-500 font-bold text-xs uppercase mt-1">Generating multi-level layout including mandatory stairwells.</p>
                  </div>
                  {generatingLayout ? (
                    <div className="py-24 text-center"><i className="fas fa-drafting-compass fa-spin text-7xl text-construction-yellow mb-8"></i><p className="text-sm font-black uppercase tracking-[0.3em] text-slate-600 animate-pulse italic">Synthesizing Dimensional Blueprint...</p></div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {aiLayoutOptions.map((opt, idx) => (
                        <div key={idx} onClick={() => setSelectedLayoutIndex(idx)} className={`relative cursor-pointer group rounded-xl overflow-hidden border-4 transition-all ${selectedLayoutIndex === idx ? 'border-construction-yellow shadow-2xl scale-[1.02] z-10' : 'border-slate-100 opacity-60'}`}>
                          <img src={opt.url} className="w-full aspect-square object-contain p-2" />
                          <div className={`p-4 ${selectedLayoutIndex === idx ? 'bg-construction-yellow text-construction-slate' : 'bg-slate-50 text-slate-500'}`}><p className="font-black uppercase italic text-xs">{opt.style}</p></div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="p-6 bg-slate-50 flex gap-4 border-t-4 border-construction-yellow">
              {step > 1 && <button onClick={handleBack} className="px-8 py-4 rounded font-black uppercase text-xs text-slate-500 border-2 border-slate-300">Previous</button>}
              <button onClick={step === 4 ? handleFinalSubmit : handleNext} disabled={loading || generatingLayout || (step === 4 && selectedLayoutIndex === null)} className="flex-1 bg-construction-yellow text-construction-slate py-4 rounded font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(30,41,59,1)] active:translate-y-1 transition-all disabled:opacity-30">
                {loading ? <i className="fas fa-spinner fa-spin"></i> : (step === 4 ? 'Confirm & Deploy' : 'Advance Stage')}
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessOverlay && <SuccessTick message="Order Sent to Engineer" subMessage="Review sent for verification" />}
      {previewImageUrl && <ImagePreviewModal url={previewImageUrl} onClose={() => setPreviewImageUrl(null)} title="Architectural Site Layout" />}
    </div>
  );
};

export default CustomerDashboard;
