import type { Express } from "express";
import { storage } from "../storage";
import { optionalAuth, getCurrentUser } from "../middleware/auth";
import { validateBody, validateParams } from "../middleware/validation";
import { insertRideSchema } from "@shared/schema";
import { z } from "zod";

export function setupRidesRoutes(app: Express) {
  // Get user rides
  app.get("/api/rides", optionalAuth, async (req, res) => {
    try {
      const user = getCurrentUser(req);
      const userId = user?.id || "demo-user";
      
      const rides = await storage.getUserRides(userId);
      res.json(rides);
    } catch (error) {
      res.status(500).json({ message: "Failed to get rides" });
    }
  });

  // Create ride
  app.post("/api/rides", 
    optionalAuth,
    validateBody(insertRideSchema),
    async (req, res) => {
      try {
        const user = getCurrentUser(req);
        const userId = user?.id || "demo-user";

        const rideData = {
          ...req.body,
          userId,
        };

        const ride = await storage.createRide(rideData);
        res.status(201).json(ride);
      } catch (error) {
        console.error('Ride creation error:', error);
        res.status(500).json({ message: "Failed to create ride" });
      }
    }
  );

  // Get specific ride
  app.get("/api/rides/:id",
    optionalAuth,
    validateParams(z.object({ id: z.string() })),
    async (req, res) => {
      try {
        const user = getCurrentUser(req);
        const userId = user?.id || "demo-user";
        
        const ride = await storage.getRide(req.params.id);
        if (!ride) {
          return res.status(404).json({ message: "Ride not found" });
        }
        
        // Ensure user can only access their own rides
        if (ride.userId !== userId) {
          return res.status(403).json({ message: "Access denied" });
        }
        
        res.json(ride);
      } catch (error) {
        res.status(500).json({ message: "Failed to get ride" });
      }
    }
  );
}