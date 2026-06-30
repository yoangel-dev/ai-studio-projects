export interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string; // YYYY-MM-DD
  priority: 'high' | 'medium' | 'low';
  category: 'inbox' | 'today' | 'upcoming' | 'labels';
  tags: string[];
}

export interface Profile {
  avatarUrl: string;
  nombre: string;
  apellidos: string;
}

export type Screen = 'tasks' | 'profile';

export type TaskFilter = 'all' | 'pending' | 'completed';

export type SidebarTab = 'inbox' | 'today' | 'upcoming' | 'labels';
