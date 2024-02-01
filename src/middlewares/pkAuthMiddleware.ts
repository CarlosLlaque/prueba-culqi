import { Request, Response, NextFunction } from 'express';

export const pkAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('pk-token');

  if (!token) {
    return res.status(401).json({ message: 'pk-token header not present' });
  }

  if (!token.startsWith('pk_test_')){
    return res.status(401).json({ message: 'Invalid PK token format' });
  }

  next()
};
