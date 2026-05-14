import { Link } from "wouter";
import {
  useGetDashboardStats,
  useGetRecommendations,
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Flame,
  Calendar,
  Activity,
  Scale,
  Timer,
  Target,
  Utensils,
  Zap,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Play,
} from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Achievements } from "@/components/dashboard/Achievements";
import { WaterTracker } from "@/components/dashboard/WaterTracker";

export default function Dashboard() {
  const { data: stats, isLoading } = useGetDashboardStats();
  const { data: rec, isLoading: recLoading } = useGetRecommendations();

  if (isLoading) {
    return (
      <div className="p-6 md:p-10 space-y-6">
        <Skeleton className="h-10 w-48 mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Skeleton className="h-48 rounded-xl lg:col-span-2" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (!stats) {
    return <div className="p-6 text-destructive">Failed to load dashboard stats.</div>;
  }

  const statCards = [
    { title: "Current Streak", value: `${stats.currentStreak} Days`, icon: Flame, color: "text-orange-500" },
    { title: "This Week", value: `${stats.workoutsThisWeek} Sessions`, icon: Calendar, color: "text-primary" },
    {
      title: "Current Weight",
      value: stats.currentWeightKg != null ? `${stats.currentWeightKg} kg` : "N/A",
      icon: Scale,
      color: "text-blue-400",
      sub: stats.weightCategory,
    },
    {
      title: "Time (Week)",
      value: `${Math.floor(stats.minutesThisWeek / 60)}h ${stats.minutesThisWeek % 60}m`,
      icon: Timer,
      color: "text-green-400",
    },
  ];

  const cal = stats.calories;
  const cut = stats.weightCut;

  // Recommendation block visuals
  let recAccent = "border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card";
  let recIcon = Zap;
  let recIconColor = "text-primary";
  if (rec?.status === "on_track") {
    recAccent = "border-green-500/30 bg-gradient-to-br from-green-500/10 via-card to-card";
    recIcon = CheckCircle2;
    recIconColor = "text-green-400";
  } else if (rec?.status === "behind") {
    recAccent = "border-orange-500/30 bg-gradient-to-br from-orange-500/15 via-card to-card";
    recIcon = AlertTriangle;
    recIconColor = "text-orange-400";
  } else if (rec?.status === "no_target") {
    recAccent = "border-border bg-card";
    recIcon = Target;
    recIconColor = "text-muted-foreground";
  }
  const RecIcon = recIcon;

  return (
    <div className="p-6 md:p-10 space-y-8">
      <div className="flex justify-between items-end gap-4">
        <h1 className="text-3xl font-black uppercase tracking-tight">Command Center</h1>
        <div className="hidden md:flex gap-2">
          <Link href="/workouts/play">
            <Button className="gap-2 font-bold uppercase tracking-wider" data-testid="btn-quick-start">
              <Play className="w-4 h-4" /> Start Workout
            </Button>
          </Link>
          <Link href="/workouts/new">
            <Button variant="outline" className="gap-2 font-bold uppercase tracking-wider" data-testid="btn-quick-log">
              Log Manually
            </Button>
          </Link>
        </div>
      </div>

      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {statCards.map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="bg-card/50 backdrop-blur border-card-border overflow-hidden group">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`w-4 h-4 ${stat.color} opacity-80 group-hover:opacity-100 transition-opacity`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl md:text-3xl font-bold tracking-tight">{stat.value}</div>
                {stat.sub && <div className="text-xs text-muted-foreground mt-1 font-medium">{stat.sub}</div>}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Recommendation block */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className={`border ${recAccent} relative overflow-hidden`} data-testid="card-recommendation">
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
              <RecIcon className={`w-5 h-5 ${recIconColor}`} /> Smart Recommendation
            </CardTitle>
            {rec?.dailyDeficitTarget != null && (
              <Badge variant="outline" className="font-mono">
                Daily target: {rec.dailyDeficitTarget} kcal
              </Badge>
            )}
          </CardHeader>
          <CardContent>
            {recLoading ? (
              <Skeleton className="h-12 w-full" />
            ) : rec ? (
              <div className="space-y-4">
                <p className="text-lg font-medium" data-testid="text-recommendation-message">
                  {rec.message}
                </p>
                {rec.suggestions.length > 0 && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                      Suggested workouts
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {rec.suggestions.map((s) => (
                        <div
                          key={s.activity}
                          className="rounded-lg border border-border bg-secondary/40 p-3"
                          data-testid={`suggestion-${s.activity.toLowerCase().replace(/\s+/g, "-")}`}
                        >
                          <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">
                            {s.activity}
                          </div>
                          <div className="text-2xl font-black tabular-nums">
                            {s.minutes}
                            <span className="text-sm text-muted-foreground font-medium ml-1">min</span>
                          </div>
                          <div className="text-xs text-muted-foreground font-mono mt-1">~{s.calories} kcal</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {rec.status === "no_target" && (
                  <Link href="/profile">
                    <Button variant="outline" className="gap-2 mt-2" data-testid="btn-set-target">
                      Set target weight <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">Recommendations unavailable.</p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calories block */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="lg:col-span-2">
          <Card className="bg-card border-card-border h-full" data-testid="card-calories">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
                <Utensils className="w-5 h-5 text-primary" /> Calories Today
              </CardTitle>
              <Link href="/meals">
                <Button variant="ghost" size="sm" className="text-xs gap-1" data-testid="btn-go-meals">
                  Log meal <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="space-y-1">
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Consumed</div>
                  <div className="text-2xl md:text-3xl font-black tabular-nums" data-testid="text-cals-consumed">
                    {cal.consumedToday}
                  </div>
                  <div className="text-[10px] text-muted-foreground font-mono">kcal</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Burned</div>
                  <div className="text-2xl md:text-3xl font-black tabular-nums text-orange-400" data-testid="text-cals-burned">
                    {cal.burnedToday}
                  </div>
                  <div className="text-[10px] text-muted-foreground font-mono">kcal</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Net</div>
                  <div
                    className={`text-2xl md:text-3xl font-black tabular-nums ${cal.netToday <= 0 ? "text-green-400" : "text-foreground"}`}
                    data-testid="text-cals-net"
                  >
                    {cal.netToday > 0 ? "+" : ""}{cal.netToday}
                  </div>
                  <div className="text-[10px] text-muted-foreground font-mono">kcal</div>
                </div>
              </div>

              {cal.dailyLimit != null ? (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold uppercase tracking-wider text-muted-foreground">
                      Daily Limit
                    </span>
                    <span className="font-mono">
                      {Math.max(0, cal.consumedToday)} / {cal.dailyLimit} kcal
                    </span>
                  </div>
                  <Progress
                    value={Math.min(100, (cal.consumedToday / cal.dailyLimit) * 100)}
                    className="h-2"
                  />
                  <div className="text-xs text-muted-foreground font-mono">
                    Remaining net budget:{" "}
                    <span className={cal.remainingToday != null && cal.remainingToday < 0 ? "text-destructive" : "text-foreground"}>
                      {cal.remainingToday} kcal
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-muted-foreground">
                  Set a daily calorie limit in your profile to track your budget.
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Weight cut block */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-card border-card-border h-full" data-testid="card-weight-cut">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
                <Target className="w-5 h-5 text-primary" /> Weight Cut
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cut.hasTarget && cut.currentWeightKg != null && cut.targetWeightKg != null ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Current</div>
                      <div className="text-2xl font-black tabular-nums" data-testid="text-cut-current">
                        {cut.currentWeightKg}
                        <span className="text-sm text-muted-foreground font-medium ml-1">kg</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Target</div>
                      <div className="text-2xl font-black tabular-nums text-primary" data-testid="text-cut-target">
                        {cut.targetWeightKg}
                        <span className="text-sm text-muted-foreground font-medium ml-1">kg</span>
                      </div>
                    </div>
                  </div>

                  {cut.weightDifferenceKg != null && cut.weightDifferenceKg > 0 ? (
                    <div className="rounded-lg bg-secondary/40 p-3">
                      <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                        Remaining
                      </div>
                      <div className="text-xl font-bold tabular-nums" data-testid="text-cut-remaining">
                        {cut.weightDifferenceKg.toFixed(1)} kg
                      </div>
                      {cut.totalCaloriesToBurn != null && (
                        <div className="text-xs text-muted-foreground font-mono mt-1">
                          ~{cut.totalCaloriesToBurn.toLocaleString()} kcal to burn
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="rounded-lg bg-green-500/10 border border-green-500/30 p-3">
                      <div className="text-sm font-bold text-green-400">At weight</div>
                      <div className="text-xs text-muted-foreground">Keep it locked in.</div>
                    </div>
                  )}

                  {cut.percentComplete != null && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold uppercase tracking-wider text-muted-foreground">Progress</span>
                        <span className="font-mono">{cut.percentComplete.toFixed(0)}%</span>
                      </div>
                      <Progress value={cut.percentComplete} className="h-2" />
                    </div>
                  )}

                  {cut.deadline && cut.daysRemaining != null && (
                    <div className="text-xs text-muted-foreground">
                      <span className="font-bold uppercase tracking-wider">Deadline:</span>{" "}
                      {format(new Date(cut.deadline), "MMM d, yyyy")}{" "}
                      <span className="font-mono">({cut.daysRemaining}d left)</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Set a target weight to start tracking your cut.
                  </p>
                  <Link href="/profile">
                    <Button variant="outline" className="gap-2" data-testid="btn-cut-setup">
                      Set goals <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="lg:col-span-2">
          <Achievements
            totalWorkouts={stats.totalWorkouts}
            currentStreak={stats.currentStreak}
            minutesThisWeek={stats.minutesThisWeek}
            workoutsThisWeek={stats.workoutsThisWeek}
            hasMealLogged={cal.consumedToday > 0}
            cutPercentComplete={cut.percentComplete ?? null}
            hasTarget={cut.hasTarget}
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <WaterTracker />
        </motion.div>
      </div>

      <div className="space-y-4 mt-2">
        <h2 className="text-xl font-bold uppercase tracking-tight">Recent Sessions</h2>

        {stats.recentWorkouts.length === 0 ? (
          <Card className="bg-secondary/50 border-dashed">
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <Activity className="w-12 h-12 text-muted-foreground mb-4 opacity-20" />
              <p className="text-lg font-medium text-muted-foreground">No recent workouts.</p>
              <p className="text-sm text-muted-foreground/60 mb-4">Time to get some rounds in.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {stats.recentWorkouts.map((workout, index) => (
              <motion.div
                key={workout.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shrink-0">
                      <Activity className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-bold text-base capitalize">{workout.type}</span>
                        <Badge variant="outline" className="text-[10px] py-0">
                          {workout.durationMinutes} min
                        </Badge>
                        <Badge variant="outline" className="text-[10px] py-0 gap-1 text-orange-400 border-orange-400/30">
                          <Flame className="w-2.5 h-2.5" /> {workout.caloriesBurned} kcal
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(workout.date), "EEEE, MMM d")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold">Intensity</div>
                    <div className="flex gap-1 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-1.5 h-3 rounded-sm ${i < Math.ceil(workout.intensity / 2) ? "bg-primary" : "bg-muted"}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
