import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Calendar, Clock, MapPin, User, Phone, Mail, ChevronRight } from "lucide-react";
import { format } from "date-fns";

import StatusBar from "@/components/status-bar";
import MobileHeader from "@/components/mobile-header";
import BottomNavigation from "@/components/bottom-navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import type { Booking, Experience, Package, TimeSlot } from "@shared/schema";

interface BookingWithDetails {
  id: number;
  bookingId: string;
  experienceId: number;
  packageId: number;
  timeSlotId: number;
  selectedDate: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  paymentMethod: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  experience: {
    id: number;
    title: string;
    imageUrl: string;
    location: string;
    hostName: string;
  };
  package: {
    id: number;
    name: string;
    price: number;
  };
  timeSlot: {
    id: number;
    name: string;
    startTime: string;
    endTime: string;
  };
}

export default function MyBookings() {
  const [email, setEmail] = useState("");
  const [searchEmail, setSearchEmail] = useState("");

  const { data: bookings, isLoading, error } = useQuery({
    queryKey: ["/api/bookings/by-email", searchEmail],
    queryFn: () => fetch(`/api/bookings/by-email/${searchEmail}`).then(res => res.json()),
    enabled: !!searchEmail,
  });

  const handleSearch = () => {
    if (email.trim()) {
      setSearchEmail(email.trim());
    }
  };

  const getBookingStatus = (booking: BookingWithDetails) => {
    const bookingDate = new Date(booking.selectedDate);
    const now = new Date();
    
    if (bookingDate < now) {
      return { label: "Completed", color: "bg-green-100 text-green-800" };
    } else if (bookingDate.getTime() - now.getTime() < 24 * 60 * 60 * 1000) {
      return { label: "Upcoming", color: "bg-orange-100 text-orange-800" };
    } else {
      return { label: "Confirmed", color: "bg-blue-100 text-blue-800" };
    }
  };

  return (
    <div className="mobile-container bg-gray-50 min-h-screen">
      <StatusBar />
      <MobileHeader 
        title="My Bookings" 
        showBackButton={true}
        backHref="/"
      />
      
      <div className="p-4 space-y-6">
        {/* Search Section */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Find Your Bookings</h3>
            <p className="text-sm text-gray-600 mb-4">
              Enter your email address to view your booking history
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={!email.trim()}>
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Skeleton className="w-16 h-16 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                      <Skeleton className="h-3 w-2/3" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-red-600">Unable to load bookings. Please try again.</p>
            </CardContent>
          </Card>
        )}

        {/* No Bookings Found */}
        {searchEmail && !isLoading && !error && (!bookings || bookings.length === 0) && (
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">No Bookings Found</h3>
              <p className="text-gray-600 mb-4">
                We couldn't find any bookings for {searchEmail}
              </p>
              <Link href="/">
                <Button variant="outline">Browse Experiences</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Bookings List */}
        {bookings && bookings.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">
                Your Bookings ({bookings.length})
              </h3>
            </div>
            
            {bookings.map((booking: BookingWithDetails) => {
              const status = getBookingStatus(booking);
              
              return (
                <Card key={booking.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex">
                      <img 
                        src={booking.experience.imageUrl} 
                        alt={booking.experience.title}
                        className="w-24 h-24 object-cover"
                      />
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900 text-sm">
                              {booking.experience.title}
                            </h4>
                            <p className="text-xs text-gray-600">
                              Booking ID: {booking.bookingId}
                            </p>
                          </div>
                          <Badge className={`text-xs ${status.color}`}>
                            {status.label}
                          </Badge>
                        </div>
                        
                        <div className="space-y-1 text-xs text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3" />
                            <span>{format(new Date(booking.selectedDate), "MMM dd, yyyy")}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3" />
                            <span>{booking.timeSlot.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3 h-3" />
                            <span>{booking.experience.location}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-3">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              ₹{booking.totalPrice}
                            </p>
                            <p className="text-xs text-gray-600">
                              {booking.package.name}
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Contact Details */}
                    <div className="border-t bg-gray-50 p-3">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-2 text-gray-600">
                          <User className="w-3 h-3" />
                          <span>{booking.attendeeName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="w-3 h-3" />
                          <span>{booking.attendeePhone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 col-span-2">
                          <Mail className="w-3 h-3" />
                          <span>{booking.attendeeEmail}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Help Section */}
        {!searchEmail && (
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-3">
                If you can't find your booking, contact our support team
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>support@lokly.com</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      <BottomNavigation currentPage="bookings" />
    </div>
  );
}