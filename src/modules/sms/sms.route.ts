// src/routes/auth.routes.ts

import { Router } from 'express';
import { smsController } from './sms.controller';

const router = Router();

router.post('/send', smsController.sendMessages);
router.get('/logs', smsController.getLogs);

export default router;
