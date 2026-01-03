/**
 * CSRF Protection Utility
 * Validates CSRF tokens for state-changing operations
 */

import { NextRequest } from 'next/server';
import { logger } from './logger';

/**
 * Generate a CSRF token (for future use with forms)
 */
export function generateCSRFToken(): string {
  return Buffer.from(`${Date.now()}-${Math.random()}`).toString('base64');
}

/**
 * Validate CSRF token from request
 * For Next.js, we rely on SameSite cookies and origin checking
 * This provides additional validation for API routes
 */
export function validateCSRF(request: NextRequest): boolean {
  try {
    // Check origin header
    const origin = request.headers.get('origin');
    const referer = request.headers.get('referer');
    const host = request.headers.get('host');
    
    // Allow same-origin requests
    if (!origin && !referer) {
      // Direct API calls (e.g., from server components) are allowed
      return true;
    }
    
    // Validate origin matches host
    if (origin) {
      const originHost = new URL(origin).host;
      if (originHost !== host && originHost !== `www.${host}`) {
        logger.warn('CSRF validation failed: origin mismatch', {
          origin,
          host,
        });
        return false;
      }
    }
    
    // Validate referer if present
    if (referer && !origin) {
      const refererHost = new URL(referer).host;
      if (refererHost !== host && refererHost !== `www.${host}`) {
        logger.warn('CSRF validation failed: referer mismatch', {
          referer,
          host,
        });
        return false;
      }
    }
    
    return true;
  } catch (error) {
    logger.error('CSRF validation error', error instanceof Error ? error : undefined);
    return false;
  }
}

/**
 * Middleware to check CSRF for POST/PUT/DELETE requests
 */
export function requireCSRF(request: NextRequest): boolean {
  const method = request.method;
  
  // Only check CSRF for state-changing methods
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    return validateCSRF(request);
  }
  
  return true;
}

