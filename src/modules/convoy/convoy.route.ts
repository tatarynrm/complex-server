// src/routes/auth.routes.ts

import { Router } from 'express';

import { convoyController } from './convoy.controller';






const router = Router();



router.post('/new', convoyController.saveConvoy)
router.get('/all', convoyController.getAllConvoys)
router.get('/:id', convoyController.getOneConvoy)


export default router;
