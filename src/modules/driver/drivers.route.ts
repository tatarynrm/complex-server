// src/routes/auth.routes.ts

import { Router } from 'express';
import { driversController } from './driver.controller';





const router = Router();

router.get('/all', driversController.getAllDrivers)
router.post('/new', driversController.createNewDriver)
router.post('/update', driversController.updateDriver)


export default router;
