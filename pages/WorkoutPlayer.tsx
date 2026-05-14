import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import {
  Play,
  Pause,
  SkipForward,
  Square,
  Volume2,
  VolumeX,
  ArrowLeft,
  CheckCircle2,
  Flame,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  useCreateWorkout,
  getListWorkoutsQueryKey,
  getGetDashboardStatsQueryKey,
  getGetWeeklyWorkoutsQueryKey,
  getGetRecommendationsQueryKey,
} from "@workspace/api-client-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  WORKOUT_ROUTINES,
  findRoutine,
  totalDurationSec,
  totalMinutes,
  type Routine,
} from "@/lib/workout-routines";
import { beep, isSoundEnabled, setSoundEnabled, vibrate } from "@/lib/sound";

function fmtTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export default function WorkoutPlayer() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const createWorkout = useCreateWorkout();

  const [routineType, setRoutineType] = useState<string>(WORKOUT_ROUTINES[0].type);
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const phaseAdvanceRef = useRef(false);

  useEffect(() => {
    setSoundOn(isSoundEnabled());
  }, []);

  const routine: Routine = useMemo(() => findRoutine(routineType), [routineType]);
  const totalSec = useMemo(() => totalDurationSec(routine), [routine]);
  const elapsedBeforePhase = useMemo(
    () => routine.phases.slice(0, phaseIndex).reduce((s, p) => s + p.durationSec, 0),
    [routine, phaseIndex],
  );
  const currentPhase = routine.phases[phaseIndex];
  const elapsedSec = elapsedBeforePhase + (currentPhase ? currentPhase.durationSec - secondsLeft : 0);
  const overallPct = totalSec > 0 ? Math.min(100, (elapsedSec / totalSec) * 100) : 0;
  const phasePct = currentPhase ? Math.min(100, ((currentPhase.durationSec - secondsLeft) / currentPhase.durationSec) * 100) : 0;

  // Tick
  useEffect(() => {
    if (!started || completed || isPaused) return;
    const id = window.setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [started, completed, isPaused]);

  // Phase transition
  useEffect(() => {
    if (!started || completed) return;
    if (secondsLeft > 0) {
      phaseAdvanceRef.current = false;
      // 3-second countdown beep
      if (secondsLeft <= 3 && currentPhase?.kind === "work") {
        beep(660, 90, 0.12);
      }
      return;
    }
    if (phaseAdvanceRef.current) return;
    phaseAdvanceRef.current = true;
    const next = phaseIndex + 1;
    if (next >= routine.phases.length) {
      // Done
      beep(1100, 360, 0.22);
      vibrate([120, 80, 120]);
      setCompleted(true);
      logWorkout();
      return;
    }
    const nextPhase = routine.phases[next];
    if (nextPhase.kind === "work") {
      beep(880, 220, 0.2);
      vibrate(80);
    } else {
      beep(440, 220, 0.18);
      vibrate(40);
    }
    setPhaseIndex(next);
    setSecondsLeft(nextPhase.durationSec);
  }, [secondsLeft, started, completed, phaseIndex, routine, currentPhase]);

  function start() {
    setPhaseIndex(0);
    setSecondsLeft(routine.phases[0].durationSec);
    setIsPaused(false);
    setCompleted(false);
    setStarted(true);
    beep(880, 200, 0.2);
    vibrate(80);
  }

  function stop() {
    setStarted(false);
    setCompleted(false);
    setIsPaused(false);
    setPhaseIndex(0);
    setSecondsLeft(0);
  }

  function skip() {
    if (!currentPhase) return;
    setSecondsLeft(0);
  }

  function togglePause() {
    setIsPaused((p) => !p);
  }

  function toggleSound() {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) beep(660, 100, 0.15);
  }

  function logWorkout() {
    const minutes = totalMinutes(routine);
    createWorkout.mutate(
      {
        data: {
          date: new Date().toISOString(),
          type: routine.type as "boxing" | "cardio" | "sparring" | "strength" | "kickboxing" | "mma" | "conditioning",
          durationMinutes: minutes,
          intensity: routine.defaultIntensity,
          notes: `Guided routine: ${routine.label}`,
        },
      },
      {
        onSuccess: () => {
          toast.success("Workout logged");
          queryClient.invalidateQueries({ queryKey: getListWorkoutsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetDashboardStatsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetWeeklyWorkoutsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetRecommendationsQueryKey() });
        },
        onError: () => toast.error("Failed to log workout"),
      },
    );
  }

  // Selection screen
  if (!started) {
    return (
      <div className="p-6 md:p-10 max-w-3xl mx-auto w-full">
        <Button
          variant="ghost"
          onClick={() => setLocation("/workouts")}
          className="mb-6 pl-0 gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>

        <h1 className="text-3xl font-black uppercase tracking-tight">Guided Workout</h1>
        <p className="text-muted-foreground mt-2">Pick a discipline. The timer will run the rounds for you.</p>

        <Card className="mt-8 bg-card border-card-border">
          <CardContent className="p-6 space-y-6">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Routine</label>
              <Select value={routineType} onValueChange={setRoutineType}>
                <SelectTrigger className="mt-2 bg-secondary/50 capitalize" data-testid="select-routine">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {WORKOUT_ROUTINES.map((r) => (
                    <SelectItem key={r.type} value={r.type} className="capitalize">
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Phases</div>
                <div className="text-2xl font-black">{routine.phases.length}</div>
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Duration</div>
                <div className="text-2xl font-black">{totalMinutes(routine)} min</div>
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Intensity</div>
                <div className="text-2xl font-black text-primary">{routine.defaultIntensity}/10</div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-secondary/30 p-4 max-h-72 overflow-auto">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                Round Breakdown
              </div>
              <ol className="space-y-2">
                {routine.phases.map((p, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <span className="text-lg w-7 text-center">{p.emoji}</span>
                    <span className={`flex-1 ${p.kind === "rest" ? "text-muted-foreground" : "font-medium"}`}>
                      {p.name}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">{fmtTime(p.durationSec)}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                size="lg"
                className="flex-1 h-14 gap-2 font-bold uppercase tracking-wider text-base"
                onClick={start}
                data-testid="btn-start-routine"
              >
                <Play className="w-5 h-5" /> Start Workout
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2"
                onClick={toggleSound}
                aria-label="Toggle sound"
                data-testid="btn-toggle-sound"
              >
                {soundOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                {soundOn ? "Sound On" : "Sound Off"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Completion screen
  if (completed) {
    return (
      <div className="p-6 md:p-10 max-w-2xl mx-auto w-full flex flex-col items-center text-center pt-20">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 18 }}
          className="w-24 h-24 rounded-full bg-primary/15 border border-primary/40 flex items-center justify-center mb-6"
        >
          <CheckCircle2 className="w-12 h-12 text-primary" />
        </motion.div>
        <h1 className="text-4xl font-black uppercase tracking-tight">Workout Complete</h1>
        <p className="text-muted-foreground mt-3 capitalize">{routine.label}</p>

        <div className="grid grid-cols-3 gap-6 mt-10">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Duration</div>
            <div className="text-3xl font-black tabular-nums">{totalMinutes(routine)}</div>
            <div className="text-xs text-muted-foreground">min</div>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Phases</div>
            <div className="text-3xl font-black tabular-nums">{routine.phases.length}</div>
            <div className="text-xs text-muted-foreground">rounds</div>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Intensity</div>
            <div className="text-3xl font-black tabular-nums text-primary">{routine.defaultIntensity}</div>
            <div className="text-xs text-muted-foreground">/10</div>
          </div>
        </div>

        <Badge variant="outline" className="mt-8 gap-1 text-orange-400 border-orange-400/40">
          <Flame className="w-3 h-3" /> Logged · {format(new Date(), "MMM d, h:mm a")}
        </Badge>

        <div className="flex gap-3 mt-10 w-full">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              stop();
            }}
            data-testid="btn-do-another"
          >
            Do Another
          </Button>
          <Button
            className="flex-1 font-bold uppercase tracking-wider"
            onClick={() => setLocation("/dashboard")}
            data-testid="btn-back-dashboard"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Active player
  const isWork = currentPhase?.kind === "work";
  const upcoming = routine.phases.slice(phaseIndex + 1, phaseIndex + 3);

  return (
    <div className="min-h-[calc(100vh-4rem)] md:min-h-screen flex flex-col p-4 md:p-8 max-w-3xl mx-auto w-full">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{routine.label}</div>
          <div className="text-sm font-mono text-muted-foreground">
            Round {phaseIndex + 1} / {routine.phases.length}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={toggleSound}
            aria-label="Toggle sound"
            data-testid="btn-toggle-sound-active"
          >
            {soundOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={stop}
            className="gap-2 text-muted-foreground hover:text-destructive"
            data-testid="btn-stop"
          >
            <Square className="w-4 h-4" /> Stop
          </Button>
        </div>
      </div>

      <div className="space-y-1 mb-6">
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          <span>Workout Progress</span>
          <span className="font-mono">{Math.round(overallPct)}%</span>
        </div>
        <Progress value={overallPct} className="h-1.5" />
      </div>

      <Card
        className={`flex-1 border-2 transition-colors ${
          isWork
            ? "border-primary/40 bg-gradient-to-br from-primary/15 via-card to-card"
            : "border-blue-500/30 bg-gradient-to-br from-blue-500/15 via-card to-card"
        }`}
      >
        <CardContent className="h-full flex flex-col items-center justify-center text-center p-6 md:p-10">
          <Badge
            variant="outline"
            className={`uppercase tracking-wider font-bold text-[10px] mb-3 ${
              isWork ? "border-primary/50 text-primary" : "border-blue-400/50 text-blue-300"
            }`}
          >
            {isWork ? "Work" : "Rest"}
          </Badge>

          <AnimatePresence mode="wait">
            <motion.div
              key={phaseIndex}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center"
            >
              <div className="text-7xl md:text-8xl mb-3">{currentPhase?.emoji}</div>
              <div className="text-2xl md:text-3xl font-black uppercase tracking-tight" data-testid="text-phase-name">
                {currentPhase?.name}
              </div>
              {currentPhase?.description && (
                <div className="text-sm text-muted-foreground mt-2 max-w-md">
                  {currentPhase.description}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div
            className={`mt-8 font-mono font-black tabular-nums leading-none ${
              isWork ? "text-primary" : "text-blue-300"
            }`}
            style={{ fontSize: "clamp(4rem, 14vw, 8rem)" }}
            data-testid="text-time-left"
          >
            {fmtTime(secondsLeft)}
          </div>

          <div className="w-full max-w-md mt-6">
            <Progress value={phasePct} className="h-2" />
          </div>

          {isPaused && (
            <Badge variant="outline" className="mt-6 uppercase tracking-wider text-yellow-400 border-yellow-400/40">
              Paused
            </Badge>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-3 mt-4">
        <Button
          variant="outline"
          size="lg"
          className="h-14 gap-2 font-bold uppercase tracking-wider"
          onClick={togglePause}
          data-testid="btn-pause"
        >
          {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
          {isPaused ? "Resume" : "Pause"}
        </Button>
        <Button
          size="lg"
          className="h-14 gap-2 font-bold uppercase tracking-wider"
          onClick={skip}
          data-testid="btn-skip"
        >
          <SkipForward className="w-5 h-5" /> Skip
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="h-14 gap-2 font-bold uppercase tracking-wider text-destructive border-destructive/30 hover:bg-destructive/10"
          onClick={stop}
          data-testid="btn-stop-bottom"
        >
          <Square className="w-5 h-5" /> Stop
        </Button>
      </div>

      {upcoming.length > 0 && (
        <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground overflow-hidden">
          <span className="font-bold uppercase tracking-wider shrink-0">Up next:</span>
          {upcoming.map((p, i) => (
            <span key={i} className="flex items-center gap-1 truncate">
              <span>{p.emoji}</span>
              <span className="truncate">{p.name}</span>
              <span className="font-mono opacity-60">· {fmtTime(p.durationSec)}</span>
              {i < upcoming.length - 1 && <span className="opacity-40">→</span>}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
