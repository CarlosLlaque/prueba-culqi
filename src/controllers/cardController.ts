import express, { NextFunction, Request, Response } from 'express';
import { jwtMiddleware } from '../middlewares/jwtMiddleware';
import { pkAuthMiddleware } from '../middlewares/pkAuthMiddleware';
import { CardService } from '../services/cardService';

const router = express.Router();
const cardService = new CardService();

router.get('/data', pkAuthMiddleware, jwtMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  const jwt = req.headers.authorization!.split(' ')[1];
  let cardData;

  try {
    cardData = await cardService.getCardData(jwt);
    res.status(200).json(cardData);
  } catch (error) {
    next(error);
  }

});

export default router;
