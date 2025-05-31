import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  fullName: text("full_name").notNull(),
  phone: text("phone"),
  location: text("location"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const experiences = pgTable("experiences", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  hostName: text("host_name").notNull(),
  hostBio: text("host_bio").notNull(),
  hostAvatar: text("host_avatar").notNull(),
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(),
  price: integer("price").notNull(), // price in paise
  duration: integer("duration").notNull(), // duration in minutes
  rating: decimal("rating", { precision: 2, scale: 1 }).notNull(),
  reviewCount: integer("review_count").notNull(),
  isActive: boolean("is_active").default(true),
});

export const timeSlots = pgTable("time_slots", {
  id: serial("id").primaryKey(),
  experienceId: integer("experience_id").notNull(),
  name: text("name").notNull(), // Morning, Afternoon, etc.
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  isAvailable: boolean("is_available").default(true),
});

export const packages = pgTable("packages", {
  id: serial("id").primaryKey(),
  experienceId: integer("experience_id").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  sessions: integer("sessions").notNull(),
  price: integer("price").notNull(), // price in paise
  discount: integer("discount").default(0), // discount percentage
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  experienceId: integer("experience_id").notNull(),
  packageId: integer("package_id"),
  timeSlotId: integer("time_slot_id").notNull(),
  selectedDate: text("selected_date").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  paymentMethod: text("payment_method").notNull(),
  totalAmount: integer("total_amount").notNull(),
  bookingId: text("booking_id").notNull().unique(),
  status: text("status").default("confirmed"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertExperienceSchema = createInsertSchema(experiences).omit({
  id: true,
  isActive: true,
});

export const insertTimeSlotSchema = createInsertSchema(timeSlots).omit({
  id: true,
  isAvailable: true,
});

export const insertPackageSchema = createInsertSchema(packages).omit({
  id: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  bookingId: true,
  status: true,
  createdAt: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  bookings: many(bookings),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  user: one(users, {
    fields: [bookings.userId],
    references: [users.id],
  }),
  experience: one(experiences, {
    fields: [bookings.experienceId],
    references: [experiences.id],
  }),
  package: one(packages, {
    fields: [bookings.packageId],
    references: [packages.id],
  }),
  timeSlot: one(timeSlots, {
    fields: [bookings.timeSlotId],
    references: [timeSlots.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Experience = typeof experiences.$inferSelect;
export type InsertExperience = z.infer<typeof insertExperienceSchema>;
export type TimeSlot = typeof timeSlots.$inferSelect;
export type InsertTimeSlot = z.infer<typeof insertTimeSlotSchema>;
export type Package = typeof packages.$inferSelect;
export type InsertPackage = z.infer<typeof insertPackageSchema>;
export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
