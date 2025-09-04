// src/routes/auth.routes.ts

import { Request, Response, Router } from 'express';
import { transportationController } from './transportation.controller';






const router = Router();

router.get('/all', transportationController.getTransportations)
router.post('/new', transportationController.createNewTransportation)
router.get('/form-data', transportationController.getTransportationFormData)



export default router;
