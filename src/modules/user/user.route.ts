// src/routes/auth.routes.ts

import { Router } from 'express';
import { userController } from './user.controller';





const router = Router();

router.get('/all', userController.getUsers)
router.put('/:id', userController.updateUser)



export default router;
