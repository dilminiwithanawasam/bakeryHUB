import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'supersecret_bakery_key';

// Extend the Express Request type to include our user data
export interface AuthRequest extends Request {
  user?: {
    userId: number;
    role: string;
  };
}

// 1. Authenticate (Check if the user is logged in)
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  // Format: "Bearer <TOKEN>"
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: "Access denied. No token provided." });
    return;
  }

  try {
    const verified = jwt.verify(token, SECRET_KEY) as any;
    (req as AuthRequest).user = verified; // Attach user info to the request
    next(); // Move to the next middleware or controller
  } catch (error) {
    res.status(403).json({ error: "Invalid or expired token." });
  }
};

// 2. Authorize (Check if the user has the right Role)
export const authorizeRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as AuthRequest).user;

    if (!user) {
      res.status(401).json({ error: "User not authenticated." });
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      res.status(403).json({ 
        error: `Access denied. Role '${user.role}' is not authorized to perform this action.` 
      });
      return;
    }

    next(); // Role is allowed, proceed!
  };
};