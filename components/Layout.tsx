import React, { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  TrendingUp, 
  Menu,
  X
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const Sidebar = ({ mobile, onClose }: { mobile?: boolean; onClose?: () => void }) => {
  const navItems = [
    { to: "/", icon: <LayoutDashboard size={20} />, label: "Umumiy Statistika" },
    { to: "/students", icon: <GraduationCap size={20} />, label: "O'quvchilar" },
    { to: "/staff", icon: <Users size={20} />, label: "O'qituvchilar" },
    { to: "/trends", icon: <TrendingUp size={20} />, label: "Tendensiyalar" },
  ];

  const baseClasses = "flex items-center space-x-3 px-6 py-4 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors duration-200 border-r-4 border-transparent";
  const activeClasses = "bg-indigo-50 text-indigo-600 border-indigo-600";

  return (
    <div className={`h-full flex flex-col bg-white border-r border-slate-200 ${mobile ? 'w-full' : 'w-64'}`}>
      <div className="p-6 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <LayoutDashboard className="text-white" size={24} />
          </div>
          <span className="text-xl font-bold text-slate-800">MaktabTahlil</span>
        </div>
        {mobile && (
          <button onClick={onClose} className="p-2 text-slate-500">
            <X size={24} />
          </button>
        )}
      </div>
      
      <nav className="flex-1 py-6 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) => 
              `${baseClasses} ${isActive ? activeClasses : ''}`
            }
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-100">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Tizim holati</p>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-sm text-slate-700 font-medium">Faol</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:block h-full">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-slate-900/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}>
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-2xl" onClick={e => e.stopPropagation()}>
            <Sidebar mobile onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200">
          <div className="flex items-center space-x-2">
             <div className="bg-indigo-600 p-1.5 rounded-lg">
                <LayoutDashboard className="text-white" size={20} />
             </div>
             <span className="font-bold text-slate-800">MaktabTahlil</span>
          </div>
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
            <Menu size={24} />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
