
import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface AuthViewProps {
  onLogin: (user: User) => void;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const AuthView: React.FC<AuthViewProps> = ({ onLogin, users, setUsers }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<UserRole>(UserRole.CUSTOMER);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [experience, setExperience] = useState(0);
  const [projectsDone, setProjectsDone] = useState(0);
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState('');

  const inputClasses = "w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-100 text-slate-950 placeholder:text-slate-400 focus:bg-white focus:border-construction-yellow focus:ring-2 focus:ring-construction-yellow/20 transition-all outline-none font-medium";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const user = users.find(u => u.email === email);
      if (user) {
        if (user.password && user.password !== password) {
          setError('Incorrect password. Please try again.');
          return;
        }
        onLogin(user);
      } else {
        setError('User not found. Try one of the demo accounts below.');
      }
    } else {
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: `${firstName} ${lastName}`.trim(),
        firstName,
        lastName,
        email,
        password,
        role,
        isApproved: role === UserRole.ENGINEER ? false : true,
        experience: role === UserRole.ENGINEER ? experience : undefined,
        projectsDone: role === UserRole.ENGINEER ? projectsDone : undefined,
        companyName: role === UserRole.ENGINEER ? companyName : undefined
      };
      setUsers(prev => [...prev, newUser]);
      onLogin(newUser);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Dynamic Background Image - 3D Floor Plan */}
      <div className="fixed inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=2070" 
          alt="Architectural Blueprint Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[4px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="bg-white rounded-[2.5rem] shadow-2xl border-b-8 border-construction-slate overflow-hidden">
          <div className="bg-construction-slate p-8 text-center border-b-4 border-construction-yellow">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-construction-yellow text-construction-slate text-2xl mb-4 shadow-xl transform rotate-3">
              <i className="fas fa-lock"></i>
            </div>
            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">
              {isLogin ? 'Access Center' : 'Create Profile'}
            </h2>
            <p className="text-construction-yellow/70 mt-1 font-bold text-[10px] uppercase tracking-[0.3em]">Secure Construction Terminal</p>
          </div>

          <div className="p-10">
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase mb-1 tracking-widest">First Name</label>
                      <input 
                        type="text" 
                        required 
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                        className={inputClasses}
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase mb-1 tracking-widest">Last Name</label>
                      <input 
                        type="text" 
                        required 
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                        className={inputClasses}
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Registry Role</label>
                    <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200">
                      <button 
                        type="button"
                        onClick={() => setRole(UserRole.CUSTOMER)}
                        className={`py-2 px-4 rounded-lg text-[10px] font-black uppercase transition-all ${role === UserRole.CUSTOMER ? 'bg-construction-slate text-construction-yellow shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        Site Owner
                      </button>
                      <button 
                        type="button"
                        onClick={() => setRole(UserRole.ENGINEER)}
                        className={`py-2 px-4 rounded-lg text-[10px] font-black uppercase transition-all ${role === UserRole.ENGINEER ? 'bg-construction-slate text-construction-yellow shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        Specialist
                      </button>
                    </div>
                  </div>
                  {role === UserRole.ENGINEER && (
                    <div className="animate-in slide-in-from-top-2 space-y-4">
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase mb-1 tracking-widest">Company Name</label>
                        <input 
                          type="text" 
                          required 
                          value={companyName}
                          onChange={e => setCompanyName(e.target.value)}
                          className={inputClasses}
                          placeholder="Architecture Firm LLC"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-black text-slate-500 uppercase mb-1 tracking-widest">Exp. (Years)</label>
                          <input 
                            type="number" 
                            required 
                            value={experience || ''}
                            onChange={e => setExperience(Number(e.target.value))}
                            className={inputClasses}
                            min="0"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-500 uppercase mb-1 tracking-widest">Projects Done</label>
                          <input 
                            type="number" 
                            required 
                            value={projectsDone || ''}
                            onChange={e => setProjectsDone(Number(e.target.value))}
                            className={inputClasses}
                            min="0"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-1 tracking-widest">Identity Email</label>
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className={inputClasses}
                  placeholder="name@build.pro"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-1 tracking-widest">Operational Password</label>
                <input 
                  type="password" 
                  required 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className={inputClasses}
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <div className="text-red-600 text-[10px] font-black bg-red-50 p-4 rounded-xl text-center border-2 border-red-100 uppercase tracking-widest animate-shake">
                  {error}
                </div>
              )}

              <button 
                type="submit"
                className="w-full bg-construction-yellow hover:bg-construction-yellowDark text-construction-slate py-5 rounded-2xl font-black uppercase tracking-widest shadow-[6px_6px_0px_0px_rgba(30,41,59,1)] transition-all active:shadow-none active:translate-y-1 mt-4"
              >
                {isLogin ? 'Initialize Session' : 'Finalize Profile'}
              </button>

              <div className="pt-4 text-center">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  {isLogin ? "New to the registry?" : "Already enlisted?"}{' '}
                  <button 
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-construction-slate underline decoration-construction-yellow decoration-4 underline-offset-4 hover:text-black transition-colors"
                  >
                    {isLogin ? 'Create Account' : 'Back to Terminal'}
                  </button>
                </p>
              </div>
            </form>

            <div className="mt-10 pt-8 border-t-2 border-slate-100">
              <p className="text-[10px] text-slate-400 text-center uppercase tracking-[0.2em] font-black mb-5">Authorised Demo Clearance</p>
              <div className="grid grid-cols-1 gap-3">
                <div className="p-4 bg-slate-900 text-white rounded-2xl border-l-8 border-construction-yellow shadow-xl group cursor-pointer hover:bg-black transition-all" onClick={() => {setEmail('alamfaraaziitian@gmail.com'); setPassword('alamiit'); setIsLogin(true);}}>
                   <div className="flex justify-between items-center mb-1">
                     <span className="font-black text-construction-yellow text-xs">SUPER ADMIN</span>
                     <i className="fas fa-chevron-right text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"></i>
                   </div>
                   <p className="text-[10px] font-mono opacity-60">alamfaraaziitian@gmail.com</p>
                </div>
                <div className="p-4 bg-slate-100 text-slate-700 rounded-2xl border-l-8 border-slate-400 group cursor-pointer hover:bg-slate-200 transition-all" onClick={() => {setEmail('iit@gmail.com'); setPassword('iit'); setIsLogin(true);}}>
                   <div className="flex justify-between items-center mb-1">
                     <span className="font-black text-slate-900 text-xs">SITE OWNER (DEMO)</span>
                     <i className="fas fa-chevron-right text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"></i>
                   </div>
                   <p className="text-[10px] font-mono opacity-60">iit@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.5em] italic">
            End-to-End Encryption Enabled • Registry v3.4.1
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
