import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBookingSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all experiences
  app.get("/api/experiences", async (req, res) => {
    try {
      const experiences = await storage.getExperiences();
      res.json(experiences);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch experiences" });
    }
  });

  // Search experiences - must come before /:id route
  app.get("/api/experiences/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      const category = req.query.category as string;

      let experiences;
      if (category) {
        experiences = await storage.getExperiencesByCategory(category);
      } else if (query) {
        experiences = await storage.searchExperiences(query);
      } else {
        experiences = await storage.getExperiences();
      }

      res.json(experiences);
    } catch (error) {
      res.status(500).json({ message: "Failed to search experiences" });
    }
  });

  // Get experience by ID
  app.get("/api/experiences/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid experience ID" });
      }

      const experience = await storage.getExperienceById(id);
      if (!experience) {
        return res.status(404).json({ message: "Experience not found" });
      }

      res.json(experience);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch experience" });
    }
  });



  // Get time slots for an experience
  app.get("/api/experiences/:id/timeslots", async (req, res) => {
    try {
      const experienceId = parseInt(req.params.id);
      if (isNaN(experienceId)) {
        return res.status(400).json({ message: "Invalid experience ID" });
      }

      const timeSlots = await storage.getTimeSlotsByExperienceId(experienceId);
      res.json(timeSlots);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch time slots" });
    }
  });

  // Get packages for an experience
  app.get("/api/experiences/:id/packages", async (req, res) => {
    try {
      const experienceId = parseInt(req.params.id);
      if (isNaN(experienceId)) {
        return res.status(400).json({ message: "Invalid experience ID" });
      }

      const packages = await storage.getPackagesByExperienceId(experienceId);
      res.json(packages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch packages" });
    }
  });

  // Create booking
  app.post("/api/bookings", async (req, res) => {
    try {
      const validatedData = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(validatedData);
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid booking data", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to create booking" });
    }
  });

  // Get booking by ID
  app.get("/api/bookings/:id", async (req, res) => {
    try {
      const bookingId = req.params.id;
      const booking = await storage.getBookingById(bookingId);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch booking" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
