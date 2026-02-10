
import React, { useState, useEffect } from 'react';
import { User, UserRole, Project, AuthState } from './types';
import Navbar from './components/Navbar';
import Home from './views/Home';
import AuthView from './views/Auth';
import CustomerDashboard from './views/CustomerDashboard';
import EngineerDashboard from './views/EngineerDashboard';
import AdminDashboard from './views/AdminDashboard';
import BottomNav from './components/BottomNav';
import FieldBotModal from './components/FieldBotModal';
import ProfileModal from './components/ProfileModal';
import MyProjectsModal from './components/MyProjectsModal';
import { initialProjects, initialUsers } from './constants';
import { supabaseService } from './services/supabase';
import { LanguageProvider } from './contexts/LanguageContext';

const AppContent: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const saved = localStorage.getItem('auth');
    return saved ? JSON.parse(saved) : { user: null, isAuthenticated: false };
  });

  const [users, setUsers] = useState<User[]>(initialUsers);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Modal States
  const [isFieldBotOpen, setIsFieldBotOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);

  const [currentView, setCurrentView] = useState<'home' | 'auth' | 'dashboard'>(() => {
    const savedAuth = localStorage.getItem('auth');
    if (savedAuth) {
      const parsed = JSON.parse(savedAuth);
      return parsed.isAuthenticated ? 'dashboard' : 'home';
    }
    return 'home';
  });

  // Load data from Supabase on start
  useEffect(() => {
    const loadData = async () => {
      try {
        const [dbUsers, dbProjects] = await Promise.all([
          supabaseService.getUsers(),
          supabaseService.getProjects()
        ]);

        if (dbUsers.length > 0) setUsers(dbUsers);
        if (dbProjects.length > 0) setProjects(dbProjects);
      } catch (err) {
        console.error('Supabase load failed, falling back to local data', err);
      } finally {
        setIsInitialLoad(false);
      }
    };
    loadData();
  }, []);

  // Sync authState to local storage
  useEffect(() => {
    localStorage.setItem('auth', JSON.stringify(authState));
  }, [authState]);

  const handleLogin = (user: User) => {
    setAuthState({ user, isAuthenticated: true });
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setAuthState({ user: null, isAuthenticated: false });
    setCurrentView('home');
  };

  const handleUpdateUser = async (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (authState.user?.id === updatedUser.id) {
      setAuthState(prev => ({ ...prev, user: updatedUser }));
    }
    await supabaseService.upsertUser(updatedUser);
  };

  const updateProject = async (updatedProject: Project) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
    await supabaseService.upsertProject(updatedProject);
  };

  const addProject = async (newProject: Project) => {
    setProjects(prev => [newProject, ...prev]);
    await supabaseService.upsertProject(newProject);
  };

  const updateUsers = async (updatedUsers: User[]) => {
    setUsers(updatedUsers);
    for (const u of updatedUsers) {
      await supabaseService.upsertUser(u);
    }
  };

  const renderContent = () => {
    if (isInitialLoad) {
      return (
        <div className="flex-grow flex items-center justify-center bg-slate-50">
           <div className="text-center">
             <i className="fas fa-cog fa-spin text-4xl text-construction-yellow mb-4"></i>
             <p className="font-black uppercase tracking-widest text-construction-slate italic">Synchronizing with Site Database...</p>
           </div>
        </div>
      );
    }

    if (currentView === 'home') return <Home onGetStarted={() => setCurrentView('auth')} />;
    if (currentView === 'auth') return <AuthView onLogin={handleLogin} users={users} setUsers={setUsers} />;
    
    if (currentView === 'dashboard' && authState.user) {
      switch (authState.user.role) {
        case UserRole.CUSTOMER:
          return (
            <CustomerDashboard 
              user={authState.user} 
              projects={projects.filter(p => p.customerId === authState.user?.id)} 
              onAddProject={addProject}
              onUpdateProject={updateProject}
              allUsers={users}
            />
          );
        case UserRole.ENGINEER:
          return (
            <EngineerDashboard 
              user={authState.user} 
              projects={projects} 
              onUpdateProject={updateProject}
            />
          );
        case UserRole.ADMIN:
          return (
            <AdminDashboard 
              users={users} 
              setUsers={updateUsers} 
              projects={projects} 
            />
          );
      }
    }
    return <Home onGetStarted={() => setCurrentView('auth')} />;
  };

  return (
    <div className="min-h-screen flex flex-col pb-24 sm:pb-0">
      <Navbar 
        user={authState.user} 
        projects={authState.user?.role === UserRole.CUSTOMER 
          ? projects.filter(p => p.customerId === authState.user?.id) 
          : projects}
        onLogout={handleLogout} 
        onNavHome={() => setCurrentView('home')}
        onNavDashboard={() => setCurrentView('dashboard')}
        onNavLogin={() => setCurrentView('auth')}
        onUpdateUser={handleUpdateUser}
      />
      
      <main className="flex-grow">
        {renderContent()}
      </main>

      {/* ONLY show navigation buttons after login and when on the dashboard */}
      {authState.isAuthenticated && authState.user && currentView === 'dashboard' && (
        <BottomNav 
          onProfile={() => setIsProfileOpen(true)}
          onFieldBot={() => setIsFieldBotOpen(true)}
          onOrders={() => setIsOrdersOpen(true)}
          isActive={isProfileOpen ? 'profile' : isFieldBotOpen ? 'fieldbot' : isOrdersOpen ? 'orders' : null}
        />
      )}

      {/* Global Modals - Only accessible via UI when BottomNav is visible */}
      {isFieldBotOpen && <FieldBotModal onClose={() => setIsFieldBotOpen(false)} />}
      
      {isProfileOpen && authState.user && (
        <ProfileModal 
          user={authState.user} 
          onClose={() => setIsProfileOpen(false)} 
          onUpdate={handleUpdateUser} 
        />
      )}

      {isOrdersOpen && authState.user && (
        <MyProjectsModal 
          user={authState.user} 
          projects={authState.user.role === UserRole.CUSTOMER 
            ? projects.filter(p => p.customerId === authState.user?.id) 
            : projects}
          onClose={() => setIsOrdersOpen(false)} 
          onViewDashboard={() => setCurrentView('dashboard')}
        />
      )}

      <footer className="bg-construction-slate text-white py-12 px-4 text-center border-t-8 border-construction-yellow mb-20 sm:mb-0">
        <p className="text-construction-yellow font-black uppercase tracking-widest text-lg mb-2">BuildEstimate Pro</p>
        <p className="text-slate-400 text-sm font-medium">© 2024 Heavy-Duty Site Management. All rights reserved.</p>
        <div className="mt-4 flex justify-center items-center gap-2 opacity-40 grayscale">
          <i className="fas fa-database text-xs"></i>
          <span className="text-[10px] font-bold uppercase tracking-widest">Connected to Cloud Site Registry</span>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => (
  <LanguageProvider>
    <AppContent />
  </LanguageProvider>
);

export default App;
