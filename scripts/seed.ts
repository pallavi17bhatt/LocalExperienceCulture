import { db } from "../server/db";
import { experiences, timeSlots, packages, users } from "../shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

async function seedDatabase() {
  try {
    console.log("🌱 Starting database seed...");

    // Check if data already exists
    const existingExperiences = await db.select().from(experiences).limit(1);
    if (existingExperiences.length > 0) {
      console.log("📊 Database already contains data. Skipping seed.");
      return;
    }

    // Seed users first
    console.log("👤 Seeding users...");
    const hashedPassword = await bcrypt.hash("password123", 10);
    const userData = {
      username: "aarti_verma",
      email: "aarti.verma@gmail.com",
      passwordHash: hashedPassword,
      fullName: "Aarti Verma",
      phone: "+91 98765 43210",
      location: "Mumbai, Maharashtra",
    };
    
    const [user] = await db.insert(users).values(userData).returning();
    console.log(`✅ Inserted user: ${user.fullName}`);

    // Seed experiences
    console.log("📝 Seeding experiences...");
    const experiencesData = [
      {
        title: "Traditional Kathak Dance Class",
        description: "Immerse yourself in the rhythmic world of Kathak, one of India's most graceful classical dance forms. In this beginner-friendly session, you'll learn the fundamental footwork, hand gestures, and expressions that make Kathak so captivating. Our experienced instructor will guide you through a traditional routine, sharing cultural insights along the way.",
        location: "Shivpuri Colony, Varanasi",
        hostName: "Meera Sharma",
        hostBio: "Professional Kathak dancer for 15+ years",
        hostAvatar: "https://images.unsplash.com/photo-1494790108755-2616c6106130?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150",
        imageUrl: "https://images.unsplash.com/photo-1635151989412-1ead17f9aa44?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
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
      },
      {
        title: "Pottery Workshop with Local Artisan",
        description: "Discover the ancient art of pottery in this hands-on workshop led by a master craftsman. Learn traditional techniques passed down through generations while creating your own unique ceramic pieces.",
        location: "Ramnagar, Varanasi",
        hostName: "Ravi Kumhar",
        hostBio: "Third-generation potter with 25+ years of experience",
        hostAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150",
        imageUrl: "https://images.unsplash.com/photo-1594736797933-d0b22d3b6daa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
        category: "Art",
        price: 49900,
        duration: 150,
        rating: "4.7",
        reviewCount: 89,
      },
      {
        title: "Heritage Photography Walk",
        description: "Capture the timeless beauty of Varanasi's ancient architecture and vibrant street life. Professional photographer guides you through hidden lanes and iconic ghats while teaching composition and lighting techniques.",
        location: "Dashashwamedh Ghat, Varanasi",
        hostName: "Priya Gupta",
        hostBio: "Award-winning photographer specializing in cultural documentation",
        hostAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150",
        imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
        category: "Photography",
        price: 39900,
        duration: 180,
        rating: "4.9",
        reviewCount: 156,
      },
      {
        title: "Traditional Silk Weaving Experience",
        description: "Learn the intricate art of Banarasi silk weaving from master weavers. Understand the process behind creating world-famous silk sarees and try your hand at the traditional loom.",
        location: "Peeli Kothi, Varanasi",
        hostName: "Mukesh Ansari",
        hostBio: "Master weaver from a family of silk artisans",
        hostAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150",
        imageUrl: "https://images.unsplash.com/photo-1583846112692-dd6b1b8b6f7b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
        category: "Art",
        price: 69900,
        duration: 240,
        rating: "4.6",
        reviewCount: 67,
      }
    ];

    const insertedExperiences = await db.insert(experiences).values(experiencesData).returning();
    console.log(`✅ Inserted ${insertedExperiences.length} experiences`);

    // Seed time slots
    console.log("⏰ Seeding time slots...");
    const timeSlotsData = [
      // Kathak Dance Class slots
      { experienceId: insertedExperiences[0].id, name: "Morning", startTime: "10:00", endTime: "12:00" },
      { experienceId: insertedExperiences[0].id, name: "Afternoon", startTime: "02:00", endTime: "04:00" },
      { experienceId: insertedExperiences[0].id, name: "Evening", startTime: "05:00", endTime: "07:00" },
      { experienceId: insertedExperiences[0].id, name: "Night", startTime: "07:30", endTime: "09:30" },
      
      // Cooking Class slots
      { experienceId: insertedExperiences[1].id, name: "Morning", startTime: "09:00", endTime: "12:00" },
      { experienceId: insertedExperiences[1].id, name: "Evening", startTime: "05:00", endTime: "08:00" },
      
      // Pottery Workshop slots
      { experienceId: insertedExperiences[2].id, name: "Morning", startTime: "10:00", endTime: "12:30" },
      { experienceId: insertedExperiences[2].id, name: "Afternoon", startTime: "02:00", endTime: "04:30" },
      
      // Photography Walk slots
      { experienceId: insertedExperiences[3].id, name: "Early Morning", startTime: "06:00", endTime: "09:00" },
      { experienceId: insertedExperiences[3].id, name: "Evening", startTime: "04:00", endTime: "07:00" },
      
      // Silk Weaving slots
      { experienceId: insertedExperiences[4].id, name: "Morning", startTime: "09:00", endTime: "01:00" },
      { experienceId: insertedExperiences[4].id, name: "Afternoon", startTime: "02:00", endTime: "06:00" },
    ];

    await db.insert(timeSlots).values(timeSlotsData);
    console.log(`✅ Inserted ${timeSlotsData.length} time slots`);

    // Seed packages
    console.log("📦 Seeding packages...");
    const packagesData = [
      // Kathak Dance packages
      { experienceId: insertedExperiences[0].id, name: "Single Session", description: "One-time experience", sessions: 1, price: 59900, discount: 0 },
      { experienceId: insertedExperiences[0].id, name: "3 Sessions", description: "Save 10%", sessions: 3, price: 161730, discount: 10 },
      { experienceId: insertedExperiences[0].id, name: "5 Sessions", description: "Save 15%", sessions: 5, price: 254575, discount: 15 },
      
      // Cooking Class packages
      { experienceId: insertedExperiences[1].id, name: "Single Session", description: "One-time experience", sessions: 1, price: 79900, discount: 0 },
      { experienceId: insertedExperiences[1].id, name: "Weekend Package", description: "2 sessions over weekend", sessions: 2, price: 143820, discount: 10 },
      
      // Pottery Workshop packages
      { experienceId: insertedExperiences[2].id, name: "Single Session", description: "One-time experience", sessions: 1, price: 49900, discount: 0 },
      { experienceId: insertedExperiences[2].id, name: "Artisan Package", description: "3 sessions with take-home pottery", sessions: 3, price: 124750, discount: 17 },
      
      // Photography Walk packages
      { experienceId: insertedExperiences[3].id, name: "Single Walk", description: "One-time experience", sessions: 1, price: 39900, discount: 0 },
      { experienceId: insertedExperiences[3].id, name: "Photo Series", description: "3 walks covering different themes", sessions: 3, price: 107730, discount: 10 },
      
      // Silk Weaving packages
      { experienceId: insertedExperiences[4].id, name: "Single Session", description: "Introduction to silk weaving", sessions: 1, price: 69900, discount: 0 },
      { experienceId: insertedExperiences[4].id, name: "Master Class", description: "Complete 2-day intensive course", sessions: 2, price: 111840, discount: 20 },
    ];

    await db.insert(packages).values(packagesData);
    console.log(`✅ Inserted ${packagesData.length} packages`);

    console.log("🎉 Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

// Run if called directly
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase().then(() => {
    console.log("🏁 Seed script completed");
    process.exit(0);
  });
}

export { seedDatabase };