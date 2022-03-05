import { Router } from 'express';
import categoryRouter from './categoryRouter.js';
import customeRouter from './customerRouter.js';
import gameRouter from './gameRouter.js';

const router = Router();
router.use(categoryRouter);
router.use(gameRouter);
router.use(customeRouter);

export default router;