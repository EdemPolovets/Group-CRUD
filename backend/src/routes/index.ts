import express from 'express';
import todoRoutes from './todoroutes';
import authRoutes from './authRoutes';
 
const router = express.Router();
 
router.use('/api/todos', todoRoutes);
router.use('/api/auth', authRoutes);
 
export default router;