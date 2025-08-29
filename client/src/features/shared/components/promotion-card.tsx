import { Card } from "@/components/ui/card";
import { Gift } from "lucide-react";

export default function PromotionCard() {
  return (
    <div className="px-4 pb-6">
      <Card className="bg-gradient-to-r from-accent to-orange-500 text-accent-foreground p-6 rounded-2xl shadow-lg" data-testid="card-promotion">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-sm font-medium opacity-90 mb-1" data-testid="text-promotion-label">Points Special!</h3>
            <h2 className="text-lg font-bold mb-2" data-testid="text-promotion-title">Get 5% points off all your rides</h2>
            <p className="text-sm opacity-90" data-testid="text-promotion-description">
              Use your points to get discounts on your rides and services.
            </p>
          </div>
          <Gift className="h-6 w-6 opacity-80" data-testid="icon-promotion" />
        </div>
      </Card>
    </div>
  );
}
