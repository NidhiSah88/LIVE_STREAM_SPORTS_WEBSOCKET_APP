import { z } from "zod";

// Act as a Senior Node.js Developer. Using Zod, create a 
// validation file `src/validation/commentary.js`.

// 1. Create `listCommentaryQuerySchema`: an object with an 
// optional `limit` (coerced number,
//  positive, max 100).
// 2. Create `createCommentarySchema`: include fields for 
// minute (non-negative int), sequence, period (string), eventType,
//  actor, team, message (required string), metadata (record), and 
// tags (array of strings).
// 3. Use ES Modules and export the schemas.


/**
 * Query validation
 */
export const listCommentaryQuerySchema = z.object({
  limit: z.coerce
    .number()
    .int()
    .positive()
    .max(100)
    .optional(),
});

/**
 * Create commentary validation
 */
export const createCommentarySchema = z.object({
  minute: z.coerce
    .number()
    .int()
    .nonnegative(),

  sequence: z.coerce
    .number()
    .int()
    .nonnegative(),

  period: z.string().trim().min(1),

  eventType: z.string().trim().min(1),

  actor: z.string().trim().min(1),

  team: z.string().trim().min(1),

  message: z.string().trim().min(1),

  metadata: z
    .record(z.string(), z.unknown())
    .optional(),

  tags: z
    .array(
      z.string().trim().min(1)
    )
    .optional(),
});



