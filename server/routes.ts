import type { Express } from "express";
import { createServer, type Server } from "http";
import passport from "passport";
import { storage } from "./storage";
import { requireAuth, optionalAuth, getCurrentUser } from "./middleware/auth";
import { validateBody, validateParams, validateQuery } from "./middleware/validation";
import { insertBookingSchema, insertRideSchema, insertUserSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/register", validateBody(insertUserSchema), async (req, res) => {
    try {
      const { username, email } = req.body;
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
      
      const user = await storage.createUser(req.body);
      const { password, ...userWithoutPassword } = user;
      
      res.status(201).json({ 
        message: "User registered successfully", 
        user: userWithoutPassword 
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: "Failed to register user" });
    }
  });

  app.post("/api/auth/login", 
    validateBody(z.object({
      username: z.string().min(1, "Username is required"),
      password: z.string().min(1, "Password is required")
    })),
    passport.authenticate('local', { session: true }),
    async (req, res) => {
      try {
        const user = getCurrentUser(req);
        if (!user) {
          return res.status(401).json({ message: "Authentication failed" });
        }
        
        const { password, ...userWithoutPassword } = user;
        res.json({ 
          message: "Login successful", 
          user: userWithoutPassword 
        });
      } catch (error) {
        res.status(500).json({ message: "Login failed" });
      }
    }
  );

  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ message: "Session destruction failed" });
        }
        res.clearCookie('connect.sid');
        res.json({ message: "Logout successful" });
      });
    });
  });

  // Get current user - works for both authenticated and demo users
  app.get("/api/user", optionalAuth, async (req, res) => {
    try {
      let user = getCurrentUser(req);
      
      // Fallback to demo user if not authenticated (for demo purposes)
      if (!user) {
        user = await storage.getUser("user-1");
      }
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Update user profile
  app.patch("/api/user", requireAuth, validateBody(z.object({
    email: z.string().email().optional(),
    phoneNumber: z.string().optional(),
  })), async (req, res) => {
    try {
      const user = getCurrentUser(req);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      
      // TODO: Implement user update in storage interface
      res.json({ message: "Profile update not yet implemented" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update profile" });
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
  app.get("/api/rides", optionalAuth, async (req, res) => {
    try {
      let userId = getCurrentUser(req)?.id;
      
      // Fallback to demo user if not authenticated
      if (!userId) {
        userId = "user-1";
      }
      
      const rides = await storage.getUserRides(userId);
      res.json(rides);
    } catch (error) {
      console.error('Get rides error:', error);
      res.status(500).json({ message: "Failed to get rides" });
    }
  });

  // Create new booking
  app.post("/api/bookings", optionalAuth, validateBody(insertBookingSchema.omit({ userId: true })), async (req, res) => {
    try {
      let userId = getCurrentUser(req)?.id;
      
      // Fallback to demo user if not authenticated
      if (!userId) {
        userId = "user-1";
      }
      
      const bookingData = {
        ...req.body,
        userId,
      };
      
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
      
      res.status(201).json(booking);
    } catch (error) {
      console.error('Create booking error:', error);
      res.status(500).json({ message: "Failed to create booking" });
    }
  });

  // Get user bookings with pagination
  app.get("/api/bookings", optionalAuth, validateQuery(z.object({
    page: z.string().transform(Number).optional(),
    limit: z.string().transform(Number).optional(),
    status: z.string().optional()
  })), async (req, res) => {
    try {
      let userId = getCurrentUser(req)?.id;
      
      // Fallback to demo user if not authenticated
      if (!userId) {
        userId = "user-1";
      }
      
      const bookings = await storage.getUserBookings(userId);
      res.json(bookings);
    } catch (error) {
      console.error('Get bookings error:', error);
      res.status(500).json({ message: "Failed to get bookings" });
    }
  });

  // Update booking status
  app.patch("/api/bookings/:id", 
    optionalAuth,
    validateParams(z.object({ id: z.string().uuid() })),
    validateBody(z.object({ status: z.enum(["pending", "confirmed", "in_progress", "completed", "cancelled"]) })),
    async (req, res) => {
      try {
        const { id } = req.params;
        const { status } = req.body;
        
        // Check if booking exists and belongs to user
        const existingBooking = await storage.getBooking(id);
        if (!existingBooking) {
          return res.status(404).json({ message: "Booking not found" });
        }
        
        const currentUser = getCurrentUser(req);
        const userId = currentUser?.id || "user-1";
        
        if (existingBooking.userId !== userId) {
          return res.status(403).json({ message: "Access denied" });
        }
        
        const booking = await storage.updateBookingStatus(id, status);
        res.json(booking);
      } catch (error) {
        console.error('Update booking error:', error);
        res.status(500).json({ message: "Failed to update booking" });
      }
    }
  );

  // Get single booking
  app.get("/api/bookings/:id", 
    optionalAuth,
    validateParams(z.object({ id: z.string().uuid() })),
    async (req, res) => {
      try {
        const { id } = req.params;
        const booking = await storage.getBooking(id);
        
        if (!booking) {
          return res.status(404).json({ message: "Booking not found" });
        }
        
        const currentUser = getCurrentUser(req);
        const userId = currentUser?.id || "user-1";
        
        if (booking.userId !== userId) {
          return res.status(403).json({ message: "Access denied" });
        }
        
        res.json(booking);
      } catch (error) {
        console.error('Get booking error:', error);
        res.status(500).json({ message: "Failed to get booking" });
      }
    }
  );

  // Payment and Points routes
  app.post("/api/payments/process", 
    optionalAuth,
    validateBody(z.object({
      bookingId: z.string().uuid(),
      paymentMethod: z.enum(["card", "cash", "points"]),
      amount: z.string(),
      pointsUsed: z.string().optional()
    })),
    async (req, res) => {
      try {
        const { bookingId, paymentMethod, amount, pointsUsed } = req.body;
        
        // TODO: Implement payment processing logic
        res.json({ 
          message: "Payment processed successfully", 
          transactionId: `txn_${Date.now()}`,
          status: "completed"
        });
      } catch (error) {
        console.error('Payment processing error:', error);
        res.status(500).json({ message: "Payment processing failed" });
      }
    }
  );

  // Update user points
  app.patch("/api/user/points", 
    optionalAuth,
    validateBody(z.object({
      points: z.string(),
      operation: z.enum(["add", "subtract", "set"])
    })),
    async (req, res) => {
      try {
        const currentUser = getCurrentUser(req);
        const userId = currentUser?.id || "user-1";
        const { points, operation } = req.body;
        
        const user = await storage.getUser(userId);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        
        let newPoints: string;
        const currentPoints = parseFloat(user.pointsBalance);
        const pointsValue = parseFloat(points);
        
        switch (operation) {
          case "add":
            newPoints = (currentPoints + pointsValue).toFixed(2);
            break;
          case "subtract":
            newPoints = Math.max(0, currentPoints - pointsValue).toFixed(2);
            break;
          case "set":
            newPoints = pointsValue.toFixed(2);
            break;
        }
        
        const updatedUser = await storage.updateUserPoints(userId, newPoints);
        if (!updatedUser) {
          return res.status(500).json({ message: "Failed to update points" });
        }
        
        const { password, ...userWithoutPassword } = updatedUser;
        res.json(userWithoutPassword);
      } catch (error) {
        console.error('Update points error:', error);
        res.status(500).json({ message: "Failed to update points" });
      }
    }
  );

  const httpServer = createServer(app);
  return httpServer;
}
