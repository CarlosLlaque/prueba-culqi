import express, { NextFunction, Request, Response } from 'express';
import { TokenService } from '../services/tokenService';
import { GenerateTokenRequest } from '../models/requests/generateTokenRequest';
import { pkAuthMiddleware } from '../middlewares/pkAuthMiddleware';
import RedisClient from '../util/redisUtil';

const router = express.Router();
const tokenService = new TokenService(new RedisClient());

router.post('/generateToken', pkAuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  const tokenRequest:GenerateTokenRequest = req.body;
  let token;
    try {
      const isValid = tokenService.validateTokenRequest(tokenRequest);
      if(isValid){
        token = await tokenService.generateToken(tokenRequest);
        res.status(200).json({token:token})
      }
    } catch (error) {
      next(error);
    }

});

export default router;
