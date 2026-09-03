import express from 'express';
import userController from '../controllers/userController.js';
import { auth, protect } from '../middleware/protect.js';

const router = express.Router();

router.get('/verify/:id', protect, userController.verifyToken);
router.get('/me', protect, auth, userController.aboutMe);
router.post('/add/new', protect, userController.addUser);
router.post('/login', protect, userController.loginUser);

export default router;