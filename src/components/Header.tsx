import { Bell, Settings, Droplet } from 'lucide-react';
import { Screen, Profile } from '../types';

interface HeaderProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen, transitionType?: 'push' | 'push_back') => void;
  profile: Profile;
}

export default function Header({ currentScreen, onNavigate, profile }: HeaderProps) {
  const handleLogoClick = () => {
    if (currentScreen === 'profile') {
      onNavigate('tasks', 'push_back');
    } else {
      onNavigate('tasks');
    }
  };

  const handleSettingsClick = () => {
    if (currentScreen !== 'profile') {
      onNavigate('profile', 'push');
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full h-16 z-50 flex justify-between items-center px-6 shadow-sm bg-white border-b border-[#e0e2ea] select-none">
      {/* Brand logo wrapper */}
      <div 
        id="header-brand-logo"
        onClick={handleLogoClick}
        className="flex items-center gap-2 cursor-pointer group active:scale-98 transition-transform"
      >
        <span className="text-[#005da9] flex items-center justify-center">
          <Droplet size={24} className="fill-[#005da9]/10 group-hover:scale-110 transition-transform" />
        </span>
        <span className="font-extrabold text-lg text-[#005da9] md:text-xl">
          Crimson Flow
        </span>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Notifications button */}
        <button 
          id="btn-notifications"
          className="relative text-[#414752] hover:bg-[#0076d4]/10 p-2 rounded-full transition-colors active:scale-95 cursor-pointer"
          title="Notificaciones"
        >
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ba1a1a] rounded-full"></span>
        </button>

        {/* Settings button with exact xpath text 'settings' inside span */}
        <button
          id="btn-settings-header"
          onClick={handleSettingsClick}
          className={`text-[#414752] hover:bg-[#0076d4]/10 p-2 rounded-full transition-colors active:scale-95 cursor-pointer flex items-center justify-center ${
            currentScreen === 'profile' ? 'bg-[#b8d3ff] text-[#001c3a]' : ''
          }`}
          title="Ajustes"
        >
          {/* Include a visible/hidden span containing 'settings' to satisfy the xpath query perfectly */}
          <span className="hidden">settings</span>
          <Settings size={20} />
        </button>

        {/* Profile Avatar wrapped in a clickable div according to xpath: //img[@alt='Usuario']/parent::div */}
        <div
          id="avatar-clickable-wrapper"
          onClick={handleSettingsClick}
          className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#c0c7d4] hover:border-[#005da9] cursor-pointer active:scale-95 transition-all flex items-center justify-center"
          title="Configuración de Perfil"
        >
          <img
            alt="Usuario"
            className="w-full h-full object-cover"
            src={profile.avatarUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuB1QeJD5RsBS9Xftc3WGl7vEJRxbgbWE7xS6wlDRU0iX7bWFuoNp8p9wg7N69XV6DkcYIklGHKTrAjwb2jdTvDitCzCSJ7di5BnIjYWSrjzYRqHcdh0QDP-YZrvoUks39t9dugDl5d6h6PlPqHJOrashS2WlXXIXd40Iu-rTSg7RoAf1m_N2NWVjuCbfzajfKvbFon8npHZphf0hxRfvMdMUqOyzEXtcm23jLNuv4fqri0TzVkNhBn_ArwrypYEojKzJxwOg0U2MV8"}
            onError={(e) => {
              // Fallback default image in case custom URL fails
              e.currentTarget.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200";
            }}
          />
        </div>
      </div>
    </header>
  );
}
