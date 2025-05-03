import e from 'express';
import {getDashboardSummary, getDashboardTrends, getDashboardBreakdown, getDashboardTopics, getTitleDescriptionTopics} from '../controllers/dashboardController.js';
const router = e.Router();

router.get('/summary', getDashboardSummary);
router.get('/trends', getDashboardTrends);
router.get('/breakdown', getDashboardBreakdown)
router.get('/topics', getDashboardTopics)
router.get('/title-desc-topics', getTitleDescriptionTopics);
export default router;
