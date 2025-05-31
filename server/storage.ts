import { 
  experiences, 
  timeSlots, 
  packages, 
  bookings,
  type Experience, 
  type TimeSlot, 
  type Package, 
  type Booking,
  type InsertExperience, 
  type InsertTimeSlot, 
  type InsertPackage, 
  type InsertBooking 
} from "@shared/schema";
import { db } from "./db";
import { eq, like, or } from "drizzle-orm";

export interface IStorage {
  // Experiences
  getExperiences(): Promise<Experience[]>;
  getExperienceById(id: number): Promise<Experience | undefined>;
  getExperiencesByCategory(category: string): Promise<Experience[]>;
  searchExperiences(query: string): Promise<Experience[]>;
  createExperience(experience: InsertExperience): Promise<Experience>;

  // Time Slots
  getTimeSlotsByExperienceId(experienceId: number): Promise<TimeSlot[]>;
  createTimeSlot(timeSlot: InsertTimeSlot): Promise<TimeSlot>;

  // Packages
  getPackagesByExperienceId(experienceId: number): Promise<Package[]>;
  createPackage(pkg: InsertPackage): Promise<Package>;

  // Bookings
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBookingById(id: string): Promise<Booking | undefined>;
  getBookingsByEmail(email: string): Promise<Booking[]>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    // Initialize with seed data if needed
    this.seedData();
  }

  private async seedData() {
    try {
      // Check if data already exists
      const existingExperiences = await db.select().from(experiences).limit(1);
      if (existingExperiences.length > 0) {
        return; // Data already seeded
      }

      // Seed experiences
      const experiencesData = [
        {
          title: "Traditional Kathak Dance Class",
          description: "Immerse yourself in the rhythmic world of Kathak, one of India's most graceful classical dance forms. In this beginner-friendly session, you'll learn the fundamental footwork, hand gestures, and expressions that make Kathak so captivating. Our experienced instructor will guide you through a traditional routine, sharing cultural insights along the way.",
          location: "Shivpuri Colony, Varanasi",
          hostName: "Meera Sharma",
          hostBio: "Professional Kathak dancer for 15+ years",
          hostAvatar: "https://images.unsplash.com/photo-1494790108755-2616c6106130?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150",
          imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
          category: "Dance",
          price: 59900,
          duration: 120,
          rating: "4.8",
          reviewCount: 124,
        },
        {
          title: "Authentic Banarasi Cooking",
          description: "Learn the secrets of traditional Banarasi cuisine with our expert chef. This hands-on cooking class will teach you to prepare authentic local dishes using traditional techniques and spices.",
          location: "Old City, Varanasi",
          hostName: "Chef Rajesh Kumar",
          hostBio: "Master chef specializing in Banarasi cuisine for 20+ years",
          hostAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150",
          imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
          category: "Food",
          price: 79900,
          duration: 180,
          rating: "4.9",
          reviewCount: 87,
        }
      ];

      const insertedExperiences = await db.insert(experiences).values(experiencesData).returning();

      // Seed time slots
      const timeSlotsData = [
        { experienceId: insertedExperiences[0].id, name: "Morning", startTime: "10:00", endTime: "12:00" },
        { experienceId: insertedExperiences[0].id, name: "Afternoon", startTime: "02:00", endTime: "04:00" },
        { experienceId: insertedExperiences[0].id, name: "Evening", startTime: "05:00", endTime: "07:00" },
        { experienceId: insertedExperiences[0].id, name: "Night", startTime: "07:30", endTime: "09:30" },
        { experienceId: insertedExperiences[1].id, name: "Morning", startTime: "09:00", endTime: "12:00" },
        { experienceId: insertedExperiences[1].id, name: "Evening", startTime: "05:00", endTime: "08:00" },
      ];

      await db.insert(timeSlots).values(timeSlotsData);

      // Seed packages
      const packagesData = [
        { experienceId: insertedExperiences[0].id, name: "Single Session", description: "One-time experience", sessions: 1, price: 59900, discount: 0 },
        { experienceId: insertedExperiences[0].id, name: "3 Sessions", description: "Save 10%", sessions: 3, price: 161730, discount: 10 },
        { experienceId: insertedExperiences[1].id, name: "Single Session", description: "One-time experience", sessions: 1, price: 79900, discount: 0 },
      ];

      await db.insert(packages).values(packagesData);
    } catch (error) {
      console.error("Error seeding data:", error);
    }
  }

  async getExperiences(): Promise<Experience[]> {
    return await db.select().from(experiences).where(eq(experiences.isActive, true));
  }

  async getExperienceById(id: number): Promise<Experience | undefined> {
    const [experience] = await db.select().from(experiences).where(eq(experiences.id, id));
    return experience || undefined;
  }

  async getExperiencesByCategory(category: string): Promise<Experience[]> {
    return await db.select().from(experiences)
      .where(eq(experiences.category, category))
      .where(eq(experiences.isActive, true));
  }

  async searchExperiences(query: string): Promise<Experience[]> {
    const lowerQuery = `%${query.toLowerCase()}%`;
    return await db.select().from(experiences)
      .where(
        or(
          like(experiences.title, lowerQuery),
          like(experiences.description, lowerQuery),
          like(experiences.location, lowerQuery),
          like(experiences.category, lowerQuery)
        )
      )
      .where(eq(experiences.isActive, true));
  }

  async createExperience(insertExperience: InsertExperience): Promise<Experience> {
    const [experience] = await db.insert(experiences).values(insertExperience).returning();
    return experience;
  }

  async getTimeSlotsByExperienceId(experienceId: number): Promise<TimeSlot[]> {
    return await db.select().from(timeSlots)
      .where(eq(timeSlots.experienceId, experienceId))
      .where(eq(timeSlots.isAvailable, true));
  }

  async createTimeSlot(insertTimeSlot: InsertTimeSlot): Promise<TimeSlot> {
    const [timeSlot] = await db.insert(timeSlots).values(insertTimeSlot).returning();
    return timeSlot;
  }

  async getPackagesByExperienceId(experienceId: number): Promise<Package[]> {
    return await db.select().from(packages).where(eq(packages.experienceId, experienceId));
  }

  async createPackage(insertPackage: InsertPackage): Promise<Package> {
    const [pkg] = await db.insert(packages).values(insertPackage).returning();
    return pkg;
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const bookingId = `LK${new Date().toISOString().slice(2, 10).replace(/-/g, '')}${String(Date.now()).slice(-3)}`;
    const bookingData = {
      ...insertBooking,
      bookingId,
    };
    const [booking] = await db.insert(bookings).values(bookingData).returning();
    return booking;
  }

  async getBookingById(bookingId: string): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.bookingId, bookingId));
    return booking || undefined;
  }

  async getBookingsByEmail(email: string): Promise<Booking[]> {
    return await db.select().from(bookings).where(eq(bookings.email, email));
  }
}

export const storage = new DatabaseStorage();
