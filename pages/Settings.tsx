import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Volume2, VolumeX, Target, RotateCcw, Settings as SettingsIcon } from "lucide-react";

import {
  useUpdateProfile,
  getGetProfileQueryKey,
  getGetDashboardStatsQueryKey,
  getGetRecommendationsQueryKey,
} from "@workspace/api-client-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { isSoundEnabled, setSoundEnabled, beep } from "@/lib/sound";

export default function Settings() {
  const [sound, setSound] = useState(true);
  const updateProfile = useUpdateProfile();
  const queryClient = useQueryClient();

  useEffect(() => {
    setSound(isSoundEnabled());
  }, []);

  const onToggleSound = (next: boolean) => {
    setSound(next);
    setSoundEnabled(next);
    if (next) beep(660, 120, 0.15);
  };

  const onResetGoals = () => {
    updateProfile.mutate(
      {
        data: {
          targetWeightKg: null,
          cutDeadline: null,
          dailyCalorieLimit: null,
        },
      },
      {
        onSuccess: () => {
          toast.success("Weight cut goals cleared");
          queryClient.invalidateQueries({ queryKey: getGetProfileQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetDashboardStatsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetRecommendationsQueryKey() });
        },
        onError: () => toast.error("Failed to reset goals"),
      },
    );
  };

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto w-full space-y-8">
      <div className="flex items-center gap-3">
        <SettingsIcon className="w-7 h-7 text-primary" />
        <h1 className="text-3xl font-black uppercase tracking-tight">Settings</h1>
      </div>

      <Card className="bg-card border-card-border">
        <CardHeader>
          <CardTitle className="text-sm font-bold uppercase tracking-wider">Audio & Feedback</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {sound ? (
                <Volume2 className="w-5 h-5 text-primary" />
              ) : (
                <VolumeX className="w-5 h-5 text-muted-foreground" />
              )}
              <div>
                <div className="font-bold">Workout Sounds</div>
                <div className="text-xs text-muted-foreground">
                  Beeps and vibration on phase transitions during guided workouts.
                </div>
              </div>
            </div>
            <Switch checked={sound} onCheckedChange={onToggleSound} data-testid="switch-sound" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-card-border">
        <CardHeader>
          <CardTitle className="text-sm font-bold uppercase tracking-wider">Goals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <div className="font-bold">Weight Cut Goals</div>
                <div className="text-xs text-muted-foreground">
                  Set or update your target weight, deadline, and daily calorie limit on the Profile page.
                </div>
              </div>
            </div>
          </div>
          <Separator />
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <RotateCcw className="w-5 h-5 text-destructive mt-0.5" />
              <div>
                <div className="font-bold">Reset Weight Cut Goals</div>
                <div className="text-xs text-muted-foreground">
                  Clear your target weight, deadline, and daily calorie limit. Your workout, weight and meal history is kept.
                </div>
              </div>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="border-destructive/40 text-destructive hover:bg-destructive/10"
                  data-testid="btn-reset-goals"
                >
                  Reset
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset weight cut goals?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will clear your target weight, deadline, and daily calorie limit. Your training and meal history won't be touched.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onResetGoals}
                    className="bg-destructive hover:bg-destructive/90"
                    disabled={updateProfile.isPending}
                  >
                    {updateProfile.isPending ? "Resetting..." : "Reset"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
