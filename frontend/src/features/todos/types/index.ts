import { BaseEntity } from '../../../shared/types';
 
export interface Todo extends BaseEntity {
  title: string;
  completed: boolean;
}
 
export type FilterType = 'all' | 'active' | 'completed';
 
export interface TodoFormProps {
  onSubmit: (title: string) => void;
  isLoading?: boolean;
}
 
export interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, title: string) => void;
}
 
export interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, title: string) => void;
}
 
export interface TodoFilterProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  completedCount: number;
  onClearCompleted: () => void;
}