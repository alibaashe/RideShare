import type { Express } from "express";
import passport from "passport";
import { storage } from "../storage";
import { requireAuth, optionalAuth, getCurrentUser } from "../middleware/auth";
import { validateBody } from "../middleware/validation";
import { insertUserSchema } from "@shared/schema";
import { z } from "zod";

export function setupAuthRoutes(app: Express) {
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
      phoneNumber: z.string().regex(/^(?:\+252|252|0)?[1-9][0-9]{7,8}$/, "Please enter a valid Somalia phone number"),
      password: z.string().min(1, "Password is required")
    })),
    async (req, res) => {
      try {
        let { phoneNumber, password } = req.body;
        
        // Normalize Somalia phone number to +252 format
        if (phoneNumber.startsWith('0')) {
          phoneNumber = '+252' + phoneNumber.substring(1);
        } else if (phoneNumber.startsWith('252')) {
          phoneNumber = '+' + phoneNumber;
        } else if (!phoneNumber.startsWith('+252')) {
          phoneNumber = '+252' + phoneNumber;
        }

        // Find user by phone number instead of username
        const user = await storage.getUserByPhoneNumber(phoneNumber);
        if (!user) {
          return res.status(401).json({ message: "Invalid phone number or password" });
        }

        // Verify password
        const bcrypt = require('bcrypt');
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          return res.status(401).json({ message: "Invalid phone number or password" });
        }

        // Create session (manual session management since we're not using passport for this)
        (req.session as any).userId = user.id;
        
        const { password: _, ...userWithoutPassword } = user;
        res.json({ 
          message: "Login successful", 
          user: userWithoutPassword 
        });
      } catch (error) {
        console.error('Login error:', error);
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
      
      // If no authenticated user, return demo user
      if (!user) {
        user = {
          id: "demo-user",
          username: "demo_user",
          email: "demo@example.com",
          phoneNumber: "+252612345678",
          pointsBalance: "150.00",
          isVerified: true,
          createdAt: new Date(),
          password: ""
        };
      }

      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error('Error getting user:', error);
      res.status(500).json({ message: "Failed to get user" });
    }
  });
}