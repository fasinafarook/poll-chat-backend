import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  userId?: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const auth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = req.header('x-auth-token');

  if (!token) {
     res.status(401).json({ msg: 'No token, authorization denied' });
     return
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string }; // Make sure this matches the payload structure
    req.userId = decoded.id; // Correct property access based on token payload
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
