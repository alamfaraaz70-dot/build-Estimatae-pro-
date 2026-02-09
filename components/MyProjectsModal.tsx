
import React from 'react';
import { Project, ProjectStatus, User } from '../types';

interface MyProjectsModalProps {
  user: User;
  projects: Project[];
  onClose: () => void;
  onViewDashboard: () => void;
}

const MyProjectsModal: React.FC<MyProjectsModalProps> = ({ user, projects, onClose, onViewDashboard }) => {
  return (
    <div className="fixed inset-0 z-[150] bg-construction-slate/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-xl overflow-hidden shadow-2xl animate-in zoom-in duration-200 border-4 border-construction-yellow flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="bg-construction-slate text-white p-6 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-3">
            <i className="fas fa-project-diagram text-construction-yellow text-2xl"></i>
            <h3 className="text-xl font-black uppercase tracking-widest italic">My Site Registry</h3>
          </div>
          <button onClick={onClose} className="text-construction-yellow hover:scale-110 transition-transform">
            <i className="fas fa-times-circle text-2xl"></i>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto construction-grid flex-grow">
          {projects.length === 0 ? (
            <div className="py-20 text-center">
              <i className="fas fa-folder-open text-5xl text-slate-200 mb-4 block"></i>
              <p className="font-black text-slate-400 uppercase tracking-widest">No projects found in registry</p>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((p) => (
                <div key={p.id} className="bg-white border-2 border-slate-100 rounded-lg p-4 shadow-sm hover:border-construction-yellow transition-colors group">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">ID: {p.id.toUpperCase()}</span>
                        <span className={`px-2 py-0.5 rounded-[4px] text-[9px] font-black uppercase tracking-tight ${
                          p.status === ProjectStatus.FINALIZED ? 'bg-green-100 text-green-700' : 
                          p.status === ProjectStatus.APPROVED ? 'bg-amber-100 text-amber-700' : 'bg-slate-800 text-white'
                        }`}>
                          {p.status}
                        </span>
                      </div>
                      <h4 className="font-black text-construction-slate uppercase tracking-tight text-sm">
                        {p.details.plotArea} SQ FT Site Plan
                      </h4>
                      <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">
                        <i className="fas fa-wallet mr-1 text-construction-yellow"></i> {p.details.budgetRange}
                      </p>
                    </div>
                    <button 
                      onClick={() => {
                        onViewDashboard();
                        onClose();
                      }}
                      className="bg-slate-100 hover:bg-construction-yellow text-slate-600 hover:text-construction-slate px-4 py-2 rounded text-[10px] font-black uppercase tracking-widest transition-all group-hover:shadow-[2px_2px_0px_0px_rgba(30,41,59,1)]"
                    >
                      Management Dashboard
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t-2 border-slate-100 text-center flex-shrink-0">
          <p className="text-[10px] font-bold text-slate-400 uppercase italic">
            Displaying all active and archived site records for {user.name}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyProjectsModal;
