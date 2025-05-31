import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Search, MapPin, Star, ChevronDown } from "lucide-react";
import StatusBar from "@/components/status-bar";
import BottomNavigation from "@/components/bottom-navigation";
import type { Experience } from "@shared/schema";

const categories = [
  { name: "Art", icon: "🎨", color: "category-art" },
  { name: "Dance", icon: "💃", color: "category-dance" },
  { name: "Food", icon: "🍽️", color: "category-food" },
  { name: "Photography", icon: "📷", color: "category-photography" },
];

export default function Home() {
  const { data: experiences, isLoading } = useQuery<Experience[]>({
    queryKey: ["/api/experiences"],
  });

  const featuredExperiences = experiences?.slice(0, 2) || [];
  const recommendedExperiences = experiences?.slice(0, 3) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading experiences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <StatusBar />
      
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white">
        <h1 className="text-2xl font-bold text-primary">Lokly</h1>
        <div className="flex items-center text-primary">
          <MapPin className="w-4 h-4 mr-2" />
          <span className="font-medium">Varanasi</span>
          <ChevronDown className="w-4 h-4 ml-1" />
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 content-with-nav">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Discover Local Experiences Today!
        </h2>
        
        {/* Search Bar */}
        <Link href="/search" className="block mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <div className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border-0 text-gray-400 cursor-pointer">
              Search for experiences or cities
            </div>
          </div>
        </Link>

        {/* Featured Experiences */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Featured Experiences</h3>
          <Link href="/search" className="text-primary font-medium">See All</Link>
        </div>

        <div className="flex space-x-4 mb-6 overflow-x-auto">
          {featuredExperiences.map((experience) => (
            <Link key={experience.id} href={`/experience/${experience.id}`}>
              <div className="experience-card min-w-64 cursor-pointer">
                <img 
                  src={experience.imageUrl} 
                  alt={experience.title}
                  className="w-full h-32 object-cover rounded-xl mb-3"
                />
                <div className="flex items-center mb-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                  <span className="text-sm font-medium">{experience.rating}</span>
                  <span className="text-sm text-gray-500 ml-1">({experience.reviewCount})</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">{experience.title}</h4>
                <p className="text-sm text-gray-500 mb-2">
                  ₹{Math.floor(experience.price / 100)} per person • {Math.floor(experience.duration / 60)} hours
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Browse Categories */}
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Browse Categories</h3>
        <div className="grid grid-cols-4 gap-4 mb-6">
          {categories.map((category) => (
            <Link key={category.name} href={`/search?category=${category.name}`}>
              <div className="text-center cursor-pointer">
                <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                  <span className="text-2xl">{category.icon}</span>
                </div>
                <span className="text-sm font-medium text-gray-700">{category.name}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Recommended for You */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recommended for You</h3>
          <Link href="/search" className="text-primary font-medium">See All</Link>
        </div>

        <div className="space-y-4 mb-6">
          {recommendedExperiences.map((experience) => (
            <Link key={experience.id} href={`/experience/${experience.id}`}>
              <div className="experience-card cursor-pointer bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="relative">
                  <img 
                    src={experience.imageUrl} 
                    alt={experience.title}
                    className="w-full h-32 object-cover"
                  />
                  <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
                <div className="p-3">
                  <h4 className="font-semibold text-gray-900 mb-1 text-sm">{experience.title}</h4>
                  <div className="flex items-center mb-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                    <span className="text-xs font-medium">{experience.rating}</span>
                    <span className="text-xs text-gray-500 ml-1">({experience.reviewCount})</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{experience.location} • 2.3 km away</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-gray-500">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12,6 12,12 16,14"/>
                      </svg>
                      <span>{Math.floor(experience.duration / 60)} hours</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-gray-900">
                        ₹{Math.floor(experience.price / 100)}
                      </span>
                      <span className="text-xs text-gray-500">/person</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <BottomNavigation currentPage="home" />
    </div>
  );
}
