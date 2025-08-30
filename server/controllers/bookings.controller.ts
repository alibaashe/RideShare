import type { Express } from "express";
import { storage } from "../storage";
import { optionalAuth, getCurrentUser } from "../middleware/auth";
import { validateBody, validateParams } from "../middleware/validation";
import { insertBookingSchema } from "@shared/schema";
import { z } from "zod";

export function setupBookingsRoutes(app: Express) {
  // Create booking
  app.post("/api/bookings", 
    optionalAuth,
    validateBody(insertBookingSchema.omit({ userId: true })),
    async (req, res) => {
      try {
        const user = getCurrentUser(req);
        const userId = user?.id || "demo-user";

        const bookingData = {
          ...req.body,
          userId,
        };

        const booking = await storage.createBooking(bookingData);
        res.status(201).json(booking);
      } catch (error) {
        console.error('Booking creation error:', error);
        res.status(500).json({ message: "Failed to create booking" });
      }
    }
  );

  // Get user bookings
  app.get("/api/bookings", optionalAuth, async (req, res) => {
    try {
      const user = getCurrentUser(req);
      const userId = user?.id || "demo-user";
      
      const bookings = await storage.getUserBookings(userId);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to get bookings" });
    }
  });

  // Get specific booking
  app.get("/api/bookings/:id",
    optionalAuth,
    validateParams(z.object({ id: z.string() })),
    async (req, res) => {
      try {
        const user = getCurrentUser(req);
        const userId = user?.id || "demo-user";
        
        const booking = await storage.getBooking(req.params.id);
        if (!booking) {
          return res.status(404).json({ message: "Booking not found" });
        }
        
        // Ensure user can only access their own bookings
        if (booking.userId !== userId) {
          return res.status(403).json({ message: "Access denied" });
        }
        
        res.json(booking);
      } catch (error) {
        res.status(500).json({ message: "Failed to get booking" });
      }
    }
  );
}