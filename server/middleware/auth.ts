import { Request, Response, NextFunction } from 'express';
import type { User } from '@shared/schema';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated || !req.isAuthenticated() || !req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  next();
};

export const requireVerified = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user?.isVerified) {
    return res.status(403).json({ message: 'Account verification required' });
  }
  next();
};

export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  // This middleware doesn't block the request if user is not authenticated
  next();
};

export const getCurrentUser = (req: Request): User | null => {
  return req.user || null;
};

export const isAuthenticated = (req: Request): boolean => {
  return req.isAuthenticated && req.isAuthenticated() && !!req.user;
};