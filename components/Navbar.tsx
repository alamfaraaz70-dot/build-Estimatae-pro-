
import React, { useState, useRef, useEffect } from 'react';
import { User, Project } from '../types';
import ProfileModal from './ProfileModal';
import MyProjectsModal from './MyProjectsModal';
import { useLanguage, Language } from '../contexts/LanguageContext';

interface NavbarProps {
  user: User | null;
  projects: Project[];
  onLogout: () => void;
  onNavHome: () => void;
  onNavDashboard: () => void;
  onNavLogin: () => void;
  onUpdateUser: (updatedUser: User) => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, projects, onLogout, onNavHome, onNavDashboard, onNavLogin, onUpdateUser }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLanguageList, setShowLanguageList] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { language, setLanguage, t } = useLanguage();

  const languages: { code: Language; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिंदी' },
    { code: 'bn', label: 'Bengali', native: 'বাংলা' },
    { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు' },
    { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  ];

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
        setShowLanguageList(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    { 
      label: t('nav_profile'), 
      icon: 'fa-user-circle', 
      action: () => { 
        if(user) {
          setIsProfileModalOpen(true);
        } else {
          onNavLogin();
        }
        setIsMenuOpen(false); 
      } 
    },
    { 
      label: t('nav_language'), 
      icon: 'fa-language', 
      action: () => { 
        setShowLanguageList(true);
      } 
    },
    { 
      label: t('nav_projects'), 
      icon: 'fa-tasks', 
      action: () => { 
        if(user) {
          setIsProjectsModalOpen(true);
        } else {
          onNavLogin();
        }
        setIsMenuOpen(false); 
      } 
    },
    { 
      label: t('nav_about'), 
      icon: 'fa-info-circle', 
      action: () => { 
        alert('BuildEstimate Pro: Your partner in precision construction.'); 
        setIsMenuOpen(false); 
      } 
    },
  ];

  return (
    <>
      <nav className="bg-white border-b-4 border-construction-yellow px-6 py-4 flex justify-between items-center sticky top-0 z-[100] shadow-md">
        <div 
          className="flex items-center gap-2 cursor-pointer group" 
          onClick={onNavHome}
        >
          <div className="bg-construction-slate text-construction-yellow p-2 rounded-lg group-hover:scale-110 transition-transform">
            <i className="fas fa-hammer"></i>
          </div>
          <span className="text-xl font-black tracking-tighter uppercase italic">
            BuildEstimate <span className="text-construction-caution">Pro</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <div className="hidden md:flex items-center gap-3 pr-4 border-r-2 border-slate-100">
              <div className="text-right">
                <p className="text-[10px] font-black uppercase text-slate-400 leading-none mb-1">Authenticated</p>
                <p className="text-sm font-black text-construction-slate uppercase tracking-tight leading-none">{user.name}</p>
              </div>
              <div 
                onClick={() => setIsProfileModalOpen(true)}
                className="w-8 h-8 bg-construction-slate text-construction-yellow rounded flex items-center justify-center font-black text-xs cursor-pointer hover:scale-110 transition-transform"
              >
                {user.name.charAt(0)}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2" ref={menuRef}>
            {!user ? (
              <button 
                onClick={onNavLogin}
                className="bg-construction-yellow hover:bg-construction-yellowDark text-construction-slate px-6 py-2 rounded font-black uppercase tracking-widest text-xs transition-all shadow-[2px_2px_0px_0px_rgba(30,41,59,1)] active:shadow-none active:translate-y-[1px]"
              >
                {t('nav_signin')}
              </button>
            ) : (
              <button 
                onClick={onLogout}
                className="hidden sm:block text-slate-400 hover:text-red-600 px-3 py-2 rounded font-black uppercase tracking-widest text-[10px] transition-all"
              >
                {t('nav_logout')}
              </button>
            )}

            <div className="relative">
              <button 
                onClick={() => {
                  setIsMenuOpen(!isMenuOpen);
                  setShowLanguageList(false);
                }}
                className={`w-10 h-10 flex items-center justify-center rounded border-2 transition-all ${
                  isMenuOpen 
                  ? 'bg-construction-slate text-construction-yellow border-construction-slate' 
                  : 'bg-white text-construction-slate border-slate-200 hover:border-construction-yellow'
                }`}
                aria-label="Navigation Menu"
              >
                <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-lg`}></i>
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white border-2 border-construction-slate rounded-lg shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="bg-construction-slate p-3 flex justify-between items-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-construction-yellow">
                      {showLanguageList ? 'Select Language' : 'Menu Options'}
                    </p>
                    {showLanguageList && (
                      <button onClick={() => setShowLanguageList(false)} className="text-white hover:text-construction-yellow">
                        <i className="fas fa-chevron-left text-[10px]"></i>
                      </button>
                    )}
                  </div>
                  <div className="py-1">
                    {!showLanguageList ? (
                      <>
                        {menuItems.map((item, idx) => (
                          <button
                            key={idx}
                            onClick={item.action}
                            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                          >
                            <div className="w-8 h-8 flex items-center justify-center text-construction-slate/60">
                              <i className={`fas ${item.icon} text-base`}></i>
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-construction-slate">
                              {item.label}
                            </span>
                          </button>
                        ))}
                      </>
                    ) : (
                      <div className="grid grid-cols-1 divide-y divide-slate-50 max-h-[400px] overflow-y-auto">
                        {languages.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => {
                              setLanguage(lang.code);
                              setShowLanguageList(false);
                              setIsMenuOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
                              language === lang.code ? 'bg-construction-yellow/10' : 'hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex flex-col">
                              <span className="text-xs font-black uppercase tracking-widest text-construction-slate">{lang.label}</span>
                              <span className="text-[10px] font-bold text-slate-400">{lang.native}</span>
                            </div>
                            {language === lang.code && <i className="fas fa-check text-construction-slate text-xs"></i>}
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {!showLanguageList && user && (
                      <button
                        onClick={() => { onLogout(); setIsMenuOpen(false); }}
                        className="sm:hidden w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-red-50 text-red-600 transition-colors"
                      >
                        <div className="w-8 h-8 flex items-center justify-center">
                          <i className="fas fa-sign-out-alt text-base"></i>
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest">
                          {t('nav_logout')}
                        </span>
                      </button>
                    )}
                  </div>
                  <div className="bg-slate-50 p-2 text-center border-t border-slate-100">
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter italic">Precision Building Solutions v2.0</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      {isProfileModalOpen && user && (
        <ProfileModal 
          user={user} 
          onClose={() => setIsProfileModalOpen(false)} 
          onUpdate={onUpdateUser} 
        />
      )}
      {isProjectsModalOpen && user && (
        <MyProjectsModal 
          user={user} 
          projects={projects} 
          onClose={() => setIsProjectsModalOpen(false)} 
          onViewDashboard={onNavDashboard} 
        />
      )}
    </>
  );
};

export default Navbar;
