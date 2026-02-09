
import React, { useState, useEffect } from 'react';
import { User, Project, ProjectStatus, ConstructionDetails, FloorConfig, Estimate, ChatMessage } from '../types';
import LocationWidget from '../components/LocationWidget';
import ChatRoom from '../components/ChatRoom';

interface CustomerDashboardProps {
  user: User;
  projects: Project[];
  onAddProject: (p: Project) => void;
  onUpdateProject: (p: Project) => void;
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

const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ user, projects, onAddProject, onUpdateProject }) => {
  const [showWizard, setShowWizard] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  
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

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const updateFloorConfig = (floorNum: number, field: keyof FloorConfig, value: any) => {
    setDetails(prev => ({
      ...prev,
      floorConfigs: prev.floorConfigs.map(f => 
        f.floorNumber === floorNum ? { ...f, [field]: value } : f
      )
    }));
  };

  const handleFinalSubmit = () => {
    setLoading(true);
    const newProject: Project = {
      id: 'p' + Math.random().toString(36).substr(2, 5),
      customerId: user.id,
      customerName: user.name,
      status: ProjectStatus.SUBMITTED,
      createdAt: new Date().toISOString(),
      details,
      estimates: [],
      messages: []
    };

    setTimeout(() => {
      onAddProject(newProject);
      setShowWizard(false);
      setStep(1);
      setLoading(false);
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

  const activeProjectForChat = projects.find(p => p.id === activeChatId);

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10">
      <div className="flex flex-col lg:flex-row gap-10">
        
        <aside className="w-full lg:w-1/4 space-y-6">
          <div className="bg-construction-slate text-white rounded-xl p-8 shadow-xl border-t-8 border-construction-yellow">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-construction-yellow text-construction-slate rounded-xl flex items-center justify-center text-3xl font-black mb-4 transform -rotate-3">
                {user.name.charAt(0)}
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight">{user.name}</h2>
              <p className="text-construction-yellow text-xs font-bold uppercase tracking-widest mt-1">Project Owner</p>
            </div>
          </div>
          <LocationWidget />
        </aside>

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
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 bg-white p-6 rounded-xl border-b-4 border-construction-yellow shadow-sm">
                <div>
                  <h2 className="text-3xl font-black text-construction-slate uppercase italic">Site Dashboard</h2>
                  <p className="text-slate-500 font-medium">Track your pending requests and finalize site plans.</p>
                </div>
                <button 
                  onClick={() => setShowWizard(true)}
                  className="bg-construction-yellow hover:bg-construction-yellowDark text-construction-slate px-8 py-4 rounded-lg font-black uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(30,41,59,1)] transition-all flex items-center gap-2"
                >
                  <i className="fas fa-hard-hat"></i>
                  Post New Request
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.length === 0 ? (
                  <div className="col-span-full bg-white border-4 border-dashed border-slate-200 rounded-xl p-20 text-center">
                    <i className="fas fa-drafting-compass text-5xl text-slate-300 mb-6 block"></i>
                    <h3 className="text-2xl font-black text-slate-700 uppercase">No active projects</h3>
                    <p className="text-slate-500 mt-2">Submit a request to start receiving engineer quotes.</p>
                  </div>
                ) : (
                  projects.map(p => (
                    <div key={p.id} className="bg-white rounded-xl overflow-hidden shadow-md border-l-8 border-construction-slate flex flex-col">
                      <div className="p-6 flex-grow">
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <span className={`px-3 py-1 rounded text-[10px] font-black uppercase tracking-tighter ${
                              p.status === ProjectStatus.FINALIZED ? 'bg-green-600 text-white' : 
                              p.status === ProjectStatus.APPROVED ? 'bg-amber-500 text-construction-slate' : 'bg-slate-800 text-white'
                            }`}>
                              {p.status}
                            </span>
                            <p className="text-[10px] text-slate-400 font-bold mt-2">PROJECT #{p.id.toUpperCase()}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-black text-slate-800 uppercase tracking-tighter">Budget Range</p>
                            <p className="text-xs font-bold text-construction-caution">{p.details.budgetRange}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="bg-slate-50 p-3 rounded border border-slate-100">
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Area</p>
                            <p className="text-sm font-black">{p.details.plotArea} SQ FT</p>
                          </div>
                          <div className="bg-slate-50 p-3 rounded border border-slate-100">
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Configuration</p>
                            <p className="text-sm font-black">{p.details.floors} FLOORS</p>
                          </div>
                        </div>

                        {p.status === ProjectStatus.APPROVED && p.estimates.length > 0 && (
                          <div className="bg-amber-50 border-2 border-amber-200 p-4 rounded-lg mb-4">
                            <div className="flex items-center gap-2 mb-3">
                              <i className="fas fa-clipboard-check text-amber-600"></i>
                              <p className="text-xs font-black uppercase text-amber-700 tracking-tight">Engineer's Quote Received</p>
                            </div>
                            <div className="space-y-1 text-sm font-bold text-slate-800">
                              <div className="flex justify-between"><span>Material Cost:</span> <span>{formatCurrency(p.estimates[0].materialCost)}</span></div>
                              <div className="flex justify-between border-b-2 border-amber-100 pb-1"><span>Labor Cost:</span> <span>{formatCurrency(p.estimates[0].laborCost)}</span></div>
                              <div className="flex justify-between pt-1 text-base text-construction-slate"><span>Total Final Cost:</span> <span>{formatCurrency(p.estimates[0].materialCost + p.estimates[0].laborCost)}</span></div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col">
                        {p.status === ProjectStatus.APPROVED && (
                          <button 
                            onClick={() => handleFinalizeProject(p)}
                            className="w-full bg-green-600 hover:bg-green-700 text-white py-4 font-black uppercase tracking-widest transition-all"
                          >
                            Finalize & Start Building
                          </button>
                        )}
                        {p.status === ProjectStatus.FINALIZED && (
                          <button 
                            onClick={() => setActiveChatId(p.id)}
                            className="w-full bg-construction-slate text-construction-yellow py-4 font-black uppercase tracking-widest transition-all hover:bg-black flex items-center justify-center gap-2"
                          >
                            <i className="fas fa-comments"></i>
                            Open Site Chat
                          </button>
                        )}
                        {p.status === ProjectStatus.SUBMITTED && (
                          <div className="bg-slate-900 text-white p-4 text-center text-[10px] font-black uppercase tracking-widest opacity-80">
                            <i className="fas fa-hourglass-half mr-2 animate-spin"></i>
                            Awaiting Engineer Approval
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

      {showWizard && (
        <div className="fixed inset-0 z-[60] bg-construction-slate/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-lg overflow-hidden shadow-2xl animate-in zoom-in duration-200 border-4 border-construction-yellow">
            <div className="bg-construction-slate text-white p-6 flex justify-between items-center">
              <h3 className="text-xl font-black uppercase tracking-widest">New Project Specification</h3>
              <button onClick={() => {setShowWizard(false); setStep(1);}} className="text-construction-yellow hover:scale-110 transition-transform">
                <i className="fas fa-times-circle text-2xl"></i>
              </button>
            </div>
            
            <div className="p-8 max-h-[70vh] overflow-y-auto construction-grid">
              {step === 1 && (
                <div className="space-y-6">
                  <h4 className="text-2xl font-black text-construction-slate uppercase italic">Site Dimensions</h4>
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase mb-2">Build Area (SQ FT)</label>
                    <input type="number" className={inputClasses} value={details.plotArea} onChange={e => setDetails({...details, plotArea: Number(e.target.value)})} />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase mb-2">Floor Count</label>
                    <div className="grid grid-cols-5 gap-3">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                        <button key={n} onClick={() => setDetails({...details, floors: n})} className={`py-4 rounded font-black border-2 transition-all ${details.floors === n ? 'bg-construction-yellow border-construction-slate text-construction-slate shadow-md' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <h4 className="text-2xl font-black text-construction-slate uppercase italic">Internal Layout</h4>
                  {details.floorConfigs.map(f => (
                    <div key={f.floorNumber} className="p-5 bg-white border-2 border-slate-200 rounded-lg space-y-4 shadow-sm">
                      <p className="font-black text-construction-slate uppercase text-sm border-b-2 border-construction-yellow pb-1 inline-block">Floor {f.floorNumber}</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-black uppercase text-slate-400">Rooms</label>
                          <input type="number" className={inputClasses + " p-2 text-sm"} value={f.rooms} onChange={e => updateFloorConfig(f.floorNumber, 'rooms', Number(e.target.value))} />
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase text-slate-400">Baths</label>
                          <input type="number" className={inputClasses + " p-2 text-sm"} value={f.bathrooms} onChange={e => updateFloorConfig(f.floorNumber, 'bathrooms', Number(e.target.value))} />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase text-slate-400">Kitchen Ventilation</label>
                        <div className="flex gap-2">
                          {['Without Chimney', 'With Chimney'].map(type => (
                            <button key={type} onClick={() => updateFloorConfig(f.floorNumber, 'kitchenType', type)} className={`flex-1 py-2 rounded text-[10px] font-black uppercase transition-all ${f.kitchenType === type ? 'bg-construction-slate text-white' : 'bg-slate-100 text-slate-400'}`}>
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
                <div className="space-y-6">
                  <h4 className="text-2xl font-black text-construction-slate uppercase italic">Budget & Logistics</h4>
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase mb-2">Intended Budget Range</label>
                    <select 
                      className={inputClasses}
                      value={details.budgetRange}
                      onChange={e => setDetails({...details, budgetRange: e.target.value})}
                    >
                      {BUDGET_RANGES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-construction-slate text-white rounded-lg">
                    <div>
                      <p className="font-black uppercase tracking-wider text-sm">Site Parking</p>
                      <p className="text-[10px] text-slate-400">Include garage/driveway planning</p>
                    </div>
                    <button onClick={() => setDetails({...details, parking: !details.parking})} className={`w-14 h-8 rounded-full relative transition-colors ${details.parking ? 'bg-construction-yellow' : 'bg-slate-600'}`}>
                      <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${details.parking ? 'left-7' : 'left-1'}`}></div>
                    </button>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase mb-2">Contractor Notes</label>
                    <textarea className={inputClasses + " h-24 resize-none font-normal"} placeholder="Special requests..." value={details.notes} onChange={e => setDetails({...details, notes: e.target.value})} />
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 bg-slate-50 flex gap-4 border-t-4 border-construction-yellow">
              {step > 1 && (
                <button onClick={handleBack} className="px-8 py-3 rounded font-black uppercase text-slate-500 border-2 border-slate-300 hover:bg-slate-100">Back</button>
              )}
              <button 
                onClick={step === 3 ? handleFinalSubmit : handleNext}
                disabled={loading}
                className="flex-1 bg-construction-yellow text-construction-slate py-4 rounded font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(30,41,59,1)] transition-all flex items-center justify-center gap-2 active:shadow-none active:translate-y-1"
              >
                {loading ? <i className="fas fa-spinner fa-spin"></i> : (step === 3 ? 'Finalize Request' : 'Next Phase')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
