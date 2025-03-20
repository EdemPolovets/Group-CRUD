import { Request, Response, RequestHandler } from 'express';
import { CreateTodoDTO, UpdateTodoDTO } from '../types/Todo';
import { TodoService } from '../services/TodoService';
 
export class TodoController {
    private todoService: TodoService;
   
    constructor() {
      this.todoService = new TodoService();
    }
   
    getAllTodos: RequestHandler = async (req, res) => {
      try {
        if (!req.user) {
          res.status(401).json({ message: 'Unauthorized' });
          return;
        }
       
        const todos = await this.todoService.getAllTodos(req.user.id);
        res.status(200).json(todos);
      } catch (error) {
        res.status(500).json({ message: 'Failed to get todos', error: (error as Error).message });
      }
    }
   
    getTodoById: RequestHandler = async (req, res) => {
      try {
        if (!req.user) {
          res.status(401).json({ message: 'Unauthorized' });
          return;
        }
       
        const todo = await this.todoService.getTodoById(req.params.id, req.user.id);
        res.status(200).json(todo);
      } catch (error) {
        if ((error as Error).message === 'Todo not found') {
          res.status(404).json({ message: 'Todo not found' });
          return;
        }
        res.status(500).json({ message: 'Failed to get todo', error: (error as Error).message });
      }
    }
   
    createTodo: RequestHandler = async (req, res) => {
      try {
        if (!req.user) {
          res.status(401).json({ message: 'Unauthorized' });
          return;
        }
       
        const todoData: CreateTodoDTO = {
          title: req.body.title,
          userId: req.user.id
        };
       
        const todo = await this.todoService.createTodo(todoData);
        res.status(201).json(todo);
      } catch (error) {
        res.status(400).json({ message: 'Failed to create todo', error: (error as Error).message });
      }
    }
   
    updateTodo: RequestHandler = async (req, res) => {
      try {
        if (!req.user) {
          res.status(401).json({ message: 'Unauthorized' });
          return;
        }
       
        const todoData: UpdateTodoDTO = {};
       
        if (req.body.title !== undefined) {
          todoData.title = req.body.title;
        }
       
        if (req.body.completed !== undefined) {
          todoData.completed = req.body.completed;
        }
       
        const todo = await this.todoService.updateTodo(req.params.id, req.user.id, todoData);
        res.status(200).json(todo);
      } catch (error) {
        if ((error as Error).message === 'Todo not found') {
          res.status(404).json({ message: 'Todo not found' });
          return;
        }
        res.status(400).json({ message: 'Failed to update todo', error: (error as Error).message });
      }
    }
   
    deleteTodo: RequestHandler = async (req, res) => {
      try {
        if (!req.user) {
          res.status(401).json({ message: 'Unauthorized' });
          return;
        }
       
        await this.todoService.deleteTodo(req.params.id, req.user.id);
        res.status(204).send();
      } catch (error) {
        if ((error as Error).message === 'Todo not found') {
          res.status(404).json({ message: 'Todo not found' });
          return;
        }
        res.status(500).json({ message: 'Failed to delete todo', error: (error as Error).message });
      }
    }
  }