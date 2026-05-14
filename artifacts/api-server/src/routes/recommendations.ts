import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, profilesTable } from "@workspace/db";
import { GetRecommendationsResponse } from "@workspace/api-zod";
import { calculateDailyStats } from "../lib/dailyStats";
import { RECOMMENDATION_ACTIVITIES } from "../lib/calories";

const router: IRouter = Router();

router.get("/recommendations", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const userId = req.user.id;

  const [profile] = await db
    .select()
    .from(profilesTable)
    .where(eq(profilesTable.userId, userId));

  const stats = await calculateDailyStats(userId);
  const caloriesConsumed = stats.totalCaloriesConsumed;
  const caloriesBurned = stats.totalCaloriesBurned;
  const deficitToday = caloriesBurned - caloriesConsumed;

  // No target weight set
  if (!profile?.targetWeightKg || !profile.weightKg) {
    res.json(
      GetRecommendationsResponse.parse({
        message: "Set a target weight in your profile to unlock smart recommendations.",
        suggestions: [],
        status: "no_target",
        dailyDeficitTarget: null,
        deficitToday,
      }),
    );
    return;
  }

  const weightDifference = profile.weightKg - profile.targetWeightKg;
  // Already at or below target weight
  if (weightDifference <= 0) {
    res.json(
      GetRecommendationsResponse.parse({
        message: "You're already at or below your target weight. Hold steady.",
        suggestions: [],
        status: "ahead",
        dailyDeficitTarget: null,
        deficitToday,
      }),
    );
    return;
  }

  const totalCaloriesToBurn = weightDifference * 7700;

  let dailyDeficit = 500;
  if (profile.cutDeadline) {
    const now = new Date();
    const ms = profile.cutDeadline.getTime() - now.getTime();
    const remainingDays = Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)));
    dailyDeficit = totalCaloriesToBurn / remainingDays;
  }

  const remainingCaloriesToBurn = Math.round(dailyDeficit - deficitToday);

  if (remainingCaloriesToBurn <= 0) {
    res.json(
      GetRecommendationsResponse.parse({
        message: "You are on track today. Good job.",
        suggestions: [],
        status: "on_track",
        dailyDeficitTarget: Math.round(dailyDeficit),
        deficitToday,
      }),
    );
    return;
  }

  const suggestions = RECOMMENDATION_ACTIVITIES.map((a) => {
    const minutes = Math.max(1, Math.ceil(remainingCaloriesToBurn / a.kcalPerMinute));
    return {
      activity: a.activity,
      minutes,
      calories: minutes * a.kcalPerMinute,
    };
  });

  res.json(
    GetRecommendationsResponse.parse({
      message: `You need to burn ${remainingCaloriesToBurn} kcal more today.`,
      suggestions,
      status: "behind",
      dailyDeficitTarget: Math.round(dailyDeficit),
      deficitToday,
    }),
  );
});

export default router;
