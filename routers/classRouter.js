import express from 'express';
import classController from '../controllers/classController.js';
import { adminOnly, auth, protect } from '../middleware/protect.js';

const router = express.Router();

router.get('/get/:section', protect, classController.getBySection);
router.get('/delete/:section/:name', protect, adminOnly, classController.deleteOne);
router.get('/user', protect, auth, classController.selectForToken);
router.get('/all', protect, adminOnly, classController.getAllClass);
router.get('/user/in', protect, auth, classController.isEntered);
router.get('/leave/:id', protect, auth, classController.leaveClass);
router.post('/add/new', protect, adminOnly, classController.addNew);
router.post('/enter', protect, auth, classController.enterClass);

export default router;