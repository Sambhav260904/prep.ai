import React from 'react';
import { Brain, LogOut, User, Home, LayoutDashboard, Award, Settings, Search, Bell, Menu, X } from 'lucide-react';
import { UserProfile } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: UserProfile | null;
  onLogout: () => void;
  activeView: string;
  setView: (v: any) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, activeView, setView }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const NavItem = ({ id, label, icon: Icon }: { id: string, label: string, icon: any }) => (
    <button 
      onClick={() => {
        setView(id);
        setIsSidebarOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
        activeView === id 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
          : 'text-slate-500 hover:bg-indigo-50 hover:text-indigo-600'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-72 bg-white border-r border-slate-200 z-[70] transition-transform duration-300 lg:translate-x-0 lg:static ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="bg-gradient-to-tr from-indigo-600 to-violet-600 p-2 rounded-xl shadow-lg shadow-indigo-100">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold font-outfit text-slate-900 tracking-tight">
              PrepGenie AI
            </span>
          </div>

          <nav className="flex-1 space-y-2">
            <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Main Menu</p>
            <NavItem id="DASHBOARD" label="Dashboard" icon={LayoutDashboard} />
            <NavItem id="PRACTICE" label="Practice Lab" icon={Home} />
            <NavItem id="LEADERBOARD" label="Leaderboard" icon={Award} />
            
            <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-8 mb-2">Account</p>
            <NavItem id="PROFILE" label="Profile" icon={User} />
            <NavItem id="SETTINGS" label="Settings" icon={Settings} />
          </nav>

          {user && (
            <div className="mt-auto pt-6 border-t border-slate-100">
              <div className="flex items-center gap-3 p-2 mb-4">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border border-indigo-200">
                  {user.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                  <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                </div>
              </div>
              <button 
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-50">
          <div className="flex items-center gap-4">
             <button 
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
             >
                <Menu className="w-6 h-6" />
             </button>
             <div className="hidden sm:flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl border border-slate-200 group focus-within:ring-2 ring-indigo-500/20 transition-all">
                <Search className="w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search challenges..." 
                  className="bg-transparent border-none text-sm focus:outline-none w-48 sm:w-64"
                />
             </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block"></div>
            <div className="flex items-center gap-3">
               <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-slate-900">Today's Goal</p>
                  <p className="text-[10px] text-indigo-600 font-medium">85% Completed</p>
               </div>
               <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-indigo-100">
                  {user?.stats.streak}
                  <span className="text-[8px] absolute -bottom-1 bg-white text-indigo-600 px-1 rounded-full border border-indigo-100 shadow-sm">DAYS</span>
               </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;