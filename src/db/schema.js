// import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// // Define the 'demo_users' table 
// export const demoUsers = pgTable('demo_users', {
//     id: serial('id').primaryKey(),
//     name: text('name').notNull(),
//     email: text('email').notNull().unique(),
//     createdAt: timestamp('created_at').defaultNow().noNull(),
    
// });


import {
  pgTable,
  serial,
  varchar,
  integer,
  timestamp,
  pgEnum,
  text,
  jsonb,
} from "drizzle-orm/pg-core";

/**
 * ENUMS
 */

export const matchStatus = pgEnum("match_status", [
  "scheduled",
  "live",
  "finished",
]);

/**
 * MATCHES
 */

export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),

  sport: varchar("sport", {
    length: 50,
  }).notNull(),

  homeTeam: varchar("home_team", {
    length: 120,
  }).notNull(),

  awayTeam: varchar("away_team", {
    length: 120,
  }).notNull(),

  status: matchStatus("status")
    .default("scheduled")
    .notNull(),

  startTime: timestamp("start_time", {
    withTimezone: true,
  }),

  endTime: timestamp("end_time", {
    withTimezone: true,
  }),

  homeScore: integer("home_score")
    .default(0)
    .notNull(),

  awayScore: integer("away_score")
    .default(0)
    .notNull(),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

/**
 * COMMENTARY
 */

export const commentary = pgTable("commentary", {
  id: serial("id").primaryKey(),

  matchId: integer("match_id")
    .references(() => matches.id, {
      onDelete: "cascade",
    })
    .notNull(),

  minute: integer("minute"),

  sequence: integer("sequence")
    .notNull(),

  period: varchar("period", {
    length: 50,
  }),

  eventType: varchar("event_type", {
    length: 100,
  }).notNull(),

  actor: varchar("actor", {
    length: 150,
  }),

  team: varchar("team", {
    length: 120,
  }),

  message: text("message").notNull(),

  metadata: jsonb("metadata").default({}),

  tags: text("tags")
    .array()
    .default([]),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});








