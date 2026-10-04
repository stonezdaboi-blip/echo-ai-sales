import { Request, Response, NextFunction } from 'express';

export interface ValidationRules {
  [key: string]: {
    type: 'string' | 'number' | 'boolean' | 'array';
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
  };
}

export const validateRequest =
  (rules: ValidationRules) =>
  (req: Request, res: Response, next: NextFunction) => {
    const errors: Record<string, string> = {};

    for (const [field, rule] of Object.entries(rules)) {
      const value = req.body[field];

      // Check required
      if (rule.required && (value === undefined || value === null || value === '')) {
        errors[field] = `${field} is required`;
        continue;
      }

      if (value === undefined || value === null) continue;

      // Check type
      if (typeof value !== rule.type) {
        errors[field] = `${field} must be ${rule.type}`;
        continue;
      }

      // Check string rules
      if (rule.type === 'string' && typeof value === 'string') {
        if (rule.minLength && value.length < rule.minLength) {
          errors[field] = `${field} must be at least ${rule.minLength} characters`;
        }
        if (rule.maxLength && value.length > rule.maxLength) {
          errors[field] = `${field} must be at most ${rule.maxLength} characters`;
        }
        if (rule.pattern && !rule.pattern.test(value)) {
          errors[field] = `${field} format is invalid`;
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      res.status(400).json({ errors, status: 400 });
      return;
    }

    next();
  };
