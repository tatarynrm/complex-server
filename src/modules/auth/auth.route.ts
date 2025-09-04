// src/routes/auth.routes.ts

import { Router } from 'express';
import { authController } from './auth.controller';
import { checkAuth } from '../../common/middlewares/check-auth.middleware';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.get('/me', checkAuth, authController.getMe);
router.get('/all-sessions', checkAuth, authController.getUserSessions);
router.delete(
  '/delete-other-sessions',
  checkAuth,
  authController.deleteOtherSessions,
);
router.get('/logout', authController.logout);

export default router;
