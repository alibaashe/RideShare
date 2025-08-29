import type { Express } from "express";
import { storage } from "../storage";
import { validateParams } from "../middleware/validation";
import { z } from "zod";

export function setupServicesRoutes(app: Express) {
  // Get all services
  app.get("/api/services", async (req, res) => {
    try {
      const services = await storage.getAllServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Failed to get services" });
    }
  });

  // Get specific service
  app.get("/api/services/:id", 
    validateParams(z.object({ id: z.string() })),
    async (req, res) => {
      try {
        const service = await storage.getService(req.params.id);
        if (!service) {
          return res.status(404).json({ message: "Service not found" });
        }
        res.json(service);
      } catch (error) {
        res.status(500).json({ message: "Failed to get service" });
      }
    }
  );
}