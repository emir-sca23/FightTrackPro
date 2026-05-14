import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Utensils, Plus, Trash2, Flame, Search, Check } from "lucide-react";
import { searchFoods, type FoodItem } from "@/lib/food-database";

import {
  useListMeals,
  useCreateMeal,
  useDeleteMeal,
  getListMealsQueryKey,
  getGetDashboardStatsQueryKey,
  getGetRecommendationsQueryKey,
} from "@workspace/api-client-react";

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const mealSchema = z.object({
  name: z.string().min(1, "Required").max(200),
  calories: z.coerce.number().int().min(0, "Must be 0+").max(10000),
});

function todayIsoDate(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export default function Meals() {
  const today = todayIsoDate();
  const queryClient = useQueryClient();

  const mealsQuery = useListMeals(
    { date: today },
    { query: { queryKey: getListMealsQueryKey({ date: today }) } },
  );
  const createMeal = useCreateMeal();
  const deleteMeal = useDeleteMeal();

  const form = useForm<z.infer<typeof mealSchema>>({
    resolver: zodResolver(mealSchema),
    defaultValues: { name: "", calories: 0 },
  });

  const meals = mealsQuery.data ?? [];
  const total = useMemo(() => meals.reduce((s, m) => s + m.calories, 0), [meals]);

  const nameValue = form.watch("name");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [autoFilledFor, setAutoFilledFor] = useState<string | null>(null);
  const suggestions = useMemo(() => {
    if (!showSuggestions) return [];
    return searchFoods(nameValue, 6);
  }, [nameValue, showSuggestions]);

  const pickFood = (food: FoodItem) => {
    form.setValue("name", food.name, { shouldValidate: true });
    form.setValue("calories", food.calories, { shouldValidate: true });
    setAutoFilledFor(food.name);
    setShowSuggestions(false);
  };

  const onSubmit = (values: z.infer<typeof mealSchema>) => {
    createMeal.mutate(
      {
        data: {
          date: new Date().toISOString(),
          name: values.name,
          calories: values.calories,
        },
      },
      {
        onSuccess: () => {
          toast.success("Meal logged");
          form.reset({ name: "", calories: 0 });
          setAutoFilledFor(null);
          setShowSuggestions(false);
          queryClient.invalidateQueries({ queryKey: getListMealsQueryKey({ date: today }) });
          queryClient.invalidateQueries({ queryKey: getGetDashboardStatsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetRecommendationsQueryKey() });
        },
        onError: () => toast.error("Failed to log meal"),
      },
    );
  };

  const onDelete = (id: string) => {
    deleteMeal.mutate(
      { id },
      {
        onSuccess: () => {
          toast.success("Meal removed");
          queryClient.invalidateQueries({ queryKey: getListMealsQueryKey({ date: today }) });
          queryClient.invalidateQueries({ queryKey: getGetDashboardStatsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetRecommendationsQueryKey() });
        },
        onError: () => toast.error("Failed to remove meal"),
      },
    );
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8 w-full">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight">Fuel Log</h1>
          <p className="text-sm text-muted-foreground mt-1">{format(new Date(), "EEEE, MMMM d")}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Today</p>
          <p className="text-3xl font-black tabular-nums" data-testid="text-meals-total">
            {total}
            <span className="text-sm text-muted-foreground font-medium ml-1">kcal</span>
          </p>
        </div>
      </div>

      <Card className="bg-card/60 backdrop-blur border-card-border border-primary/20">
        <CardHeader>
          <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
            <Plus className="w-4 h-4 text-primary" /> Log Meal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid grid-cols-1 md:grid-cols-[1fr_180px_auto] gap-4 items-end"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold flex items-center gap-1">
                      Meal
                      {autoFilledFor && autoFilledFor === field.value && (
                        <span className="text-[10px] font-normal text-green-400 normal-case flex items-center gap-1 ml-1">
                          <Check className="w-3 h-3" /> Auto-filled
                        </span>
                      )}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        <Input
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            setShowSuggestions(true);
                            if (autoFilledFor && autoFilledFor !== e.target.value) {
                              setAutoFilledFor(null);
                            }
                          }}
                          onFocus={() => setShowSuggestions(true)}
                          onBlur={() => window.setTimeout(() => setShowSuggestions(false), 150)}
                          placeholder="Type a food (e.g. chicken, rice, banana)"
                          className="bg-secondary/50 pl-9"
                          autoComplete="off"
                          data-testid="input-meal-name"
                        />
                        {suggestions.length > 0 && (
                          <div className="absolute top-full left-0 right-0 mt-1 z-50 rounded-md border border-border bg-popover shadow-lg overflow-hidden">
                            {suggestions.map((s) => (
                              <button
                                key={s.name}
                                type="button"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  pickFood(s);
                                }}
                                className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-secondary/60 transition-colors text-left"
                                data-testid={`suggestion-${s.name.toLowerCase().replace(/\s+/g, "-")}`}
                              >
                                <div className="min-w-0">
                                  <div className="font-medium truncate">{s.name}</div>
                                  <div className="text-xs text-muted-foreground">{s.serving}</div>
                                </div>
                                <span className="font-mono text-xs text-primary shrink-0 ml-3">
                                  {s.calories} kcal
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="calories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold">Calories</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        className="bg-secondary/50 font-mono text-lg"
                        data-testid="input-meal-calories"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={createMeal.isPending}
                className="font-bold uppercase tracking-wider"
                data-testid="btn-log-meal"
              >
                {createMeal.isPending ? "Saving..." : "Log Meal"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-bold uppercase tracking-tight">Today's Meals</h2>

        {mealsQuery.isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 rounded-lg" />
            ))}
          </div>
        ) : meals.length === 0 ? (
          <Card className="bg-secondary/30 border-dashed">
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <Utensils className="w-10 h-10 text-muted-foreground mb-3 opacity-30" />
              <p className="text-base font-medium text-muted-foreground">No meals logged today.</p>
              <p className="text-sm text-muted-foreground/60">Log your first meal to start tracking.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {meals.map((meal, index) => (
                <motion.div
                  key={meal.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ delay: index * 0.04 }}
                  data-testid={`meal-row-${meal.id}`}
                >
                  <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-secondary/50 transition-colors">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                        <Utensils className="w-4 h-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold truncate">{meal.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(meal.date), "h:mm a")}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <Badge variant="outline" className="gap-1 font-mono">
                        <Flame className="w-3 h-3" /> {meal.calories} kcal
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => onDelete(meal.id)}
                        disabled={deleteMeal.isPending}
                        data-testid={`btn-delete-meal-${meal.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
