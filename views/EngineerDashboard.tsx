
import React, { useState } from 'react';
import { User, Project, ProjectStatus, Estimate, ChatMessage } from '../types';
import LocationWidget from '../components/LocationWidget';
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
  const [materialCost, setMaterialCost] = useState<number>(0);
  const [laborCost, setLaborCost] = useState<number>(0);
  const [message, setMessage] = useState('');

  const inputClasses = "w-full p-4 rounded-lg border-2 border-slate-200 bg-white text-slate-950 focus:border-construction-yellow outline-none transition-all font-bold";

  const handleApproveAndQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;

    const finalEstimate: Estimate = {
      engineerId: user.id,
      engineerName: user.name,
      materialCost,
      laborCost,
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
    setMaterialCost(0);
    setLaborCost(0);
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
      <div className="max-w-4xl mx-auto my-20 text-center p-12 bg-white rounded-xl shadow-xl border-t-8 border-construction-yellow">
        <div className="bg-amber-100 text-amber-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
          <i className="fas fa-tools"></i>
        </div>
        <h2 className="text-3xl font-black text-construction-slate uppercase italic">Site Verification Pending</h2>
        <p className="text-slate-500 mt-4 max-w-md mx-auto leading-relaxed font-medium">
          Your credentials as a structural engineer are currently being verified by the central administrative office. Access to bidding will be granted shortly.
        </p>
      </div>
    );
  }

  const activeProjectForChat = projects.find(p => p.id === activeChatId);

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 flex flex-col lg:flex-row gap-10">
      <div className="w-full lg:w-1/3 space-y-6">
        <div className="bg-construction-slate text-white rounded-xl shadow-xl overflow-hidden border-b-8 border-construction-yellow">
          <div className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-construction-yellow text-construction-slate rounded-xl flex items-center justify-center text-2xl font-black transform rotate-3">
                {user.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-black uppercase italic tracking-tight">{user.name}</h2>
                <p className="text-construction-yellow text-[10px] font-black uppercase tracking-widest">Certified Engineer</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 p-3 rounded border border-white/10">
                <p className="text-[10px] text-slate-400 font-black uppercase">Experience</p>
                <p className="font-black">{user.experience}YRS</p>
              </div>
              <div className="bg-white/5 p-3 rounded border border-white/10">
                <p className="text-[10px] text-slate-400 font-black uppercase">Status</p>
                <p className="font-black text-green-400">ACTIVE</p>
              </div>
            </div>
          </div>
        </div>
        <LocationWidget />
      </div>

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
            <div className="mb-10 bg-white p-6 rounded-xl border-b-4 border-construction-yellow shadow-sm">
              <h2 className="text-3xl font-black text-construction-slate uppercase italic">Client Requests</h2>
              <p className="text-slate-500 font-medium italic">Review site specifications and provide your final expert quote.</p>
            </div>

            <div className="space-y-6">
              {projects.length === 0 ? (
                 <div className="bg-white p-10 rounded-xl text-center border-2 border-dashed border-slate-200">
                   <p className="text-slate-400 font-black uppercase tracking-widest">No site requests pending</p>
                 </div>
              ) : projects.map(p => (
                <div 
                  key={p.id} 
                  className={`bg-white rounded-xl shadow-md border-2 transition-all overflow-hidden ${
                    selectedProject?.id === p.id ? 'border-construction-yellow' : 'border-slate-100'
                  }`}
                >
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between gap-6">
                      <div className="flex-grow">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-black text-lg text-construction-slate uppercase tracking-tight">{p.customerName}'S SITE</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ${
                            p.status === ProjectStatus.SUBMITTED ? 'bg-construction-slate text-white' : 
                            p.status === ProjectStatus.APPROVED ? 'bg-amber-500 text-construction-slate' : 'bg-green-600 text-white'
                          }`}>
                            {p.status}
                          </span>
                        </div>
                        <div className="flex gap-6 text-xs font-bold text-slate-500 uppercase mb-4">
                          <span><i className="fas fa-ruler-combined mr-2 text-construction-yellow"></i> {p.details.plotArea} SQ FT</span>
                          <span><i className="fas fa-building mr-2 text-construction-yellow"></i> {p.details.floors} FLOORS</span>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-lg border-l-4 border-construction-slate italic text-sm text-slate-700">
                          <span className="font-black uppercase text-[10px] text-slate-400 block mb-1">User's Budget Goal:</span>
                          {p.details.budgetRange}
                          <p className="mt-2 font-medium">"{p.details.notes || 'No notes provided.'}"</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 min-w-[200px]">
                        {p.status === ProjectStatus.SUBMITTED ? (
                          <button 
                            onClick={() => setSelectedProject(p)}
                            className="btn-construction px-6 py-3 rounded text-sm w-full"
                          >
                            Approve & Quote
                          </button>
                        ) : (
                          <div className="text-right bg-green-50 p-3 rounded-lg border border-green-200">
                            <p className="text-[10px] font-black text-green-700 uppercase mb-1">Your Quote Sent</p>
                            <p className="text-xl font-black text-construction-slate">{formatCurrency(p.estimates[0].materialCost + p.estimates[0].laborCost)}</p>
                          </div>
                        )}
                        {(p.status === ProjectStatus.APPROVED || p.status === ProjectStatus.FINALIZED) && (
                          <button 
                            onClick={() => setActiveChatId(p.id)}
                            className="bg-construction-slate text-construction-yellow px-6 py-3 rounded text-sm font-black uppercase flex items-center justify-center gap-2 hover:bg-black transition-all"
                          >
                            <i className="fas fa-comments"></i>
                            Chat with Client
                          </button>
                        )}
                      </div>
                    </div>

                    {selectedProject?.id === p.id && (
                      <form onSubmit={handleApproveAndQuote} className="mt-8 pt-8 border-t-2 border-slate-100 animate-in slide-in-from-top-4">
                        <h4 className="font-black text-construction-slate uppercase italic mb-6">Reviewer's Final Estimation (INR)</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                          <div>
                            <label className="block text-xs font-black text-slate-500 uppercase mb-2">Final Material Cost (₹)</label>
                            <input type="number" required className={inputClasses} value={materialCost} onChange={e => setMaterialCost(Number(e.target.value))} />
                          </div>
                          <div>
                            <label className="block text-xs font-black text-slate-500 uppercase mb-2">Final Labor Cost (₹)</label>
                            <input type="number" required className={inputClasses} value={laborCost} onChange={e => setLaborCost(Number(e.target.value))} />
                          </div>
                        </div>
                        <div className="mb-6">
                          <label className="block text-xs font-black text-slate-500 uppercase mb-2">Engineer's Recommendation</label>
                          <textarea className={inputClasses + " h-24 font-normal"} placeholder="Brief explanation of costs..." value={message} onChange={e => setMessage(e.target.value)} />
                        </div>
                        <div className="flex gap-4">
                          <button type="submit" className="btn-construction flex-1 py-4 rounded text-base">Confirm & Approve Project</button>
                          <button type="button" onClick={() => setSelectedProject(null)} className="px-8 py-4 rounded font-black uppercase text-slate-500 border-2 border-slate-200 hover:bg-slate-50">Cancel</button>
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
  );
};

export default EngineerDashboard;
