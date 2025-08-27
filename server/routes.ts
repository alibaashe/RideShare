import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBookingSchema, insertRideSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get current user (demo user for now)
  app.get("/api/user", async (req, res) => {
    try {
      const user = await storage.getUser("user-1");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Get all services
  app.get("/api/services", async (req, res) => {
    try {
      const services = await storage.getAllServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Failed to get services" });
    }
  });

  // Get user rides
  app.get("/api/rides", async (req, res) => {
    try {
      const rides = await storage.getUserRides("user-1");
      res.json(rides);
    } catch (error) {
      res.status(500).json({ message: "Failed to get rides" });
    }
  });

  // Create new booking
  app.post("/api/bookings", async (req, res) => {
    try {
      const bookingData = insertBookingSchema.parse({
        ...req.body,
        userId: "user-1", // Demo user
      });
      
      const booking = await storage.createBooking(bookingData);
      
      // Also create a ride record
      const service = await storage.getService(booking.serviceId);
      if (service) {
        await storage.createRide({
          userId: booking.userId,
          serviceType: service.name,
          destination: booking.destination || "Unknown",
          amount: booking.totalAmount,
          status: "completed",
        });
      }
      
      res.json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid booking data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create booking" });
    }
  });

  // Get user bookings
  app.get("/api/bookings", async (req, res) => {
    try {
      const bookings = await storage.getUserBookings("user-1");
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to get bookings" });
    }
  });

  // Update booking status
  app.patch("/api/bookings/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      
      const booking = await storage.updateBookingStatus(id, status);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: "Failed to update booking" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
