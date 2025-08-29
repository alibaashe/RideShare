import type { Express } from "express";
import passport from "passport";
import { storage } from "../storage";
import { requireAuth, optionalAuth, getCurrentUser } from "../middleware/auth";
import { validateBody } from "../middleware/validation";
import { insertUserSchema } from "@shared/schema";
import { normalizeSomaliPhoneNumber } from "@shared/utils";
import { z } from "zod";
import bcrypt from 'bcrypt';

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
    (req, res, next) => {
      // We need to normalize the phone number before passing it to passport
      req.body.phoneNumber = normalizeSomaliPhoneNumber(req.body.phoneNumber); // Update the request body for passport

      passport.authenticate('local', (err: Error, user: any, info: any) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.status(401).json({ message: info.message || 'Login failed' });
        }
        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }
          const { password, ...userWithoutPassword } = user;
          return res.json({
            message: "Login successful",
            user: userWithoutPassword,
          });
        });
      })(req, res, next);
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