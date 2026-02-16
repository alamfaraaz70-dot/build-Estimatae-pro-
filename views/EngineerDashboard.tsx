
import React, { useState } from 'react';
import { User, Project, ProjectStatus, Estimate, ChatMessage } from '../types';
import ChatRoom from '../components/ChatRoom';
import ImagePreviewModal from '../components/ImagePreviewModal';
import SuccessTick from '../components/SuccessTick';

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
  const [materialQuality, setMaterialQuality] = useState<'Affordable' | 'Premium' | 'Super Premium'>('Affordable');
  const [tokenPercentage, setTokenPercentage] = useState<number>(5);
  const [message, setMessage] = useState('');
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

  const inputClasses = "w-full p-4 rounded-lg border-2 border-slate-200 bg-white text-slate-950 focus:border-construction-yellow outline-none transition-all font-bold";

  const handleApproveAndQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;

    const numMaterialCost = Number(materialCost) || 0;
    const numLaborCost = Number(laborCost) || 0;
    const totalCost = numMaterialCost + numLaborCost;
    const tokenAmount = Math.round(totalCost * (tokenPercentage / 100));

    const finalEstimate: Estimate = {
      engineerId: user.id,
      engineerName: user.name,
      materialCost: numMaterialCost,
      laborCost: numLaborCost,
      materialQuality,
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
    
    setShowSuccessOverlay(true);
    setTimeout(() => setShowSuccessOverlay(false), 3000);
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

  if (!user.isApproved) {
    return (
      <div className="relative min-h-screen flex items-center justify-center p-6 bg-slate-900">
        <div className="relative z-10 max-w-2xl w-full text-center p-12 bg-white rounded-3xl shadow-2xl border-t-8 border-construction-yellow">
          <i className="fas fa-hard-hat text-4xl text-amber-600 mb-6"></i>
          <h2 className="text-3xl font-black text-construction-slate uppercase italic">Verification Pending</h2>
          <p className="text-slate-500 mt-4 leading-relaxed font-bold uppercase tracking-widest text-xs">Awaiting Site Credentials Verification</p>
        </div>
      </div>
    );
  }

  const activeProjectForChat = projects.find(p => p.id === activeChatId);

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=2070" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-[3px]"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto p-6 md:p-10">
        {activeProjectForChat ? (
          <div className="h-[600px]"><ChatRoom project={activeProjectForChat} currentUser={user} onSendMessage={handleSendMessage} onClose={() => setActiveChatId(null)} /></div>
        ) : (
          <div className="space-y-8">
            <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-12">Engineer <span className="text-construction-yellow">Command Center</span></h2>
            {projects.map(p => (
              <div key={p.id} className={`bg-white rounded-3xl shadow-2xl border-l-[12px] transition-all overflow-hidden ${selectedProject?.id === p.id ? 'border-construction-yellow' : 'border-construction-slate'}`}>
                <div className="p-8">
                  <div className="flex flex-col lg:flex-row justify-between gap-8">
                    <div className="flex-grow">
                      <div className="flex items-center gap-4 mb-2">
                        <span className="font-black text-2xl text-construction-slate uppercase italic">{p.customerName}'S PROJECT</span>
                      </div>
                      
                      {p.details.location && (
                        <div className="mb-4 flex items-center gap-2 bg-slate-100 py-2 px-4 rounded-lg border-2 border-slate-200 inline-flex">
                            <i className="fas fa-map-marker-alt text-construction-caution"></i>
                            <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Build Area: {p.details.location}</span>
                        </div>
                      )}

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100"><p className="text-[9px] text-slate-400 font-black uppercase">Area</p><p className="font-black text-xs">{p.details.plotArea} SQFT</p></div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100"><p className="text-[9px] text-slate-400 font-black uppercase">Floors</p><p className="font-black text-xs">{p.details.floors} LEVELS</p></div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100"><p className="text-[9px] text-slate-400 font-black uppercase">Timeline</p><p className="font-black text-xs text-blue-600">{p.details.timelineMonths} MONTHS</p></div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100"><p className="text-[9px] text-slate-400 font-black uppercase">Goal Budget</p><p className="font-black text-xs text-green-600">{p.details.budgetRange}</p></div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 min-w-[200px]">
                      {p.status === ProjectStatus.SUBMITTED ? (
                        <button onClick={() => setSelectedProject(p)} className="bg-construction-yellow text-construction-slate py-4 rounded-xl font-black uppercase text-xs shadow-lg hover:translate-y-[-2px] transition-all">Create Estimate</button>
                      ) : (
                        <div className="p-4 bg-green-50 rounded-xl border border-green-100 text-center"><p className="text-[10px] font-black text-green-700 uppercase">Quote Dispatched</p></div>
                      )}
                    </div>
                  </div>
                  {selectedProject?.id === p.id && (
                    <form onSubmit={handleApproveAndQuote} className="mt-8 pt-8 border-t-2 border-slate-100 animate-in slide-in-from-top-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                          <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 ml-1">Material Quality Tier</label>
                          <select 
                            className={inputClasses} 
                            value={materialQuality} 
                            onChange={(e) => setMaterialQuality(e.target.value as any)}
                          >
                            <option value="Affordable">Affordable Materials</option>
                            <option value="Premium">Premium Materials</option>
                            <option value="Super Premium">Super Premium Materials</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 ml-1">Structural Valuation</label>
                          <div className="grid grid-cols-2 gap-3">
                            <input type="number" required className={inputClasses} placeholder="Materials (₹)" value={materialCost} onChange={e => setMaterialCost(e.target.value)} />
                            <input type="number" required className={inputClasses} placeholder="Labor (₹)" value={laborCost} onChange={e => setLaborCost(e.target.value)} />
                          </div>
                        </div>
                      </div>
                      <textarea className={inputClasses + " mb-6 h-24"} placeholder="Site notes & professional recommendations..." value={message} onChange={e => setMessage(e.target.value)} />
                      <button type="submit" className="w-full bg-construction-slate text-construction-yellow py-4 rounded-xl font-black uppercase tracking-widest hover:bg-black">Submit Final Review</button>
                    </form>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showSuccessOverlay && <SuccessTick message="Review Sent for Review" subMessage="Estimate dispatched to site owner" />}
      {previewImageUrl && <ImagePreviewModal url={previewImageUrl} onClose={() => setPreviewImageUrl(null)} title="Reference Plan" />}
    </div>
  );
};

export default EngineerDashboard;
