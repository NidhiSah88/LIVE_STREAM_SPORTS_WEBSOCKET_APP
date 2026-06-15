
import { z } from "zod";

/**
 * Match status constants
 */
export const MATCH_STATUS = {
  SCHEDULED: "scheduled",
  LIVE: "live",
  FINISHED: "finished",
};

/**
 * Utility: validate ISO date string
 */
const isValidIsoDate = (value) => {
  const date = new Date(value);

  return (
    typeof value === "string" &&
    !Number.isNaN(date.getTime()) &&
    date.toISOString() === value
  );
};

/**
 * Query validation
 */
export const listMatchesQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).optional(),
});

/**
 * Route params validation
 */
export const matchIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

/**
 * Create match validation
 */
export const createMatchSchema = z
  .object({
    sport: z.string().trim().min(1),

    homeTeam: z.string().trim().min(1),

    awayTeam: z.string().trim().min(1),

    startTime: z
      .string()
      .refine(isValidIsoDate, {
        message: "startTime must be a valid ISO date string",
      }),

    endTime: z
      .string()
      .refine(isValidIsoDate, {
        message: "endTime must be a valid ISO date string",
      }),

    homeScore: z.coerce
      .number()
      .int()
      .nonnegative()
      .optional(),

    awayScore: z.coerce
      .number()
      .int()
      .nonnegative()
      .optional(),
  })
  .superRefine((data, ctx) => {
    const start = new Date(data.startTime);
    const end = new Date(data.endTime);

    if (end <= start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endTime"],
        message: "endTime must be after startTime",
      });
    }
  });

/**
 * Score update validation
 */
export const updateScoreSchema = z.object({
  homeScore: z.coerce
    .number()
    .int()
    .nonnegative(),

  awayScore: z.coerce
    .number()
    .int()
    .nonnegative(),
});








