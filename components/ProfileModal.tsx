
import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface ProfileModalProps {
  user: User;
  onClose: () => void;
  onUpdate: (updatedUser: User) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ user, onClose, onUpdate }) => {
  const [phone, setPhone] = useState(user.phone || '');
  const [address, setAddress] = useState(user.address || '');
  const [experience, setExperience] = useState(user.experience || 0);
  const [projectsDone, setProjectsDone] = useState(user.projectsDone || 0);
  const [companyName, setCompanyName] = useState(user.companyName || '');
  const [isSaving, setIsSaving] = useState(false);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(value);
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      onUpdate({ 
        ...user, 
        phone, 
        address, 
        experience, 
        projectsDone, 
        companyName 
      });
      setIsSaving(false);
      onClose();
    }, 500);
  };

  const isEngineer = user.role === UserRole.ENGINEER;

  return (
    <div className="fixed inset-0 z-[150] bg-construction-slate/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-xl overflow-hidden shadow-2xl animate-in zoom-in duration-200 border-4 border-construction-yellow flex flex-col max-h-[90vh]">
        <div className="bg-construction-slate text-white p-6 flex justify-between items-center flex-shrink-0">
          <h3 className="text-xl font-black uppercase tracking-widest italic">User Profile</h3>
          <button onClick={onClose} className="text-construction-yellow hover:scale-110 transition-transform">
            <i className="fas fa-times-circle text-2xl"></i>
          </button>
        </div>

        <div className="p-8 space-y-6 overflow-y-auto construction-grid flex-grow">
          <div className="flex flex-col items-center mb-4">
             <div className="w-20 h-20 bg-construction-yellow text-construction-slate rounded-2xl flex items-center justify-center text-4xl font-black mb-2 shadow-[4px_4px_0px_0px_rgba(30,41,59,1)]">
                {user.name.charAt(0)}
             </div>
             <p className="font-black text-construction-slate uppercase text-lg italic">{user.name}</p>
             <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{user.role}</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Email ID (Primary)</label>
              <input 
                type="text" 
                readOnly 
                value={user.email} 
                className="w-full p-3 rounded bg-slate-100 border-2 border-slate-200 text-slate-500 font-bold text-sm cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Mobile Number (Max 10 Digits)</label>
              <input 
                type="text" 
                value={phone}
                onChange={handlePhoneChange}
                placeholder="Enter 10 digit number"
                className="w-full p-3 rounded bg-white border-2 border-slate-200 text-construction-slate font-black text-sm focus:border-construction-yellow outline-none transition-all"
              />
            </div>

            {isEngineer && (
              <div className="space-y-4 border-y-2 border-slate-100 py-4 my-4">
                <p className="text-[10px] font-black text-construction-caution uppercase tracking-[0.2em] mb-2 text-center">Professional Credentials</p>
                
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Company / Firm Name</label>
                  <input 
                    type="text" 
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Skyline Structural Solutions"
                    className="w-full p-3 rounded bg-white border-2 border-slate-200 text-construction-slate font-black text-sm focus:border-construction-yellow outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Years of Experience</label>
                    <input 
                      type="number" 
                      value={experience || ''}
                      onChange={(e) => setExperience(Number(e.target.value))}
                      placeholder="0"
                      className="w-full p-3 rounded bg-white border-2 border-slate-200 text-construction-slate font-black text-sm focus:border-construction-yellow outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Projects Delivered</label>
                    <input 
                      type="number" 
                      value={projectsDone || ''}
                      onChange={(e) => setProjectsDone(Number(e.target.value))}
                      placeholder="0"
                      className="w-full p-3 rounded bg-white border-2 border-slate-200 text-construction-slate font-black text-sm focus:border-construction-yellow outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Current Address</label>
              <textarea 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street, City, State, Pincode"
                className="w-full p-3 rounded bg-white border-2 border-slate-200 text-construction-slate font-bold text-sm focus:border-construction-yellow outline-none transition-all h-20 resize-none"
              />
            </div>

            <div className="pt-2 border-t-2 border-slate-100">
               <button 
                  onClick={() => alert("Connecting to Support Engineering Team...")}
                  className="flex items-center gap-3 w-full p-3 rounded bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors border-2 border-amber-100"
               >
                  <i className="fas fa-headset text-lg"></i>
                  <span className="text-xs font-black uppercase tracking-wider">Help Centre & Support</span>
               </button>
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t-4 border-construction-yellow flex gap-4 flex-shrink-0">
          <button 
            disabled={isSaving}
            onClick={handleSave}
            className="flex-1 bg-construction-slate text-construction-yellow py-3 rounded font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(255,215,0,1)] transition-all hover:bg-black active:shadow-none active:translate-y-1 disabled:opacity-50"
          >
            {isSaving ? <i className="fas fa-spinner fa-spin"></i> : 'Update Profile'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
