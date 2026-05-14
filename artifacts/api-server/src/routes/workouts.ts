import { Router, type IRouter } from "express";
import { and, desc, eq } from "drizzle-orm";
import { db, workoutsTable } from "@workspace/db";
import {
  ListWorkoutsResponse,
  CreateWorkoutBody,
  UpdateWorkoutBody,
  UpdateWorkoutParams,
  UpdateWorkoutResponse,
  DeleteWorkoutParams,
} from "@workspace/api-zod";
import { estimateCaloriesBurned } from "../lib/calories";

const router: IRouter = Router();

function serialize(w: typeof workoutsTable.$inferSelect) {
  return {
    id: w.id,
    date: w.date.toISOString(),
    type: w.type,
    durationMinutes: w.durationMinutes,
    notes: w.notes ?? null,
    intensity: w.intensity,
    caloriesBurned: w.caloriesBurned,
    createdAt: w.createdAt.toISOString(),
  };
}

router.get("/workouts", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const rows = await db
    .select()
    .from(workoutsTable)
    .where(eq(workoutsTable.userId, req.user.id))
    .orderBy(desc(workoutsTable.date));
  res.json(ListWorkoutsResponse.parse(rows.map(serialize)));
});

router.post("/workouts", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const parsed = CreateWorkoutBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const caloriesBurned = estimateCaloriesBurned(
    parsed.data.type,
    parsed.data.durationMinutes,
    parsed.data.intensity,
  );
  const [created] = await db
    .insert(workoutsTable)
    .values({
      userId: req.user.id,
      date: new Date(parsed.data.date),
      type: parsed.data.type,
      durationMinutes: parsed.data.durationMinutes,
      notes: parsed.data.notes ?? null,
      intensity: parsed.data.intensity,
      caloriesBurned,
    })
    .returning();
  res.status(201).json(serialize(created));
});

router.put("/workouts/:id", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const params = UpdateWorkoutParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateWorkoutBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const caloriesBurned = estimateCaloriesBurned(
    parsed.data.type,
    parsed.data.durationMinutes,
    parsed.data.intensity,
  );
  const [updated] = await db
    .update(workoutsTable)
    .set({
      date: new Date(parsed.data.date),
      type: parsed.data.type,
      durationMinutes: parsed.data.durationMinutes,
      notes: parsed.data.notes ?? null,
      intensity: parsed.data.intensity,
      caloriesBurned,
    })
    .where(and(eq(workoutsTable.id, params.data.id), eq(workoutsTable.userId, req.user.id)))
    .returning();
  if (!updated) {
    res.status(404).json({ error: "Workout not found" });
    return;
  }
  res.json(UpdateWorkoutResponse.parse(serialize(updated)));
});

router.delete("/workouts/:id", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const params = DeleteWorkoutParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [deleted] = await db
    .delete(workoutsTable)
    .where(and(eq(workoutsTable.id, params.data.id), eq(workoutsTable.userId, req.user.id)))
    .returning();
  if (!deleted) {
    res.status(404).json({ error: "Workout not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
