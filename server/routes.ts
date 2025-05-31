import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBookingSchema, insertUserSchema } from "@shared/schema";
import { z } from "zod";
import session from "express-session";
import connectPg from "connect-pg-simple";

// Session middleware
function setupSession(app: Express) {
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    ttl: 7 * 24 * 60 * 60, // 7 days
  });

  app.use(session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET || 'fallback-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      secure: false, // Set to true in production with HTTPS
    },
  }));
}

// Authentication middleware
function requireAuth(req: any, res: any, next: any) {
  if (req.session?.userId) {
    next();
  } else {
    res.status(401).json({ message: "Authentication required" });
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup session middleware
  setupSession(app);

  // Authentication routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const user = await storage.createUser(userData);
      
      // Set session
      (req.session as any).userId = user.id;
      (req.session as any).user = {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
      };

      res.status(201).json({
        message: "User created successfully",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
        }
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }

      const user = await storage.validateUserPassword(username, password);
      if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      // Set session
      (req.session as any).userId = user.id;
      (req.session as any).user = {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
      };

      res.json({
        message: "Login successful",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session?.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logout successful" });
    });
  });

  app.get("/api/auth/me", requireAuth, async (req, res) => {
    try {
      const userId = (req.session as any).userId;
      const user = await storage.getUserById(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        location: user.location,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

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

  // Get bookings by email
  app.get("/api/bookings/by-email/:email", async (req, res) => {
    try {
      const email = req.params.email;
      const bookings = await storage.getBookingsByEmail(email);
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching bookings by email:", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  // Get bookings for logged-in user
  app.get("/api/my-bookings", requireAuth, async (req, res) => {
    try {
      const userId = (req.session as any).userId;
      const bookings = await storage.getBookingsByUserId(userId);
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching user bookings:", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
