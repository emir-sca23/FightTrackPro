import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import {
  useGetProfile,
  useUpdateProfile,
  useCreateWeight,
  getListWeightsQueryKey,
  getGetProfileQueryKey,
  getGetDashboardStatsQueryKey,
  getGetRecommendationsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { User, Scale, Save, Target } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const profileSchema = z.object({
  displayName: z.string().min(2, "Name is required").max(50),
  discipline: z.string().min(1, "Discipline is required"),
});

const cutSchema = z.object({
  targetWeightKg: z.union([z.literal(""), z.coerce.number().min(20).max(250)]).optional(),
  cutDeadline: z.string().optional(),
  dailyCalorieLimit: z.union([z.literal(""), z.coerce.number().int().min(800).max(8000)]).optional(),
});

const weightSchema = z.object({
  date: z.string().min(1),
  weightKg: z.coerce.number().min(30, "Invalid weight").max(250, "Invalid weight"),
});

export default function Profile() {
  const { data: profile, isLoading: isProfileLoading } = useGetProfile();
  const updateProfile = useUpdateProfile();
  const createWeight = useCreateWeight();
  const queryClient = useQueryClient();

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: { displayName: "", discipline: "boxing" },
  });

  const cutForm = useForm<z.infer<typeof cutSchema>>({
    resolver: zodResolver(cutSchema),
    defaultValues: { targetWeightKg: "" as unknown as number, cutDeadline: "", dailyCalorieLimit: "" as unknown as number },
  });

  const weightForm = useForm<z.infer<typeof weightSchema>>({
    resolver: zodResolver(weightSchema),
    defaultValues: { date: format(new Date(), "yyyy-MM-dd"), weightKg: 70 },
  });

  const profileInitialized = useRef(false);

  useEffect(() => {
    if (profile && !profileInitialized.current) {
      profileForm.reset({
        displayName: profile.displayName || "",
        discipline: profile.discipline || "boxing",
      });
      cutForm.reset({
        targetWeightKg: (profile.targetWeightKg ?? "") as number,
        cutDeadline: profile.cutDeadline ? format(new Date(profile.cutDeadline), "yyyy-MM-dd") : "",
        dailyCalorieLimit: (profile.dailyCalorieLimit ?? "") as number,
      });
      if (profile.weightKg) {
        weightForm.setValue("weightKg", profile.weightKg);
      }
      profileInitialized.current = true;
    }
  }, [profile, profileForm, cutForm, weightForm]);

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: getGetProfileQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetDashboardStatsQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetRecommendationsQueryKey() });
  };

  const onProfileSubmit = (values: z.infer<typeof profileSchema>) => {
    updateProfile.mutate(
      { data: values },
      {
        onSuccess: () => {
          toast.success("Profile updated");
          invalidateAll();
        },
        onError: () => toast.error("Failed to update profile"),
      },
    );
  };

  const onCutSubmit = (values: z.infer<typeof cutSchema>) => {
    const target = values.targetWeightKg === "" || values.targetWeightKg === undefined ? null : Number(values.targetWeightKg);
    const deadline = values.cutDeadline ? new Date(values.cutDeadline + "T00:00:00.000Z").toISOString() : null;
    const limit = values.dailyCalorieLimit === "" || values.dailyCalorieLimit === undefined ? null : Math.round(Number(values.dailyCalorieLimit));
    updateProfile.mutate(
      {
        data: {
          targetWeightKg: target,
          cutDeadline: deadline,
          dailyCalorieLimit: limit,
        },
      },
      {
        onSuccess: () => {
          toast.success("Weight cut goals saved");
          invalidateAll();
        },
        onError: () => toast.error("Failed to save goals"),
      },
    );
  };

  const onWeightSubmit = (values: z.infer<typeof weightSchema>) => {
    createWeight.mutate(
      { data: { date: new Date(values.date + "T00:00:00.000Z").toISOString(), weightKg: values.weightKg } },
      {
        onSuccess: () => {
          toast.success("Weight logged");
          queryClient.invalidateQueries({ queryKey: getListWeightsQueryKey() });
          invalidateAll();
        },
        onError: () => toast.error("Failed to log weight"),
      },
    );
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8 w-full">
      <h1 className="text-3xl font-black uppercase tracking-tight">Fighter Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-card border-card-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-bold uppercase">
              <User className="w-5 h-5 text-primary" /> Identity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                <FormField
                  control={profileForm.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-xs font-bold">Ring Name</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-secondary/50" data-testid="input-display-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={profileForm.control}
                  name="discipline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-xs font-bold">Primary Discipline</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-secondary/50 capitalize" data-testid="select-discipline">
                            <SelectValue placeholder="Select primary discipline" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {["boxing", "kickboxing", "mma", "muay thai", "bjj", "wrestling"].map((d) => (
                            <SelectItem key={d} value={d} className="capitalize">{d}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full gap-2 font-bold uppercase tracking-wider"
                  disabled={updateProfile.isPending || isProfileLoading}
                  data-testid="btn-save-profile"
                >
                  <Save className="w-4 h-4" /> {updateProfile.isPending ? "Saving..." : "Save Profile"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card className="bg-card border-card-border border-primary/20 shadow-[0_0_15px_rgba(225,29,72,0.1)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
            <CardHeader>
              <CardTitle className="text-lg font-bold uppercase flex items-center gap-2">
                <Scale className="w-5 h-5 text-primary" /> Current Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground font-bold uppercase mb-1">Weight</p>
                  <p className="text-3xl font-black" data-testid="text-current-weight">
                    {profile?.weightKg ?? "--"} <span className="text-lg text-muted-foreground font-medium">kg</span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-bold uppercase mb-1">Category</p>
                  <p className="text-xl font-bold text-primary capitalize leading-tight" data-testid="text-category">
                    {profile?.weightCategory ?? "Unknown"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-card-border">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Log New Weight</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...weightForm}>
                <form onSubmit={weightForm.handleSubmit(onWeightSubmit)} className="flex items-end gap-4">
                  <FormField
                    control={weightForm.control}
                    name="weightKg"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="uppercase text-xs font-bold">Weight (kg)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            {...field}
                            className="bg-secondary/50 font-mono text-lg"
                            data-testid="input-log-weight"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={createWeight.isPending}
                    className="font-bold uppercase tracking-wider mb-2"
                    data-testid="btn-log-weight"
                  >
                    Log
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="bg-card border-card-border border-primary/20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-bold uppercase">
            <Target className="w-5 h-5 text-primary" /> Weight Cut Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...cutForm}>
            <form
              onSubmit={cutForm.handleSubmit(onCutSubmit)}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <FormField
                control={cutForm.control}
                name="targetWeightKg"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold">Target Weight (kg)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="e.g. 70"
                        {...field}
                        value={field.value ?? ""}
                        className="bg-secondary/50 font-mono text-lg"
                        data-testid="input-target-weight"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={cutForm.control}
                name="cutDeadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold">Deadline (optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={field.value ?? ""}
                        className="bg-secondary/50"
                        data-testid="input-cut-deadline"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={cutForm.control}
                name="dailyCalorieLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold">Daily Calorie Limit</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g. 2200"
                        {...field}
                        value={field.value ?? ""}
                        className="bg-secondary/50 font-mono text-lg"
                        data-testid="input-daily-limit"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="md:col-span-3">
                <Button
                  type="submit"
                  disabled={updateProfile.isPending}
                  className="gap-2 font-bold uppercase tracking-wider"
                  data-testid="btn-save-cut"
                >
                  <Save className="w-4 h-4" /> Save Goals
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
