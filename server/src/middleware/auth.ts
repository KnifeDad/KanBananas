import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request type to include user property
interface AuthRequest extends Request {
  user?: any;
}

// Middleware to authenticate JWT tokens
// Extracts token from Authorization header and verifies it
export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  // Get token from Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // Check if token exists
  if (!token) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  try {
    // Verify token using JWT_SECRET
    const user = jwt.verify(token, process.env.JWT_SECRET!);
    // Add user information to request object
    req.user = user;
    next();
  } catch (error) {
    // Return 403 if token is invalid or expired
    res.status(403).json({ message: 'Invalid token' });
  }
};
