import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Service } from "@shared/schema";

interface ServicesGridProps {
  onServiceSelect: (serviceId: string) => void;
}

const serviceImages = {
  "service-bajaj": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
  "service-taxi": "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
  "service-bus": "https://images.unsplash.com/photo-1570125909517-53cb21c89ff2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
  "service-business": "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
  "service-delivery": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
  "service-parcel": "https://images.unsplash.com/photo-1556139943-4bdca53adf1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
  "service-gas": "https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
  "service-food": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
};

export default function ServicesGrid({ onServiceSelect }: ServicesGridProps) {
  const { data: services, isLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  if (isLoading) {
    return (
      <div className="px-4 pb-4">
        <h2 className="text-xl font-semibold text-foreground mb-4">Services</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Card key={i} className="p-6">
              <div className="flex flex-col items-center space-y-3">
                <Skeleton className="w-16 h-16 rounded-full" />
                <Skeleton className="h-4 w-16" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!services || services.length === 0) {
    return (
      <div className="px-4 pb-4">
        <h2 className="text-xl font-semibold text-foreground mb-4">Services</h2>
        <div className="text-center py-12" data-testid="no-services">
          <p className="text-muted-foreground">No services available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pb-4">
      <h2 className="text-xl font-semibold text-foreground mb-4">Services</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6" data-testid="services-grid">
        {services.map((service) => (
          <Card
            key={service.id}
            className="service-card bg-card rounded-2xl p-6 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onServiceSelect(service.id)}
            data-testid={`service-card-${service.id}`}
          >
            <div className="flex flex-col items-center space-y-3">
              <img
                src={serviceImages[service.id as keyof typeof serviceImages] || "/api/placeholder/200/200"}
                alt={`${service.name} service`}
                className="w-16 h-16 rounded-full object-cover"
                data-testid={`service-image-${service.id}`}
              />
              <span className="font-medium text-foreground" data-testid={`service-name-${service.id}`}>
                {service.name}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Service Cars - Full width */}
      <Card
        className="service-card bg-card rounded-2xl p-6 shadow-sm cursor-pointer hover:shadow-md transition-shadow mb-6"
        onClick={() => onServiceSelect("service-cars")}
        data-testid="service-card-service-cars"
      >
        <div className="flex items-center space-x-4">
          <img
            src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200"
            alt="Car service center"
            className="w-16 h-16 rounded-full object-cover"
            data-testid="service-image-service-cars"
          />
          <div>
            <h3 className="font-semibold text-foreground" data-testid="service-name-service-cars">Service Cars</h3>
            <p className="text-sm text-muted-foreground">Professional car maintenance</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
