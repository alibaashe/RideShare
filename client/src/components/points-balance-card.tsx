import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle } from "lucide-react";
import type { User } from "@shared/schema";

export default function PointsBalanceCard() {
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["/api/user"],
  });

  if (isLoading) {
    return (
      <div className="p-4">
        <Card className="bg-gradient-to-r from-primary to-teal-600 text-primary-foreground p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Points Balance</p>
              <Skeleton className="h-8 w-20 bg-white/20 mt-1" />
            </div>
            <Skeleton className="h-8 w-24 bg-white/20 rounded-full" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Card className="bg-gradient-to-r from-primary to-teal-600 text-primary-foreground p-6 rounded-2xl shadow-lg" data-testid="card-points-balance">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Points Balance</p>
            <p className="text-3xl font-bold" data-testid="text-points-value">
              {user?.pointsBalance || "0.0"}
            </p>
          </div>
          {user?.isVerified && (
            <div className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full" data-testid="verification-badge">
              <CheckCircle className="h-4 w-4 text-green-300" />
              <span className="text-sm font-medium">Verified</span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
