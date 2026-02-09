
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
  const [name, setName] = useState('');
  const [experience, setExperience] = useState(0);
  const [error, setError] = useState('');

  const inputClasses = "w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-100 text-slate-950 placeholder:text-slate-400 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all outline-none font-medium";

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
        name,
        email,
        password, // Store password for new signups in this session
        role,
        isApproved: role === UserRole.ENGINEER ? false : true,
        experience: role === UserRole.ENGINEER ? experience : undefined
      };
      setUsers(prev => [...prev, newUser]);
      onLogin(newUser);
    }
  };

  return (
    <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl shadow-xl border border-slate-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900">
          {isLogin ? 'Welcome Back' : 'Join Us Today'}
        </h2>
        <p className="text-slate-500 mt-2">
          {isLogin ? 'Login to manage your construction projects' : 'Create an account to start planning'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
              <input 
                type="text" 
                required 
                value={name}
                onChange={e => setName(e.target.value)}
                className={inputClasses}
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Account Type</label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200">
                <button 
                  type="button"
                  onClick={() => setRole(UserRole.CUSTOMER)}
                  className={`py-2 px-4 rounded-lg text-sm font-medium transition-all ${role === UserRole.CUSTOMER ? 'bg-white shadow-sm text-orange-500' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Customer
                </button>
                <button 
                  type="button"
                  onClick={() => setRole(UserRole.ENGINEER)}
                  className={`py-2 px-4 rounded-lg text-sm font-medium transition-all ${role === UserRole.ENGINEER ? 'bg-white shadow-sm text-orange-500' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Engineer
                </button>
              </div>
            </div>
            {role === UserRole.ENGINEER && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Years of Experience</label>
                <input 
                  type="number" 
                  required 
                  value={experience}
                  onChange={e => setExperience(Number(e.target.value))}
                  className={inputClasses}
                  min="0"
                />
              </div>
            )}
          </>
        )}

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
          <input 
            type="email" 
            required 
            value={email}
            onChange={e => setEmail(e.target.value)}
            className={inputClasses}
            placeholder="name@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
          <input 
            type="password" 
            required 
            value={password}
            onChange={e => setPassword(e.target.value)}
            className={inputClasses}
            placeholder="••••••••"
          />
        </div>

        {error && <p className="text-red-500 text-sm font-medium bg-red-50 p-2 rounded-lg text-center">{error}</p>}

        <button 
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-orange-100 transition-all active:scale-95"
        >
          {isLogin ? 'Sign In' : 'Create Account'}
        </button>

        <p className="text-center text-slate-500 text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-orange-500 font-bold hover:underline"
          >
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </form>

      <div className="mt-8 pt-6 border-t border-slate-100">
        <p className="text-xs text-slate-400 text-center uppercase tracking-widest font-semibold mb-4">Demo Credentials</p>
        <div className="grid grid-cols-1 gap-3 text-xs">
          <div className="p-3 bg-orange-50 border border-orange-100 rounded-xl">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-orange-700">Admin Account:</span>
              <span className="bg-orange-200 text-orange-800 px-1 rounded text-[9px]">ADMIN</span>
            </div>
            <div className="flex justify-between text-slate-600 font-mono">
              <span>Email:</span>
              <span>alamfaraaziitian@gmail.com</span>
            </div>
            <div className="flex justify-between text-slate-600 font-mono">
              <span>Pass:</span>
              <span className="font-bold">alamiit</span>
            </div>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-blue-700">Customer Account:</span>
              <span className="bg-blue-200 text-blue-800 px-1 rounded text-[9px]">CUSTOMER</span>
            </div>
            <div className="flex justify-between text-slate-600 font-mono">
              <span>Email:</span>
              <span>iit@gmail.com</span>
            </div>
            <div className="flex justify-between text-slate-600 font-mono">
              <span>Pass:</span>
              <span className="font-bold">iit</span>
            </div>
          </div>
          
          <p className="text-[10px] text-slate-400 text-center mt-1 uppercase tracking-tighter">Other Demos (Pass: password123)</p>
          <div className="flex justify-between p-2 bg-slate-50 rounded-lg text-slate-500">
            <span>Engineer:</span>
            <span>engineer@example.com</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
