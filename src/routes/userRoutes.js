import express from 'express';

import { updateUserAvatar } from '../controllers/userController.js';
import { upload } from '../middleware/multer.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

router.patch(
  '/me/avatar',
  authenticate,
  upload.single('avatar'),
  updateUserAvatar,
);

export default router;
