
import React, { useState } from 'react';
import { User, Project, UserRole } from '../types';

interface AdminDashboardProps {
  users: User[];
  setUsers: (users: User[]) => void;
  projects: Project[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ users, setUsers, projects }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'projects'>('users');

  const engineers = users.filter(u => u.role === UserRole.ENGINEER);
  const pendingEngineers = engineers.filter(e => !e.isApproved);
  const customers = users.filter(u => u.role === UserRole.CUSTOMER);

  const toggleApproval = (id: string) => {
    const updated = users.map(u => u.id === id ? { ...u, isApproved: !u.isApproved } : u);
    setUsers(updated);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Total Projects', value: projects.length, icon: 'fa-briefcase', color: 'bg-blue-500' },
          { label: 'Total Users', value: users.length, icon: 'fa-users', color: 'bg-orange-500' },
          { label: 'Pending Approvals', value: pendingEngineers.length, icon: 'fa-clock', color: 'bg-amber-500' },
          { label: 'Verified Engineers', value: engineers.length - pendingEngineers.length, icon: 'fa-user-check', color: 'bg-green-500' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className={`${stat.color} w-10 h-10 rounded-xl flex items-center justify-center text-white mb-4`}>
              <i className={`fas ${stat.icon}`}></i>
            </div>
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="text-3xl font-extrabold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex border-b border-slate-100">
          <button 
            onClick={() => setActiveTab('users')}
            className={`flex-1 py-4 text-sm font-bold transition-all ${activeTab === 'users' ? 'text-orange-500 border-b-2 border-orange-500 bg-orange-50/30' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Engineer Approvals
          </button>
          <button 
            onClick={() => setActiveTab('projects')}
            className={`flex-1 py-4 text-sm font-bold transition-all ${activeTab === 'projects' ? 'text-orange-500 border-b-2 border-orange-500 bg-orange-50/30' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Project Monitoring
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'users' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-400 text-xs font-bold uppercase tracking-widest border-b border-slate-100">
                    <th className="pb-4 px-4">Engineer</th>
                    <th className="pb-4 px-4">Experience</th>
                    <th className="pb-4 px-4">Status</th>
                    <th className="pb-4 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {engineers.map(e => (
                    <tr key={e.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-6 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold">
                            {e.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{e.name}</p>
                            <p className="text-xs text-slate-500">{e.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-6 px-4 text-slate-600">{e.experience} Years</td>
                      <td className="py-6 px-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${e.isApproved ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                          {e.isApproved ? 'Approved' : 'Pending'}
                        </span>
                      </td>
                      <td className="py-6 px-4 text-right">
                        <button 
                          onClick={() => toggleApproval(e.id)}
                          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                            e.isApproved ? 'text-red-500 hover:bg-red-50' : 'bg-green-500 text-white hover:bg-green-600 shadow-md shadow-green-100'
                          }`}
                        >
                          {e.isApproved ? 'Reject' : 'Approve'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {projects.map(p => (
                <div key={p.id} className="p-4 border border-slate-100 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                      <i className="fas fa-home"></i>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Project #{p.id}</p>
                      <p className="text-sm text-slate-500">Owner: {p.customerName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-xs text-slate-400">Status</p>
                      <p className="text-sm font-bold text-slate-800">{p.status}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400">Estimates</p>
                      <p className="text-sm font-bold text-slate-800">{p.estimates.length}</p>
                    </div>
                    <button className="text-slate-400 hover:text-orange-500 transition-colors">
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
