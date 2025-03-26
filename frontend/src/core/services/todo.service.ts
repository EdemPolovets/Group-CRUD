import { api } from '@core/api/client';
import { Todo } from '@core/api/types/todo.types';
 
export class TodoService {
  static async getAll(): Promise<Todo[]> {
    const response = await api.get<Todo[]>('/todos');
    return response.data;
  }
 
  static async create(data: { title: string }): Promise<Todo> {
    const response = await api.post<Todo>('/todos', data);
    return response.data;
  }
 
  static async update(id: string, todo: Partial<Todo>): Promise<Todo> {
    const response = await api.patch<Todo>(`/todos/${id}`, todo);
    return response.data;
  }
 
  static async delete(id: string): Promise<void> {
    await api.delete(`/todos/${id}`);
  }
}
 
export const todoService = TodoService;