import { useGetWeeklyWorkouts, useGetWorkoutTypeBreakdown } from "@workspace/api-client-react";
import { format, parseISO } from "date-fns";
import { 
  Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, 
  Tooltip, XAxis, YAxis, PieChart, Pie, Cell 
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function Progress() {
  const { data: weeklyData, isLoading: isLoadingWeekly } = useGetWeeklyWorkouts();
  const { data: typeBreakdown, isLoading: isLoadingTypes } = useGetWorkoutTypeBreakdown();

  const COLORS = ['#E11D48', '#FF6347', '#FF8C00', '#FFA500', '#FFD700', '#B8860B', '#808080'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border p-3 rounded-lg shadow-xl">
          <p className="font-bold mb-1">{label}</p>
          {payload.map((p: any, i: number) => (
            <p key={i} className="text-sm" style={{ color: p.color }}>
              {p.name}: {p.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const formattedWeekly = weeklyData?.map(d => ({
    ...d,
    formattedDate: format(parseISO(d.weekStart), 'MMM d'),
    hours: Number((d.totalMinutes / 60).toFixed(1))
  })) || [];

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-6xl mx-auto w-full">
      <h1 className="text-3xl font-black uppercase tracking-tight">Progress & Analytics</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-card border-card-border h-[400px] flex flex-col">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Volume Over Time (Hours)</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-0">
              {isLoadingWeekly ? (
                <Skeleton className="w-full h-full" />
              ) : formattedWeekly.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">Not enough data</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={formattedWeekly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.5}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis 
                      dataKey="formattedDate" 
                      tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} 
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} 
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="hours" 
                      name="Hours"
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorHours)" 
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-card border-card-border h-[400px] flex flex-col">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Discipline Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 flex items-center justify-center">
              {isLoadingTypes ? (
                <Skeleton className="w-[250px] h-[250px] rounded-full" />
              ) : !typeBreakdown || typeBreakdown.length === 0 ? (
                <div className="text-muted-foreground text-sm">Not enough data</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={typeBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={110}
                      paddingAngle={2}
                      dataKey="totalMinutes"
                      nameKey="type"
                      animationDuration={1500}
                    >
                      {typeBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [`${Math.floor(value/60)}h ${value%60}m`, 'Time']}
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      formatter={(value) => <span className="capitalize text-xs font-medium text-foreground">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
