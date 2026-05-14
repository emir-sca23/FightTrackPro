import { sql } from "drizzle-orm";
import { pgTable, varchar, real, timestamp } from "drizzle-orm/pg-core";

export const weightsTable = pgTable("weights", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  date: timestamp("date", { withTimezone: true }).notNull(),
  weightKg: real("weight_kg").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type WeightEntry = typeof weightsTable.$inferSelect;
export type InsertWeightEntry = typeof weightsTable.$inferInsert;
