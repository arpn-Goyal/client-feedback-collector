import e from 'express';
import {getDashboardSummary} from '../controllers/dashboardController.js';
const router = e.Router();

router.get('/summary', getDashboardSummary);

export default router;
