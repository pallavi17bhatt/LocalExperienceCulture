import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams, useLocation } from "wouter";
import { ArrowLeft, MapPin, ArrowRight, LogIn } from "lucide-react";
import { useBooking } from "@/hooks/use-booking";
import { useToast } from "@/hooks/use-toast";
import StatusBar from "@/components/status-bar";
import type { Experience, TimeSlot, Package } from "@shared/schema";

const dates = [
  { key: "today", label: "Today", date: "24", month: "May" },
  { key: "thu", label: "Thu", date: "25", month: "May" },
  { key: "fri", label: "Fri", date: "26", month: "May" },
  { key: "sat", label: "Sat", date: "27", month: "May" },
  { key: "sun", label: "Sun", date: "28", month: "May" },
];

export default function Availability() {
  const { id } = useParams<{ id: string }>();
  const experienceId = parseInt(id || "1");
  const [selectedDate, setSelectedDate] = useState("today");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<number | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  
  const { setBookingData } = useBooking();
  const [, setLocation] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  // Check authentication status
  useEffect(() => {
    const userData = localStorage.getItem("user");
    setIsAuthenticated(!!userData);
  }, []);

  const { data: experience } = useQuery<Experience>({
    queryKey: [`/api/experiences/${experienceId}`],
  });

  const { data: timeSlots } = useQuery<TimeSlot[]>({
    queryKey: [`/api/experiences/${experienceId}/timeslots`],
  });

  // Remove duplicates from time slots
  const uniqueTimeSlots = timeSlots ? timeSlots.filter((slot, index, self) => 
    index === self.findIndex(s => s.startTime === slot.startTime && s.endTime === slot.endTime && s.name === slot.name)
  ) : [];

  const { data: packages } = useQuery<Package[]>({
    queryKey: [`/api/experiences/${experienceId}/packages`],
  });

  const handleProceedToBook = () => {
    if (!experience || !selectedTimeSlot || selectedPackage === null) return;

    // Check if user is authenticated
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to book this experience.",
        variant: "destructive",
      });
      setLocation("/login");
      return;
    }

    const selectedTime = uniqueTimeSlots?.find(slot => slot.id === selectedTimeSlot);
    const selectedPkg = packages?.find(pkg => pkg.id === selectedPackage);
    const selectedDateInfo = dates.find(d => d.key === selectedDate);

    if (selectedTime && selectedPkg && selectedDateInfo) {
      setBookingData({
        experienceId: experience.id,
        experience,
        timeSlot: selectedTime,
        package: selectedPkg,
        selectedDate: `${selectedDateInfo.date} ${selectedDateInfo.month} 2025`,
      });
      setLocation("/checkout");
    }
  };

  if (!experience || !timeSlots || !packages) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading availability...</p>
        </div>
      </div>
    );
  }

  const canProceed = selectedTimeSlot && selectedPackage !== null;
  
  console.log('Selection state:', { selectedTimeSlot, selectedPackage, canProceed });

  return (
    <div className="min-h-screen bg-white">
      <StatusBar />
      
      {/* Header */}
      <div className="flex items-center px-6 py-4 bg-white">
        <Link href={`/experience/${experienceId}`}>
          <button className="mr-4">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
        </Link>
        <h1 className="text-2xl font-bold text-primary">Lokly</h1>
      </div>

      {/* Content */}
      <div className="px-6 pb-48">
        <h2 className="text-xl font-bold text-gray-900 mb-1">{experience.title}</h2>
        <div className="flex items-center text-gray-600 mb-6">
          <MapPin className="w-4 h-4 text-primary mr-2" />
          <span>{experience.location}</span>
        </div>

        {/* Date Selection */}
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select a Date</h3>
        <div className="flex space-x-3 mb-6 overflow-x-auto">
          {dates.map((date) => (
            <button
              key={date.key}
              onClick={() => setSelectedDate(date.key)}
              className={`time-slot-btn min-w-16 px-4 py-3 border-2 rounded-xl text-center ${
                selectedDate === date.key
                  ? "active border-primary bg-primary text-white"
                  : "border-gray-200"
              }`}
            >
              <div className="text-sm font-semibold">{date.label}</div>
              <div className="text-lg font-bold">{date.date}</div>
              <div className="text-sm">{date.month}</div>
            </button>
          ))}
        </div>

        {/* Time Slots */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Time Slots</h3>
          <div className="grid grid-cols-2 gap-3">
            {uniqueTimeSlots.map((slot) => (
              <button
                key={slot.id}
                onClick={() => setSelectedTimeSlot(slot.id)}
                className={`time-slot-btn p-4 border-2 rounded-xl text-center ${
                  selectedTimeSlot === slot.id
                    ? "active border-primary bg-primary text-white"
                    : "border-gray-200"
                }`}
              >
                <div className="font-semibold">{slot.name}</div>
                <div className={`text-sm ${
                  selectedTimeSlot === slot.id ? "text-white" : "text-gray-500"
                }`}>
                  {slot.startTime} - {slot.endTime}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Package Selection */}
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Package</h3>
        <div className="space-y-3 mb-40">
          {packages.map((pkg) => (
            <button
              key={pkg.id}
              onClick={() => setSelectedPackage(pkg.id)}
              className={`w-full p-4 border-2 rounded-xl text-left ${
                selectedPackage === pkg.id
                  ? "border-primary"
                  : "border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">{pkg.name}</h4>
                <span className={`text-lg font-bold ${
                  selectedPackage === pkg.id ? "text-primary" : "text-gray-900"
                }`}>
                  ₹{Math.floor(pkg.price / 100)}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{pkg.description}</p>
              <p className="text-sm text-gray-500">
                {pkg.sessions === 1 ? "per person" : `₹${Math.floor(pkg.price / (pkg.sessions * 100))} per session`}
              </p>
            </button>
          ))}
        </div>

      </div>

      {/* Proceed to Book Button - Fixed at very bottom */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md px-6 py-6 bg-white border-t border-gray-200 safe-area-bottom">
        <Link href="/checkout">
          <button 
            onClick={handleProceedToBook}
            disabled={!canProceed}
            className={`w-full py-4 font-semibold rounded-xl flex items-center justify-center button-press touch-target ${
              canProceed 
                ? "bg-primary text-white" 
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <span>Proceed to Book</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </Link>
      </div>
    </div>
  );
}
