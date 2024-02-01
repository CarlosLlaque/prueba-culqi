import { Request, Response, NextFunction } from 'express';
import { CardValidationException } from '../exceptions/cardValidationException';
import { GenericException } from '../exceptions/genericException';

export const exceptionHandlerMiddleware = (error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof CardValidationException){
    return res.status(error.statusCode).json({message: error.message})
  }else if (error instanceof GenericException){
    return res.status(error.statusCode).json({message: error.message})
  }

  return res.status(500).json({ message: error.message});
};
