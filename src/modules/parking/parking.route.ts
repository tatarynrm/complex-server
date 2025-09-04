// src/routes/auth.routes.ts

import { Router } from 'express';
import { parkingController } from './parking.controller';







const router = Router();

router.get('/all', parkingController.getAllParkingCars)




export default router;