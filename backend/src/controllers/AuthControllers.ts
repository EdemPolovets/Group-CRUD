import { Request, Response, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserService } from '../services/UserService';
 
export class AuthController {
  private userService: UserService;
 
  constructor() {
    this.userService = new UserService();
  }
 
  register: RequestHandler = async (req, res) => {
    try {
      const { username, email, password } = req.body;
     
      if (!username || !email || !password) {
        res.status(400).json({ message: 'All fields are required' });
        return;
      }
     
      const existingUser = await this.userService.getUserByEmail(email);
      if (existingUser) {
        res.status(400).json({ message: 'Email already registered' });
        return;
      }
     
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.userService.createUser({
        username,
        email,
        password: hashedPassword
      });
     
      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );
     
      res.status(201).json({ token, user: { id: user.id, username: user.username, email: user.email } });
    } catch (error) {
      res.status(500).json({ message: 'Failed to register user', error: (error as Error).message });
    }
  };
 
  login: RequestHandler = async (req, res) => {
    try {
      const { email, password } = req.body;
     
      if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required' });
        return;
      }
     
      const user = await this.userService.getUserByEmail(email);
      if (!user) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }
     
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }
     
      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );
     
      res.status(200).json({ token, user: { id: user.id, username: user.username, email: user.email } });
    } catch (error) {
      res.status(500).json({ message: 'Failed to login', error: (error as Error).message });
    }
  };
}