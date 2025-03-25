import { Todo, CreateTodoDTO, UpdateTodoDTO } from '../types/Todo';
import { TodoRepository } from '../repositories/TodoRepository';
 
export class TodoService {
  private todoRepository: TodoRepository;
 
  constructor() {
    this.todoRepository = new TodoRepository();
  }
 
  async getAllTodos(userId: string): Promise<Todo[]> {
    return this.todoRepository.findAll(userId);
  }
 
  async getTodoById(id: string, userId: string): Promise<Todo> {
    const todo = await this.todoRepository.findById(id, userId);
   
    if (!todo) {
      throw new Error('Todo not found');
    }
   
    return todo;
  }
 
  async createTodo(todoData: CreateTodoDTO): Promise<Todo> {
    if (!todoData.title || todoData.title.trim() === '') {
      throw new Error('Todo title is required');
    }
   
    return this.todoRepository.create({
      title: todoData.title.trim(),
      userId: todoData.userId
    });
  }
 
  async updateTodo(id: string, userId: string, todoData: UpdateTodoDTO): Promise<Todo> {
    // Validation
    if (todoData.title !== undefined && todoData.title.trim() === '') {
      throw new Error('Todo title cannot be empty');
    }
   
    const updatedTodo = await this.todoRepository.update(id, userId, {
      ...todoData,
      title: todoData.title ? todoData.title.trim() : undefined
    });
   
    if (!updatedTodo) {
      throw new Error('Todo not found');
    }
   
    return updatedTodo;
  }
 
  async deleteTodo(id: string, userId: string): Promise<boolean> {
    const deleted = await this.todoRepository.delete(id, userId);
   
    if (!deleted) {
      throw new Error('Todo not found');
    }
   
    return true;
  }
}