import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Inbox, Calendar, Clock, Tag, Settings, Plus } from 'lucide-react';
import { Task, Profile, Screen, SidebarTab } from './types';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import TaskScreen from './components/TaskScreen';
import ProfileScreen from './components/ProfileScreen';

// Initial dummy tasks to make the prototype look gorgeous out of the box
const DEFAULT_TASKS: Task[] = [
  {
    id: '1',
    title: 'Completar diseño de interfaz Crimson Flow',
    completed: true,
    dueDate: '2026-06-29',
    priority: 'low',
    category: 'inbox',
    tags: ['Diseño', 'UI'],
  },
  {
    id: '2',
    title: 'Revisar entregables del sprint técnico',
    completed: false,
    dueDate: '2026-06-30', // Matches today's date in local metadata
    priority: 'high',
    category: 'inbox',
    tags: ['Reunión', 'Sprint'],
  },
  {
    id: '3',
    title: 'Presentación de planificación de objetivos anuales',
    completed: false,
    dueDate: '2026-07-02',
    priority: 'medium',
    category: 'upcoming',
    tags: ['Estrategia'],
  },
];

const DEFAULT_PROFILE: Profile = {
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1QeJD5RsBS9Xftc3WGl7vEJRxbgbWE7xS6wlDRU0iX7bWFuoNp8p9wg7N69XV6DkcYIklGHKTrAjwb2jdTvDitCzCSJ7di5BnIjYWSrjzYRqHcdh0QDP-YZrvoUks39t9dugDl5d6h6PlPqHJOrashS2WlXXIXd40Iu-rTSg7RoAf1m_N2NWVjuCbfzajfKvbFon8npHZphf0hxRfvMdMUqOyzEXtcm23jLNuv4fqri0TzVkNhBn_ArwrypYEojKzJxwOg0U2MV8',
  nombre: 'Crimson',
  apellidos: 'Flow User',
};

export default function App() {
  // Screen and transition states
  const [currentScreen, setCurrentScreen] = useState<Screen>('tasks');
  const [transitionDirection, setTransitionDirection] = useState<'forward' | 'backward'>('forward');
  const [activeTab, setActiveTab] = useState<SidebarTab>('inbox');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Core Persisted States
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('crimson_tasks');
    return saved ? JSON.parse(saved) : DEFAULT_TASKS;
  });

  const [profile, setProfile] = useState<Profile>(() => {
    const saved = localStorage.getItem('crimson_profile');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  // Persist data updates
  useEffect(() => {
    localStorage.setItem('crimson_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('crimson_profile', JSON.stringify(profile));
  }, [profile]);

  // Task Operations
  const handleAddTask = (
    title: string,
    dueDate: string,
    priority: 'high' | 'medium' | 'low',
    tags: string[]
  ) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      completed: false,
      dueDate,
      priority,
      category: activeTab,
      tags,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const handleSaveProfile = (updatedProfile: Profile) => {
    setProfile(updatedProfile);
  };

  // Navigations with exact custom animation types ('push', 'push_back')
  const handleNavigate = (screen: Screen, transitionType?: 'push' | 'push_back') => {
    if (transitionType === 'push_back' || screen === 'tasks') {
      setTransitionDirection('backward');
    } else {
      setTransitionDirection('forward');
    }
    setCurrentScreen(screen);
    setMobileMenuOpen(false);
  };

  // Trigger focus / modal input when "Nueva Tarea" is clicked
  const handleOpenCreateTask = () => {
    if (currentScreen !== 'tasks') {
      handleNavigate('tasks', 'push_back');
    }
    setTimeout(() => {
      const input = document.getElementById('taskTitle');
      if (input) {
        input.focus();
        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);
  };

  // Screen variants for beautiful framer-motion slides
  const screenVariants = {
    initial: (dir: 'forward' | 'backward') => ({
      opacity: 0,
      x: dir === 'forward' ? 150 : -150,
    }),
    animate: {
      opacity: 1,
      x: 0,
      transition: { type: 'spring', stiffness: 350, damping: 30 },
    },
    exit: (dir: 'forward' | 'backward') => ({
      opacity: 0,
      x: dir === 'forward' ? -150 : 150,
      transition: { ease: 'easeInOut', duration: 0.2 },
    }),
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] flex flex-col text-[#181c21] selection:bg-[#005da9]/20 font-sans">
      {/* Top Application Header */}
      <Header
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        profile={profile}
      />

      {/* Main Framework Layout Container */}
      <div className="flex flex-1 pt-16 relative">
        {/* Left Desktop Sidebar */}
        <Sidebar
          currentScreen={currentScreen}
          onNavigate={handleNavigate}
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          onOpenCreateTask={handleOpenCreateTask}
        />

        {/* Mobile floating drawer toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden fixed bottom-6 right-6 z-50 bg-[#005da9] text-white p-4 rounded-full shadow-lg hover:bg-[#004c8c] transition-transform active:scale-90"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile menu container */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="lg:hidden fixed inset-x-4 bottom-24 z-40 bg-white rounded-2xl shadow-2xl p-6 border border-[#e0e2ea] flex flex-col gap-4"
            >
              <h3 className="text-xs font-bold text-[#717784] uppercase tracking-wider mb-1">
                Navegación Móvil
              </h3>
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setActiveTab('inbox');
                    handleNavigate('tasks');
                  }}
                  className={`flex items-center gap-2 p-3 rounded-lg text-sm transition-all ${
                    currentScreen === 'tasks' && activeTab === 'inbox'
                      ? 'bg-[#e0e2ea] text-[#005da9] font-medium'
                      : 'text-[#414752] hover:bg-[#f1f3fb]'
                  }`}
                >
                  <Inbox size={16} />
                  <span>Bandeja</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('today');
                    handleNavigate('tasks');
                  }}
                  className={`flex items-center gap-2 p-3 rounded-lg text-sm transition-all ${
                    currentScreen === 'tasks' && activeTab === 'today'
                      ? 'bg-[#e0e2ea] text-[#005da9] font-medium'
                      : 'text-[#414752] hover:bg-[#f1f3fb]'
                  }`}
                >
                  <Calendar size={16} />
                  <span>Hoy</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('upcoming');
                    handleNavigate('tasks');
                  }}
                  className={`flex items-center gap-2 p-3 rounded-lg text-sm transition-all ${
                    currentScreen === 'tasks' && activeTab === 'upcoming'
                      ? 'bg-[#e0e2ea] text-[#005da9] font-medium'
                      : 'text-[#414752] hover:bg-[#f1f3fb]'
                  }`}
                >
                  <Clock size={16} />
                  <span>Próximo</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('labels');
                    handleNavigate('tasks');
                  }}
                  className={`flex items-center gap-2 p-3 rounded-lg text-sm transition-all ${
                    currentScreen === 'tasks' && activeTab === 'labels'
                      ? 'bg-[#e0e2ea] text-[#005da9] font-medium'
                      : 'text-[#414752] hover:bg-[#f1f3fb]'
                  }`}
                >
                  <Tag size={16} />
                  <span>Etiquetas</span>
                </button>
              </div>

              <div className="border-t border-[#e0e2ea] pt-4 flex gap-2">
                <button
                  onClick={handleOpenCreateTask}
                  className="flex-1 bg-[#005da9] hover:bg-[#004c8c] text-white py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5"
                >
                  <Plus size={16} />
                  <span>Nueva Tarea</span>
                </button>

                <button
                  onClick={() => handleNavigate('profile', 'push')}
                  className={`p-2.5 rounded-lg border flex items-center justify-center gap-1.5 ${
                    currentScreen === 'profile'
                      ? 'bg-[#b8d3ff] border-[#005da9] text-[#001c3a]'
                      : 'border-[#c0c7d4] text-[#414752]'
                  }`}
                >
                  <Settings size={18} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Primary Screen Area */}
        <main className="flex-1 lg:ml-64 p-6 md:p-8 max-w-5xl mx-auto w-full transition-all overflow-hidden flex flex-col">
          <div className="flex-1">
            <AnimatePresence mode="wait" custom={transitionDirection}>
              {currentScreen === 'tasks' ? (
                <motion.div
                  key="tasks-screen"
                  custom={transitionDirection}
                  variants={screenVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="w-full"
                >
                  <TaskScreen
                    tasks={tasks}
                    onAddTask={handleAddTask}
                    onToggleTask={handleToggleTask}
                    onDeleteTask={handleDeleteTask}
                    activeSidebarTab={activeTab}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="profile-screen"
                  custom={transitionDirection}
                  variants={screenVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="w-full"
                >
                  <ProfileScreen
                    profile={profile}
                    onSaveProfile={handleSaveProfile}
                    onNavigate={handleNavigate}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Core Footer conforming exactly to Image 2 design specs */}
          <footer className="mt-16 pt-6 border-t border-[#e0e2ea] flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-medium text-[#717784] select-none">
            <span className="text-[#005da9]">
              © 2024 Crimson Flow Task Manager
            </span>
            <div className="flex gap-4">
              <a href="#privacidad" className="hover:text-[#005da9] transition-colors">Privacidad</a>
              <a href="#terminos" className="hover:text-[#005da9] transition-colors">Términos</a>
              <a href="#ayuda" className="hover:text-[#005da9] transition-colors">Ayuda</a>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
