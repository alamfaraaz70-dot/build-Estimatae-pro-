
import React, { useState } from 'react';
import { User, Project, ProjectStatus, Estimate, ChatMessage } from '../types';
import ChatRoom from '../components/ChatRoom';

interface EngineerDashboardProps {
  user: User;
  projects: Project[];
  onUpdateProject: (p: Project) => void;
}

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(val);
};

const EngineerDashboard: React.FC<EngineerDashboardProps> = ({ user, projects, onUpdateProject }) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [materialCost, setMaterialCost] = useState<string>('');
  const [laborCost, setLaborCost] = useState<string>('');
  const [tokenPercentage, setTokenPercentage] = useState<number>(5);
  const [message, setMessage] = useState('');

  const inputClasses = "w-full p-4 rounded-lg border-2 border-slate-200 bg-white text-slate-950 focus:border-construction-yellow outline-none transition-all font-bold";

  const numMaterialCost = Number(materialCost) || 0;
  const numLaborCost = Number(laborCost) || 0;
  const totalCost = numMaterialCost + numLaborCost;
  const tokenAmount = Math.round(totalCost * (tokenPercentage / 100));

  const handleApproveAndQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;

    const finalEstimate: Estimate = {
      engineerId: user.id,
      engineerName: user.name,
      materialCost: numMaterialCost,
      laborCost: numLaborCost,
      tokenPercentage,
      tokenAmount,
      submittedAt: new Date().toISOString(),
      message
    };

    const updated: Project = {
      ...selectedProject,
      status: ProjectStatus.APPROVED,
      estimates: [finalEstimate],
      messages: selectedProject.messages || []
    };

    onUpdateProject(updated);
    setSelectedProject(null);
    setMaterialCost('');
    setLaborCost('');
    setTokenPercentage(5);
    setMessage('');
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

  if (!user.isApproved) {
    return (
      <div className="relative min-h-screen flex items-center justify-center p-6">
        <div className="fixed inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=2070" 
            alt="Construction Verification" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"></div>
        </div>
        
        <div className="relative z-10 max-w-2xl w-full text-center p-12 bg-white rounded-3xl shadow-2xl border-t-8 border-construction-yellow">
          <div className="bg-amber-100 text-amber-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
            <i className="fas fa-hard-hat"></i>
          </div>
          <h2 className="text-3xl font-black text-construction-slate uppercase italic">Verification Pending</h2>
          <p className="text-slate-500 mt-4 max-w-md mx-auto leading-relaxed font-medium">
            Structural engineer credentials for <span className="text-construction-slate font-black underline decoration-construction-yellow">{user.name}</span> are currently undergoing central audit. Access to site registries will be granted post-validation.
          </p>
        </div>
      </div>
    );
  }

  const activeProjectForChat = projects.find(p => p.id === activeChatId);

  return (
    <div className="relative min-h-screen">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=2070" 
          alt="Engineer Site Registry" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-900/75 backdrop-blur-[3px]"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto p-6 md:p-10">
        <div className="flex flex-col gap-10">
          <div className="flex-grow">
            {activeProjectForChat ? (
              <div className="h-[600px]">
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
                      Engineer <span className="text-construction-yellow">Command</span>
                    </h2>
                    <p className="text-slate-300 font-bold text-xs uppercase tracking-[0.2em] mt-2">Active Specialist: {user.name} • Certified Professional</p>
                  </div>
                  <div className="bg-white/10 px-6 py-4 rounded-2xl border border-white/10 flex items-center gap-4">
                    <div className="text-right">
                       <p className="text-[10px] text-slate-400 font-black uppercase">Service Term</p>
                       <p className="text-white font-black">{user.experience} Years Exp.</p>
                    </div>
                    <div className="w-10 h-10 bg-construction-yellow text-construction-slate rounded-lg flex items-center justify-center font-black">
                      <i className="fas fa-check-double"></i>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  {projects.length === 0 ? (
                     <div className="bg-white/5 backdrop-blur-sm border-4 border-dashed border-white/10 rounded-3xl p-24 text-center">
                       <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8">
                         <i className="fas fa-clipboard-list text-5xl text-construction-yellow/40"></i>
                       </div>
                       <p className="text-3xl font-black text-white/50 uppercase italic">Registry Quiet</p>
                       <p className="text-white/30 mt-4 font-bold text-sm uppercase tracking-widest">No site requests pending engineering review</p>
                     </div>
                  ) : projects.map(p => (
                    <div 
                      key={p.id} 
                      className={`bg-white rounded-3xl shadow-2xl border-l-[12px] transition-all overflow-hidden ${
                        selectedProject?.id === p.id ? 'border-construction-yellow' : 'border-construction-slate'
                      }`}
                    >
                      <div className="p-8">
                        <div className="flex flex-col lg:flex-row justify-between gap-8">
                          <div className="flex-grow">
                            <div className="flex items-center gap-4 mb-4">
                              <span className="font-black text-2xl text-construction-slate uppercase tracking-tight">{p.customerName}'S DEPLOYMENT</span>
                              <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                p.status === ProjectStatus.SUBMITTED ? 'bg-construction-slate text-white' : 
                                p.status === ProjectStatus.APPROVED ? 'bg-amber-400 text-construction-slate' : 'bg-green-600 text-white'
                              }`}>
                                {p.status}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <p className="text-[9px] text-slate-400 font-black uppercase mb-1">Total Plot</p>
                                <p className="font-black text-construction-slate">{p.details.plotArea} SQFT</p>
                              </div>
                              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <p className="text-[9px] text-slate-400 font-black uppercase mb-1">Levels</p>
                                <p className="font-black text-construction-slate">{p.details.floors} STORY</p>
                              </div>
                              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <p className="text-[9px] text-slate-400 font-black uppercase mb-1">Target</p>
                                <p className="font-black text-construction-caution">{p.details.budgetRange}</p>
                              </div>
                              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <p className="text-[9px] text-slate-400 font-black uppercase mb-1">Parking</p>
                                <p className="font-black text-construction-slate">{p.details.parking ? 'YES' : 'NO'}</p>
                              </div>
                            </div>

                            <div className="bg-slate-900 text-white/90 p-6 rounded-2xl border-l-8 border-construction-yellow italic text-sm shadow-xl">
                              <span className="font-black uppercase text-[10px] text-construction-yellow block mb-2 tracking-widest">Site Intelligence Notes:</span>
                              "{p.details.notes || 'No specific site constraints reported by owner.'}"
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-3 lg:min-w-[240px]">
                            {p.status === ProjectStatus.SUBMITTED ? (
                              <button 
                                onClick={() => setSelectedProject(p)}
                                className="bg-construction-yellow hover:bg-construction-yellowDark text-construction-slate py-5 rounded-xl font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] transition-all active:shadow-none active:translate-y-1"
                              >
                                Create Estimate
                              </button>
                            ) : (
                              <div className="text-right bg-green-50 p-5 rounded-2xl border border-green-200">
                                <p className="text-[10px] font-black text-green-700 uppercase mb-2 tracking-widest">Official Quote Dispatched</p>
                                <p className="text-2xl font-black text-construction-slate italic">{formatCurrency((p.estimates[0].materialCost || 0) + (p.estimates[0].laborCost || 0))}</p>
                                {p.estimates[0].tokenAmount && (
                                  <p className="text-[11px] font-black text-slate-500 uppercase mt-1">Token: {formatCurrency(p.estimates[0].tokenAmount)} ({p.estimates[0].tokenPercentage}%)</p>
                                )}
                              </div>
                            )}
                            {(p.status === ProjectStatus.APPROVED || p.status === ProjectStatus.FINALIZED) && (
                              <button 
                                onClick={() => setActiveChatId(p.id)}
                                className="bg-construction-slate text-construction-yellow py-5 rounded-xl font-black uppercase flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl"
                              >
                                <i className="fas fa-comments"></i>
                                Field Communications
                              </button>
                            )}
                          </div>
                        </div>

                        {selectedProject?.id === p.id && (
                          <form onSubmit={handleApproveAndQuote} className="mt-12 pt-10 border-t-4 border-slate-100 animate-in slide-in-from-top-6 duration-300">
                            <h4 className="text-2xl font-black text-construction-slate uppercase italic mb-8 border-b-2 border-construction-yellow pb-2 inline-block">Final Site Valuation (INR)</h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                              <div>
                                <label className="block text-xs font-black text-slate-500 uppercase mb-3 tracking-widest">Structural Materials (₹)</label>
                                <input type="number" required className={inputClasses} value={materialCost} onChange={e => setMaterialCost(e.target.value)} />
                              </div>
                              <div>
                                <label className="block text-xs font-black text-slate-500 uppercase mb-3 tracking-widest">Skilled Labor Force (₹)</label>
                                <input type="number" required className={inputClasses} value={laborCost} onChange={e => setLaborCost(e.target.value)} />
                              </div>
                            </div>

                            <div className="mb-8 p-6 bg-slate-50 rounded-2xl border-2 border-slate-200">
                              <label className="block text-xs font-black text-slate-500 uppercase mb-4 tracking-widest">Select Booking Token Percentage</label>
                              <div className="grid grid-cols-3 gap-4">
                                {[5, 10, 15].map(pct => (
                                  <button 
                                    key={pct}
                                    type="button"
                                    onClick={() => setTokenPercentage(pct)}
                                    className={`py-4 rounded-xl font-black uppercase tracking-widest border-4 transition-all ${
                                      tokenPercentage === pct 
                                      ? 'bg-construction-yellow border-construction-slate text-construction-slate shadow-xl scale-105' 
                                      : 'bg-white border-slate-200 text-slate-400 hover:border-construction-yellow'
                                    }`}
                                  >
                                    {pct}% Token
                                  </button>
                                ))}
                              </div>
                              <div className="mt-6 flex justify-between items-center bg-white p-4 rounded-xl border-2 border-slate-100">
                                <div>
                                  <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Total Project Cost</p>
                                  <p className="text-lg font-black text-construction-slate">{formatCurrency(totalCost)}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-[10px] font-black text-construction-caution uppercase leading-none mb-1">Required Booking Amount</p>
                                  <p className="text-2xl font-black text-construction-slate italic">{formatCurrency(tokenAmount)}</p>
                                </div>
                              </div>
                            </div>

                            <div className="mb-8">
                              <label className="block text-xs font-black text-slate-500 uppercase mb-3 tracking-widest">Professional Site Summary</label>
                              <textarea className={inputClasses + " h-32 font-normal text-sm leading-relaxed"} placeholder="Explain design logic, safety buffers, and material grade selection..." value={message} onChange={e => setMessage(e.target.value)} />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                              <button type="submit" className="flex-1 bg-construction-slate text-construction-yellow py-5 rounded-xl font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(255,215,0,0.3)] hover:bg-black transition-all">Submit Final Verification</button>
                              <button type="button" onClick={() => setSelectedProject(null)} className="px-10 py-5 rounded-xl font-black uppercase text-slate-500 border-2 border-slate-200 hover:bg-slate-50 transition-colors">Discard Draft</button>
                            </div>
                          </form>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EngineerDashboard;
