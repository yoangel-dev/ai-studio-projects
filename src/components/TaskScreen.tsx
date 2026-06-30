import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Calendar, AlertCircle, Sparkles, FolderOpen } from 'lucide-react';
import { Task, TaskFilter, SidebarTab } from '../types';

interface TaskScreenProps {
  tasks: Task[];
  onAddTask: (title: string, dueDate: string, priority: 'high' | 'medium' | 'low', tags: string[]) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  activeSidebarTab: SidebarTab;
}

export default function TaskScreen({
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  activeSidebarTab,
}: TaskScreenProps) {
  const [newTitle, setNewTitle] = useState('');
  const [newDueDate, setNewDueDate] = useState(() => {
    // Default to today
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [selectedTag, setSelectedTag] = useState<string>('');

  // Sidebar Tab filtering
  const getSidebarFilteredTasks = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    
    switch (activeSidebarTab) {
      case 'today':
        return tasks.filter((t) => t.dueDate === todayStr);
      case 'upcoming':
        return tasks.filter((t) => t.dueDate > todayStr);
      case 'labels':
        // Show high priority tasks as 'labels' or let user filter by tags
        return tasks.filter((t) => t.priority === 'high' || t.tags.length > 0);
      case 'inbox':
      default:
        return tasks;
    }
  };

  const sidebarFilteredTasks = getSidebarFilteredTasks();

  // Filter chips filtering (Todas, Pendientes, Completadas)
  const finalTasks = sidebarFilteredTasks.filter((task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const tagsList = selectedTag.trim() ? [selectedTag.trim()] : [];
    onAddTask(newTitle, newDueDate, priority, tagsList);
    setNewTitle('');
    setSelectedTag('');
    
    // Default priority back to medium
    setPriority('medium');
  };

  const getPriorityBadgeColor = (p: 'high' | 'medium' | 'low') => {
    switch (p) {
      case 'high':
        return 'bg-[#ffdad6] text-[#ba1a1a] border-[#ffb4ab]';
      case 'medium':
        return 'bg-[#ffdbc7] text-[#934700] border-[#ffb688]';
      case 'low':
        return 'bg-[#d4e3ff] text-[#005da9] border-[#adc8f3]';
    }
  };

  const getPriorityLabel = (p: 'high' | 'medium' | 'low') => {
    switch (p) {
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
    }
  };

  const getSidebarTitle = () => {
    switch (activeSidebarTab) {
      case 'today': return 'Tareas de Hoy';
      case 'upcoming': return 'Próximas Tareas';
      case 'labels': return 'Tareas Destacadas & Etiquetas';
      case 'inbox':
      default:
        return 'Mis Tareas';
    }
  };

  const getSidebarSubtitle = () => {
    switch (activeSidebarTab) {
      case 'today': return 'Tareas programadas para el día de hoy.';
      case 'upcoming': return 'Tu planificación y objetivos futuros.';
      case 'labels': return 'Tareas de alta prioridad y categorizadas.';
      case 'inbox':
      default:
        return 'Mantén tu día organizado y enfocado.';
    }
  };

  return (
    <div className="w-full">
      {/* Title Header Section */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-[#181c21] tracking-tight mb-2 flex items-center gap-2">
          {getSidebarTitle()}
          {activeSidebarTab === 'today' && <Sparkles className="text-[#005da9] animate-pulse" size={24} />}
        </h1>
        <p className="text-base text-[#414752]">{getSidebarSubtitle()}</p>
      </header>

      {/* Task Creation Form Card */}
      <div className="bg-white rounded-2xl p-6 mb-8 shadow-[0_4px_20px_rgba(6,120,215,0.05)] border border-[#e0e2ea]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label htmlFor="taskTitle" className="block text-xs font-semibold text-[#414752] uppercase tracking-wider mb-1">
                ¿Qué hay que hacer?
              </label>
              <input
                id="taskTitle"
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Añadir nueva tarea..."
                className="w-full py-2 bg-transparent text-lg text-[#181c21] placeholder-[#717784] border-b-2 border-[#c0c7d4] focus:outline-none focus:border-b-[#005da9] transition-all"
                required
              />
            </div>

            {/* Crear Tarea button matching mockup exactly */}
            <button
              id="btn-create-task"
              type="submit"
              className="w-full md:w-auto bg-[#005da9] hover:bg-[#004c8c] text-white font-medium rounded-lg px-6 py-3 flex items-center justify-center gap-2 transition-colors active:scale-98 cursor-pointer shadow-md"
            >
              <Plus size={18} />
              <span>Crear Tarea</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {/* Due date picker */}
            <div>
              <label htmlFor="dueDate" className="block text-xs font-semibold text-[#414752] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Calendar size={14} className="text-[#005da9]" />
                Fecha de Vencimiento
              </label>
              <input
                id="dueDate"
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="w-full px-3 py-1.5 bg-[#f1f3fb] border border-[#c0c7d4] rounded-lg text-sm text-[#181c21] focus:outline-none focus:border-[#005da9] transition-colors"
              />
            </div>

            {/* Priority Selector */}
            <div>
              <span className="block text-xs font-semibold text-[#414752] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <AlertCircle size={14} className="text-[#005da9]" />
                Prioridad
              </span>
              <div className="grid grid-cols-3 gap-1 bg-[#f1f3fb] p-1 rounded-lg border border-[#c0c7d4]">
                {(['low', 'medium', 'high'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`py-1 text-xs font-medium rounded-md transition-all ${
                      priority === p
                        ? p === 'high'
                          ? 'bg-[#ba1a1a] text-white shadow-sm'
                          : p === 'medium'
                          ? 'bg-[#934700] text-white shadow-sm'
                          : 'bg-[#005da9] text-white shadow-sm'
                        : 'text-[#414752] hover:bg-[#e0e2ea]'
                    }`}
                  >
                    {getPriorityLabel(p)}
                  </button>
                ))}
              </div>
            </div>

            {/* Tag / Category input */}
            <div>
              <label htmlFor="taskTag" className="block text-xs font-semibold text-[#414752] uppercase tracking-wider mb-1.5">
                Etiqueta / Categoría
              </label>
              <input
                id="taskTag"
                type="text"
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                placeholder="Ej. Trabajo, Hogar"
                className="w-full px-3 py-1.5 bg-[#f1f3fb] border border-[#c0c7d4] rounded-lg text-sm text-[#181c21] placeholder-[#717784] focus:outline-none focus:border-[#005da9] transition-colors"
              />
            </div>
          </div>
        </form>
      </div>

      {/* Filter Control Chips matching Image 1: "Todas", "Pendientes", "Completadas" */}
      <div className="flex gap-2 mb-6">
        {(['all', 'pending', 'completed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-all active:scale-95 cursor-pointer ${
              filter === f
                ? 'bg-[#005da9] text-white border-[#005da9] shadow-sm'
                : 'bg-white hover:bg-[#e6e8f0] text-[#414752] border-[#c0c7d4]'
            }`}
          >
            {f === 'all' && 'Todas'}
            {f === 'pending' && 'Pendientes'}
            {f === 'completed' && 'Completadas'}
          </button>
        ))}
      </div>

      {/* Tasks List container */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {finalTasks.length > 0 ? (
            finalTasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`flex items-center justify-between p-4 bg-white rounded-xl shadow-[0_2px_10px_rgba(6,120,215,0.02)] border transition-all ${
                  task.completed
                    ? 'border-[#e0e2ea] bg-gray-50/50'
                    : 'border-[#c0c7d4] hover:shadow-[0_4px_20px_rgba(6,120,215,0.05)]'
                }`}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {/* Task Checkbox Button */}
                  <button
                    onClick={() => onToggleTask(task.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                      task.completed
                        ? 'bg-[#005da9] border-[#005da9] text-white'
                        : 'border-[#c0c7d4] hover:border-[#005da9] bg-white'
                    }`}
                  >
                    {task.completed && (
                      <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-3" viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>

                  {/* Task details */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`font-semibold text-base truncate transition-all ${
                        task.completed
                          ? 'text-[#717784] line-through'
                          : 'text-[#181c21]'
                      }`}
                    >
                      {task.title}
                    </h3>
                    
                    {/* Metadata strip */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-1">
                      {/* Due date badge */}
                      {task.dueDate && (
                        <span className="flex items-center gap-1 text-xs text-[#717784] font-mono">
                          <Calendar size={12} className="text-[#005da9]" />
                          {task.dueDate}
                        </span>
                      )}

                      {/* Tags */}
                      {task.tags && task.tags.map((tag) => (
                        <span key={tag} className="bg-[#eceef6] text-[#414752] text-[10px] px-2 py-0.5 rounded font-mono font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right controls: priority badge and delete button */}
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold border ${getPriorityBadgeColor(task.priority)}`}>
                    {getPriorityLabel(task.priority)}
                  </span>

                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="text-[#717784] hover:text-[#ba1a1a] p-1.5 rounded-md hover:bg-red-50 transition-colors cursor-pointer"
                    title="Eliminar tarea"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            // Beautiful empty state matching mockup exactly
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl border border-dashed border-[#c0c7d4] bg-white/50"
            >
              <div className="w-16 h-16 rounded-full bg-[#f1f3fb] flex items-center justify-center mb-4 text-[#717784]">
                <FolderOpen size={28} />
              </div>
              <h3 className="text-xl font-bold text-[#181c21] mb-1">Nada por aquí</h3>
              <p className="text-sm text-[#414752] max-w-sm">
                Disfruta tu tiempo libre o crea una nueva tarea para mantener tu día organizado.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
