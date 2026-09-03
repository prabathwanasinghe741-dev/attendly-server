import express from 'express';
import sectionController from '../controllers/sectionController.js';
import { adminOnly, auth, protect } from '../middleware/protect.js';

const router = express.Router();

router.get('/add/:name', protect, adminOnly, sectionController.addNew);
router.get('/delete/:name', protect, adminOnly, sectionController.deleteOne);
router.get('/all', protect, sectionController.getAll);

export default router;