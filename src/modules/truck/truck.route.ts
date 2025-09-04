// src/routes/auth.routes.ts

import { Router } from 'express';
import { truckController } from './truck.controller';






const router = Router();

router.post('/new', truckController.createNewTruck)
router.post('/update', truckController.updateTruck)
router.post('/all', truckController.getAllTrucks)
router.get('/status', truckController.getTruckStatus)



export default router;
