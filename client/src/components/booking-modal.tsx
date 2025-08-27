import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { MapPin, Flag, Clock, Calendar, CreditCard, Car } from "lucide-react";
import type { Service, User } from "@shared/schema";

interface BookingModalProps {
  serviceId: string;
  onClose: () => void;
}

export default function BookingModal({ serviceId, onClose }: BookingModalProps) {
  const [pickupLocation, setPickupLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [isScheduled, setIsScheduled] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: service } = useQuery<Service>({
    queryKey: ["/api/services", serviceId],
    enabled: false, // We'll get it from the services list
  });

  const { data: services } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  const { data: user } = useQuery<User>({
    queryKey: ["/api/user"],
  });

  const selectedService = services?.find(s => s.id === serviceId);

  const createBookingMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      const response = await apiRequest("POST", "/api/bookings", bookingData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Booking Confirmed",
        description: "Your ride has been successfully booked!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/rides"] });
      onClose();
    },
    onError: () => {
      toast({
        title: "Booking Failed",
        description: "Failed to create booking. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleBooking = () => {
    if (!selectedService) return;

    if (!pickupLocation.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a pickup location",
        variant: "destructive",
      });
      return;
    }

    if (selectedService.type === "transportation" && !destination.trim()) {
      toast({
        title: "Missing Information", 
        description: "Please enter a destination",
        variant: "destructive",
      });
      return;
    }

    const basePrice = parseFloat(selectedService.basePrice);
    const discount = isScheduled ? 3.00 : 0;
    const totalAmount = (basePrice - discount).toFixed(2);

    const bookingData = {
      serviceId: selectedService.id,
      pickupLocation: pickupLocation.trim(),
      destination: destination.trim() || selectedService.name,
      scheduledTime: isScheduled ? new Date(Date.now() + 60 * 60 * 1000) : new Date(), // 1 hour later if scheduled
      totalAmount,
      pointsUsed: "0.00",
      paymentMethod: "card",
      status: "pending",
    };

    createBookingMutation.mutate(bookingData);
  };

  if (!selectedService) {
    return null;
  }

  const basePrice = parseFloat(selectedService.basePrice);
  const discount = isScheduled ? 3.00 : 0;
  const finalPrice = basePrice - discount;

  const getServiceIcon = () => {
    switch (selectedService.icon) {
      case "motorcycle":
        return "🏍️";
      case "taxi":
        return "🚕";
      case "bus":
        return "🚌";
      case "car":
        return "🚗";
      case "box":
        return "📦";
      case "fire":
        return "🔥";
      case "utensils":
        return "🍽️";
      default:
        return "🚗";
    }
  };

  const getTitle = () => {
    switch (selectedService.type) {
      case "transportation":
        return `Book ${selectedService.name}`;
      case "delivery":
        return `Schedule ${selectedService.name}`;
      case "food":
        return `Order ${selectedService.name}`;
      default:
        return `Book ${selectedService.name}`;
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto max-h-[80vh] overflow-y-auto" data-testid="booking-modal">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2" data-testid="modal-title">
            <span className="text-2xl">{getServiceIcon()}</span>
            <span>{getTitle()}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Location Inputs */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="pickup" className="text-sm font-medium text-foreground">
                Pickup Location
              </Label>
              <div className="relative mt-2">
                <Input
                  id="pickup"
                  type="text"
                  placeholder="Enter pickup address"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="pl-10"
                  data-testid="input-pickup"
                />
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            {selectedService.type === "transportation" && (
              <div>
                <Label htmlFor="destination" className="text-sm font-medium text-foreground">
                  Destination
                </Label>
                <div className="relative mt-2">
                  <Input
                    id="destination"
                    type="text"
                    placeholder="Enter destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="pl-10"
                    data-testid="input-destination"
                  />
                  <Flag className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            )}
          </div>

          {/* Service Options */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">Service Options</h3>
            <div className="space-y-2">
              <Card 
                className={`cursor-pointer transition-colors ${!isScheduled ? 'border-primary bg-primary/5' : 'hover:border-primary'}`}
                onClick={() => setIsScheduled(false)}
                data-testid="option-now"
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">Now</p>
                        <p className="text-sm text-muted-foreground">Immediate pickup</p>
                      </div>
                    </div>
                    <span className="text-primary font-semibold" data-testid="price-now">
                      ${basePrice.toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className={`cursor-pointer transition-colors ${isScheduled ? 'border-primary bg-primary/5' : 'hover:border-primary'}`}
                onClick={() => setIsScheduled(true)}
                data-testid="option-schedule"
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">Schedule</p>
                        <p className="text-sm text-muted-foreground">Pick a time</p>
                      </div>
                    </div>
                    <span className="text-muted-foreground font-semibold" data-testid="price-schedule">
                      ${(basePrice - 3).toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">Payment Method</h3>
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-4 w-4 text-primary" />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Points + Card</p>
                    <p className="text-sm text-muted-foreground">
                      Use {Math.min(25, parseFloat(user?.pointsBalance || "0"))} points + ${(finalPrice - 0.25).toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Book Button */}
          <Button
            onClick={handleBooking}
            disabled={createBookingMutation.isPending}
            className="w-full bg-primary text-primary-foreground font-semibold py-4 rounded-xl hover:opacity-90 transition-opacity"
            data-testid="button-book-now"
          >
            <Car className="mr-2 h-4 w-4" />
            {createBookingMutation.isPending 
              ? "Booking..." 
              : `Book Now - $${finalPrice.toFixed(2)}`
            }
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
