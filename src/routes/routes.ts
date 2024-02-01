import express from 'express';
import tokenController from '../controllers/tokenController';
import cardController from '../controllers/cardController';

const router = express.Router();

router.use('/token', tokenController);
router.use('/card', cardController);

export default router;
