import { useAuth } from "@workspace/replit-auth-web";
import { Redirect } from "wouter";
import { Button } from "@/components/ui/button";
import { Activity, Zap, BarChart2, Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function Landing() {
  const { isAuthenticated, isLoading, login } = useAuth();

  if (isLoading) return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  if (isAuthenticated) return <Redirect to="/dashboard" />;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col overflow-hidden relative">
      {/* Abstract Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-destructive/10 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-4 py-6 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-2">
          <Activity className="text-primary w-6 h-6" />
          <span className="font-bold text-xl uppercase italic tracking-tight">FightTrack Pro</span>
        </div>
        <Button variant="outline" onClick={() => login()} data-testid="btn-login-top">
          Log in
        </Button>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center px-4 relative z-10 text-center max-w-4xl mx-auto mt-12 md:mt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-6 border border-border">
            <Zap className="w-4 h-4 text-primary" />
            Built for Combat Athletes
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9] mb-6">
            Track Your Craft <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-destructive">Like a Pro</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Stop using generic gym trackers. FightTrack is built for the cage and the ring. Log intensity, track weight cuts, and monitor your conditioning.
          </p>
          <Button 
            size="lg" 
            className="text-lg px-8 py-6 uppercase font-bold tracking-wider"
            onClick={() => login()}
            data-testid="btn-login-hero"
          >
            Start Tracking
          </Button>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 pb-20 w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-card/50 backdrop-blur border border-card-border p-6 rounded-xl text-left">
            <Activity className="w-8 h-8 text-primary mb-4" />
            <h3 className="font-bold text-lg mb-2 uppercase">Intensity Tracking</h3>
            <p className="text-muted-foreground text-sm">Log your rounds, time on the bag, and perceived intensity to avoid overtraining before a camp.</p>
          </div>
          <div className="bg-card/50 backdrop-blur border border-card-border p-6 rounded-xl text-left">
            <BarChart2 className="w-8 h-8 text-primary mb-4" />
            <h3 className="font-bold text-lg mb-2 uppercase">Weight Cuts</h3>
            <p className="text-muted-foreground text-sm">Monitor your weight trends and automatically determine your fighting category.</p>
          </div>
          <div className="bg-card/50 backdrop-blur border border-card-border p-6 rounded-xl text-left">
            <Shield className="w-8 h-8 text-primary mb-4" />
            <h3 className="font-bold text-lg mb-2 uppercase">Discipline Stats</h3>
            <p className="text-muted-foreground text-sm">Break down your time between striking, grappling, strength, and conditioning.</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
