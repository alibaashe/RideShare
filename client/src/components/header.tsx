import { Button } from "@/components/ui/button";
import { Menu, Bell } from "lucide-react";

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-card shadow-sm" data-testid="header">
      <Button variant="ghost" size="icon" data-testid="button-menu">
        <Menu className="h-5 w-5" />
      </Button>
      
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center" data-testid="logo">
          <svg className="w-4 h-4 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
          </svg>
        </div>
        <h1 className="text-lg font-semibold text-foreground" data-testid="text-app-title">Sombeder Service</h1>
      </div>
      
      <Button variant="ghost" size="icon" className="relative" data-testid="button-notifications">
        <Bell className="h-5 w-5" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full" data-testid="notification-dot"></span>
      </Button>
    </header>
  );
}
