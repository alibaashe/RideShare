import { useState } from "react";
import Header from "@/components/header";
import PointsBalanceCard from "@/components/points-balance-card";
import ServicesGrid from "@/components/services-grid";
import PromotionCard from "@/components/promotion-card";
import RecentRides from "@/components/recent-rides";
import BottomNavigation from "@/components/bottom-navigation";
import BookingModal from "@/components/booking-modal";

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
