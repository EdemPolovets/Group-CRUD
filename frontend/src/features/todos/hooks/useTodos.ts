import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { todoService } from '@core/api';
import { Todo } from '@core/api/types/todo.types';
 
type TodoMutationType = 'create' | 'update' | 'delete';
 
interface TodoMutationParams {
  type: TodoMutationType;
  id?: string;
  data?: { title?: string; completed?: boolean };
}
 
export const useTodos = () => {
  const queryClient = useQueryClient();
 
  const { data: todos = [], isLoading, error } = useQuery<Todo[]>({
    queryKey: ['todos'],
    queryFn: () => todoService.getAll(),
  });
 
  const mutation = useMutation({
    mutationFn: async ({ type, id, data }: TodoMutationParams) => {
      switch (type) {
        case 'create':
          if (!data?.title) throw new Error('Title is required for creating a todo');
          return todoService.create({ title: data.title });
        case 'update':
          if (!id) throw new Error('ID is required for updating a todo');
          return todoService.update(id, data || {});
        case 'delete':
          if (!id) throw new Error('ID is required for deleting a todo');
          return todoService.delete(id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
 
  return {
    todos,
    isLoading,
    error,
    addTodo: (title: string) => mutation.mutate({ type: 'create', data: { title } }),
    deleteTodo: (id: string) => mutation.mutate({ type: 'delete', id }),
    toggleTodoStatus: (id: string, completed: boolean) =>
      mutation.mutate({ type: 'update', id, data: { completed } }),
    updateTodoTitle: (id: string, title: string) =>
      mutation.mutate({ type: 'update', id, data: { title } }),
  };
};