import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateWorkout, getListWorkoutsQueryKey, getGetDashboardStatsQueryKey, getGetWeeklyWorkoutsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

const workoutTypes = ["boxing", "cardio", "sparring", "strength", "kickboxing", "mma", "conditioning"] as const;

const formSchema = z.object({
  date: z.string().min(1, "Date is required"),
  type: z.enum(workoutTypes),
  durationMinutes: z.coerce.number().min(1, "Duration must be at least 1 minute").max(600, "Duration seems too high"),
  intensity: z.number().min(1).max(10),
  notes: z.string().optional(),
});

export default function NewWorkout() {
  const [, setLocation] = useLocation();
  const createWorkout = useCreateWorkout();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: format(new Date(), "yyyy-MM-dd"),
      type: "boxing",
      durationMinutes: 60,
      intensity: 7,
      notes: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createWorkout.mutate(
      {
        data: {
          ...values,
          notes: values.notes || null,
        }
      },
      {
        onSuccess: () => {
          toast.success("Session logged successfully!");
          queryClient.invalidateQueries({ queryKey: getListWorkoutsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetDashboardStatsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetWeeklyWorkoutsQueryKey() });
          setLocation("/workouts");
        },
        onError: (err: any) => {
          toast.error(err?.data?.error || "Failed to log session");
        }
      }
    );
  };

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto w-full">
      <Button variant="ghost" onClick={() => setLocation("/workouts")} className="mb-6 pl-0 gap-2 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Back to log
      </Button>

      <h1 className="text-3xl font-black uppercase tracking-tight mb-8">Log Session</h1>

      <div className="bg-card border border-border p-6 rounded-xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold tracking-wider">Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className="bg-secondary/50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold tracking-wider">Discipline / Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-secondary/50 capitalize">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {workoutTypes.map(type => (
                          <SelectItem key={type} value={type} className="capitalize">{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="durationMinutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase text-xs font-bold tracking-wider">Duration (Minutes)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} className="bg-secondary/50 font-mono text-lg" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="intensity"
              render={({ field }) => (
                <FormItem className="pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <FormLabel className="uppercase text-xs font-bold tracking-wider">Intensity (1-10)</FormLabel>
                    <span className="font-black text-2xl text-primary">{field.value}</span>
                  </div>
                  <FormControl>
                    <Slider
                      min={1}
                      max={10}
                      step={1}
                      defaultValue={[field.value]}
                      onValueChange={(vals) => field.onChange(vals[0])}
                      className="py-4"
                    />
                  </FormControl>
                  <FormDescription className="flex justify-between text-xs mt-2">
                    <span>Light Flow</span>
                    <span>War</span>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase text-xs font-bold tracking-wider">Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="What did you work on? How did you feel?" 
                      className="resize-none h-24 bg-secondary/50" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full h-14 text-lg font-bold uppercase tracking-wider mt-8" 
              disabled={createWorkout.isPending}
              data-testid="btn-submit-workout"
            >
              {createWorkout.isPending ? "Logging..." : "Log Session"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
