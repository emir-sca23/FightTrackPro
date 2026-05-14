import { pgTable, varchar, real, integer, timestamp } from "drizzle-orm/pg-core";

export const profilesTable = pgTable("profiles", {
  userId: varchar("user_id").primaryKey(),
  displayName: varchar("display_name"),
  weightKg: real("weight_kg"),
  weightCategory: varchar("weight_category"),
  discipline: varchar("discipline"),
  targetWeightKg: real("target_weight_kg"),
  cutDeadline: timestamp("cut_deadline", { withTimezone: true }),
  dailyCalorieLimit: integer("daily_calorie_limit"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export type Profile = typeof profilesTable.$inferSelect;
export type InsertProfile = typeof profilesTable.$inferInsert;
