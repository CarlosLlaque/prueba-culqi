import { Request, Response, NextFunction } from 'express';
import { JwtException } from '../exceptions/jwtException';
import { JwtUtil } from '../util/jwtUtil';

export const jwtMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message:'JWT not present' })
  }

  try {
    JwtUtil.verifyToken(authHeader.split(' ')[1]);
  } catch (error) {
    if (error instanceof JwtException){
      return res.status(401).json({message: error.message})
    }else{
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  next();
};
