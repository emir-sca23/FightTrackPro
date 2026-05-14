export type PhaseKind = "work" | "rest";

export interface RoutinePhase {
  name: string;
  durationSec: number;
  kind: PhaseKind;
  emoji: string;
  description?: string;
}

export interface Routine {
  type: string;
  label: string;
  defaultIntensity: number;
  phases: RoutinePhase[];
}

const REST = (s: number): RoutinePhase => ({
  name: "Rest",
  durationSec: s,
  kind: "rest",
  emoji: "💧",
  description: "Recover. Breathe. Reset.",
});

export const WORKOUT_ROUTINES: Routine[] = [
  {
    type: "boxing",
    label: "Boxing Bag Rounds",
    defaultIntensity: 7,
    phases: [
      { name: "Shadow Box Warm-up", durationSec: 60, kind: "work", emoji: "🥊", description: "Loose hands, light footwork. Visualise the opponent." },
      REST(15),
      { name: "Jab–Jab–Cross", durationSec: 45, kind: "work", emoji: "👊", description: "Snap the jab. Rotate the hip on the cross." },
      REST(15),
      { name: "Cross–Hook Combo", durationSec: 45, kind: "work", emoji: "🥊", description: "Drive through the floor. Pivot the lead foot." },
      REST(15),
      { name: "Slip & Rip", durationSec: 45, kind: "work", emoji: "🌀", description: "Slip outside, return with a hook to the body." },
      REST(15),
      { name: "Power 6 Combo", durationSec: 60, kind: "work", emoji: "⚡", description: "Jab–cross–hook–cross–hook–cross. Fast hands." },
      REST(30),
      { name: "Footwork Drill", durationSec: 60, kind: "work", emoji: "👣", description: "In, out, angle. Stay on the balls of your feet." },
      REST(15),
      { name: "Burnout Round", durationSec: 45, kind: "work", emoji: "🔥", description: "Non-stop combos. Empty the tank." },
      { name: "Cooldown", durationSec: 60, kind: "work", emoji: "🧘", description: "Slow shadow boxing. Long exhales." },
    ],
  },
  {
    type: "kickboxing",
    label: "Kickboxing Flow",
    defaultIntensity: 7,
    phases: [
      { name: "Shadow Kick Warm-up", durationSec: 60, kind: "work", emoji: "🥋", description: "Front kicks, teep, light hands." },
      REST(15),
      { name: "Jab–Cross–Low Kick", durationSec: 45, kind: "work", emoji: "🦵", description: "Step in with the punches, chop the lead leg." },
      REST(15),
      { name: "Roundhouse Drill", durationSec: 45, kind: "work", emoji: "🔄", description: "Alternating roundhouses. Pivot the support foot." },
      REST(15),
      { name: "Teep + Cross", durationSec: 45, kind: "work", emoji: "🦶", description: "Push kick to manage range, finish with the cross." },
      REST(15),
      { name: "Switch Kick", durationSec: 45, kind: "work", emoji: "⚡", description: "Switch the stance, kick high or to the body." },
      REST(30),
      { name: "Knees in the Clinch", durationSec: 45, kind: "work", emoji: "🤼", description: "Drive the knees up. Pull down with the hands." },
      REST(15),
      { name: "Burnout Combo Round", durationSec: 45, kind: "work", emoji: "🔥", description: "All weapons. Stay long." },
      { name: "Cooldown", durationSec: 60, kind: "work", emoji: "🧘", description: "Stretch the hips and quads." },
    ],
  },
  {
    type: "muay thai",
    label: "Muay Thai Rounds",
    defaultIntensity: 7,
    phases: [
      { name: "Skip Rope Warm-up", durationSec: 90, kind: "work", emoji: "🪢", description: "Light bouncy skipping." },
      REST(15),
      { name: "Teep Drill", durationSec: 45, kind: "work", emoji: "🦶", description: "Front teep, retract fast." },
      REST(15),
      { name: "Roundhouse to Body", durationSec: 45, kind: "work", emoji: "🦵", description: "Hard pivot, deep rotation." },
      REST(15),
      { name: "Elbows", durationSec: 45, kind: "work", emoji: "💪", description: "Horizontal and downward elbows." },
      REST(15),
      { name: "Clinch Knees", durationSec: 60, kind: "work", emoji: "🤼", description: "Long knees from the plum." },
      REST(30),
      { name: "Burnout Round", durationSec: 60, kind: "work", emoji: "🔥", description: "All eight limbs." },
      { name: "Cooldown", durationSec: 60, kind: "work", emoji: "🧘", description: "Long stretches." },
    ],
  },
  {
    type: "mma",
    label: "MMA Conditioning",
    defaultIntensity: 8,
    phases: [
      { name: "Shadow MMA", durationSec: 60, kind: "work", emoji: "🥋", description: "Mix punches, kicks, level changes." },
      REST(15),
      { name: "Sprawls", durationSec: 30, kind: "work", emoji: "🤸", description: "Drop and recover, fast hips." },
      REST(15),
      { name: "Shot + Stand-up", durationSec: 45, kind: "work", emoji: "🏃", description: "Shoot, drive, return to feet." },
      REST(15),
      { name: "Ground & Pound", durationSec: 45, kind: "work", emoji: "👊", description: "From mount, controlled volume." },
      REST(15),
      { name: "Cage Wrestling", durationSec: 45, kind: "work", emoji: "🤼", description: "Hand fight, level changes." },
      REST(30),
      { name: "Burnout", durationSec: 45, kind: "work", emoji: "🔥", description: "Striking + sprawls." },
      { name: "Cooldown", durationSec: 60, kind: "work", emoji: "🧘", description: "Long breaths, stretch hips." },
    ],
  },
  {
    type: "sparring",
    label: "Sparring Rounds",
    defaultIntensity: 8,
    phases: [
      { name: "Round 1 — Light Touch", durationSec: 180, kind: "work", emoji: "🥊", description: "50% pace. Find the timing." },
      REST(60),
      { name: "Round 2 — Medium", durationSec: 180, kind: "work", emoji: "🥊", description: "70% pace. Work combinations." },
      REST(60),
      { name: "Round 3 — Hard", durationSec: 180, kind: "work", emoji: "🔥", description: "Fight pace. Stay technical." },
      REST(60),
      { name: "Cooldown", durationSec: 90, kind: "work", emoji: "🧘", description: "Walk, breathe, stretch." },
    ],
  },
  {
    type: "cardio",
    label: "Fight Cardio HIIT",
    defaultIntensity: 7,
    phases: [
      { name: "Jumping Jacks", durationSec: 45, kind: "work", emoji: "🤾", description: "Steady rhythm, full extension." },
      REST(15),
      { name: "High Knees", durationSec: 45, kind: "work", emoji: "🏃", description: "Knees to chest, pump the arms." },
      REST(15),
      { name: "Mountain Climbers", durationSec: 45, kind: "work", emoji: "⛰️", description: "Drive the knees in. Flat back." },
      REST(15),
      { name: "Burpees", durationSec: 30, kind: "work", emoji: "💥", description: "Down, kick out, push, jump up." },
      REST(30),
      { name: "Skater Jumps", durationSec: 45, kind: "work", emoji: "⛸️", description: "Side to side, soft landings." },
      REST(15),
      { name: "Jump Rope", durationSec: 60, kind: "work", emoji: "🪢", description: "Light bounce, fast turns." },
      REST(30),
      { name: "Sprint Finisher", durationSec: 30, kind: "work", emoji: "⚡", description: "All out. Empty the tank." },
      { name: "Cooldown", durationSec: 60, kind: "work", emoji: "🧘", description: "Walk it out." },
    ],
  },
  {
    type: "strength",
    label: "Fighter Strength",
    defaultIntensity: 6,
    phases: [
      { name: "Push-ups", durationSec: 45, kind: "work", emoji: "🤲", description: "Tight core, full range." },
      REST(20),
      { name: "Bodyweight Squats", durationSec: 45, kind: "work", emoji: "🦵", description: "Heels down, knees track toes." },
      REST(20),
      { name: "Plank Hold", durationSec: 45, kind: "work", emoji: "📏", description: "Brace hard. Don't sag." },
      REST(20),
      { name: "Reverse Lunges", durationSec: 45, kind: "work", emoji: "🚶", description: "Alternating legs, controlled." },
      REST(20),
      { name: "Glute Bridges", durationSec: 45, kind: "work", emoji: "🌉", description: "Squeeze at the top." },
      REST(20),
      { name: "Pike Push-ups", durationSec: 30, kind: "work", emoji: "🔻", description: "Shoulders over hands. Slow." },
      REST(30),
      { name: "Hollow Hold", durationSec: 30, kind: "work", emoji: "🥄", description: "Lower back glued to floor." },
      { name: "Cooldown", durationSec: 60, kind: "work", emoji: "🧘", description: "Stretch quads, hips, chest." },
    ],
  },
  {
    type: "conditioning",
    label: "Combat Conditioning",
    defaultIntensity: 8,
    phases: [
      { name: "Bear Crawl", durationSec: 30, kind: "work", emoji: "🐻", description: "Knees off the floor, slow." },
      REST(15),
      { name: "Squat Jumps", durationSec: 30, kind: "work", emoji: "🦘", description: "Land soft. Reset each rep." },
      REST(15),
      { name: "Plank Get-ups", durationSec: 45, kind: "work", emoji: "📏", description: "Plank → push-up → plank." },
      REST(15),
      { name: "Lateral Shuffles", durationSec: 30, kind: "work", emoji: "↔️", description: "Stay low. Don't stand up." },
      REST(15),
      { name: "Sprawl + Punch", durationSec: 30, kind: "work", emoji: "🤸", description: "Sprawl, stand, two punches." },
      REST(20),
      { name: "Burpees", durationSec: 30, kind: "work", emoji: "💥", description: "All-out tempo." },
      REST(30),
      { name: "Sprint Finisher", durationSec: 30, kind: "work", emoji: "⚡", description: "Empty the tank." },
      { name: "Cooldown", durationSec: 60, kind: "work", emoji: "🧘", description: "Walk and breathe." },
    ],
  },
];

export function findRoutine(type: string): Routine {
  const found = WORKOUT_ROUTINES.find((r) => r.type === type);
  return found ?? WORKOUT_ROUTINES[0];
}

export function totalDurationSec(routine: Routine): number {
  return routine.phases.reduce((s, p) => s + p.durationSec, 0);
}

export function totalMinutes(routine: Routine): number {
  return Math.max(1, Math.round(totalDurationSec(routine) / 60));
}
