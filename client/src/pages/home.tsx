import { useState } from "react";
import { Header, BottomNavigation } from "@/components/layout";
import { PointsBalanceCard, RecentRides } from "@/features/user";
import { ServicesGrid } from "@/features/services";
import { PromotionCard } from "@/features/shared";
import { BookingModal } from "@/features/bookings";

export default function Home() {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
  };

  const handleCloseModal = () => {
    setSelectedService(null);
  };

  return (
    <div className="max-w-sm mx-auto bg-background min-h-screen relative">
      <Header />
      <PointsBalanceCard />
      <ServicesGrid onServiceSelect={handleServiceSelect} />
      <PromotionCard />
      <RecentRides />
      <BottomNavigation currentPage="home" />
      
      {selectedService && (
        <BookingModal
          serviceId={selectedService}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
