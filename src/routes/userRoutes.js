import { Router } from 'express';

import { authenticate } from '../middleware/authenticate.js';
import upload from '../middleware/multer.js';
import { getCurrentUser, updateUserAvatar } from '../controllers/userController.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = Router();

router.use(authenticate);

router.get('/me', ctrlWrapper(getCurrentUser));
router.patch('/me/avatar', upload.single('avatar'), ctrlWrapper(updateUserAvatar));

export default router;
