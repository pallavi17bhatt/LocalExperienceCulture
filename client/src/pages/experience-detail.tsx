import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { ArrowLeft, Share, Heart, MapPin, Star } from "lucide-react";
import StatusBar from "@/components/status-bar";
import BottomNavigation from "@/components/bottom-navigation";
import type { Experience } from "@shared/schema";

export default function ExperienceDetail() {
  const { id } = useParams<{ id: string }>();
  const experienceId = parseInt(id || "1");

  const { data: experience, isLoading } = useQuery<Experience>({
    queryKey: [`/api/experiences/${experienceId}`],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading experience...</p>
        </div>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Experience not found</h2>
          <Link href="/" className="text-primary">Return to home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <StatusBar />
      
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white">
        <Link href="/search">
          <button className="w-8 h-8 flex items-center justify-center">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
        </Link>
        <h1 className="text-lg font-semibold">Experience Details</h1>
        <div className="flex items-center space-x-3">
          <button className="w-8 h-8 flex items-center justify-center">
            <Share className="w-5 h-5 text-gray-700" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center">
            <Heart className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Hero Image */}
      <div className="px-6">
        <img 
          src={experience.imageUrl} 
          alt={experience.title}
          className="w-full h-48 object-cover rounded-xl"
        />
      </div>

      {/* Content */}
      <div className="px-6 py-6 content-with-nav">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{experience.title}</h1>
        
        <div className="flex items-center mb-4">
          <MapPin className="w-4 h-4 text-primary mr-2" />
          <span className="text-gray-600">{experience.location}</span>
          <div className="ml-auto flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
            <span className="font-semibold">{experience.rating}</span>
            <span className="text-gray-500 ml-1">({experience.reviewCount} reviews)</span>
          </div>
        </div>

        {/* Host Info */}
        <div className="flex items-center mb-6 p-4 bg-gray-50 rounded-xl">
          <img 
            src={experience.hostAvatar} 
            alt={experience.hostName}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="ml-3">
            <p className="text-sm text-gray-500">Hosted by</p>
            <h3 className="font-semibold text-gray-900">{experience.hostName}</h3>
            <p className="text-sm text-gray-500">{experience.hostBio}</p>
          </div>
        </div>

        {/* About Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">About This Experience</h3>
          <p className="text-gray-600 leading-relaxed">
            {experience.description}
          </p>
        </div>

        {/* Pricing */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Price per person</p>
            <span className="text-2xl font-bold text-gray-900">
              ₹{Math.floor(experience.price / 100)}
            </span>
          </div>
          <Link href={`/availability/${experience.id}`}>
            <button className="px-8 py-3 bg-primary text-white font-semibold rounded-xl">
              Check Availability
            </button>
          </Link>
        </div>
      </div>

      <BottomNavigation currentPage="" />
    </div>
  );
}
