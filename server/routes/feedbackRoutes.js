import express from 'express';
import { upload } from '../middleware/upload.js';
import { validateFeedback } from '../middleware/validateFeedback.js';
import { submitFeedback } from '../controllers/feedbackController.js';

const router = express.Router();

// POST /api/feedback
router.post(
  '/',
  upload.array('files'),        // handle multiple file uploads
  validateFeedback,             // validate required fields
  submitFeedback                // controller function
);

export default router;
