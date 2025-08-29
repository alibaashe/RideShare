import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Car, Utensils } from "lucide-react";
import { format } from "date-fns";
import type { Ride } from "@shared/schema";

export default function RecentRides() {
  const { data: rides, isLoading } = useQuery<Ride[]>({
    queryKey: ["/api/rides"],
  });

  const getServiceIcon = (serviceType: string) => {
    switch (serviceType.toLowerCase()) {
      case 'food':
        return <Utensils className="h-5 w-5 text-secondary" />;
      default:
        return <Car className="h-5 w-5 text-primary" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'text-green-600';
      case 'delivered':
        return 'text-green-600';
      case 'cancelled':
        return 'text-red-600';
      default:
        return 'text-yellow-600';
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const rideDate = new Date(date);
    const diffInHours = (now.getTime() - rideDate.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return `Today, ${format(rideDate, 'h:mm a')}`;
    } else if (diffInHours < 48) {
      return `Yesterday, ${format(rideDate, 'h:mm a')}`;
    } else {
      return format(rideDate, 'MMM d, h:mm a');
    }
  };

  return (
    <div className="px-4 pb-20">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">Recent Rides</h2>
        <Button variant="link" className="text-primary text-sm font-medium p-0 h-auto" data-testid="button-view-all">
          View All
        </Button>
      </div>
      
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <div className="text-right">
                    <Skeleton className="h-4 w-12 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : rides && rides.length > 0 ? (
        <div className="space-y-3" data-testid="rides-list">
          {rides.slice(0, 3).map((ride) => (
            <Card key={ride.id} data-testid={`ride-card-${ride.id}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      {getServiceIcon(ride.serviceType)}
                    </div>
                    <div>
                      <p className="font-medium text-foreground" data-testid={`ride-destination-${ride.id}`}>
                        {ride.destination}
                      </p>
                      <p className="text-sm text-muted-foreground" data-testid={`ride-date-${ride.id}`}>
                        {formatDate(ride.date)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground" data-testid={`ride-amount-${ride.id}`}>
                      ${ride.amount}
                    </p>
                    <p className={`text-xs ${getStatusColor(ride.status)} capitalize`} data-testid={`ride-status-${ride.id}`}>
                      {ride.status}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12" data-testid="no-rides">
          <p className="text-muted-foreground">No recent rides found</p>
        </div>
      )}
    </div>
  );
}
