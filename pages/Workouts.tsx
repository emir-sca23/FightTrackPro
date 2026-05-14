import { useState } from "react";
import { Link } from "wouter";
import { useListWorkouts, useDeleteWorkout, getListWorkoutsQueryKey, getGetDashboardStatsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Plus, Search, Trash2, Edit2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { motion, AnimatePresence } from "framer-motion";

export default function Workouts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [workoutToDelete, setWorkoutToDelete] = useState<string | null>(null);
  
  const { data: workouts, isLoading } = useListWorkouts();
  const deleteWorkout = useDeleteWorkout();
  const queryClient = useQueryClient();

  const filteredWorkouts = workouts?.filter(w => 
    w.type.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (w.notes && w.notes.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDelete = () => {
    if (!workoutToDelete) return;
    
    deleteWorkout.mutate(
      { id: workoutToDelete },
      {
        onSuccess: () => {
          toast.success("Workout deleted");
          queryClient.invalidateQueries({ queryKey: getListWorkoutsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetDashboardStatsQueryKey() });
          setWorkoutToDelete(null);
        },
        onError: () => {
          toast.error("Failed to delete workout");
          setWorkoutToDelete(null);
        }
      }
    );
  };

  return (
    <div className="p-6 md:p-10 space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-black uppercase tracking-tight">Training Log</h1>
        <div className="flex gap-2 flex-wrap">
          <Link href="/workouts/play">
            <Button className="gap-2 uppercase font-bold tracking-wide" data-testid="btn-start-workout">
              <Play className="w-4 h-4" /> Start Workout
            </Button>
          </Link>
          <Link href="/workouts/new">
            <Button variant="outline" className="gap-2 uppercase font-bold tracking-wide" data-testid="btn-new-workout">
              <Plus className="w-4 h-4" /> Log Manually
            </Button>
          </Link>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Search by type or notes..." 
          className="pl-10 bg-card/50"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          data-testid="input-search-workouts"
        />
      </div>

      {isLoading ? (
        <div className="space-y-4 mt-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 w-full rounded-lg" />)}
        </div>
      ) : (
        <div className="space-y-3 mt-6">
          <AnimatePresence>
            {filteredWorkouts?.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="text-center py-12 text-muted-foreground border border-dashed rounded-xl"
              >
                No workouts found.
              </motion.div>
            ) : (
              filteredWorkouts?.map((workout, idx) => (
                <motion.div
                  key={workout.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-card border border-border rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-secondary px-3 py-2 rounded-lg text-center min-w-16 shrink-0 border border-border/50">
                      <div className="text-xs uppercase font-bold text-muted-foreground mb-1">{format(new Date(workout.date), "MMM")}</div>
                      <div className="text-xl font-black leading-none">{format(new Date(workout.date), "dd")}</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-lg capitalize">{workout.type}</span>
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                          {workout.durationMinutes}m · {workout.caloriesBurned} kcal
                        </Badge>
                        <Badge variant="outline">
                          Intensity: {workout.intensity}/10
                        </Badge>
                      </div>
                      {workout.notes && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{workout.notes}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 self-end md:self-auto">
                    {/* Edit button disabled for now as no edit page is defined in prompt, but placeholder is good */}
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" disabled>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() => setWorkoutToDelete(workout.id)}
                      data-testid={`btn-delete-workout-${workout.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      )}

      <AlertDialog open={!!workoutToDelete} onOpenChange={(open) => !open && setWorkoutToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Workout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this session? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
              disabled={deleteWorkout.isPending}
            >
              {deleteWorkout.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
