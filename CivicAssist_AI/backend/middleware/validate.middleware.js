/**
 * middleware/validate.middleware.js
 * Zod-based request validation middleware factory.
 */

const { z } = require('zod');

/**
 * Creates a validation middleware for a given Zod schema targeting req.body.
 * @param {z.ZodSchema} schema
 * @returns {import('express').RequestHandler}
 */
function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const issues = result.error.issues || result.error.errors || [];
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: issues.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
    }
    req.body = result.data; // Use parsed/cleaned data
    next();
  };
}

// ─── Validation Schemas ──────────────────────────────────────────────────────

const chatSchema = z.object({
  query: z.string().min(2, 'Query must be at least 2 characters').max(500, 'Query too long'),
  simplified: z.boolean().optional().default(false),
  userProfile: z
    .object({
      age: z.number().int().min(1).max(120).optional(),
      isFirstTimeVoter: z.boolean().optional(),
      language: z.enum(['en', 'hi']).optional().default('en'),
    })
    .optional()
    .default({}),
});

const profileSchema = z.object({
  userId: z.string().min(1, 'userId is required'),
  age: z.number().int().min(1).max(120).optional(),
  isFirstTimeVoter: z.boolean().optional().default(false),
  language: z.enum(['en', 'hi']).optional().default('en'),
});

const eligibilitySchema = z.object({
  age: z.number().int().min(0).max(120),
  isCitizen: z.boolean().optional().default(true),
  hasCriminalDisqualification: z.boolean().optional().default(false),
});

const checklistItemSchema = z.object({
  completed: z.boolean(),
});

module.exports = {
  validateBody,
  chatSchema,
  profileSchema,
  eligibilitySchema,
  checklistItemSchema,
};
