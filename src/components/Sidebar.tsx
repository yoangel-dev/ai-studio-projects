import { MouseEvent } from 'react';
import { Inbox, Calendar, Clock, Tag, Settings, Plus } from 'lucide-react';
import { Screen, SidebarTab } from '../types';

interface SidebarProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen, transitionType?: 'push' | 'push_back') => void;
  activeTab: SidebarTab;
  onChangeTab: (tab: SidebarTab) => void;
  onOpenCreateTask: () => void;
}

export default function Sidebar({
  currentScreen,
  onNavigate,
  activeTab,
  onChangeTab,
  onOpenCreateTask,
}: SidebarProps) {
  const handleTabClick = (tab: SidebarTab) => {
    onChangeTab(tab);
    if (currentScreen !== 'tasks') {
      onNavigate('tasks', 'push_back');
    }
  };

  const handleConfigClick = (e: MouseEvent) => {
    e.preventDefault();
    if (currentScreen !== 'profile') {
      onNavigate('profile', 'push');
    }
  };

  return (
    <nav className="hidden lg:flex flex-col fixed left-0 top-0 pt-16 z-40 bg-[#f1f3fb] dark:bg-[#181c21]/20 h-full w-64 border-r border-[#e0e2ea] transition-all">
      {/* Mi Día Brand Section */}
      <div className="p-6 flex flex-col items-center border-b border-[#e0e2ea] mb-4">
        <img
          alt="Avatar de Crimson Flow"
          className="w-16 h-16 rounded-lg mb-2 shadow-[0_4px_20px_rgba(6,120,215,0.05)] object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkvolc5MeJUeuoc0XuK5fYMVt28Di5VZk1jb759_h8PCYZ-J8GRecq6i1gb_EdQvzDZderwDMn-SnsqEi11O--EbdpUlNiho1mjnNSI7e94t6w7C7leqMy9Q_pcMIQPB1V4gOU3uzI0DYp35fZmJsSAmUdL5YQ5h2zJTWH9EbDW3dEJ5AooSalZGh6I3BHbQiov03fJAlN24joM0uunhFAnsQeXCmg6bbocX_XX46KFHRn1N_ywpOFTvMmhRQ0gT1U4evNZKMi9SI"
        />
        <h2 className="font-semibold text-lg text-[#181c21]">Mi Día</h2>
        <p className="text-xs text-[#414752]">Productividad enfocada</p>
      </div>

      {/* Action Button */}
      <div className="px-4 pb-4">
        <button
          onClick={onOpenCreateTask}
          className="w-full bg-[#005da9] text-white rounded-lg py-2.5 px-4 font-medium flex items-center justify-center gap-2 hover:bg-[#004c8c] transition-colors shadow-sm active:scale-95 cursor-pointer"
        >
          <Plus size={18} />
          <span>Nueva Tarea</span>
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 space-y-1">
        <a
          id="sidebar-inbox"
          href="#inbox"
          onClick={(e) => {
            e.preventDefault();
            handleTabClick('inbox');
          }}
          className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm ${
            currentScreen === 'tasks' && activeTab === 'inbox'
              ? 'bg-[#e0e2ea] text-[#005da9] font-medium'
              : 'text-[#414752] hover:bg-[#e6e8f0]'
          }`}
        >
          <Inbox size={18} />
          <span>Bandeja de entrada</span>
        </a>

        <a
          id="sidebar-today"
          href="#hoy"
          onClick={(e) => {
            e.preventDefault();
            handleTabClick('today');
          }}
          className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm ${
            currentScreen === 'tasks' && activeTab === 'today'
              ? 'bg-[#e0e2ea] text-[#005da9] font-medium'
              : 'text-[#414752] hover:bg-[#e6e8f0]'
          }`}
        >
          <Calendar size={18} />
          <span>Hoy</span>
        </a>

        <a
          id="sidebar-upcoming"
          href="#proximo"
          onClick={(e) => {
            e.preventDefault();
            handleTabClick('upcoming');
          }}
          className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm ${
            currentScreen === 'tasks' && activeTab === 'upcoming'
              ? 'bg-[#e0e2ea] text-[#005da9] font-medium'
              : 'text-[#414752] hover:bg-[#e6e8f0]'
          }`}
        >
          <Clock size={18} />
          <span>Próximo</span>
        </a>

        <a
          id="sidebar-labels"
          href="#etiquetas"
          onClick={(e) => {
            e.preventDefault();
            handleTabClick('labels');
          }}
          className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm ${
            currentScreen === 'tasks' && activeTab === 'labels'
              ? 'bg-[#e0e2ea] text-[#005da9] font-medium'
              : 'text-[#414752] hover:bg-[#e6e8f0]'
          }`}
        >
          <Tag size={18} />
          <span>Etiquetas</span>
        </a>
      </div>

      {/* Configuración button at the bottom */}
      <div className="p-4 border-t border-[#e0e2ea] mt-auto">
        <a
          id="sidebar-config"
          href="#configuracion"
          onClick={handleConfigClick}
          className={`flex items-center gap-3 rounded-lg px-4 py-2.5 transition-all text-sm active:scale-[0.98] ${
            currentScreen === 'profile'
              ? 'bg-[#b8d3ff] text-[#001c3a] font-medium'
              : 'text-[#414752] hover:bg-[#e6e8f0]'
          }`}
        >
          <Settings size={18} className={currentScreen === 'profile' ? 'fill-[#001c3a]/20' : ''} />
          <span>Configuración</span>
        </a>
      </div>
    </nav>
  );
}
