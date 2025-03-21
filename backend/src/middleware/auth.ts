import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
 
interface UserPayload {
  id: string;
  username: string;
}
 
declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}
 
export const authenticate: RequestHandler = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
   
    if (!authHeader) {
      res.status(401).json({ message: 'No authorization header' });
      return;
    }
 
    const token = authHeader.split(' ')[1];
   
    if (!token) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }
 
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as UserPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};