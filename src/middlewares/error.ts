import { NextFunction, Request, Response } from 'express';
import LocalizedError from '../errors/localized-error';

export const errorMiddleware = (
  err: LocalizedError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.message = err.message || 'Internal Server Error';
  err.statusCode = err.statusCode || 500;

  if (err.code === 11000) {
    err.message = `Duplicate ${Object.keys(err.keyValue!).join(', ')} Entered`;
    err.statusCode = 400;
  }

  if (err.name === 'CastError') {
    err.message = `Invalid ${err.path}`;
    err.statusCode = 400;
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    statusCode: err.statusCode,
    localizedMessages: err.localizedMessages,
    timestamp: new Date(),
  });
};
