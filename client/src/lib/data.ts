import type { Experience } from "@shared/schema";

export const sampleExperiences: Experience[] = [
  {
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
  },
  {
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
  },
];
