import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Search, Calendar, Tag, Clock, Heart, Star, MapPin } from "lucide-react";
import StatusBar from "@/components/status-bar";
import BottomNavigation from "@/components/bottom-navigation";
import type { Experience } from "@shared/schema";

export default function SearchPage() {
  const [location, setLocation] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  const initialCategory = searchParams.get('category') || '';
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedDate, setSelectedDate] = useState("today");

  const { data: experiences, isLoading } = useQuery<Experience[]>({
    queryKey: ["/api/experiences/search", { q: searchQuery, category: selectedCategory }],
    queryFn: () => 
      fetch(`/api/experiences/search?${new URLSearchParams({ 
        q: searchQuery, 
        category: selectedCategory 
      }).toString()}`)
        .then(res => res.json()),
  });

  const filteredExperiences = experiences || [];

  const categories = ["Art", "Dance", "Food", "Photography"];
  const dateFilters = [
    { key: "today", label: "Today" },
    { key: "tomorrow", label: "Tomorrow" },
    { key: "week", label: "This Week" },
  ];

  const clearDateFilter = () => {
    setSelectedDate("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <StatusBar />
      
      {/* Header */}
      <div className="flex items-center px-6 py-4 bg-white">
        <Link href="/">
          <button className="mr-4">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
        </Link>
        <h1 className="text-2xl font-bold text-primary">Lokly</h1>
        <div className="flex items-center text-primary ml-auto">
          <MapPin className="w-4 h-4 mr-2" />
          <span className="font-medium">Varanasi</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-6 pb-4 bg-white">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search experiences, activities, or hosts"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border-0 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-primary focus:bg-white"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 bg-white border-b">
        <div className="flex space-x-3 overflow-x-auto">
          <button 
            className={`flex items-center px-4 py-2 rounded-full whitespace-nowrap ${
              selectedDate === "today" ? "bg-primary text-white" : "bg-gray-100"
            }`}
            onClick={() => setSelectedDate(selectedDate === "today" ? "" : "today")}
          >
            <Calendar className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Today</span>
          </button>
          
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="flex items-center px-4 py-2 bg-gray-100 rounded-full text-sm font-medium"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
          <button className="flex items-center px-4 py-2 bg-gray-100 rounded-full whitespace-nowrap">
            <span className="text-sm font-medium">₹ Price</span>
          </button>
          
          <button className="flex items-center px-4 py-2 bg-gray-100 rounded-full whitespace-nowrap">
            <Clock className="w-4 h-4 mr-2 text-gray-400" />
            <span className="text-sm font-medium">Duration</span>
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="px-6 py-4 content-with-nav">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-500">
            {filteredExperiences.length} experiences found
          </span>
          {selectedDate === "today" && (
            <button 
              onClick={clearDateFilter}
              className="text-primary text-sm font-medium"
            >
              Today ×
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-xl mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredExperiences.map((experience) => (
              <Link key={experience.id} href={`/experience/${experience.id}`}>
                <div className="experience-card cursor-pointer">
                  <div className="relative">
                    <img 
                      src={experience.imageUrl} 
                      alt={experience.title}
                      className="w-full h-48 object-cover rounded-xl"
                    />
                    <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <Heart className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                  <div className="mt-3">
                    <h3 className="font-semibold text-gray-900 mb-1">{experience.title}</h3>
                    <div className="flex items-center mb-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm font-medium">{experience.rating}</span>
                      <span className="text-sm text-gray-500 ml-1">({experience.reviewCount})</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{experience.location} • 2.3 km away</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{Math.floor(experience.duration / 60)} hours</span>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-semibold text-gray-900">
                          ₹{Math.floor(experience.price / 100)}
                        </span>
                        <span className="text-sm text-gray-500">/person</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <BottomNavigation currentPage="search" />
    </div>
  );
}
