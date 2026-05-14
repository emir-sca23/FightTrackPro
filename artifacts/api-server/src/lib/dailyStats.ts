import { and, eq, gte, lt } from "drizzle-orm";
import { db, mealsTable, workoutsTable } from "@workspace/db";

export interface DailyStats {
  date: Date;
  totalCaloriesConsumed: number;
  totalCaloriesBurned: number;
  netCalories: number;
}

export function startOfTodayUtc(now: Date = new Date()): Date {
  const d = new Date(now);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

export async function calculateDailyStats(userId: string, day: Date = new Date()): Promise<DailyStats> {
  const start = startOfTodayUtc(day);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);

  const meals = await db
    .select()
    .from(mealsTable)
    .where(
      and(
        eq(mealsTable.userId, userId),
        gte(mealsTable.date, start),
        lt(mealsTable.date, end),
      ),
    );

  const workouts = await db
    .select()
    .from(workoutsTable)
    .where(
      and(
        eq(workoutsTable.userId, userId),
        gte(workoutsTable.date, start),
        lt(workoutsTable.date, end),
      ),
    );

  const totalCaloriesConsumed = meals.reduce((sum, m) => sum + m.calories, 0);
  const totalCaloriesBurned = workouts.reduce((sum, w) => sum + w.caloriesBurned, 0);

  return {
    date: start,
    totalCaloriesConsumed,
    totalCaloriesBurned,
    netCalories: totalCaloriesConsumed - totalCaloriesBurned,
  };
}
