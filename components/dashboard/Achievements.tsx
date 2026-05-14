import { motion } from "framer-motion";
import { Trophy, Flame, Calendar, Target, Scale, Utensils, Zap, Award, Lock } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AchievementInput {
  totalWorkouts: number;
  currentStreak: number;
  minutesThisWeek: number;
  workoutsThisWeek: number;
  hasMealLogged: boolean;
  cutPercentComplete: number | null;
  hasTarget: boolean;
}

interface AchievementDef {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  earned: boolean;
}

function buildAchievements(i: AchievementInput): AchievementDef[] {
  return [
    {
      id: "first-round",
      label: "First Round",
      description: "Log your first workout",
      icon: Zap,
      earned: i.totalWorkouts >= 1,
    },
    {
      id: "five-star",
      label: "Five Star",
      description: "Log 5 total workouts",
      icon: Trophy,
      earned: i.totalWorkouts >= 5,
    },
    {
      id: "ten-count",
      label: "Ten Count",
      description: "Log 10 total workouts",
      icon: Award,
      earned: i.totalWorkouts >= 10,
    },
    {
      id: "twenty-five",
      label: "25 & Counting",
      description: "Log 25 total workouts",
      icon: Award,
      earned: i.totalWorkouts >= 25,
    },
    {
      id: "hot-streak",
      label: "Hot Streak",
      description: "Train 3 days in a row",
      icon: Flame,
      earned: i.currentStreak >= 3,
    },
    {
      id: "week-warrior",
      label: "Week Warrior",
      description: "Train 7 days in a row",
      icon: Flame,
      earned: i.currentStreak >= 7,
    },
    {
      id: "hour-of-power",
      label: "Hour of Power",
      description: "Hit 60+ training minutes this week",
      icon: Calendar,
      earned: i.minutesThisWeek >= 60,
    },
    {
      id: "weekly-grinder",
      label: "Weekly Grinder",
      description: "5 workouts in one week",
      icon: Calendar,
      earned: i.workoutsThisWeek >= 5,
    },
    {
      id: "fueling-up",
      label: "Fueling Up",
      description: "Log a meal",
      icon: Utensils,
      earned: i.hasMealLogged,
    },
    {
      id: "goal-setter",
      label: "Goal Setter",
      description: "Set a target weight",
      icon: Target,
      earned: i.hasTarget,
    },
    {
      id: "halfway-there",
      label: "Halfway There",
      description: "50% of weight cut complete",
      icon: Scale,
      earned: (i.cutPercentComplete ?? 0) >= 50,
    },
    {
      id: "locked-in",
      label: "Locked In",
      description: "Hit your target weight",
      icon: Trophy,
      earned: (i.cutPercentComplete ?? 0) >= 100,
    },
  ];
}

export function Achievements(props: AchievementInput) {
  const achievements = buildAchievements(props);
  const earnedCount = achievements.filter((a) => a.earned).length;

  return (
    <Card className="bg-card border-card-border" data-testid="card-achievements">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
          <Trophy className="w-5 h-5 text-primary" /> Achievements
        </CardTitle>
        <span className="text-xs text-muted-foreground font-mono">
          {earnedCount} / {achievements.length}
        </span>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {achievements.map((a, idx) => {
            const Icon = a.earned ? a.icon : Lock;
            return (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.03 }}
                className={`rounded-lg border p-3 flex flex-col items-center text-center ${
                  a.earned
                    ? "border-primary/30 bg-primary/5"
                    : "border-border bg-secondary/30 opacity-60"
                }`}
                data-testid={`achievement-${a.id}`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center mb-2 ${
                    a.earned ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className={`text-xs font-bold ${a.earned ? "" : "text-muted-foreground"}`}>
                  {a.label}
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{a.description}</div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
