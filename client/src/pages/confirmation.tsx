import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams, useLocation } from "wouter";
import { Check, Calendar, Clock, MapPin, Home, CalendarCheck, CheckCircle } from "lucide-react";
import StatusBar from "@/components/status-bar";
import type { Booking } from "@shared/schema";

export default function Confirmation() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [, setLocation] = useLocation();
  const [lastBooking, setLastBooking] = useState<any>(null);

  // Check for stored booking data from checkout
  useEffect(() => {
    const storedBooking = localStorage.getItem("lastBooking");
    if (storedBooking) {
      setLastBooking(JSON.parse(storedBooking));
      // Clear the stored data after loading
      localStorage.removeItem("lastBooking");
    } else if (!bookingId) {
      // If no booking data and no bookingId, redirect to home
      setLocation("/");
    }
  }, [bookingId]);

  const { data: booking, isLoading } = useQuery<Booking>({
    queryKey: [`/api/bookings/${bookingId}`],
    enabled: !!bookingId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Booking not found</h2>
          <Link href="/" className="text-primary">Return to home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <StatusBar />
      
      <div className="flex flex-col justify-center items-center h-full px-6 text-center py-20">
        {/* Success Icon */}
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <Check className="w-12 h-12 text-green-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
        <p className="text-gray-600 mb-6">Your Traditional Kathak Dance Class has been successfully booked.</p>
        
        {/* Booking Details */}
        <div className="w-full bg-gray-50 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Booking Details</h3>
          <div className="space-y-3 text-left">
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">Wed, {booking.selectedDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Time:</span>
              <span className="font-medium">10:00 AM - 12:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Location:</span>
              <span className="font-medium">Shivpuri Colony, Varanasi</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Booking ID:</span>
              <span className="font-medium">#{booking.bookingId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Paid:</span>
              <span className="font-medium">₹{Math.floor(booking.totalAmount / 100)}</span>
            </div>
          </div>
        </div>
        
        <p className="text-sm text-gray-500 mb-8">A confirmation email has been sent to {booking.email}.</p>
        
        <Link href="/" className="w-full">
          <button className="w-full py-4 bg-primary text-white font-semibold rounded-xl mb-4 flex items-center justify-center">
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </button>
        </Link>
        
        <button className="w-full py-4 border border-primary text-primary font-semibold rounded-xl flex items-center justify-center">
          <CalendarCheck className="w-4 h-4 mr-2" />
          View My Bookings
        </button>
      </div>
    </div>
  );
}
