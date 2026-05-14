import { Router, type IRouter } from "express";
import { and, desc, eq, gte, lt } from "drizzle-orm";
import { db, mealsTable } from "@workspace/db";
import { CreateMealBody, DeleteMealParams, ListMealsResponse } from "@workspace/api-zod";

const router: IRouter = Router();

function serialize(m: typeof mealsTable.$inferSelect) {
  return {
    id: m.id,
    date: m.date.toISOString(),
    name: m.name,
    calories: m.calories,
    createdAt: m.createdAt.toISOString(),
  };
}

function dayBounds(dateStr: string): { start: Date; end: Date } | null {
  // Accepts YYYY-MM-DD or full ISO string
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;
  const start = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);
  return { start, end };
}

router.get("/meals", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const userId = req.user.id;
  const dateParam = typeof req.query.date === "string" ? req.query.date : undefined;

  const conditions = [eq(mealsTable.userId, userId)];
  if (dateParam) {
    const bounds = dayBounds(dateParam);
    if (!bounds) {
      res.status(400).json({ error: "Invalid date" });
      return;
    }
    conditions.push(gte(mealsTable.date, bounds.start));
    conditions.push(lt(mealsTable.date, bounds.end));
  }

  const rows = await db
    .select()
    .from(mealsTable)
    .where(and(...conditions))
    .orderBy(desc(mealsTable.date));
  res.json(ListMealsResponse.parse(rows.map(serialize)));
});

router.post("/meals", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const parsed = CreateMealBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [created] = await db
    .insert(mealsTable)
    .values({
      userId: req.user.id,
      date: new Date(parsed.data.date),
      name: parsed.data.name,
      calories: parsed.data.calories,
    })
    .returning();
  res.status(201).json(serialize(created));
});

router.delete("/meals/:id", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const params = DeleteMealParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [deleted] = await db
    .delete(mealsTable)
    .where(and(eq(mealsTable.id, params.data.id), eq(mealsTable.userId, req.user.id)))
    .returning();
  if (!deleted) {
    res.status(404).json({ error: "Meal not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
