import { sql } from "drizzle-orm";
import { pgTable, varchar, integer, text, timestamp } from "drizzle-orm/pg-core";

export const workoutsTable = pgTable("workouts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  date: timestamp("date", { withTimezone: true }).notNull(),
  type: varchar("type").notNull(),
  durationMinutes: integer("duration_minutes").notNull(),
  notes: text("notes"),
  intensity: integer("intensity").notNull().default(5),
  caloriesBurned: integer("calories_burned").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Workout = typeof workoutsTable.$inferSelect;
export type InsertWorkout = typeof workoutsTable.$inferInsert;
