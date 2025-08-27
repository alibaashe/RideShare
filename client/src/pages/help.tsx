import Header from "@/components/header";
import BottomNavigation from "@/components/bottom-navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MessageCircle } from "lucide-react";

export default function Help() {
  return (
    <div className="max-w-sm mx-auto bg-background min-h-screen relative">
      <Header />
      
      <div className="p-4 pb-20">
        <h1 className="text-2xl font-bold text-foreground mb-6">Help & Support</h1>
        
        {/* Contact Options */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Contact Us</h2>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start" data-testid="button-call-support">
              <Phone className="mr-3 h-4 w-4" />
              Call Support: +1 (555) 123-4567
            </Button>
            <Button variant="outline" className="w-full justify-start" data-testid="button-email-support">
              <Mail className="mr-3 h-4 w-4" />
              Email: support@sombeder.com
            </Button>
            <Button variant="outline" className="w-full justify-start" data-testid="button-chat-support">
              <MessageCircle className="mr-3 h-4 w-4" />
              Live Chat (9 AM - 9 PM)
            </Button>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Frequently Asked Questions</h2>
          <Card>
            <CardContent className="p-0">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="px-4">How do I book a ride?</AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    Simply select your preferred service from the home screen, enter your pickup and destination locations, choose your preferred time, and confirm your booking. You'll receive a confirmation once your ride is booked.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger className="px-4">How do points work?</AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    You earn points with every completed ride or service. These points can be used to get discounts on future bookings. 1 point = $0.01 discount. Points never expire!
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger className="px-4">Can I cancel my booking?</AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    Yes, you can cancel your booking up to 5 minutes before the scheduled pickup time. Cancellations made within 5 minutes may incur a small fee.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger className="px-4">What payment methods are accepted?</AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    We accept all major credit cards, debit cards, digital wallets, and points. You can also combine points with other payment methods for partial payments.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5">
                  <AccordionTrigger className="px-4">How do I track my ride?</AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    Once your booking is confirmed, you'll be able to track your driver's location in real-time through the app. You'll also receive SMS updates about your ride status.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>

        {/* Safety */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Safety & Security</h2>
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>• All drivers are background checked and verified</p>
                <p>• Share trip details with family and friends</p>
                <p>• 24/7 customer support available</p>
                <p>• In-app emergency button for urgent situations</p>
                <p>• GPS tracking for all rides</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <BottomNavigation currentPage="help" />
    </div>
  );
}
