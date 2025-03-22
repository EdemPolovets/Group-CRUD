export interface Todo {
    id: string;
    title: string;
    completed: boolean;
    createdAt: Date;
    userId: string;
  }
 
  export interface CreateTodoDTO {
    title: string;
    userId: string;
  }
 
  export interface UpdateTodoDTO {
    title?: string;
    completed?: boolean;
  }