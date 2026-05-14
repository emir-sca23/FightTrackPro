// Calorie burn rates per minute by workout type (kcal/min)
// Tuned for moderate-to-high intensity combat athletes; intensity multiplier
// scales the base rate so a hard sparring round burns more than a light one.
const BASE_KCAL_PER_MINUTE: Record<string, number> = {
  boxing: 11,
  cardio: 9,
  sparring: 12,
  strength: 7,
  kickboxing: 11,
  mma: 12,
  conditioning: 10,
};

const DEFAULT_KCAL_PER_MINUTE = 9;

export function caloriesPerMinute(type: string): number {
  return BASE_KCAL_PER_MINUTE[type] ?? DEFAULT_KCAL_PER_MINUTE;
}

export function estimateCaloriesBurned(
  type: string,
  durationMinutes: number,
  intensity: number,
): number {
  const base = caloriesPerMinute(type);
  // intensity scale: 5 → 1.0x, 1 → 0.7x, 10 → 1.45x
  const intensityMultiplier = 0.7 + (intensity - 1) * 0.075;
  return Math.round(base * durationMinutes * intensityMultiplier);
}

// Suggested cardio activities for recommendations (kcal/min)
export const RECOMMENDATION_ACTIVITIES = [
  { activity: "Running", kcalPerMinute: 10 },
  { activity: "Jump rope", kcalPerMinute: 12 },
  { activity: "Shadow boxing", kcalPerMinute: 8 },
  { activity: "Cardio (bag work)", kcalPerMinute: 9 },
];
