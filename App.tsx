
import React, { useState, useEffect } from 'react';
import { User, UserRole, Project, AuthState } from './types';
import Navbar from './components/Navbar';
import Home from './views/Home';
import AuthView from './views/Auth';
import CustomerDashboard from './views/CustomerDashboard';
import EngineerDashboard from './views/EngineerDashboard';
import AdminDashboard from './views/AdminDashboard';
import { initialProjects, initialUsers } from './constants';

const App: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const saved = localStorage.getItem('auth');
    return saved ? JSON.parse(saved) : { user: null, isAuthenticated: false };
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('users');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('projects');
    return saved ? JSON.parse(saved) : initialProjects;
  });

  const [currentView, setCurrentView] = useState<'home' | 'auth' | 'dashboard'>('home');

  useEffect(() => {
    localStorage.setItem('auth', JSON.stringify(authState));
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [authState, users, projects]);

  const handleLogin = (user: User) => {
    setAuthState({ user, isAuthenticated: true });
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setAuthState({ user: null, isAuthenticated: false });
    setCurrentView('home');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (authState.user?.id === updatedUser.id) {
      setAuthState(prev => ({ ...prev, user: updatedUser }));
    }
  };

  const updateProject = (updatedProject: Project) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  const addProject = (newProject: Project) => {
    setProjects(prev => [newProject, ...prev]);
  };

  const updateUsers = (updatedUsers: User[]) => {
    setUsers(updatedUsers);
  };

  const renderContent = () => {
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
    <div className="min-h-screen flex flex-col">
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
      <footer className="bg-construction-slate text-white py-12 px-4 text-center border-t-8 border-construction-yellow">
        <p className="text-construction-yellow font-black uppercase tracking-widest text-lg mb-2">BuildEstimate Pro</p>
        <p className="text-slate-400 text-sm font-medium">© 2024 Heavy-Duty Site Management. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
