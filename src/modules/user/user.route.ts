// src/routes/auth.routes.ts

import { Router } from 'express';
import { userController } from './user.controller';





const router = Router();

router.post('/user', userController.getUser)



export default router;
