import { Router } from 'express';

import {
  getAllNotes,
  getNoteById,
  testError,
} from '../controllers/notesController.js';

const router = Router();

router.get('/notes', getAllNotes);
router.get('/notes/:noteId', getNoteById);
router.get('/test-error', testError);

export default router;
