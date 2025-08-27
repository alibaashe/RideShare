import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, History, HelpCircle, User } from "lucide-react";

interface BottomNavigationProps {
  currentPage: string;
}

export default function BottomNavigation({ currentPage }: BottomNavigationProps) {
  const [location] = useLocation();

  const navItems = [
    { id: "home", path: "/", label: "Home", icon: Home },
    { id: "history", path: "/history", label: "History", icon: History },
    { id: "help", path: "/help", label: "Help", icon: HelpCircle },
    { id: "profile", path: "/profile", label: "Profile", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-card border-t border-border" data-testid="bottom-navigation">
      <div className="flex items-center justify-around py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          
          return (
            <Link key={item.id} href={item.path}>
              <Button
                variant="ghost"
                className={`flex flex-col items-center space-y-1 h-auto py-2 px-3 ${
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-primary"
                }`}
                data-testid={`nav-${item.id}`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
