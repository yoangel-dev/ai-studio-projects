import { useState, useEffect, FormEvent } from 'react';
import { Camera, Check, ArrowLeft } from 'lucide-react';
import { Profile, Screen } from '../types';

interface ProfileScreenProps {
  profile: Profile;
  onSaveProfile: (profile: Profile) => void;
  onNavigate: (screen: Screen, transitionType?: 'push' | 'push_back') => void;
}

export default function ProfileScreen({
  profile,
  onSaveProfile,
  onNavigate,
}: ProfileScreenProps) {
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
  const [nombre, setNombre] = useState(profile.nombre);
  const [apellidos, setApellidos] = useState(profile.apellidos);
  const [previewUrl, setPreviewUrl] = useState(profile.avatarUrl);
  const [isSaved, setIsSaved] = useState(false);

  // Sync state if initial profile changes
  useEffect(() => {
    setAvatarUrl(profile.avatarUrl);
    setNombre(profile.nombre);
    setApellidos(profile.apellidos);
    setPreviewUrl(profile.avatarUrl);
  }, [profile]);

  // Handle live preview on blur or changes
  const handleUrlBlur = () => {
    if (avatarUrl.trim()) {
      setPreviewUrl(avatarUrl.trim());
    } else {
      setPreviewUrl('');
    }
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      avatarUrl: avatarUrl.trim(),
      nombre: nombre.trim(),
      apellidos: apellidos.trim(),
    });

    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      // Navigate back after save
      onNavigate('tasks', 'push_back');
    }, 1500);
  };

  const handleCancel = () => {
    onNavigate('tasks', 'push_back');
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Small top back link */}
      <button
        onClick={handleCancel}
        className="flex items-center gap-2 text-sm font-semibold text-[#005da9] hover:text-[#004c8c] mb-6 cursor-pointer group active:scale-95"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span>Volver a Tareas</span>
      </button>

      {/* Screen Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#181c21] tracking-tight mb-2">
          Configuración de Perfil
        </h1>
        <p className="text-base text-[#414752]">
          Gestiona tu información personal y preferencias de la aplicación.
        </p>
      </header>

      {/* Profile Card Container */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-[0_4px_20px_rgba(6,120,215,0.05)] border border-[#e0e2ea]">
        <form onSubmit={handleSave} className="space-y-8" id="profile-form">
          
          {/* Avatar visual preview and input */}
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="relative group shrink-0">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#f1f3fb] shadow-md flex items-center justify-center bg-gray-100">
                <img
                  id="form-avatar-preview"
                  alt="Vista previa de avatar"
                  className="w-full h-full object-cover"
                  src={previewUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuB1QeJD5RsBS9Xftc3WGl7vEJRxbgbWE7xS6wlDRU0iX7bWFuoNp8p9wg7N69XV6DkcYIklGHKTrAjwb2jdTvDitCzCSJ7di5BnIjYWSrjzYRqHcdh0QDP-YZrvoUks39t9dugDl5d6h6PlPqHJOrashS2WlXXIXd40Iu-rTSg7RoAf1m_N2NWVjuCbfzajfKvbFon8npHZphf0hxRfvMdMUqOyzEXtcm23jLNuv4fqri0TzVkNhBn_ArwrypYEojKzJxwOg0U2MV8"}
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200";
                  }}
                />
              </div>
              <div className="absolute inset-0 bg-[#2d3137]/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera size={24} className="text-white" />
              </div>
            </div>

            <div className="flex-1 w-full">
              <label 
                htmlFor="avatarUrl" 
                className="block text-xs font-bold text-[#414752] uppercase tracking-wider mb-2"
              >
                URL de imagen de avatar
              </label>
              <input
                id="avatarUrl"
                name="avatarUrl"
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                onBlur={handleUrlBlur}
                placeholder="https://ejemplo.com/imagen.jpg"
                className="w-full py-2 bg-white text-[#181c21] border-b-2 border-[#c0c7d4] focus:outline-none focus:border-[#005da9] transition-all text-sm font-medium"
              />
              <p className="text-xs text-[#717784] mt-2">
                Pega la dirección de una imagen online para actualizar tu foto en tiempo real.
              </p>
            </div>
          </div>

          {/* Grid fields: Nombre, Apellidos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label 
                htmlFor="nombre" 
                className="block text-xs font-bold text-[#414752] uppercase tracking-wider mb-2"
              >
                Nombre
              </label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Tu nombre"
                className="w-full py-2 bg-white text-[#181c21] border-b-2 border-[#c0c7d4] focus:outline-none focus:border-[#005da9] transition-all text-sm font-medium"
                required
              />
            </div>

            <div>
              <label 
                htmlFor="apellidos" 
                className="block text-xs font-bold text-[#414752] uppercase tracking-wider mb-2"
              >
                Apellidos
              </label>
              <input
                id="apellidos"
                name="apellidos"
                type="text"
                value={apellidos}
                onChange={(e) => setApellidos(e.target.value)}
                placeholder="Tus apellidos"
                className="w-full py-2 bg-white text-[#181c21] border-b-2 border-[#c0c7d4] focus:outline-none focus:border-[#005da9] transition-all text-sm font-medium"
                required
              />
            </div>
          </div>

          {/* Form Actions footer */}
          <div className="pt-6 border-t border-[#e0e2ea] flex justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2.5 text-sm font-semibold text-[#414752] border border-[#c0c7d4] hover:bg-[#f1f3fb] rounded-lg transition-colors cursor-pointer active:scale-95"
            >
              Cancelar
            </button>

            <button
              id="save-btn"
              type="submit"
              disabled={isSaved}
              className={`px-6 py-2.5 text-sm font-semibold text-white rounded-lg transition-all shadow-md active:scale-95 flex items-center gap-2 cursor-pointer ${
                isSaved ? 'bg-emerald-600' : 'bg-[#005da9] hover:bg-[#004c8c]'
              }`}
            >
              {isSaved ? (
                <>
                  <Check size={16} />
                  <span>¡Guardado con éxito!</span>
                </>
              ) : (
                <span>Guardar Cambios</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
