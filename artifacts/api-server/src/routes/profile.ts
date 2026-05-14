import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, profilesTable } from "@workspace/db";
import { GetProfileResponse, UpdateProfileBody } from "@workspace/api-zod";

const router: IRouter = Router();

function deriveCategory(weightKg: number | null | undefined): string | null {
  if (weightKg == null) return null;
  if (weightKg <= 52.2) return "Strawweight";
  if (weightKg <= 56.7) return "Flyweight";
  if (weightKg <= 61.2) return "Bantamweight";
  if (weightKg <= 65.8) return "Featherweight";
  if (weightKg <= 70.3) return "Lightweight";
  if (weightKg <= 77.1) return "Welterweight";
  if (weightKg <= 83.9) return "Middleweight";
  if (weightKg <= 93.0) return "Light Heavyweight";
  return "Heavyweight";
}

function serialize(p: typeof profilesTable.$inferSelect, fallbackName: string | null = null) {
  return {
    id: p.userId,
    displayName: p.displayName ?? fallbackName,
    weightKg: p.weightKg ?? null,
    weightCategory: p.weightCategory ?? null,
    discipline: p.discipline ?? null,
    targetWeightKg: p.targetWeightKg ?? null,
    cutDeadline: p.cutDeadline ? p.cutDeadline.toISOString() : null,
    dailyCalorieLimit: p.dailyCalorieLimit ?? null,
  };
}

async function getOrCreateProfile(userId: string) {
  const [existing] = await db
    .select()
    .from(profilesTable)
    .where(eq(profilesTable.userId, userId));
  if (existing) return existing;
  const [created] = await db
    .insert(profilesTable)
    .values({
      userId,
      displayName: null,
      weightKg: null,
      weightCategory: null,
      discipline: null,
      targetWeightKg: null,
      cutDeadline: null,
      dailyCalorieLimit: null,
    })
    .returning();
  return created;
}

router.get("/profile", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const profile = await getOrCreateProfile(req.user.id);
  res.json(GetProfileResponse.parse(serialize(profile, req.user.firstName ?? null)));
});

router.patch("/profile", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const parsed = UpdateProfileBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  await getOrCreateProfile(req.user.id);

  const updates: Record<string, unknown> = {};
  if (parsed.data.displayName !== undefined) updates.displayName = parsed.data.displayName;
  if (parsed.data.discipline !== undefined) updates.discipline = parsed.data.discipline;
  if (parsed.data.weightKg !== undefined) {
    updates.weightKg = parsed.data.weightKg;
    if (parsed.data.weightCategory === undefined) {
      updates.weightCategory = deriveCategory(parsed.data.weightKg);
    }
  }
  if (parsed.data.weightCategory !== undefined) updates.weightCategory = parsed.data.weightCategory;
  if (parsed.data.targetWeightKg !== undefined) updates.targetWeightKg = parsed.data.targetWeightKg;
  if (parsed.data.cutDeadline !== undefined) {
    updates.cutDeadline = parsed.data.cutDeadline ? new Date(parsed.data.cutDeadline) : null;
  }
  if (parsed.data.dailyCalorieLimit !== undefined) updates.dailyCalorieLimit = parsed.data.dailyCalorieLimit;

  const [updated] = await db
    .update(profilesTable)
    .set(updates)
    .where(eq(profilesTable.userId, req.user.id))
    .returning();

  res.json(GetProfileResponse.parse(serialize(updated)));
});

export default router;
