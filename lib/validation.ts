/**
 * Input validation schemas using Zod
 */

import { z } from 'zod';

// Blog validation schema
export const blogSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters')
    .trim(),
  content: z
    .string()
    .min(1, 'Content is required')
    .max(50000, 'Content must be less than 50000 characters'),
  excerpt: z
    .string()
    .max(500, 'Excerpt must be less than 500 characters')
    .optional()
    .nullable(),
  featuredImage: z
    .string()
    .optional()
    .nullable()
    .refine(
      (val) => {
        if (!val || val.trim() === '') return true;
        try {
          new URL(val);
          return true;
        } catch {
          return false;
        }
      },
      { message: 'Invalid image URL' }
    ),
  published: z.boolean().default(false),
});

// Contact form validation schema
export const contactSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  email: z
    .string()
    .email('Invalid email address')
    .max(100, 'Email must be less than 100 characters'),
  subject: z
    .string()
    .min(1, 'Subject is required')
    .max(200, 'Subject must be less than 200 characters')
    .trim(),
  message: z
    .string()
    .min(1, 'Message is required')
    .max(5000, 'Message must be less than 5000 characters')
    .trim(),
});

// Login validation schema
export const loginSchema = z.object({
  username: z
    .string()
    .min(1, 'Username is required')
    .max(50, 'Username must be less than 50 characters')
    .trim(),
  password: z.string().min(1, 'Password is required'),
});

// Password strength validation
export function validatePasswordStrength(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Input sanitization
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

