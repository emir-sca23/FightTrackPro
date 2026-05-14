import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@workspace/replit-auth-web";
import { Home, Activity, TrendingUp, User, LogOut, Play, Utensils, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/workouts", label: "Workouts", icon: Activity },
    { href: "/meals", label: "Meals", icon: Utensils },
    { href: "/progress", label: "Progress", icon: TrendingUp },
    { href: "/profile", label: "Profile", icon: User },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-card border-b md:border-b-0 md:border-r border-border flex flex-col shrink-0 sticky top-0 z-50 h-auto md:h-screen">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
            <Activity className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="font-bold text-xl tracking-tight text-foreground uppercase italic">FightTrack</h1>
        </div>

        <nav className="flex-1 px-4 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-4 md:pb-0">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-sm font-medium whitespace-nowrap",
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto hidden md:block">
          <Link href="/workouts/play" className="w-full block">
            <Button className="w-full gap-2 font-bold uppercase tracking-wider" size="lg" data-testid="nav-start-workout">
              <Play className="w-4 h-4" />
              Start Workout
            </Button>
          </Link>
        </div>

        <div className="p-4 border-t border-border hidden md:block">
          <div className="flex items-center gap-3 mb-4 px-2">
            {user?.profileImageUrl ? (
              <img src={user.profileImageUrl} alt="Profile" className="w-8 h-8 rounded-full" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs">
                {user?.firstName?.[0] || "?"}
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-sm font-medium leading-none">{user?.firstName} {user?.lastName}</span>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground" onClick={() => logout()} data-testid="btn-logout">
            <LogOut className="w-4 h-4" />
            Sign out
          </Button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 pb-20 md:pb-0">
        {children}
      </main>
      
      {/* Mobile bottom bar for "start workout" action since it's hidden in the sidebar on mobile */}
      <div className="md:hidden fixed bottom-4 right-4 z-50">
        <Link href="/workouts/play">
          <Button size="icon" className="h-14 w-14 rounded-full shadow-lg" data-testid="mobile-start-workout">
            <Play className="w-6 h-6" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
