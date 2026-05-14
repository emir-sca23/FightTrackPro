import { Router, type IRouter } from "express";
import { asc, eq } from "drizzle-orm";
import { db, workoutsTable, weightsTable, profilesTable } from "@workspace/db";
import {
  GetDashboardStatsResponse,
  GetWeeklyWorkoutsResponse,
  GetWorkoutTypeBreakdownResponse,
} from "@workspace/api-zod";
import { calculateDailyStats } from "../lib/dailyStats";

const router: IRouter = Router();

function startOfWeek(d: Date): Date {
  const date = new Date(d);
  const day = date.getUTCDay();
  const diff = (day + 6) % 7; // Monday as start
  date.setUTCDate(date.getUTCDate() - diff);
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

function startOfDay(d: Date): Date {
  const date = new Date(d);
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

router.get("/progress/dashboard", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const userId = req.user.id;

  const workouts = await db
    .select()
    .from(workoutsTable)
    .where(eq(workoutsTable.userId, userId))
    .orderBy(asc(workoutsTable.date));

  const weights = await db
    .select()
    .from(weightsTable)
    .where(eq(weightsTable.userId, userId))
    .orderBy(asc(weightsTable.date));

  const [profile] = await db
    .select()
    .from(profilesTable)
    .where(eq(profilesTable.userId, userId));

  const now = new Date();
  const weekStart = startOfWeek(now);
  const lastWeekStart = new Date(weekStart);
  lastWeekStart.setUTCDate(lastWeekStart.getUTCDate() - 7);

  let workoutsThisWeek = 0;
  let workoutsLastWeek = 0;
  let totalMinutes = 0;
  let minutesThisWeek = 0;

  for (const w of workouts) {
    totalMinutes += w.durationMinutes;
    if (w.date >= weekStart) {
      workoutsThisWeek += 1;
      minutesThisWeek += w.durationMinutes;
    } else if (w.date >= lastWeekStart) {
      workoutsLastWeek += 1;
    }
  }

  const trainedDays = new Set<string>();
  for (const w of workouts) {
    trainedDays.add(startOfDay(w.date).toISOString());
  }
  let streak = 0;
  const cursor = startOfDay(now);
  if (!trainedDays.has(cursor.toISOString())) {
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  while (trainedDays.has(cursor.toISOString())) {
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  const recentWorkouts = [...workouts]
    .reverse()
    .slice(0, 5)
    .map((w) => ({
      id: w.id,
      date: w.date.toISOString(),
      type: w.type,
      durationMinutes: w.durationMinutes,
      notes: w.notes ?? null,
      intensity: w.intensity,
      caloriesBurned: w.caloriesBurned,
      createdAt: w.createdAt.toISOString(),
    }));

  const startingWeight = weights.length > 0 ? weights[0].weightKg : null;
  const currentWeight =
    weights.length > 0 ? weights[weights.length - 1].weightKg : profile?.weightKg ?? null;

  const targetWeight = profile?.targetWeightKg ?? null;
  const deadline = profile?.cutDeadline ?? null;

  let weightCutPayload: {
    hasTarget: boolean;
    currentWeightKg: number | null;
    targetWeightKg: number | null;
    weightDifferenceKg: number | null;
    totalCaloriesToBurn: number | null;
    percentComplete: number | null;
    deadline: string | null;
    daysRemaining: number | null;
  };

  if (targetWeight != null && currentWeight != null) {
    const diff = currentWeight - targetWeight;
    const totalKcal = Math.max(0, diff) * 7700;
    let percent: number | null = null;
    if (startingWeight != null && startingWeight > targetWeight) {
      const total = startingWeight - targetWeight;
      const done = startingWeight - currentWeight;
      percent = Math.max(0, Math.min(100, (done / total) * 100));
    } else if (currentWeight <= targetWeight) {
      percent = 100;
    }
    let daysRemaining: number | null = null;
    if (deadline) {
      const ms = deadline.getTime() - now.getTime();
      daysRemaining = Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
    }
    weightCutPayload = {
      hasTarget: true,
      currentWeightKg: currentWeight,
      targetWeightKg: targetWeight,
      weightDifferenceKg: Number(diff.toFixed(2)),
      totalCaloriesToBurn: Math.round(totalKcal),
      percentComplete: percent != null ? Number(percent.toFixed(1)) : null,
      deadline: deadline ? deadline.toISOString() : null,
      daysRemaining,
    };
  } else {
    weightCutPayload = {
      hasTarget: false,
      currentWeightKg: currentWeight,
      targetWeightKg: targetWeight,
      weightDifferenceKg: null,
      totalCaloriesToBurn: null,
      percentComplete: null,
      deadline: deadline ? deadline.toISOString() : null,
      daysRemaining: null,
    };
  }

  const daily = await calculateDailyStats(userId);
  const limit = profile?.dailyCalorieLimit ?? null;
  const caloriesPayload = {
    consumedToday: daily.totalCaloriesConsumed,
    burnedToday: daily.totalCaloriesBurned,
    netToday: daily.netCalories,
    dailyLimit: limit,
    remainingToday: limit != null ? limit - daily.netCalories : null,
  };

  res.json(
    GetDashboardStatsResponse.parse({
      totalWorkouts: workouts.length,
      workoutsThisWeek,
      workoutsLastWeek,
      totalMinutes,
      minutesThisWeek,
      currentWeightKg: currentWeight,
      startingWeightKg: startingWeight,
      weightCategory: profile?.weightCategory ?? null,
      currentStreak: streak,
      recentWorkouts,
      weightCut: weightCutPayload,
      calories: caloriesPayload,
    }),
  );
});

router.get("/progress/weekly", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const userId = req.user.id;

  const now = new Date();
  const currentWeekStart = startOfWeek(now);
  const buckets: { weekStart: Date; count: number; totalMinutes: number }[] = [];
  for (let i = 11; i >= 0; i--) {
    const ws = new Date(currentWeekStart);
    ws.setUTCDate(ws.getUTCDate() - i * 7);
    buckets.push({ weekStart: ws, count: 0, totalMinutes: 0 });
  }

  const earliest = buckets[0].weekStart;
  const workouts = await db
    .select()
    .from(workoutsTable)
    .where(eq(workoutsTable.userId, userId));

  for (const w of workouts) {
    if (w.date < earliest) continue;
    const ws = startOfWeek(w.date);
    const bucket = buckets.find((b) => b.weekStart.getTime() === ws.getTime());
    if (bucket) {
      bucket.count += 1;
      bucket.totalMinutes += w.durationMinutes;
    }
  }

  res.json(
    GetWeeklyWorkoutsResponse.parse(
      buckets.map((b) => ({
        weekStart: b.weekStart.toISOString(),
        count: b.count,
        totalMinutes: b.totalMinutes,
      })),
    ),
  );
});

router.get("/progress/type-breakdown", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const userId = req.user.id;

  const workouts = await db
    .select()
    .from(workoutsTable)
    .where(eq(workoutsTable.userId, userId));

  const totals = new Map<string, { count: number; totalMinutes: number }>();
  for (const w of workouts) {
    const t = totals.get(w.type) ?? { count: 0, totalMinutes: 0 };
    t.count += 1;
    t.totalMinutes += w.durationMinutes;
    totals.set(w.type, t);
  }

  const result = Array.from(totals.entries()).map(([type, v]) => ({
    type,
    count: v.count,
    totalMinutes: v.totalMinutes,
  }));

  res.json(GetWorkoutTypeBreakdownResponse.parse(result));
});

export default router;
