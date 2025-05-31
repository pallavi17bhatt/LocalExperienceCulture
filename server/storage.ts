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

export class MemStorage implements IStorage {
  private experiences: Map<number, Experience>;
  private timeSlots: Map<number, TimeSlot>;
  private packages: Map<number, Package>;
  private bookings: Map<string, Booking>;
  private currentId: number;

  constructor() {
    this.experiences = new Map();
    this.timeSlots = new Map();
    this.packages = new Map();
    this.bookings = new Map();
    this.currentId = 1;
    this.seedData();
  }

  private seedData() {
    // Create sample experiences
    const kathakExperience: Experience = {
      id: 1,
      title: "Traditional Kathak Dance Class",
      description: "Immerse yourself in the rhythmic world of Kathak, one of India's most graceful classical dance forms. In this beginner-friendly session, you'll learn the fundamental footwork, hand gestures, and expressions that make Kathak so captivating. Our experienced instructor will guide you through a traditional routine, sharing cultural insights along the way.",
      location: "Shivpuri Colony, Varanasi",
      hostName: "Meera Sharma",
      hostBio: "Professional Kathak dancer for 15+ years",
      hostAvatar: "https://images.unsplash.com/photo-1494790108755-2616c6106130?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150",
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
      category: "Dance",
      price: 59900, // ₹599 in paise
      duration: 120, // 2 hours
      rating: "4.8",
      reviewCount: 124,
      isActive: true,
    };

    const cookingExperience: Experience = {
      id: 2,
      title: "Authentic Banarasi Cooking",
      description: "Learn the secrets of traditional Banarasi cuisine with our expert chef. This hands-on cooking class will teach you to prepare authentic local dishes using traditional techniques and spices.",
      location: "Old City, Varanasi",
      hostName: "Chef Rajesh Kumar",
      hostBio: "Master chef specializing in Banarasi cuisine for 20+ years",
      hostAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150",
      imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
      category: "Food",
      price: 79900, // ₹799 in paise
      duration: 180, // 3 hours
      rating: "4.9",
      reviewCount: 87,
      isActive: true,
    };

    this.experiences.set(1, kathakExperience);
    this.experiences.set(2, cookingExperience);

    // Create time slots for Kathak experience
    const timeSlotsData = [
      { id: 1, experienceId: 1, name: "Morning", startTime: "10:00", endTime: "12:00", isAvailable: true },
      { id: 2, experienceId: 1, name: "Afternoon", startTime: "02:00", endTime: "04:00", isAvailable: true },
      { id: 3, experienceId: 1, name: "Evening", startTime: "05:00", endTime: "07:00", isAvailable: true },
      { id: 4, experienceId: 1, name: "Night", startTime: "07:30", endTime: "09:30", isAvailable: true },
      { id: 5, experienceId: 2, name: "Morning", startTime: "09:00", endTime: "12:00", isAvailable: true },
      { id: 6, experienceId: 2, name: "Evening", startTime: "05:00", endTime: "08:00", isAvailable: true },
    ];

    timeSlotsData.forEach(slot => {
      this.timeSlots.set(slot.id, slot);
    });

    // Create packages
    const packagesData = [
      { id: 1, experienceId: 1, name: "Single Session", description: "One-time experience", sessions: 1, price: 59900, discount: 0 },
      { id: 2, experienceId: 1, name: "3 Sessions", description: "Save 10%", sessions: 3, price: 161730, discount: 10 },
      { id: 3, experienceId: 2, name: "Single Session", description: "One-time experience", sessions: 1, price: 79900, discount: 0 },
    ];

    packagesData.forEach(pkg => {
      this.packages.set(pkg.id, pkg);
    });

    this.currentId = 7;
  }

  async getExperiences(): Promise<Experience[]> {
    return Array.from(this.experiences.values()).filter(exp => exp.isActive);
  }

  async getExperienceById(id: number): Promise<Experience | undefined> {
    return this.experiences.get(id);
  }

  async getExperiencesByCategory(category: string): Promise<Experience[]> {
    return Array.from(this.experiences.values()).filter(
      exp => exp.isActive && exp.category.toLowerCase() === category.toLowerCase()
    );
  }

  async searchExperiences(query: string): Promise<Experience[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.experiences.values()).filter(
      exp => exp.isActive && (
        exp.title.toLowerCase().includes(lowerQuery) ||
        exp.description.toLowerCase().includes(lowerQuery) ||
        exp.location.toLowerCase().includes(lowerQuery) ||
        exp.category.toLowerCase().includes(lowerQuery)
      )
    );
  }

  async createExperience(insertExperience: InsertExperience): Promise<Experience> {
    const id = this.currentId++;
    const experience: Experience = { ...insertExperience, id, isActive: true };
    this.experiences.set(id, experience);
    return experience;
  }

  async getTimeSlotsByExperienceId(experienceId: number): Promise<TimeSlot[]> {
    return Array.from(this.timeSlots.values()).filter(
      slot => slot.experienceId === experienceId && slot.isAvailable
    );
  }

  async createTimeSlot(insertTimeSlot: InsertTimeSlot): Promise<TimeSlot> {
    const id = this.currentId++;
    const timeSlot: TimeSlot = { ...insertTimeSlot, id, isAvailable: true };
    this.timeSlots.set(id, timeSlot);
    return timeSlot;
  }

  async getPackagesByExperienceId(experienceId: number): Promise<Package[]> {
    return Array.from(this.packages.values()).filter(
      pkg => pkg.experienceId === experienceId
    );
  }

  async createPackage(insertPackage: InsertPackage): Promise<Package> {
    const id = this.currentId++;
    const pkg: Package = { ...insertPackage, id };
    this.packages.set(id, pkg);
    return pkg;
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const bookingId = `LK${new Date().toISOString().slice(2, 10).replace(/-/g, '')}${String(this.currentId).padStart(3, '0')}`;
    const booking: Booking = {
      ...insertBooking,
      id: this.currentId++,
      bookingId,
      status: "confirmed",
      createdAt: new Date(),
    };
    this.bookings.set(bookingId, booking);
    return booking;
  }

  async getBookingById(bookingId: string): Promise<Booking | undefined> {
    return this.bookings.get(bookingId);
  }

  async getBookingsByEmail(email: string): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      booking => booking.email === email
    );
  }
}

export const storage = new MemStorage();
