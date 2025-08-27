import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import BottomNavigation from "@/components/bottom-navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { User, MapPin, Phone, Mail, Star, Shield, CreditCard, Settings } from "lucide-react";
import type { User as UserType } from "@shared/schema";

export default function Profile() {
  const { data: user, isLoading } = useQuery<UserType>({
    queryKey: ["/api/user"],
  });

  if (isLoading) {
    return (
      <div className="max-w-sm mx-auto bg-background min-h-screen relative">
        <Header />
        <div className="p-4 pb-20">
          <div className="text-center mb-6">
            <Skeleton className="w-20 h-20 rounded-full mx-auto mb-4" />
            <Skeleton className="h-6 w-32 mx-auto mb-2" />
            <Skeleton className="h-4 w-24 mx-auto" />
          </div>
          <Card>
            <CardContent className="p-4 space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </CardContent>
          </Card>
        </div>
        <BottomNavigation currentPage="profile" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-sm mx-auto bg-background min-h-screen relative">
        <Header />
        <div className="p-4 pb-20">
          <div className="text-center py-12" data-testid="no-user">
            <p className="text-muted-foreground">User not found</p>
          </div>
        </div>
        <BottomNavigation currentPage="profile" />
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto bg-background min-h-screen relative">
      <Header />
      
      <div className="p-4 pb-20">
        {/* Profile Header */}
        <div className="text-center mb-6">
          <Avatar className="w-20 h-20 mx-auto mb-4" data-testid="avatar-user">
            <AvatarFallback className="text-2xl font-semibold bg-primary text-primary-foreground">
              {user.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <h1 className="text-xl font-bold text-foreground" data-testid="text-username">
            {user.username}
          </h1>
          <div className="flex items-center justify-center space-x-2 mt-2">
            {user.isVerified && (
              <div className="flex items-center space-x-1 text-green-600" data-testid="status-verified">
                <Shield className="h-4 w-4" />
                <span className="text-sm font-medium">Verified</span>
              </div>
            )}
          </div>
        </div>

        {/* Points Balance */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Available Points</p>
                <p className="text-2xl font-bold text-primary" data-testid="text-points-balance">
                  {user.pointsBalance}
                </p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        {/* Profile Information */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold text-foreground mb-4">Personal Information</h2>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Username</p>
                  <p className="font-medium text-foreground" data-testid="info-username">{user.username}</p>
                </div>
              </div>
              
              {user.email && (
                <>
                  <Separator />
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium text-foreground" data-testid="info-email">{user.email}</p>
                    </div>
                  </div>
                </>
              )}
              
              {user.phoneNumber && (
                <>
                  <Separator />
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium text-foreground" data-testid="info-phone">{user.phoneNumber}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
            
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start" data-testid="button-payment-methods">
                <CreditCard className="mr-3 h-4 w-4" />
                Payment Methods
              </Button>
              
              <Button variant="outline" className="w-full justify-start" data-testid="button-addresses">
                <MapPin className="mr-3 h-4 w-4" />
                Saved Addresses
              </Button>
              
              <Button variant="outline" className="w-full justify-start" data-testid="button-settings">
                <Settings className="mr-3 h-4 w-4" />
                Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <BottomNavigation currentPage="profile" />
    </div>
  );
}
