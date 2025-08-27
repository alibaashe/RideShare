import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import BottomNavigation from "@/components/bottom-navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Booking } from "@shared/schema";

export default function History() {
  const { data: bookings, isLoading } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
  });

  return (
    <div className="max-w-sm mx-auto bg-background min-h-screen relative">
      <Header />
      
      <div className="p-4 pb-20">
        <h1 className="text-2xl font-bold text-foreground mb-6">Booking History</h1>
        
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2 mb-2" />
                  <Skeleton className="h-3 w-1/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : bookings && bookings.length > 0 ? (
          <div className="space-y-4" data-testid="bookings-list">
            {bookings.map((booking) => (
              <Card key={booking.id} data-testid={`booking-card-${booking.id}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-foreground" data-testid={`booking-destination-${booking.id}`}>
                        {booking.destination || "Service Booking"}
                      </p>
                      <p className="text-sm text-muted-foreground" data-testid={`booking-date-${booking.id}`}>
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize" data-testid={`booking-status-${booking.id}`}>
                        {booking.status}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground" data-testid={`booking-amount-${booking.id}`}>
                        ${booking.totalAmount}
                      </p>
                      {booking.pointsUsed !== "0.00" && (
                        <p className="text-xs text-green-600" data-testid={`booking-points-${booking.id}`}>
                          {booking.pointsUsed} points used
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12" data-testid="no-bookings">
            <p className="text-muted-foreground">No bookings found</p>
          </div>
        )}
      </div>
      
      <BottomNavigation currentPage="history" />
    </div>
  );
}
