import { format } from "date-fns";

const PREFIX = "ft.water.";
export const WATER_GOAL = 8;

function todayKey(): string {
  return PREFIX + format(new Date(), "yyyy-MM-dd");
}

export function getWaterCups(): number {
  if (typeof window === "undefined") return 0;
  const v = window.localStorage.getItem(todayKey());
  if (!v) return 0;
  const n = parseInt(v, 10);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export function setWaterCups(n: number): void {
  if (typeof window === "undefined") return;
  const safe = Math.max(0, Math.min(50, Math.floor(n)));
  window.localStorage.setItem(todayKey(), String(safe));
}
