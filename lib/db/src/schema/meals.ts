import { sql } from "drizzle-orm";
import { pgTable, varchar, integer, timestamp } from "drizzle-orm/pg-core";

export const mealsTable = pgTable("meals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  date: timestamp("date", { withTimezone: true }).notNull(),
  name: varchar("name").notNull(),
  calories: integer("calories").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Meal = typeof mealsTable.$inferSelect;
export type InsertMeal = typeof mealsTable.$inferInsert;
