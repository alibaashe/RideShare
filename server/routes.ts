import type { Express } from "express";
import { createServer, type Server } from "http";
import { 
  setupAuthRoutes,
  setupServicesRoutes,
  setupBookingsRoutes,
  setupRidesRoutes
} from "./controllers";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup all route controllers
  setupAuthRoutes(app);
  setupServicesRoutes(app);
  setupBookingsRoutes(app);
  setupRidesRoutes(app);

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
  });

  // Create HTTP server without WebSocket to avoid conflicts
  const server = createServer(app);
  
  return server;
}