import { useEffect, useState } from "react";
import { Droplet, Plus, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getWaterCups, setWaterCups, WATER_GOAL } from "@/lib/water";

export function WaterTracker() {
  const [cups, setCups] = useState(0);

  useEffect(() => {
    setCups(getWaterCups());
  }, []);

  const update = (n: number) => {
    const next = Math.max(0, Math.min(20, n));
    setCups(next);
    setWaterCups(next);
  };

  const pct = Math.min(100, (cups / WATER_GOAL) * 100);

  return (
    <Card className="bg-card border-card-border h-full" data-testid="card-water">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
          <Droplet className="w-5 h-5 text-blue-400" /> Water Today
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <span className="text-4xl font-black tabular-nums" data-testid="text-water-cups">
              {cups}
            </span>
            <span className="text-sm text-muted-foreground font-medium ml-1">
              / {WATER_GOAL} cups
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="outline"
              className="h-9 w-9"
              onClick={() => update(cups - 1)}
              disabled={cups <= 0}
              aria-label="Remove cup"
              data-testid="btn-water-minus"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              className="h-9 w-9 bg-blue-500 hover:bg-blue-500/90 text-white"
              onClick={() => update(cups + 1)}
              aria-label="Add cup"
              data-testid="btn-water-plus"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex gap-1.5 mb-3">
          {Array.from({ length: WATER_GOAL }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-8 rounded-sm border transition-colors flex items-end justify-center pb-0.5 ${
                i < cups
                  ? "bg-blue-500/30 border-blue-400/50"
                  : "bg-secondary/40 border-border"
              }`}
            >
              <Droplet
                className={`w-3 h-3 ${i < cups ? "text-blue-300" : "text-muted-foreground/40"}`}
              />
            </div>
          ))}
        </div>

        <Progress value={pct} className="h-1.5" />
        {cups >= WATER_GOAL ? (
          <p className="text-xs text-green-400 mt-2">Hydration goal hit. Keep sipping.</p>
        ) : (
          <p className="text-xs text-muted-foreground mt-2">
            {WATER_GOAL - cups} more cup{WATER_GOAL - cups === 1 ? "" : "s"} to hit your daily goal.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
