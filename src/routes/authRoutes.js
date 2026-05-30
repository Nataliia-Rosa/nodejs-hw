import { celebrate } from 'celebrate';
import { Router } from 'express';

import {
  loginUser,
  requestResetEmail,
  resetPassword,
  logoutUser,
  refreshUserSession,
  registerUser,
} from '../controllers/authController.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  loginUserSchema,
  requestResetEmailSchema,
  registerUserSchema,
  resetPasswordSchema,
} from '../validations/authValidation.js';

const router = Router();

router.post('/register', celebrate(registerUserSchema), ctrlWrapper(registerUser));
router.post('/login', celebrate(loginUserSchema), ctrlWrapper(loginUser));
router.post('/refresh', ctrlWrapper(refreshUserSession));
router.post('/logout', ctrlWrapper(logoutUser));
router.post(
  '/request-reset-email',
  celebrate(requestResetEmailSchema),
  ctrlWrapper(requestResetEmail),
);
router.post('/reset-password', celebrate(resetPasswordSchema), ctrlWrapper(resetPassword));

export default router;
