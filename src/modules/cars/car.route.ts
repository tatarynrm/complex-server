// src/routes/auth.routes.ts

import { Router } from 'express';
import { carController } from './car.controller';





const router = Router();

router.post('/register', carController.register)


export default router;
