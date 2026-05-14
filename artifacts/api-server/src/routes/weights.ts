import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import { db, weightsTable, profilesTable } from "@workspace/db";
import { ListWeightsResponse, CreateWeightBody } from "@workspace/api-zod";

const router: IRouter = Router();

function serialize(w: typeof weightsTable.$inferSelect) {
  return {
    id: w.id,
    date: w.date.toISOString(),
    weightKg: w.weightKg,
    createdAt: w.createdAt.toISOString(),
  };
}

router.get("/weights", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const rows = await db
    .select()
    .from(weightsTable)
    .where(eq(weightsTable.userId, req.user.id))
    .orderBy(desc(weightsTable.date));
  res.json(ListWeightsResponse.parse(rows.map(serialize)));
});

router.post("/weights", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const parsed = CreateWeightBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [created] = await db
    .insert(weightsTable)
    .values({
      userId: req.user.id,
      date: new Date(parsed.data.date),
      weightKg: parsed.data.weightKg,
    })
    .returning();

  // Also update the profile's current weight
  const [existing] = await db
    .select()
    .from(profilesTable)
    .where(eq(profilesTable.userId, req.user.id));
  if (existing) {
    await db
      .update(profilesTable)
      .set({ weightKg: parsed.data.weightKg })
      .where(eq(profilesTable.userId, req.user.id));
  } else {
    await db
      .insert(profilesTable)
      .values({ userId: req.user.id, weightKg: parsed.data.weightKg });
  }

  res.status(201).json(serialize(created));
});

export default router;
