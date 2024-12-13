import { Request, Response, NextFunction } from 'express';
import { logger } from '../src/utils/logger';

const failedAttempts = new Map<string, number>();
const THRESHOLD = 5;
const BLOCK_DURATION = 15 * 60 * 1000; // 15 minutes

export const monitorAuth = (req: Request, res: Response, next: NextFunction): void => {
  const clientIP = req.ip || 'unknown';
  
  if ((failedAttempts.get(clientIP) || 0) >= THRESHOLD) {
    logger.warn(`Blocked request from IP ${clientIP} due to multiple failed attempts`);
    res.status(403).json({ error: 'Too many failed attempts' });
    return;
  }

  res.on('finish', () => {
    if (res.statusCode === 401) {
      const attempts = (failedAttempts.get(clientIP) || 0) + 1;
      failedAttempts.set(clientIP, attempts);
      
      logger.warn('Failed authentication attempt', {
        event: 'failed_auth_attempt',
        ip: clientIP,
        attempts,
        headers: req.headers
      });

      setTimeout(() => failedAttempts.delete(clientIP), BLOCK_DURATION);
    }
  });

  next();
}; 