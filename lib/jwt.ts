import jwt from 'jsonwebtoken';
import { env } from './env-validation';

function getJwtSecret(): string {
  return env.JWT_SECRET;
}

export interface JWTPayload {
  userId: string;
  username: string;
}

export function generateToken(payload: JWTPayload): string {
  const JWT_SECRET = getJwtSecret();
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const JWT_SECRET = getJwtSecret();
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

